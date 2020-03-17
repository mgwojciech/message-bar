export interface IHttpClient{
    get(url:string, parameters?:any): Promise<{ok:boolean, status:number, text: () => Promise<string>,json: () => Promise<any>}>;
    post(url:string, parameters?:any): Promise<{ok:boolean,status:number, text: () => Promise<string>,json: () => Promise<any>}>;
}