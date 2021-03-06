import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import {
  appendValidator,
  createConverter,
  createFormat,
  deleteConverter,
  deleteFormat,
  deleteParent,
  newConverterId,
  newFormatId,
  newValidatorId,
  removeValidator,
  setParent,
} from "@riiid/cabriolet-schema";
import { Registry } from "@riiid/cabriolet-service";

export default function createMemoryRegistry(): Registry {
  let schema: Schema = {
    formats: [],
    edges: [],
    validators: [],
    converters: [],
  };
  return {
    async getSchema() {
      return { schema };
    },
    async createFormat(req) {
      const formatId = newFormatId();
      schema = createFormat(schema, req, formatId);
      return { formatId };
    },
    async deleteFormat(req) {
      schema = deleteFormat(schema, req);
      return {};
    },
    async setParent(req) {
      schema = setParent(schema, req);
      return {};
    },
    async deleteParent(req) {
      schema = deleteParent(schema, req);
      return {};
    },
    async appendValidator(req) {
      const validatorId = newValidatorId();
      schema = appendValidator(schema, req, validatorId);
      return { validatorId };
    },
    async removeValidator(req) {
      schema = removeValidator(schema, req);
      return {};
    },
    async createConverter(req) {
      const converterId = newConverterId();
      schema = createConverter(schema, req, converterId);
      return { converterId };
    },
    async deleteConverter(req) {
      schema = deleteConverter(schema, req);
      return {};
    },
  };
}
