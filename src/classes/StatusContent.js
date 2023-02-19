import { HTMLToPlainText } from "../utils.js";
import Base from "./base/Base.js";
export default class StatusContent extends Base {
    html;
    plain;
    language;
    constructor(contentOpts, client) {
        super(client);
        this.assign(contentOpts);
    }
    assign(contentOpts, replace = true) {
        const assign = {
            html: contentOpts.content,
            language: contentOpts.language
        };
        this.plain = contentOpts.content ? HTMLToPlainText(contentOpts.content) : contentOpts.text;
        super.assign(assign, replace);
    }
}
//# sourceMappingURL=StatusContent.js.map