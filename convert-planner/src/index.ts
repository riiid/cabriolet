import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";

interface Edge {
  from: string,
  to: string,
  cost: number,
}

export class ConvertPlannerError extends Error {
  constructor(msg, from, to) {
    super(msg)
    this.name = `failed to find path "${from}" to "${to}"`
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
      cost: 1,
    }
  })

  const fromExists: boolean = edges.reduce((prev, curr) => prev || (curr.from === fromFormatId), false)
  const toExists: boolean = edges.reduce((prev, curr) => prev || (curr.to === toFormatId), false)

  if (!(fromExists && toExists)) throw new ConvertPlannerError("The input does not exists in the convert graph", fromFormatId, toFormatId)
  
  return { entries: [] };
}
