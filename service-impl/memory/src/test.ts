import test from "@riiid/cabriolet-service-test";
import createMemoryRegistry from "./registry";
import createMemoryStorage from "./storage";

test({
  createRegistry() {
    return {
      registry: createMemoryRegistry(),
      destroyRegistry() {},
    };
  },
  createStorage() {
    return {
      storage: createMemoryStorage(),
      destroyStorage() {},
    };
  },
});
