import { useState } from "react";
import type { NextPage } from "next";
import { Layout, Table, Tabs } from "antd";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Elements,
} from "react-flow-renderer";
// import dagre from "dagre";

const Page: NextPage = () => {
  const [elements] = useState(initialElements as Elements);
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
              <ReactFlow elements={elements}>
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

const initialElements = [
  {
    id: "1",
    data: { label: "foo" },
    position: { x: 250, y: 100 },
  },
  {
    id: "2",
    data: { label: "bar" },
    position: { x: 100, y: 200 },
  },
  {
    id: "3",
    data: { label: "baz" },
    position: { x: 400, y: 200 },
  },
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];
