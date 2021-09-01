import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import { Type as ConverPlanEntry } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlanEntry";
import { Cost } from "./cost";
import { Edge, findAdjEdges, FormatId } from "./edge";
import { minFromMap } from "./util/Ord";


export class ConvertPlannerError extends Error {
  constructor(msg: string, from: string, to: string) {
    super(msg);
    this.name = `failed to find path "${from}" to "${to}"`;
  }
}

export default function plan(
  schema: Schema,
  fromFormatId: FormatId,
  toFormatId: FormatId,
): ConvertPlan {
  const edges: Edge[] = schema.edges.map(it => new Edge(it.fromFormatId, it.toFormatId, new Cost(1, 0)));
  const upcasts: Edge[] = schema.formats.flatMap(it => {
    return new Edge(it.id, it.parentFormatId, new Cost(0, 1));
  });

  const converterGraphEdges: Edge[] = [...upcasts, ...edges];

  const entries: ConverPlanEntry[] = findPath(converterGraphEdges, fromFormatId, toFormatId).map(it => it.convertToProto());

  return {
    fromFormatId,
    toFormatId,
    entries,
  };
}

function findPath(graph: Edge[], from: FormatId, to: FormatId): Edge[] {
  const visited: Edge[] = [];
  const unvisited: Edge[] = [];
  let dist = new Map<FormatId, Cost>();
  let prev = new Map<FormatId, FormatId>();

  graph.forEach(it => {
    dist.set(it.to, Cost.Infinity);
    prev.set(it.to, undefined);
    unvisited.push(it);
  })

  dist.set(from, new Cost(0, 0));

  console.error(`graph: ${JSON.stringify(graph)}`)
  console.error(`from: ${from}, to: ${to}`)
  console.error(`visited: ${visited}`)
  console.error(`unvisited: ${JSON.stringify(unvisited)}`)
  console.error(`dist: ${JSON.stringify(dist)}`)
  console.error(`prev: ${JSON.stringify(prev)}`)

  while(unvisited.length !== 0) {
    const minFormatId = minFromMap(dist);
    const min = graph.find(it => it.to === minFormatId.key)

    visited.push(min);

    const visitedFormatIndex = unvisited.indexOf(min);
    if (visitedFormatIndex !== -1) {
      unvisited.splice(visitedFormatIndex, 1)
    }

    if (minFormatId.key === to) {
      break;
    }

    findAdjEdges(graph, minFormatId.key).forEach(it => {
      const alt = dist.get(minFormatId.key).add(it.cost);
      if (alt < dist.get(it.to)) {
        dist.set(it.to, alt);
        prev.set(it.to, minFormatId.key);
      }
    });
  }

  const S = [];
  let u = to
  if (prev.get(u) !== undefined) {
    while (u !== undefined) {
      S.push(u)
      u = prev.get(u)
    }
  }

  return S;
}
