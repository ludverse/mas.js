export default class Base {
    client;
    constructor(client) {
        this.client = client;
    }
    assign(assign, overwrite = true) {
        if (overwrite) {
            for (const key in assign) {
                if (assign[key] !== undefined)
                    this[key] = assign[key];
            }
        }
        else {
            for (const key in assign) {
                this[key] ??= assign[key];
            }
        }
    }
    toJSON() {
        // ? why does this exist
        const props = Object.keys(this)
            .filter(key => !key.startsWith("_"));
        const res = {};
        for (let i = 0; i < props.length; i++) {
            if (props[i] == "client")
                continue;
            res[props[i]] = this[props[i]];
        }
        return res;
    }
}
//# sourceMappingURL=Base.js.map