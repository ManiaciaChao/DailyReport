export interface IDiffers {
    (stepId: number, data: Record<string, string>): string;
}

export interface IExecuteActions {
    (
        opts: {
            stepId: number;
            csrfToken: string;
        },
        ...differs: IDiffers[]
    ): Promise<number>;
}
