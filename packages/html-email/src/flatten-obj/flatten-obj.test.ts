import { assert, AssertionError } from 'chai';
import { flattenObj } from './flatten-obj';

describe('Testing "./flatten-obj"', () => {
    it('Object 01.', () => {
        const out = flattenObj({
            text: 'jajaja',
            value: 666
        });

        assert.isArray(out);
        assert.lengthOf(out, 2);
        
        assert.lengthOf(out[0].keys, 1);
        assert.strictEqual(out[0].value, 'jajaja');
        assert.lengthOf(out[1].keys, 1);
        assert.strictEqual(out[1].value, 666);
    });

    it('Object 02.', () => {
        const out = flattenObj({
            alpha: {
                a: 66,
                b: 44
            },
            beta: {
                a: 67,
                b: 99
            },
            gamma: {
                a: {
                    text: 'jajaja',
                    value: 555
                },
                b: {
                    text: 'jojojo',
                    value: 888
                }
            }
        });

        assert.isArray(out);
        assert.lengthOf(out, 8);
        
        assert.sameOrderedMembers(out[0].keys, [ 'alpha', 'a' ]);
        assert.sameOrderedMembers(out[1].keys, [ 'alpha', 'b' ]);
        assert.sameOrderedMembers(out[2].keys, [ 'beta', 'a' ]);
        assert.sameOrderedMembers(out[3].keys, [ 'beta', 'b' ]);
        assert.sameOrderedMembers(out[4].keys, [ 'gamma', 'a', 'text' ]);
        assert.sameOrderedMembers(out[5].keys, [ 'gamma', 'a', 'value' ]);
        assert.sameOrderedMembers(out[6].keys, [ 'gamma', 'b', 'text' ]);
        assert.sameOrderedMembers(out[7].keys, [ 'gamma', 'b', 'value' ]);
        
        assert.strictEqual(out[0].value, 66);
        assert.strictEqual(out[1].value, 44);
        assert.strictEqual(out[2].value, 67);
        assert.strictEqual(out[3].value, 99);
        assert.strictEqual(out[4].value, 'jajaja');
        assert.strictEqual(out[5].value, 555);
        assert.strictEqual(out[6].value, 'jojojo');
        assert.strictEqual(out[7].value, 888);
    });
});