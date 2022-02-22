import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { HTMLElement } from 'node-html-parser';

import { CssBlock } from './css-block';
import { cssNormalize } from './css-normalize';

export class CssTemplate {
    static async load(path: string, encoding?: BufferEncoding): Promise<CssTemplate> {
        const temps: CssBlock[] = [];
        const rawText = await readFile(resolve(path), encoding ?? 'utf-8');

        const text = cssNormalize(rawText);
        const match = text
            .split(/(?<=\})\s+/gi)

        for (const base of match) {
            const rawProps = base.match(/(?<=(\{\s*|;\s*))[a-z0-9\-_]+\s*:\s*[^;]+(?=(;|;?\}))/gi) ?? [];
            const props: Record<string, string> = Object.fromEntries(
                rawProps.map(x => x.split(/\s*:\s*/gi))
            );

            const target = base
                .replace(/(^\s*|\s*\{.*$)/gis, '')
                .replace(/\s+/gi, ' ');

            temps.push(new CssBlock(target, props));
        }

        return new CssTemplate(temps);
    }
    
    private _blocks: CssBlock[];
    get blocks(): CssBlock[] {
        return this._blocks;
    }

    constructor(blocks: CssBlock[]) {
        this._blocks = blocks;
    }

    apply(html: HTMLElement): void {
        for (const block of this._blocks) {
            const nodes = html.querySelectorAll(block.target);
            nodes.forEach(node => {
                const cssOri = node.getAttribute('style');
                const cssNew = block.getStyle();

                node.setAttribute(
                    'style',
                    cssOri
                        ? `${cssOri} ${cssNew}`
                        : cssNew
                );
            });
        }
    }
}