import * as ssri from "ssri";
import { FetchDataFn } from "./fetchData";

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

export async function createSrcByPath(
  src: string,
  fetchDataFn: FetchDataFn,
): Promise<Src> {
  const data = await fetchDataFn(src);
  return { src, integrity: getIntegrity(data) };
}

export interface GetSrcDataFn {
  (src: Src): Promise<Uint8Array>;
}
export function getGetSrcData(fetchDataFn: FetchDataFn): GetSrcDataFn {
  return async function getSrcData({ src, integrity }) {
    const data = await fetchDataFn(src);
    const match = ssri.checkData(data, integrity);
    if (!match) throw new Error("Integrity check failed");
    return data;
  };
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
