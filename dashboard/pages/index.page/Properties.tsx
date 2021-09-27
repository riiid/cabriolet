import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { Layout, Button } from "antd";
import { useStoreState } from "react-flow-renderer";
import { Type as Format } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Format";
import { Type as Edge } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Edge";
import { useIndexPageStateContext } from "../index.page/state";

export default function Properties() {
  const state = useIndexPageStateContext();
  const snap = useSnapshot(state);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const selectedIds = useMemo(
    () => selectedElements?.map(({ id }) => id) || [],
    [selectedElements]
  );
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
      {selectedIds.length == 0 && "no item selected"}
      <div>
        {selectedIds.map((id) => (
          <NodeProperties key={id} id={id} />
        ))}
      </div>
    </Layout.Sider>
  );
}

interface NodePropertiesProps {
  id: string;
}
function NodeProperties({ id }: NodePropertiesProps) {
  const state = useIndexPageStateContext();
  const snap = useSnapshot(state);
  const format = snap.schema.formats.find((f) => f.id === id);
  if (format) return <FormatProperties format={format} />;
  const edge = snap.schema.edges.find(
    (e) => `${e.fromFormatId}\0${e.toFormatId}` === id
  );
  if (edge) return <EdgeProperties edge={edge} />;
  return null;
}

interface FormatPropertiesProps {
  format: Format;
}
function FormatProperties({ format }: FormatPropertiesProps) {
  const state = useIndexPageStateContext();
  return (
    <div style={{ padding: "1em", borderBottom: "1px solid #eee" }}>
      Format
      <table>
        <tbody>
          <tr>
            <td>id</td>
            <td>{format.id}</td>
          </tr>
          <tr>
            <td>name</td>
            <td>
              <input
                type="text"
                value={format.name}
                onChange={(e) => {
                  const f = state.schema.formats.find(
                    (f) => f.id === format.id
                  )!;
                  f.name = e.target.value;
                  // TODO: state.service.updateFormat(...)
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface EdgePropertiesProps {
  edge: Edge;
}
function EdgeProperties({ edge }: EdgePropertiesProps) {
  // const state = useIndexPageStateContext();
  return (
    <div style={{ padding: "1em", borderBottom: "1px solid #eee" }}>
      Edge
      <table>
        <tbody>
          <tr>
            <td>from format id</td>
            <td>{edge.fromFormatId}</td>
          </tr>
          <tr>
            <td>to format id</td>
            <td>{edge.toFormatId}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
