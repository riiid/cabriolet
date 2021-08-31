import { Type as Converter } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Converter";
import { getSrcData } from "@riiid/cabriolet-schema/lib/src";

export interface ConvertFn {
  (input: Uint8Array): Promise<Uint8Array>;
}
export async function getConvertFn(
  converter: Converter,
  getSrcDataFn: typeof getSrcData = getSrcData,
): Promise<ConvertFn> {
  const srcData = await getSrcDataFn(converter);
  const js = new TextDecoder("utf-8").decode(srcData);
  const { u8sInU8sOut } =
    await (typeof Worker === "undefined"
      ? import("./program/isolated-vm")
      : import("./program/web-worker"));
  return async function convert(input) {
    return await u8sInU8sOut(js, input);
  };
}
