import type { NextPage } from "next";
import { Layout } from "antd";
import createIndexPageState from "./index.page/state";
import Items from "./index.page/Items";
import Schema from "./index.page/Schema";

export const state = createIndexPageState();

const Page: NextPage = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Header>
        <span style={{ color: "white", fontSize: "1.5rem" }}>
          Cabriolet Dashboard
        </span>
      </Layout.Header>
      <Layout>
        <Items />
        <Schema />
      </Layout>
    </Layout>
  );
};

export default Page;
