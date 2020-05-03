interface KeyedObj {
    [key: string]: any;
}
export declare class Model<T = any> implements KeyedObj {
    _id: string;
    static new<T>(this: new () => T, data: Partial<NFP<T>>): T;
}
export declare function uid(): string;
declare type NFPN<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export declare type NFP<T> = Pick<T, NFPN<T>>;
export {};
