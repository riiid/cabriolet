import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Converter } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Converter";
import { arrToMap } from "./misc";

export interface GetConverterFn {
  (fromFormatId: string, toFormatId: string): Converter;
}
export class GetConverterFnError extends Error {}

export function getGetConverterFn(schema: Schema): GetConverterFn {
  return function getConverterFn(fromFormatId, toFormatId) {
    const converters = arrToMap(
      schema.converters,
      (converter) => `${converter.fromFormatId}${converter.toFormatId}`
    );
    return (
      converters[`${fromFormatId}${toFormatId}`] ??
      throwGetConverterFnError(
        "invalid edge: " + fromFormatId + " -> " + toFormatId
      )
    );
  };
}

function throwGetConverterFnError(errorMessage: string): never {
  throw new GetConverterFnError(errorMessage);
}
