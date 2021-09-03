import React, { memo } from "react";
import { EdgeProps, getBezierPath } from "react-flow-renderer";

const blueEdgeStyle: React.CSSProperties = {
  stroke: "#008fff",
  strokeOpacity: 0.7,
};
export const BlueEdge = (props: EdgeProps) => {
  return <CustomEdge {...props} style={blueEdgeStyle} />;
};

const boldBlueEdgeStyle: React.CSSProperties = {
  stroke: "#061d54",
  strokeWidth: 5,
};
export const BoldBlueEdge = (props: EdgeProps) => {
  return <CustomEdge {...props} style={boldBlueEdgeStyle} />;
};

const greenEdgeStyle: React.CSSProperties = {
  stroke: "#8ddf00",
  strokeOpacity: 0.7,
};
export const GreenEdge = (props: EdgeProps) => {
  return <CustomEdge {...props} style={greenEdgeStyle} />;
};

const boldGreenEdgeStyle: React.CSSProperties = {
  stroke: "#00b80e",
  strokeWidth: 5,
};
export const BoldGreenEdge = (props: EdgeProps) => {
  return <CustomEdge {...props} style={boldGreenEdgeStyle} />;
};

const CustomEdge = memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
  }: EdgeProps) => {
    const path = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    return (
      <>
        <path className="react-flow__edge-path-selector" d={path} />
        <path style={style} className="react-flow__edge-path" d={path} />
      </>
    );
  }
);
export default CustomEdge;
