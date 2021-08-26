import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";

type converterCost = number
type upcastCost = number

interface Edge {
  from: string,
  to: string,
  cost: [converterCost, upcastCost],
}

export class ConvertPlannerError extends Error {
  constructor(msg: string, from: string, to: string) {
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
      cost: [1, 0],
    }
  })
  const upcasts: Edge[] = schema.formats.flatMap(it => {
    return it.parentFormatIds.map(parentFormatId => {
      return {
        from: it.id,
        to: parentFormatId,
        cost: [0, 1],
      }
    })
  })

  const converterGraphEdges: Edge[] = [...upcasts, ...edges]

  console.log(converterGraphEdges)

  const fromExists: boolean = converterGraphEdges.reduce((prev, curr) => prev || (curr.from === fromFormatId), false)
  const toExists: boolean = converterGraphEdges.reduce((prev, curr) => prev || (curr.to === toFormatId), false)

  if (!(fromExists && toExists)) throw new ConvertPlannerError("The input does not exists in the convert graph", fromFormatId, toFormatId)
  
  return {
    fromFormatId,
    toFormatId,
    entries: [],
  };
}
