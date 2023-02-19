export async function handleResErr(err) {
    if (!(err instanceof Error))
        err = new Error(err);
    return err;
}
export function checkErr(res) {
    return res instanceof Error;
}
export function getErr(res) {
    return res instanceof Error ? res : new Error();
}
//# sourceMappingURL=errorHandler.js.map