import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import { minFromList } from "./util/Ord";
import { Cost } from "./cost";
import { Edge } from "./edge";


export class ConvertPlannerError extends Error {
  constructor(msg: string, from: string, to: string) {
    super(msg);
    this.name = `failed to find path "${from}" to "${to}"`;
  }
}

export default function plan(
  schema: Schema,
  fromFormatId: string,
  toFormatId: string,
): ConvertPlan {
  const edges: Edge[] = schema.edges.map(it => new Edge(it.fromFormatId, it.toFormatId, new Cost(1, 0)));
  const upcasts: Edge[] = schema.formats.flatMap(it => {
    return it.parentFormatIds.map(parentFormatId => new Edge(it.id, parentFormatId, new Cost(0, 1)))
  });

  const converterGraphEdges: Edge[] = [...upcasts, ...edges];

  const fromExists: boolean = converterGraphEdges.reduce((prev, curr) => prev || (curr.from === fromFormatId), false);
  const toExists: boolean = converterGraphEdges.reduce((prev, curr) => prev || (curr.to === toFormatId), false);

  if (!(fromExists && toExists)) throw new ConvertPlannerError("The input does not exists in the convert graph", fromFormatId, toFormatId);

  findPath(converterGraphEdges, fromFormatId, toFormatId)

  return {
    fromFormatId,
    toFormatId,
    entries: [],
  };
}

function findPath(graph: Edge[], from: String, to: string): Edge[] {
  const S: Edge[] = []
  const Q: Edge[] = graph

  const d = {}

  while(d[to] === undefined) {
    const shortest = minFromList(graph)
    console.log(shortest)
  }

  return [new Edge("1", "2", new Cost(0, 1))]

}
