import Base from "./base/Base.js";
import InstanceConfig from "./InstanceConfig.js";
export default class Instance extends Base {
    domain;
    title;
    config;
    description;
    contactEmail;
    contantAccount;
    rules;
    sourceRepoUrl;
    version;
    constructor(instanceOpts, client) {
        super(client);
        this.config = new InstanceConfig(instanceOpts, client);
        this.assign(instanceOpts);
    }
    assign(instanceOpts, overwrite = true) {
        const assign = {
            domain: instanceOpts.domain,
            title: instanceOpts.title,
            description: instanceOpts.description,
            contactEmail: instanceOpts.contact.email,
            contactAccount: this.client.cache.getAccount(instanceOpts.contact.account),
            sourceRepoUrl: instanceOpts.source_url,
            version: instanceOpts.version,
        };
        super.assign(assign, overwrite);
    }
}
//# sourceMappingURL=Instance.js.map