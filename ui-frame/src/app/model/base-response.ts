export class BaseResponse {
    res: any;
    error: any;

    constructor(res: any, error: any) {
        this.res = res;
        this.error = error;
    }
}
