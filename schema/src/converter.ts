import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Converter } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Converter";
import { arrToMap } from "./misc";

export interface GetConverterFn {
  (fromFormatId: string, toFormatId: string): Converter;
}
export class GetConverterFnError extends Error {}
export function getGetConverterFn(schema: Schema): GetConverterFn {
  const edges = arrToMap(schema.edges, (edge) => {
    return getEdgeId(edge.fromFormatId, edge.toFormatId);
  });
  const converters = arrToMap(schema.converters, (converter) => converter.id);
  return function getConverterFn(fromFormatId, toFormatId) {
    const edgeId = getEdgeId(fromFormatId, toFormatId);
    if (!(edgeId in edges)) {
      throw new GetConverterFnError(
        "invalid edge: " + fromFormatId + " -> " + toFormatId
      );
    }
    const edge = edges[edgeId];
    return converters[edge.converterId];
  };
}
function getEdgeId(fromFormatId: string, toFormatId: string): string {
  return fromFormatId + "\0" + toFormatId;
}
