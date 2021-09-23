import { check, DecodeBase64Fn, HashFns, parse } from "@pbkit/sri";
import { FetchDataFn } from "./fetchData";

export interface Src {
  src: string;
  integrity: string;
}

export type { HashFns };

export interface GetSrcDataFn {
  (src: Src): Promise<Uint8Array>;
}
export function getGetSrcData(
  fetchDataFn: FetchDataFn,
  hashFns: HashFns,
  decodeBase64: DecodeBase64Fn,
): GetSrcDataFn {
  return async function getSrcData({ src, integrity }) {
    const data = await fetchDataFn(src);
    const match = check(hashFns, parse(integrity, decodeBase64), data);
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
