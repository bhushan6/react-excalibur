/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import useMeasure from "react-use-measure";
import {
  ErrorBoundary,
  generateUniqueId,
  useIsomorphicLayoutEffect,
  render,
  unmountComponentAtNode,
} from ".";

export const Canvas = ({ style, children, ...props }) => {
  const canvasRef = React.useRef(null);

  const [divRef, { width, height }] = useMeasure({
    scroll: true,
    debounce: { scroll: 50, resize: 0 },
  });

  const id = React.useMemo(() => `excalibur-${generateUniqueId()}`, []);

  const [canvas, setCanvas] = React.useState();

  const [error, setError] = React.useState(false);

  if (error) throw error;

  if (canvas && width > 0 && height > 0) {
    render(<ErrorBoundary set={setError}>{children}</ErrorBoundary>, canvas, {
      width,
      height,
    });
  }

  useIsomorphicLayoutEffect(() => {
    setCanvas(canvasRef.current);
  }, []);

  React.useEffect(() => {
    if (canvas)
      return () => {
        unmountComponentAtNode(canvas);
      };
  }, [canvas]);

  return (
    <div
      {...props}
      ref={divRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        id={id}
        ref={canvasRef}
        style={{
          display: "block",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
