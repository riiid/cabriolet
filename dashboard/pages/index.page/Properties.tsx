import { useSnapshot } from "valtio";
import { Layout, Button } from "antd";
import { state } from "../index.page";

export default function Properties() {
  const snap = useSnapshot(state);
  return (
    <Layout.Sider width={300} style={{ backgroundColor: "#fff" }}>
      {snap.mode.type !== "add-format" ? (
        <Button style={{ width: "100%" }} onClick={snap.beginAddFormatMode}>
          Add Format
        </Button>
      ) : (
        <Button style={{ width: "100%" }} onClick={snap.gotoNormalMode}>
          Cancel
        </Button>
      )}
    </Layout.Sider>
  );
}
