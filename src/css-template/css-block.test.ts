import { assert } from 'chai';
import { CssBlock } from './css-block';

describe('Testing "./css-template/css-block"', () => {
    it('CSS Block 01', () => {
        const block = new CssBlock('p', {
            'display': 'flex',
            'flex-flow': 'row'
        });

        assert.strictEqual(
            block.getStyle(),
            'display: flex; flex-flow: row;'
        );
    });
    
    it('CSS Block 02', () => {
        const block = new CssBlock('button.raised', {
            'padding': '0.5rem',
            'border-radius': '0.25rem'
        });

        assert.strictEqual(
            block.getStyle(),
            'padding: 0.5rem; border-radius: 0.25rem;'
        );
    });
    
    it('CSS Block 03', () => {
        const block = new CssBlock('button.raised', {});

        assert.strictEqual(
            block.getStyle(),
            ''
        );
    });
});