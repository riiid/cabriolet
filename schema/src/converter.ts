import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Converter } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Converter";
import { arrToMap } from "./misc";

export interface GetConverterFn {
  (fromFormatId: string, toFormatId: string): Converter;
}
export class GetConverterFnError extends Error {}

export function getGetConverterFn(schema: Schema): GetConverterFn {
  const converters = arrToMap(schema.converters, (converter) =>
    getConverterId(converter.fromFormatId, converter.toFormatId)
  );
  return function getConverterFn(fromFormatId, toFormatId) {
    let res = converters[getConverterId(fromFormatId, toFormatId)];
    if (!res)
      throw new GetConverterFnError(
        "invalid edge: " + fromFormatId + " -> " + toFormatId
      );
    return res;
  };
}

function getConverterId(fromFormatId: string, toFormatId: string): string {
  return `${fromFormatId}${toFormatId}`;
}
