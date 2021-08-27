import { readFile } from "fs/promises";
import * as ssri from "ssri";
import parseDataURL from "data-urls";
import fetch from "node-fetch";

export interface Src {
  src: string;
  integrity: string;
}

export function createSrcByData(
  data: Uint8Array,
  mimeType: string = "application/octet-stream",
): Src {
  return {
    src: getDataUrl(data, mimeType),
    integrity: getIntegrity(data),
  };
}

export async function createSrcByPath(src: string): Promise<Src> {
  const data = await getDataFromPath(src);
  return { src, integrity: getIntegrity(data) };
}

export async function getSrcData({ src, integrity }: Src): Promise<Uint8Array> {
  const data = await getDataFromPath(src);
  const match = ssri.checkData(data, integrity);
  if (!match) throw new Error("Integrity check failed");
  return data;
}

export function getDataUrl(
  data: Uint8Array,
  mimeType: string = "application/octet-stream",
): string {
  return `data:${mimeType};base64,${Buffer.from(data).toString("base64")}`;
}

export function getIntegrity(data: Uint8Array): string {
  return ssri
    .create({ algorithms: ["sha256"] })
    .update(data)
    .digest()
    .toString();
}

async function getDataFromPath(src: string) {
  if (src.startsWith(".") || src.startsWith("/")) return await readFile(src);
  if (src.startsWith("file:")) {
    const url = new URL(src);
    return await readFile(decodeURIComponent(url.pathname));
  }
  if (src.startsWith("data:")) {
    const data = parseDataURL(src);
    if (!data) throw new Error("Invalid data URL");
    return data.body;
  }
  return await fetch(src).then((res) => res.buffer());
}
