import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import { Ord, Ordering } from "./util/Ord";

class Cost extends Ord {
  converterCost: number;
  upcastCost: number;

  constructor(converterCost: number, upcastCost: number) {
    super()
    this.converterCost = converterCost;
    this.upcastCost = upcastCost;
  }

  override compare(b: Cost): Ordering {
    if (this.converterCost < b.converterCost) {
      return Ordering.LT;
    } else if (this.converterCost > b.converterCost) {
      return Ordering.GT;
    } else {
      if (this.upcastCost < b.upcastCost) {
        return Ordering.LT;
      } else if (this.upcastCost > b.upcastCost) {
        return Ordering.GT;
      } else {
        return Ordering.EQ;
      }
    }
  }
}

interface Edge {
  from: string,
  to: string,
  cost: Cost,
}

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
  const edges: Edge[] = schema.edges.map(it => {
    return {
      from: it.fromFormatId,
      to: it.toFormatId,
      cost: new Cost(1, 0),
    }
  });
  const upcasts: Edge[] = schema.formats.flatMap(it => {
    return it.parentFormatIds.map(parentFormatId => {
      return {
        from: it.id,
        to: parentFormatId,
        cost: new Cost(0, 1),
      }
    })
  });

  const converterGraphEdges: Edge[] = [...upcasts, ...edges];

  const fromExists: boolean = converterGraphEdges.reduce((prev, curr) => prev || (curr.from === fromFormatId), false);
  const toExists: boolean = converterGraphEdges.reduce((prev, curr) => prev || (curr.to === toFormatId), false);

  if (!(fromExists && toExists)) throw new ConvertPlannerError("The input does not exists in the convert graph", fromFormatId, toFormatId);

  console.log(converterGraphEdges)
  
  return {
    fromFormatId,
    toFormatId,
    entries: [],
  };
}
