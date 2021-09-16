import { Registry } from "@riiid/cabriolet-service";

export interface CreateAzureRegistryConfig {}
export default function createAzureRegistry(
  config: CreateAzureRegistryConfig,
): Registry {
  return {
    async getSchema() {
      return {} as any; // TODO
    },
    async createFormat(req) {
      return {} as any; // TODO
    },
    async deleteFormat(req) {
      return {} as any; // TODO
    },
    async setParent(req) {
      return {} as any; // TODO
    },
    async deleteParent(req) {
      return {} as any; // TODO
    },
    async appendValidator(req) {
      return {} as any; // TODO
    },
    async removeValidator(req) {
      return {} as any; // TODO
    },
    async createConverter(req) {
      return {} as any; // TODO
    },
    async deleteConverter(req) {
      return {} as any; // TODO
    },
  };
}
