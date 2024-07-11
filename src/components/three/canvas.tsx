import { Canvas, type CanvasProps } from "@react-three/fiber";

/**
 * The `CanvasCore` function in TypeScript React renders a `Canvas` component with the provided props.
 * @param {CanvasProps} props - The `props` parameter in the `CanvasCore` function is of type
 * `CanvasProps`, which likely contains the properties or configuration settings needed for rendering a
 * canvas element.
 *
 * Make sure to use this component in a dynamic import to prevent server-side rendering issues.
 * And also prevent the initial js bundle size from getting too large.
 *
 * @returns A JSX element `<Canvas>` with the props passed to the `CanvasCore` component.
 */
const CanvasCore = (props: CanvasProps) => {
  return <Canvas {...props} />;
};

export default CanvasCore;
