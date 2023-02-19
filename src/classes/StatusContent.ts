
import { HTMLToPlainText } from "../utils.js";
import Client from "./Client.js";
import { StatusLanguageTypes } from "./Status.js";
import Base from "./base/Base.js";

export interface StatusContentOpts {
    content?: string;
    text?: string;
    language?: StatusLanguageTypes;
}

export default class StatusContent extends Base {

    public html: string;
    public plain: string;
    public language: StatusLanguageTypes;

    constructor(contentOpts: StatusContentOpts, client: Client) {
        super(client);
        this.assign(contentOpts);
    }

    assign(contentOpts: StatusContentOpts, replace = true) {
        const assign: any = {
            html: contentOpts.content,
            language: contentOpts.language
        }

        this.plain = contentOpts.content ? HTMLToPlainText(contentOpts.content) : contentOpts.text;

        super.assign(assign, replace);
    }
}