import { useSnapshot } from "valtio";
import { Layout } from "antd";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import {
  BlueEdge,
  BoldBlueEdge,
  GreenEdge,
  BoldGreenEdge,
} from "../react-flow/custom-edge";
import { State } from "./state";
import { getElements } from "./state/react-flow";
import { state } from "../index.page";

const edgeTypes = {
  inherit: BlueEdge,
  "inherit-highlight": BoldBlueEdge,
  convert: GreenEdge,
  "convert-highlight": BoldGreenEdge,
};

export default function Schema() {
  const snap = useSnapshot(state);
  const elements = getElements(snap as State);
  return (
    <Layout.Content style={{ padding: "0 1em" }}>
      <ReactFlow elements={elements} edgeTypes={edgeTypes}>
        <MiniMap nodeBorderRadius={2} />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </Layout.Content>
  );
}
