import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as Edge } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Edge";

export interface GetConverterIdFn {
  (fromFormatId: string, toFormatId: string): string;
}
export class GetConverterIdFnError extends Error {}
export function getGetConverterIdFn(schema: Schema): GetConverterIdFn {
  type Edges = { [edgeId: string]: Edge };
  const edges: Edges = schema.edges.reduce(
    (edges, edge) => {
      edges[getEdgeId(edge.fromFormatId, edge.toFormatId)] = edge;
      return edges;
    },
    {} as Edges,
  );
  return function getConverterIdFn(fromFormatId, toFormatId) {
    const edgeId = getEdgeId(fromFormatId, toFormatId);
    if (!(edgeId in edges)) {
      throw new GetConverterIdFnError(
        "invalid edge: " + fromFormatId + " -> " + toFormatId,
      );
    }
    const edge = edges[edgeId];
    const converterId = edge.converterId;
    return converterId;
  };
}
function getEdgeId(fromFormatId: string, toFormatId: string): string {
  return fromFormatId + "\0" + toFormatId;
}
