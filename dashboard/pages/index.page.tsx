import type { NextPage } from "next";
import { useSnapshot } from "valtio";
import { Layout, Table, Tabs, Button, Drawer } from "antd";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import createIndexPageState from "./index.state";
import { getElements } from "./index.state/react-flow";
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
const state = createIndexPageState();
const Page: NextPage = () => {
  const snap = useSnapshot(state);
  const { mode, items, gotoNormalMode, beginAddItemMode, finishAddItemMode } =
    snap;
  const elements = getElements(state);
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Header>
        <span style={{ color: "white", fontSize: "1.5rem" }}>
          Cabriolet Dashboard
        </span>
      </Layout.Header>
      <Layout>
        <Layout.Sider width={300}>
          <Button style={{ width: "100%" }} onClick={beginAddItemMode}>
            Add Item
          </Button>
          <Table
            columns={[
              { title: "key", dataIndex: "key", ellipsis: true },
              { title: "format", dataIndex: "format", ellipsis: true },
            ]}
            dataSource={items.map((item) => ({
              key: item.key,
              format: item.formatId,
            }))}
            size="small"
            scroll={{ y: "calc(100vh - 32px - 64px - 39px)" }}
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
      <Drawer
        title="Add Item"
        placement="left"
        closable={false}
        visible={mode.type === "add-item"}
      >
        TODO
        <Button type="primary" onClick={finishAddItemMode}>
          Add
        </Button>
        <Button onClick={gotoNormalMode}>Cancel</Button>
      </Drawer>
    </Layout>
  );
};

export default Page;
