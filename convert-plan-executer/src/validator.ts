import { Type as Validator } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Validator";
import { getSrcData } from "@riiid/cabriolet-schema/lib/src";

export interface ValidateFn {
  (input: Uint8Array): Promise<void>;
}
export async function getValidateFn(
  validator: Validator,
  getSrcDataFn: typeof getSrcData = getSrcData,
): Promise<ValidateFn> {
  const srcData = await getSrcDataFn(validator);
  const js = new TextDecoder("utf-8").decode(srcData);
  const { u8sInVoidOut } =
    await (typeof Worker === "undefined"
      ? import("./program/isolated-vm")
      : import("./program/web-worker"));
  return async function validate(input) {
    return await u8sInVoidOut(js, input);
  };
}
