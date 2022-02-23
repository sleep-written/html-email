import { assert } from 'chai';
import { Fetch } from '.';

describe('Testing "./fetch"', () => {
    it('GET  -> "/html/styles.css"', async () => {
        const fetch = new Fetch('https://www.w3schools.com/html/styles.css');
        const resp = await fetch.write();
        const text = resp.toString();

        assert.match(text, /body \{background-color: powderblue;\}/);
    });

    it('GET  -> "/posts/1" JSON', async () => {
        const fetch = new Fetch('https://jsonplaceholder.typicode.com/posts/1');
        const resp = await fetch.write();
        const text = resp.toJSON();
        
        assert.hasAllKeys(text, ['userId', 'id', 'title', 'body']);
    });
    
    it('POST -> "/posts" JSON', async () => {
        const fetch = new Fetch<any>('https://jsonplaceholder.typicode.com/posts', 'POST');
        const resp = await fetch.write({
            userId: 1,
            title: 'jajaja',
            body: 'joder chaval'
        });
        
        const json = resp.toJSON();
        assert.strictEqual(json?.userId, 1);
        assert.strictEqual(json?.title, 'jajaja');
        assert.strictEqual(json?.body, 'joder chaval');
    });
});