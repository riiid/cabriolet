import { Registry } from "@riiid/cabriolet-service";
import { Storage } from "@riiid/cabriolet-service";
import registryScenarios from "./registry";
import storageScenarios from "./storage";

export interface TestConfig {
  createRegistry(): {
    registry: Registry;
    destroyRegistry(): void;
  };
  createStorage(): {
    storage: Storage;
    destroyStorage(): void;
  };
}

export default async function test(config: TestConfig) {
  for (const [name, scenario] of Object.entries(registryScenarios)) {
    console.log(`running ${name}...`);
    await runRegistryScenario(config, scenario);
  }
  for (const [name, scenario] of Object.entries(storageScenarios)) {
    console.log(`running ${name}...`);
    await runStorageScenario(config, scenario);
  }
}

export interface RegistryScenario {
  (registry: Registry): Promise<void>;
}

export interface StorageScenario {
  (storage: Storage): Promise<void>;
}

async function runRegistryScenario(
  config: TestConfig,
  scenario: RegistryScenario,
) {
  const { registry, destroyRegistry } = config.createRegistry();
  try {
    await scenario(registry);
  } finally {
    destroyRegistry();
  }
}

async function runStorageScenario(
  config: TestConfig,
  scenario: StorageScenario,
) {
  const { storage, destroyStorage } = config.createStorage();
  try {
    await scenario(storage);
  } finally {
    destroyStorage();
  }
}
