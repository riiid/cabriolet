import { toUint8Array } from "js-base64";
import hashFns from "@riiid/cabriolet-hash-fns";
import fetchData from "@riiid/cabriolet-schema/lib/fetchData/browser";
import { getGetSrcData } from "@riiid/cabriolet-schema/lib/src";
import getExecConvertPlanFn from "@riiid/cabriolet-convert-plan-executer/lib";
import {
  u8sInU8sOut,
  u8sInVoidOut,
} from "@riiid/cabriolet-convert-plan-executer/lib/program/web-worker";
import convertPlanner from "@riiid/cabriolet-convert-planner";
import createMemoryStorage from "@riiid/cabriolet-service-impl-memory/lib/storage";
import createMemoryRegistry from "@riiid/cabriolet-service-impl-memory/lib/registry";
import { createService } from "@riiid/cabriolet-service";
import { Service } from "@riiid/cabriolet-proto/lib/services/riiid/kvf/KvfService";

export default function createBrowserMemoryService(): Service {
  const memoryStorage = createMemoryStorage();
  const memoryRegistry = createMemoryRegistry();
  const getSrcDataFn = getGetSrcData(fetchData, hashFns, toUint8Array);
  const convertPlanExecuter = getExecConvertPlanFn(
    getSrcDataFn,
    u8sInU8sOut,
    u8sInVoidOut,
  );
  const service = createService({
    storage: memoryStorage,
    registry: memoryRegistry,
    convertPlanExecuter,
    convertPlanner,
  });
  return service;
}
