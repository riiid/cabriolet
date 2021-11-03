import { Registry } from "@riiid/cabriolet-service";
import { PostgresDatabaseConfig } from "./postgresDatabaseConfig";
import * as repository from "./registryRepository";

export default function createAzureRegistry(
  config: PostgresDatabaseConfig
): Registry {
  return {
    async getSchema() {
      const schema = await repository.getSchema(config.pool);
      return { schema };
    },
    async createFormat(req) {
      const format = await repository.createFormat(config.pool, req);
      return { formatId: format.id };
    },
    async deleteFormat(req) {
      await repository.deleteFormat(config.pool, req);
      return {};
    },
    async appendValidator(req) {
      const res = await repository.createValidator(config.pool, req);
      return { validatorId: res.validatorId };
    },
    async removeValidator(req) {
      await repository.deleteValidator(config.pool, req);
      return {};
    },
    async createConverter(req) {
      const res = await repository.createConverter(config.pool, req);
      return { converterId: res.converterId };
    },
    async deleteConverter(req) {
      await repository.deleteConverter(config.pool, req);
      return {};
    },
  };
}
