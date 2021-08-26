import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";

export type ConcretePlanEntry = Validate | Convert;

interface ConcretePlanEntryBase<T extends string> {
  type: T;
  relatedConvertPlanIndex: number;
}

export interface Validate extends ConcretePlanEntryBase<"validate"> {
  formatId: string;
}

export interface Convert extends ConcretePlanEntryBase<"convert"> {
  fromFormatId: string;
  toFormatId: string;
}

export function* iterConcretePlan(
  convertPlan: ConvertPlan,
): Generator<ConcretePlanEntry> {
  let currFormatId = convertPlan.fromFormatId;
  yield {
    type: "validate",
    relatedConvertPlanIndex: -1,
    formatId: currFormatId,
  };
  for (let index = 0; index < convertPlan.entries.length; ++index) {
    const convertPlanEntry = convertPlan.entries[index].value;
    if (!convertPlanEntry) continue;
    const prevFormatId = currFormatId;
    switch (convertPlanEntry.field) {
      case "upcast":
        currFormatId = convertPlanEntry.value.formatId;
        yield {
          type: "validate",
          relatedConvertPlanIndex: index,
          formatId: currFormatId,
        };
        break;
      case "convert":
        currFormatId = convertPlanEntry.value.formatId;
        yield {
          type: "convert",
          relatedConvertPlanIndex: index,
          fromFormatId: prevFormatId,
          toFormatId: currFormatId,
        };
        yield {
          type: "validate",
          relatedConvertPlanIndex: index,
          formatId: currFormatId,
        };
        break;
    }
  }
}
