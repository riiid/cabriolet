import { createContext, useContext } from "react";
import { proxy, ref } from "valtio";
import { XYPosition } from "react-flow-renderer";
import { Service } from "@riiid/cabriolet-proto/lib/services/riiid/kvf/KvfService";
import { deriveReactFlow, getEdges, layout } from "./react-flow";

export interface Item {
  key: string;
  formatId: string;
}
export interface Positions {
  [formatId: string]: XYPosition;
}
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type State = Awaited<ReturnType<typeof createIndexPageState>>;
export default async function createIndexPageState(service: Service) {
  const schema = (await service.getSchema({})).schema!;
  const keys = (await service.keys({ prefix: "" })).keys;
  const items: Item[] = await Promise.all(keys.map(async (key) => {
    const { formatId } = await service.getFormatId({ key });
    return { key, formatId };
  }));
  const state = proxy({
    service: ref(service),
    items,
    schema,
    positions: Object.fromEntries(
      schema.formats.map(({ id }) => ([id, { x: 0, y: 0 }])),
    ),
    mode: { type: "normal" } as Mode,
    gotoNormalMode() {
      state.mode = { type: "normal" };
    },
    beginAddItemMode() {
      state.mode = {
        type: "add-item",
        key: "",
        format: undefined,
        file: undefined,
        waiting: false,
      };
    },
    async finishAddItemMode() {
      // TODO: add item
      state.mode = { type: "normal" };
    },
    beginAddFormatMode() {
      state.mode = { type: "add-format" };
    },
    async finishAddFormatMode(x: number, y: number) {
      const formatName = "New Format";
      const formatDescription = "";
      const { formatId } = await state.service.createFormat({
        formatName,
        formatDescription,
      });
      state.schema.formats.push({
        id: formatId,
        name: formatName,
        description: formatDescription,
        parentFormatId: undefined,
        validatorIds: [],
      });
      state.positions[formatId] = { x, y };
      state.gotoNormalMode();
      return formatId;
    },
    beginAddEdgeMode(fromFormatId: string, toFormatId: string) {
      state.mode = { type: "add-edge", fromFormatId, toFormatId };
    },
    async finishAddEdgeMode(
      converterName: string,
      converterDescription: string,
      converterSrc: string,
      converterIntegrity: string,
    ) {
      if (state.mode.type !== "add-edge") throw new Error("invalid mode");
      const fromFormatId = state.mode.fromFormatId;
      const toFormatId = state.mode.toFormatId;
      const { converterId } = await state.service.createConverter({
        fromFormatId,
        toFormatId,
        converterName,
        converterDescription,
        converterSrc,
        converterIntegrity,
      });
      state.schema.edges.push({ fromFormatId, toFormatId, converterId });
      state.gotoNormalMode();
    },
  });
  const state2 = deriveReactFlow(state);
  layout(state2.nodes, getEdges(state2));
  return state2;
}

export const indexPageStateContext = createContext<State>(undefined as any);
export function useIndexPageStateContext() {
  return useContext(indexPageStateContext);
}

type Mode = NormalMode | AddItemMode | AddFormatMode | AddEdgeMode;
interface ModeBase<TType extends string> {
  type: TType;
}
interface NormalMode extends ModeBase<"normal"> {}
interface AddItemMode extends ModeBase<"add-item"> {
  key: string;
  format: string | undefined;
  file: Blob | undefined;
  waiting: boolean;
}
interface AddFormatMode extends ModeBase<"add-format"> {}
interface AddEdgeMode extends ModeBase<"add-edge"> {
  fromFormatId: string;
  toFormatId: string;
}
