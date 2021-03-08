import { stringify } from 'querystring';
import { password, username, todayOnly } from '../config.json';

import {
    API_CAPTCHA,
    API_DO_ACTION,
    API_ENTRY_POINT,
    API_LOGIN,
    API_LOGIN_FINISHED,
    API_RENDER,
    API_START,
} from './constants';
import { desEEE } from './utils/des';
import { recognize } from './utils/recognize';
import {
    generateForm,
    get,
    postForm,
    postHeaders,
    referrer,
} from './utils/request';
import {
    diffField1,
    diffField2,
    diffFieldRefill,
    diffFieldToday,
} from './utils/diffFields';
import { IExecuteActions } from './utils/interfaces';

const random = () => Math.random() * 999;
const time = () => ~~(Date.now() / 1000);

const login = async (username: string, password: string) => {
    await get(API_ENTRY_POINT);
    const queryString = stringify({ service: API_LOGIN_FINISHED });
    const { body } = await get(`${API_LOGIN}?${queryString}`);
    const lt = body.match(/LT-.*?-cas/g)![0];
    const code = await recognize((await get(API_CAPTCHA)).rawBody);
    const form = {
        ul: username.length,
        pl: password.length,
        lt,
        rsa: desEEE(username + password + lt, '1', '2', '3'),
        code,
        execution: 'e1s1', // e: count of GETs, s: MAYBE count of (invalid) POSTs
        _eventId: 'submit',
    };
    const redirect = (await postForm(`${API_LOGIN}?${queryString}`, form))
        .headers.location;
    if (!redirect) {
        throw new Error('Failed to login');
    }
    await get(redirect);
    return (await get(API_ENTRY_POINT)).body.match(
        /(?<=itemscope="csrfToken" content=").*?(?=">)/g
    )![0];
};

const start = async (csrfToken: string) => {
    const form = generateForm(
        {
            idc: 'BKS',
            release: '',
            formData: JSON.stringify({
                _VAR_URL: API_ENTRY_POINT,
                _VAR_URL_Attr: {},
            }),
        },
        csrfToken
    );
    const res = await postForm(API_START, form, postHeaders(0));
    const { errno, entities } = JSON.parse(res.body);
    if (errno !== 0) {
        throw new Error(`Failed to post /start: ${res.body}`);
    }
    return +entities[0].match(/\d+/)[0];
};

const render = async (stepId: number, csrfToken: string) => {
    const form = generateForm(
        {
            stepId,
            admin: false,
            instanceId: '',
            rand: random(),
            width: 1920,
        },
        csrfToken
    );
    const res = await postForm(API_RENDER, form, postHeaders(stepId));
    const { errno, entities } = JSON.parse(res.body);
    if (errno !== 0) {
        throw new Error(`Failed to post /render: ${res.body}`);
    }
    const { actions, data, fields } = entities[0];
    return {
        data,
        fields,
        actionId: actions.filter(
            ({ code }: { code: string }) => code.toUpperCase() === 'TJ'
        )[0].id,
    };
};

const doAction = async (
    stepId: number,
    actionId: number,
    formData: string,
    boundFields: string,
    csrfToken: string
) => {
    const form = generateForm(
        {
            stepId,
            actionId,
            formData,
            remark: '',
            rand: random(),
            nextUsers: '{}',
            timestamp: time(),
            boundFields,
        },
        csrfToken
    );
    const res = await postForm(API_DO_ACTION, form, postHeaders(stepId));
    const { errno, entities } = JSON.parse(res.body);
    if (errno !== 0) {
        throw new Error(`Failed to post /doAction: ${res.body}`);
    }
    return entities[0].flowStepId;
};

const executeActions: IExecuteActions = async (opts, ...differs) => {
    const { stepId: initialStepId, csrfToken } = opts;
    let innerStepId = initialStepId;
    for (const differ of differs) {
        const { data, fields, actionId } = await render(innerStepId, csrfToken);

        if (todayOnly && data.fieldRBDTTBQK === '已') {
            return -1;
        }
        const boundFields = Object.entries<Record<string, string>>(fields)
            .filter(([, v]) => v.bound)
            .map(([k]) => k)
            .toString();
        const formData = differ(innerStepId, data);
        innerStepId = await doAction(
            innerStepId,
            actionId,
            formData,
            boundFields,
            csrfToken
        );
    }
    return innerStepId;
};

(async () => {
    const csrfToken = await login(username, password);
    const stepId = await start(csrfToken);
    const url = referrer(stepId);
    const opts = { stepId, csrfToken };

    if (todayOnly) {
        await executeActions(opts, diffFieldToday, diffField1, diffField2);
        console.log(url);
    } else {
        const jobs: number[] = [];
        let dateList: number[] = [];
        let innerStepId = stepId;
        const { data, fields, actionId } = await render(innerStepId, csrfToken);

        (data.fieldRBTBTWQK as string[]).forEach((v, i) => {
            v !== '正常' && jobs.push(i);
        });
        dateList = data.fieldRBTBRQ;

        const boundFields = Object.entries<Record<string, string>>(fields)
            .filter(([, v]) => v.bound)
            .map(([k]) => k)
            .toString();
        const firstJob = jobs.shift() as number;
        const formData = diffFieldRefill(firstJob)(innerStepId, data);
        innerStepId = await doAction(
            innerStepId,
            actionId,
            formData,
            boundFields,
            csrfToken
        );
        await executeActions(
            { ...opts, stepId: innerStepId },
            diffField1,
            diffField2
        );
        console.log(`job ${firstJob}: ${dateList[firstJob]} ${url}`);

        for (const job of jobs) {
            const stepId = await start(csrfToken);
            const url = referrer(stepId);
            const opts = { stepId, csrfToken };
            await executeActions(
                opts,
                diffFieldRefill(job),
                diffField1,
                diffField2
            );
            console.log(`job ${job}: ${dateList[job]} ${url}`);
        }
    }
})();
