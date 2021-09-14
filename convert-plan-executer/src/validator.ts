import type { Type as Validator } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Validator";
import type { GetSrcDataFn } from "@riiid/cabriolet-schema/lib/src";
import type { U8sInVoidOutFn } from "./program";

export interface ValidateFn {
  (input: Uint8Array): Promise<void>;
}
export async function getValidateFn(
  validator: Validator,
  getSrcDataFn: GetSrcDataFn,
  u8sInVoidOutFn: U8sInVoidOutFn,
): Promise<ValidateFn> {
  const srcData = await getSrcDataFn(validator);
  const js = new TextDecoder("utf-8").decode(srcData);
  return async function validate(input) {
    return await u8sInVoidOutFn(js, input);
  };
}
