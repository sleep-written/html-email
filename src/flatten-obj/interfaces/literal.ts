import { Primitive } from './primitive';

export interface Literal {
    [k: string]:
        Literal |
        Primitive;
}