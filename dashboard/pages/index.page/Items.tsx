import { useSnapshot } from "valtio";
import { Layout, Table, Button, Drawer } from "antd";
import { state } from "../index.page";

export default function Items() {
  const snap = useSnapshot(state);
  const { mode, items, gotoNormalMode, beginAddItemMode, finishAddItemMode } =
    snap;
  return (
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
    </Layout.Sider>
  );
}
