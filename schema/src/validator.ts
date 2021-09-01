import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Validator } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Validator";
import { arrToMap } from "./misc";

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
