
export type StatusVisibilityTypes = "public" | "unlisted" | "private" | "direct";
export interface PostStatusData {
    status: string,
    mediaIds?: string[],
    poll?: {
        options: string[],
        expires_in: number,
        multiple?: boolean,
        hide_totals?: boolean
    },
    in_reply_to_id?: string,
    sensitive?: boolean,
    spoiler_text?: string,
    visibility?: StatusVisibilityTypes,
    language?: string,
    scheduled_at?: string
}