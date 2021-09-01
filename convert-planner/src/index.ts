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
    return it.parentFormatIds.map(parentFormatId => new Edge(it.id, parentFormatId, new Cost(0, 1)));
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
  const visited: FormatId[] = [];
  const unvisited: FormatId[] = [];
  let dist = new Map<FormatId, number>();
  let prev = new Map<FormatId, number>();

  graph.forEach(it => {
    dist.set(it.to, Infinity);
    prev.set(it.to, undefined);
    unvisited.push(it.to);
  })

  dist.set(from, 0);

  while(unvisited.length !== 0) {
    const minFormatId = minFromNumMap(dist);

    visited.push(minFormatId.key);

    const visitedFormatIndex = unvisited.indexOf(minFormatId.key);
    if (visitedFormatIndex != -1) {
      unvisited.splice(visitedFormatIndex, 1)
    }


  }

  let retVal: Edge[];

  return retVal;
}

function minFromNumMap<T>(map: Map<T, number>): { key: T, value: number } {
  let min: { key: T, value: number };
  map.forEach((value, key) => {
    if (value < min.value) {
      min = {
        key,
        value,
      }
    }
  });

  return min;
}

