import { IDiffers } from './interfaces';
import { referrer } from './request';

const generateFieldRBTBQK1AN = (job: number) => {
    const tmp = Array(14).fill(false);
    tmp[job] = true;
};

const diffField0Base = (stepId: number, data: Record<string, string>) => {
    return {
        ...data,
        _VAR_ENTRY_NAME: '学生身体健康状况上报(_)',
        _VAR_ENTRY_TAGS: '健康状况上报',
        _VAR_URL: referrer(stepId),
        fieldCS_Attr: JSON.stringify({ _parent: '' }),
        fieldCS_Name: '',
        fieldCSNY: '',
        fieldDQ_Attr: JSON.stringify({ _parent: '' }),
        fieldDQ_Name: '',
        fieldGJ_Name: '',
        fieldGLSJ: '',
        fieldPCSJ: '',
        fieldQRYSSJ: '',
        fieldQZSJ: '',
        fieldSbsj: '',
        fieldSF_Name: '',
        fieldSFLX: '',
        fieldSqrDqwz_Name: '',
        fieldSqrzzqt1: '',
        fieldSqYx_Name: '',
        fieldWFRGLSJ: '',
        fieldZYSJ: '',
        groupMQJCList: [],
        groupYQRBList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    };
};

export const diffFieldToday: IDiffers = (stepId, data) =>
    JSON.stringify({
        ...diffField0Base(stepId, data),
        fieldHidden1: '1',
    });

export const diffFieldRefill: (job: number) => IDiffers = (job) => (
    stepId,
    data
) =>
    JSON.stringify({
        ...diffField0Base(stepId, data),
        fieldHidden1: '2',
        fieldRBTBQK1AN: generateFieldRBTBQK1AN(job),
    });

export const diffField1: IDiffers = (stepId, data) =>
    JSON.stringify({
        ...data,
        _VAR_URL: referrer(stepId),
        fieldCSNY: '',
        fieldGLSJ: '',
        fieldPCSJ: '',
        fieldQRYSSJ: '',
        fieldQZSJ: '',
        fieldSFLX: '',
        fieldWFRGLSJ: '',
        fieldZYSJ: '',
        groupMQJCList: [],
    });

export const diffField2: IDiffers = (stepId, data) =>
    JSON.stringify({
        ...data,
        _VAR_ENTRY_NAME: `学生身体健康状况上报(${data.fieldSqrXm}_${data.fieldSqYx_Name})`,
        _VAR_URL: referrer(stepId),
        fieldBZ: '无',
        fieldGLSJ: '',
        fieldJSTW: [
            (Math.random() * 0.9 + 36).toFixed(1),
            (Math.random() * 0.9 + 36).toFixed(1),
        ],
        fieldPCSJ: '',
        fieldQRYSSJ: '',
        fieldQZSJ: '',
        fieldWFRGLSJ: '',
        fieldXBFZ_Name: '',
        fieldXSZLB: (Math.random() * 0.9 + 36).toFixed(1),
        fieldZYSJ: '',
        groupMQJCList: [0, 1],
        groupYQRBList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    });
