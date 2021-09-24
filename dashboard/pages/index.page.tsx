import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useSnapshot } from "valtio";
import { Layout } from "antd";
import { ReactFlowProvider } from "react-flow-renderer";
import createBrowserMemoryService from "@riiid/cabriolet-service-preset-browser-memory";
import createIndexPageState, {
  State,
  indexPageStateContext,
  useIndexPageStateContext,
} from "./index.page/state";
import Items from "./index.page/Items";
import Schema from "./index.page/Schema";
import Properties from "./index.page/Properties";

const Page: NextPage = () => {
  const [state, setState] = useState<State>();
  useEffect(() => {
    const service = createBrowserMemoryService();
    createIndexPageState(service).then(setState);
  }, []);
  return (
    <indexPageStateContext.Provider value={state as State}>
      {state && <WithState />}
    </indexPageStateContext.Provider>
  );
};

export default Page;

function WithState() {
  const state = useIndexPageStateContext();
  const snap = useSnapshot(state);
  const guideMessage = guideMessages[snap.mode.type];
  const headerStyle: React.CSSProperties = {
    color: "white",
    textAlign: guideMessage ? "center" : "left",
  };
  return (
    <ReactFlowProvider>
      <Layout style={{ height: "100vh" }}>
        <Layout.Header style={headerStyle}>
          <span style={{ fontSize: "1.5rem" }}>
            {guideMessage || "Cabriolet Dashboard"}
          </span>
        </Layout.Header>
        <Layout>
          <Items />
          <Schema />
          <Properties />
        </Layout>
      </Layout>
    </ReactFlowProvider>
  );
}

const guideMessages: { [mode in State["mode"]["type"]]: string } = {
  normal: "",
  "add-item": "",
  "add-format": "Click the location where you want to add the format",
};
