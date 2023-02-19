
import { parse } from "node-html-parser";

export function HTMLToPlainText(htmlString: string) {

    return parse(htmlString).text;

    // Code after this is discontinued and doesn't do anything but I want keep the memory alive of the really ugly code.

    // Splits the HTML into an array into pieces for every "<" of each tag. And there by can easily grab all tags innerText with a regex.
    // This is clumpsy, but it will work lol
    const tagSplit = htmlString.split("<");
    const tags = tagSplit.map(tag => tag.match(/(?<=>)[\s\S]*$/)?.[0]?.trim())
    .filter(text => text);

    let plainString = tags.join(" ");
    
    return plainString;

}

export async function fetchError(fetchRes: Response) {

    let data: any;
    try {
        data = await fetchRes.json();
    } catch {
        return new Error(`[${ fetchRes.status } ${ fetchRes.statusText }] request failed; no further information (${ new URL(fetchRes.url).href })`);
    }
    
    return new Error(`[${ fetchRes.status } ${ fetchRes.statusText }] error: ${ data.error || "UNKNOWN ERROR" } (${ new URL(fetchRes.url).href })`);
}
