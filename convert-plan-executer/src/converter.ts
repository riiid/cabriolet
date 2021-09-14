import type { Type as Converter } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Converter";
import type { GetSrcDataFn } from "@riiid/cabriolet-schema/lib/src";
import type { U8sInU8sOutFn } from "./program";

export interface ConvertFn {
  (input: Uint8Array): Promise<Uint8Array>;
}
export async function getConvertFn(
  converter: Converter,
  getSrcDataFn: GetSrcDataFn,
  u8sInU8sOutFn: U8sInU8sOutFn,
): Promise<ConvertFn> {
  const srcData = await getSrcDataFn(converter);
  const js = new TextDecoder("utf-8").decode(srcData);
  return async function convert(input) {
    return await u8sInU8sOutFn(js, input);
  };
}
