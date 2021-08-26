import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Format } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Format";

export interface GetValidatorIdsFn {
  (formatId: string): string[];
}
export class GetValidatorIdsFnError extends Error {}
export function getGetValidatorIdsFn(schema: Schema): GetValidatorIdsFn {
  type Formats = { [formatId: string]: Format };
  const formats: Formats = schema.formats.reduce(
    (formats, format) => {
      formats[format.id] = format;
      return formats;
    },
    {} as Formats,
  );
  return function getValidatorIdsFn(formatId) {
    if (!(formatId in formats)) {
      throw new GetValidatorIdsFnError("invalid format id: " + formatId);
    }
    const format = formats[formatId];
    const validatorIds = format.validatorIds;
    return validatorIds;
  };
}
