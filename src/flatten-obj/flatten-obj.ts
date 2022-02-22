import { Flat, Literal, Primitive } from './interfaces';

export function flattenObj(o: Literal): Flat[] {
    const out: Flat[] = [];
    Object
        .keys(o ?? {})
        .forEach(k => {
            const base = o[k];
            if (base && typeof base === 'object') {
                // Another literal
                flattenObj(base).forEach(inner => {
                    out.push({
                        keys: [k, ...inner.keys],
                        value: inner.value
                    });
                });
            } else {
                // A primitive object
                out.push({
                    keys: [k],
                    value: base as Primitive
                });
            }
        });
    
    return out;
}