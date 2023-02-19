
import { HTMLToPlainText } from "../utils.js";
import Client from "./Client.js";
import Base from "./base/Base.js";

export interface ProfileContentOptions {
    note?: string
}

export default class ProfileContent extends Base {

    public html: string;
    public plain: string;
    
    constructor(contentOpts: ProfileContentOptions, client: Client) {
        super(client);
        this.assign(contentOpts);
    }

    assign(contentOpts: ProfileContentOptions, replace = true) {
        const assign: any = {
            html: contentOpts.note || ""
        }

        this.plain = contentOpts.note ? HTMLToPlainText(contentOpts.note) : "";

        super.assign(assign, replace);
    }

}