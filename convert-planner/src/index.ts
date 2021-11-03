import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { AdjMatrix } from "./graph";
import { getPath } from "./strategy";

export default function plan(
  schema: Schema,
  fromFormatId: string,
  toFormatId: string
): string[] {
  // TODO: cache pathMap result somewhere
  // we can have somesort of hash check for schema to determin if we should recalculate all path
  let graph = new AdjMatrix(schema.formats.map((format) => format.id));
  schema.converters.forEach((converter) =>
    graph.setEdge(converter.fromFormatId, converter.toFormatId)
  );

  // full path as vertex index
  let path = getPath(
    graph.getVertexIndex(fromFormatId),
    graph.getVertexIndex(toFormatId),
    graph.matrix
  );

  // convert index back to formatId
  return path.map((it) => graph.input[it]);
}
