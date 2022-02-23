import { assert } from 'chai';
import { getCharset } from './get-charset';

describe('Testing "./fetch/get-charset"', () => {
    it('Case 01 (not found; "utf-8")', () => {
        const resp = getCharset(undefined);
        assert.strictEqual(resp, 'utf-8');
    });

    it('Case 02 (not found; "utf-8")', () => {
        const resp = getCharset({
            'cookie': 'pendejo=555'
        });
        assert.strictEqual(resp, 'utf-8');
    });

    it('Case 03 (not found; "utf-8")', () => {
        const resp = getCharset({
            'cookie': 'pendejo=555',
            'content-type': 'application/json'
        });
        assert.strictEqual(resp, 'utf-8');
    });

    it('Case 04 (found; "hex")', () => {
        const resp = getCharset({
            'cookie': 'pendejo=555',
            'content-type': 'application/json; charset=hex'
        });
        assert.strictEqual(resp, 'hex');
    });

    it('Case 05 (found; "base64")', () => {
        const resp = getCharset({
            'cookie': 'pendejo=555',
            'content-type': 'charset=base64'
        });
        assert.strictEqual(resp, 'base64');
    });
});