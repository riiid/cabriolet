import { useState } from "react";
import type { NextPage } from "next";
import { Layout, Table, Tabs } from "antd";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Elements,
  Node as FlowNode,
  Edge as FlowEdge,
} from "react-flow-renderer";
import * as dagre from "dagre";
import {
  BlueEdge,
  BoldBlueEdge,
  GreenEdge,
  BoldGreenEdge,
} from "./react-flow/custom-edge";

const edgeTypes = {
  inherit: BlueEdge,
  "inherit-highlight": BoldBlueEdge,
  convert: GreenEdge,
  "convert-highlight": BoldGreenEdge,
};
const Page: NextPage = () => {
  const [elements] = useState(initialElements);
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Header>
        <span style={{ color: "white", fontSize: "1.5rem" }}>
          Cabriolet Dashboard
        </span>
      </Layout.Header>
      <Layout>
        <Layout.Sider width={300}>
          <Table
            columns={[
              { title: "key", dataIndex: "key", ellipsis: true },
              { title: "format", dataIndex: "format", ellipsis: true },
            ]}
            dataSource={new Array(50).fill(0).map((_, i) => ({
              key: i,
              format: i,
            }))}
            size="small"
            scroll={{ y: "calc(100vh - 64px - 70px - 39px)" }}
            pagination={false}
          />
        </Layout.Sider>
        <Layout.Content style={{ padding: "0 1em" }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Format Hierarchy" key="1">
              <ReactFlow elements={elements} edgeTypes={edgeTypes}>
                <MiniMap nodeBorderRadius={2} />
                <Controls />
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Conversion Graph" key="2">
              conversion graph
            </Tabs.TabPane>
          </Tabs>
        </Layout.Content>
      </Layout>
      <Layout.Footer>footer</Layout.Footer>
    </Layout>
  );
};

export default Page;

const nodes: FlowNode[] = [
  { id: "1", data: { label: "foo" }, position: { x: 0, y: 0 } },
  { id: "2", data: { label: "bar" }, position: { x: 0, y: 0 } },
  { id: "3", data: { label: "baz" }, position: { x: 0, y: 0 } },
  { id: "4", data: { label: "qux" }, position: { x: 0, y: 0 } },
];
const edges: FlowEdge[] = [
  {
    type: "inherit",
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    type: "inherit-highlight",
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
  },
  {
    type: "convert",
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
  },
  {
    type: "convert-highlight",
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
  },
];
layout(nodes, edges);
const initialElements: Elements = [...nodes, ...edges];

function layout(nodes: FlowNode[], edges: FlowEdge[]) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB" });
  g.setDefaultEdgeLabel(() => ({}));
  for (const node of nodes) g.setNode(node.id, { width: 170, height: 50 });
  for (const edge of edges) g.setEdge(edge.source, edge.target);
  dagre.layout(g);
  for (const node of nodes) {
    const { x, y } = g.node(node.id);
    node.position = { x, y };
  }
}
