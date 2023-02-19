import Base from "./base/Base.js";
export default class InstanceConfig extends Base {
    streamingApiEndpoint;
    languages;
    max_featured_tags; // TODO EJEGEIGJEJGIE `???????????????????
    statusCharacterLimit;
    statusMaxMediaAttachments;
    statusUrlLength;
    translationEnabled;
    mediaMimeTypes;
    imageSizeLimit;
    imageMatrixLimit;
    videoSizeLimit;
    videoFrameRateLimit;
    videoMatrixLimit;
    maxPollOptions;
    pollOptionCharacterLimit;
    pollMinDuration;
    pollMaxExpiration;
    registrationsEnabled;
    registrationsApprovalRequired;
    registrationsClosedMessage;
    constructor(instanceOpts, client) {
        super(client);
        this.assign(instanceOpts);
    }
    assign(instanceOpts, overwrite = true) {
        const assign = {
            streamingApiEndpoint: instanceOpts.configuration.urls?.streaming_api,
            languages: instanceOpts.languages,
            max_featured_tags: instanceOpts.configuration.accounts.max_featured_tags,
            statusCharacterLimit: instanceOpts.configuration.statuses.max_characters,
            statusMaxMediaAttachments: instanceOpts.configuration.statuses.max_media_attachments,
            statusUrlLength: instanceOpts.configuration.statuses.characters_reserved_per_url,
            translationEnabled: instanceOpts.configuration.translation.enabled,
            mediaMimeTypes: instanceOpts.configuration.media_attachments.supported_mime_types,
            imageSizeLimit: instanceOpts.configuration.media_attachments.image_size_limit,
            imageMatrixLimit: instanceOpts.configuration.media_attachments.image_matrix_limit,
            videoSizeLimit: instanceOpts.configuration.media_attachments.video_size_limit,
            videoFrameRateLimit: instanceOpts.configuration.media_attachments.video_frame_rate_limit,
            videoMatrixLimit: instanceOpts.configuration.media_attachments.video_matrix_limit,
            maxPollOptions: instanceOpts.configuration.polls.max_options,
            pollOptionCharacterLimit: instanceOpts.configuration.polls.max_characters_per_option,
            pollMinDuration: instanceOpts.configuration.polls.min_expiration,
            pollMaxExpiration: instanceOpts.configuration.polls.max_expiration,
            registrationsEnabled: instanceOpts.registrations.enabled,
            registrationsApprovalRequired: instanceOpts.registrations.approval_required,
            registrationsClosedMessage: instanceOpts.registrations.message
        };
        super.assign(assign, overwrite);
    }
}
//# sourceMappingURL=InstanceConfig.js.map