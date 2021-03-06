import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import type { GetSrcDataFn } from "@riiid/cabriolet-schema/lib/src";
import { getGetValidatorsFn } from "@riiid/cabriolet-schema/lib/validator";
import { getGetConverterFn } from "@riiid/cabriolet-schema/lib/converter";
import { ConcretePlanEntry, iterConcretePlan } from "./concrete-plan";
import type { U8sInU8sOutFn, U8sInVoidOutFn } from "./program";
import { getValidateFn } from "./validator";
import { getConvertFn } from "./converter";

export class ExecConvertPlanError extends Error {
  constructor(
    public concretePlanEntry: ConcretePlanEntry,
    public error: Error,
  ) {
    super(error.message);
  }
}

export interface ExecConvertPlanFn {
  (
    schema: Schema,
    convertPlan: ConvertPlan,
    input: Uint8Array,
  ): Promise<Uint8Array>;
}

export default function getExecConvertPlanFn(
  getSrcDataFn: GetSrcDataFn,
  u8sInU8sOutFn: U8sInU8sOutFn,
  u8sInVoidOutFn: U8sInVoidOutFn,
): ExecConvertPlanFn {
  return async function execConvertPlan(schema, convertPlan, input) {
    const getValidatorsFn = getGetValidatorsFn(schema);
    const getConverterFn = getGetConverterFn(schema);
    let currInput = input;
    for (const entry of iterConcretePlan(convertPlan)) {
      try {
        switch (entry.type) {
          case "validate":
            const validators = getValidatorsFn(entry.formatId);
            for (const validator of validators) {
              const validate = await getValidateFn(
                validator,
                getSrcDataFn,
                u8sInVoidOutFn,
              );
              await validate(currInput);
            }
            break;
          case "convert":
            const converter = getConverterFn(
              entry.fromFormatId,
              entry.toFormatId,
            );
            const convert = await getConvertFn(
              converter,
              getSrcDataFn,
              u8sInU8sOutFn,
            );
            currInput = await convert(currInput);
            break;
        }
      } catch (err: any) {
        throw new ExecConvertPlanError(entry, err);
      }
    }
    return currInput;
  };
}
