import { derive } from "valtio/utils";
import * as dagre from "dagre";
import {
  Edge as FlowEdge,
  Elements,
  Node as FlowNode,
} from "react-flow-renderer";
import { Type as Schema } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/Schema";
import { Positions } from ".";

interface State {
  schema: Schema;
  positions: Positions;
}

type State2 = ReturnType<typeof deriveReactFlow>;

export function deriveReactFlow<T extends State>(state: T) {
  const state2 = derive(
    {
      nodes: (get) => {
        const { schema, positions } = get(state);
        return schema.formats.map((format) => {
          const flowNode: FlowNode = {
            id: format.id,
            data: { label: format.name },
            position: positions[format.id],
          };
          return flowNode;
        });
      },
      convertEdges: (get) => {
        const { schema } = get(state);
        const convertEdges = schema.edges.map((edge) => {
          const flowEdge: FlowEdge = {
            type: "convert",
            id: edge.fromFormatId + "\0" + edge.toFormatId,
            source: edge.fromFormatId,
            target: edge.toFormatId,
            animated: true,
          };
          return flowEdge;
        });
        return convertEdges;
      },
      inheritEdges: (get) => {
        const { schema } = get(state);
        const inheritEdges = schema.formats
          .map((format) => {
            if (!format.parentFormatId) return;
            return {
              type: "inherit",
              id: format.id + "\0" + format.parentFormatId,
              source: format.id,
              target: format.parentFormatId,
              animated: true,
            };
          })
          .filter((x) => x) as FlowEdge[];
        return inheritEdges;
      },
    },
    { proxy: state },
  );
  return state2;
}

export function layout(nodes: FlowNode[], edges: FlowEdge[]) {
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

export function getEdges(state: State2) {
  return [...state.convertEdges, ...state.inheritEdges];
}

export function getElements(state: State2) {
  return [
    ...state.nodes,
    ...state.convertEdges,
    ...state.inheritEdges,
  ] as Elements;
}
