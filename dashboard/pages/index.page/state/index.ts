import { proxy } from "valtio";
import { XYPosition } from "react-flow-renderer";
import {
  getDefaultValue as getInitialSchema,
  Type as Schema,
} from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { deriveReactFlow, getEdges, layout } from "./react-flow";

export interface Item {
  key: string;
  formatId: string;
}
export interface Positions {
  [formatId: string]: XYPosition;
}
export type State = ReturnType<typeof createIndexPageState>;
export default function createIndexPageState() {
  const state = proxy({
    items: [] as Item[],
    schema: getInitialSchema(),
    positions: {} as Positions,
    mode: { type: "normal" } as Mode,
    init(schema: Schema = getInitialSchema()) {
      state.schema = schema;
      state.positions = Object.fromEntries(
        schema.formats.map(({ id }) => ([id, { x: 0, y: 0 }])),
      );
      layout(state2.nodes, getEdges(state2));
      state.gotoNormalMode();
    },
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
  });
  const state2 = deriveReactFlow(state);
  return state2;
}

type Mode = NormalMode | AddItemMode;
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
