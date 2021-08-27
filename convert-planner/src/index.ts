import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import { Type as ConverPlanEntry } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlanEntry";
import { Type as Convert } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlanEntry/Convert";
import { Type as Upcast } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlanEntry/Upcast";
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

  const path = findPath(converterGraphEdges, fromFormatId, toFormatId)
  const entries: ConverPlanEntry[] = path.map(it => {
    return {
      value: {
        field: it.isConverter() ? "convert" : "upcast",
        value: {
          formatId: it.to
        }
      }
    }
  })

  return {
    fromFormatId,
    toFormatId,
    entries,
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
