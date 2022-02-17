export class CssBlock {
    private _target: string;
    get target(): string {
        return this._target;
    }

    private _props: Record<string, string>;
    get props(): Record<string, string> {
        return this._props;
    }

    constructor(
        target: string,
        props: Record<string, string>,
    ) {
        this._target = target;
        this._props = props;
    }

    getStyle(): string {
        let raw = '';
        Object
            .entries(this._props)
            .forEach((x, i) => {
                if (i) { raw += ' '; }
                raw += `${x[0]}: ${x[1]};`;
            });

        return raw;
    }
}
