import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Type as ConvertPlan } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlan";
import { Service as KvfService } from "@riiid/cabriolet-proto/lib/services/riiid/kvf/KvfService";

export interface CreateServiceConfig {
  storage: Storage;
  registry: Registry;
  convertPlanner: ConvertPlanner;
  convertPlanExecuter: ConvertPlanExecuter;
}

export function createService({
  storage,
  registry,
  convertPlanner,
  convertPlanExecuter,
}: CreateServiceConfig): KvfService {
  return {
    ...storage,
    ...registry,
    async convert({ key, toFormatId }) {
      const { schema } = await registry.getSchema({});
      const { formatId: fromFormatId } = await storage.getFormatId({ key });
      const convertPlan = convertPlanner(schema!, fromFormatId, toFormatId);
      const { value: input } = await storage.get({ key });
      const output = await convertPlanExecuter(schema!, convertPlan, input);
      return { value: output };
    },
    async inspectConvertPlan({ fromFormatId, toFormatId }) {
      const { schema } = await registry.getSchema({});
      const convertPlan = convertPlanner(schema!, fromFormatId, toFormatId);
      return { convertPlan };
    },
  };
}

export type Storage = Pick<
  KvfService,
  | "has"
  | "get"
  | "getFormatId"
  | "set"
  | "delete"
  | "keys"
>;

export type Registry = Pick<
  KvfService,
  | "getSchema"
  | "createFormat"
  | "deleteFormat"
  | "setParent"
  | "deleteParent"
  | "appendValidator"
  | "removeValidator"
  | "createConverter"
  | "deleteConverter"
>;

export interface ConvertPlanner {
  (
    schema: Schema,
    fromFormatId: string,
    toFormatId: string,
  ): ConvertPlan;
}

export interface ConvertPlanExecuter {
  (
    schema: Schema,
    convertPlan: ConvertPlan,
    input: Uint8Array,
  ): Promise<Uint8Array>;
}
