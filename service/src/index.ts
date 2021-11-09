import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
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
      const { value: input, formatId: fromFormatId } = await storage.get({
        key,
      });
      const { schema } = await registry.getSchema({});
      const plan = convertPlanner(schema!, fromFormatId, toFormatId);
      const output = await convertPlanExecuter(schema!, plan, input);
      return { value: output };
    },
    async inspectConvertPlan({ fromFormatId, toFormatId }) {
      const { schema } = await registry.getSchema({});
      const plan = convertPlanner(schema!, fromFormatId, toFormatId);
      return { formatIds: plan };
    },
  };
}

export type Storage = Pick<
  KvfService,
  "has" | "get" | "getFormatId" | "set" | "delete" | "keys"
>;

export type Registry = Pick<
  KvfService,
  | "getSchema"
  | "createFormat"
  | "deleteFormat"
  | "appendValidator"
  | "removeValidator"
  | "createConverter"
  | "deleteConverter"
>;

export interface ConvertPlanner {
  (schema: Schema, fromFormatId: string, toFormatId: string): string[];
}

export interface ConvertPlanExecuter {
  (schema: Schema, plan: string[], input: Uint8Array): Promise<Uint8Array>;
}
