import test from "@riiid/cabriolet-service-test";
import createAzureRegistry from "./registry";
import createAzureStorage from "./storage";

test({
  createRegistry() {
    return {
      registry: createAzureRegistry({}),
      destroyRegistry() {},
    };
  },
  createStorage() {
    return {
      storage: createAzureStorage({}),
      destroyStorage() {},
    };
  },
});
