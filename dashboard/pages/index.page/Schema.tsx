import { useRef, RefObject, MutableRefObject } from "react";
import { useSnapshot } from "valtio";
import { Layout } from "antd";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  useStoreActions,
} from "react-flow-renderer";
import {
  BlueEdge,
  BoldBlueEdge,
  GreenEdge,
  BoldGreenEdge,
} from "../react-flow/custom-edge";
import { State } from "./state";
import { getElements, nodeSize } from "./state/react-flow";
import { useIndexPageStateContext } from "../index.page/state";

const edgeTypes = {
  inherit: BlueEdge,
  "inherit-highlight": BoldBlueEdge,
  convert: GreenEdge,
  "convert-highlight": BoldGreenEdge,
};

export default function Schema() {
  const state = useIndexPageStateContext();
  const snap = useSnapshot(state) as State;
  const elements = getElements(snap);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const reactFlowInstanceRef = useRef<OnLoadParams>();
  const { clickHandler } = useAddFormatMode(
    snap,
    reactFlowWrapperRef,
    reactFlowInstanceRef
  );
  return (
    <Layout.Content style={{ padding: "0 1em" }}>
      <div ref={reactFlowWrapperRef} style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          elements={elements}
          edgeTypes={edgeTypes}
          onLoad={(instance) => (reactFlowInstanceRef.current = instance)}
          onConnect={({ source, target }) => {
            if (!source || !target) return;
            snap.beginAddEdgeMode(source, target);
            snap.finishAddEdgeMode("TODO", "TODO", "TODO", "TODO");
          }}
          onClick={clickHandler}
        >
          <MiniMap nodeBorderRadius={2} />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </Layout.Content>
  );
}

function useAddFormatMode(
  state: State,
  reactFlowWrapperRef: RefObject<HTMLDivElement>,
  reactFlowInstanceRef: MutableRefObject<OnLoadParams | undefined>
) {
  const setSelectedElements = useStoreActions(
    (actions) => actions.setSelectedElements
  );
  if (state.mode.type !== "add-format") return {};
  const clickHandler: React.MouseEventHandler = async (e) => {
    const reactFlowWrapper = reactFlowWrapperRef.current;
    const reactFlowInstance = reactFlowInstanceRef.current;
    if (!reactFlowWrapper || !reactFlowInstance) throw new Error();
    const reactFlowBounds = reactFlowWrapper.getBoundingClientRect();
    const { x, y } = reactFlowInstance.project({
      x: e.clientX - reactFlowBounds.left,
      y: e.clientY - reactFlowBounds.top,
    });
    const id = await state.finishAddFormatMode(
      x - nodeSize.width / 2,
      y - nodeSize.height / 2
    );
    setSelectedElements({ id });
  };
  return { clickHandler };
}
