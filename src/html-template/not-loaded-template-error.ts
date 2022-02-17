export class NotLoadedTemplateError extends Error {
    constructor(path?: string) {
        super();

        if (typeof path === 'string') {
            this.message =  `The template file "${path}" hasn't been loaded yet. `;
        } else {
            this.message =  `The template file hasn't been loaded yet. `;
        }

        this.message += 'First execute the "this.load();" method before use this template.'
    }
}