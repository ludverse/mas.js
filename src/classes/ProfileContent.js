import { HTMLToPlainText } from "../utils.js";
import Base from "./base/Base.js";
export default class ProfileContent extends Base {
    html;
    plain;
    constructor(contentOpts, client) {
        super(client);
        this.assign(contentOpts);
    }
    assign(contentOpts, replace = true) {
        const assign = {
            html: contentOpts.note || ""
        };
        this.plain = contentOpts.note ? HTMLToPlainText(contentOpts.note) : "";
        super.assign(assign, replace);
    }
}
//# sourceMappingURL=ProfileContent.js.map