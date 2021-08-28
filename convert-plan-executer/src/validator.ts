import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Validator } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Validator";
import { arrToMap } from "./misc";
import { getSrcData } from "./src";
import { u8sInVoidOut } from "./program";

export interface GetValidatorsFn {
  (formatId: string): Validator[];
}
export class GetValidatorsFnError extends Error {}
export function getGetValidatorsFn(schema: Schema): GetValidatorsFn {
  const formats = arrToMap(schema.formats, (format) => format.id);
  const validators = arrToMap(schema.validators, (validator) => validator.id);
  return function getValidatorsFn(formatId) {
    if (!(formatId in formats)) {
      throw new GetValidatorsFnError("invalid format id: " + formatId);
    }
    const format = formats[formatId];
    return format.validatorIds.map((id) => validators[id]);
  };
}

export interface ValidateFn {
  (input: Uint8Array): Promise<void>;
}
export async function getValidateFn(
  validator: Validator,
  getSrcDataFn: typeof getSrcData = getSrcData
): Promise<ValidateFn> {
  const srcData = await getSrcDataFn(validator);
  const js = new TextDecoder("utf-8").decode(srcData);
  return async function validate(input) {
    return await u8sInVoidOut(js, input);
  };
}
