
export interface QueryConfig<I extends any[] = any[]> {
    name?: string;
    text: string;
    values?: I;
}

export class BaseCountClass {
  count: any;
}
