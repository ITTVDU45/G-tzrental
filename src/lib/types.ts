// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type I_Any = any;

export interface I_AdminDoc {
    [key: string]: I_Any;
}

export interface I_PageDoc extends I_AdminDoc {
    id?: string;
    route?: string;
    slug?: string;
    status?: string;
    seo?: I_Any;
    references?: I_Any;
    updatedAt?: string;
}
