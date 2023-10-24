import { createRender, useModelState } from "@anywidget/react";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "@react-three/drei";

function My3DModel(props) {
  const ref = useRef();
  const jsonStr = props.torusModelUrl;
  const [gltfModel, setGltfModel] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.parse(jsonStr, "", (result) => {
      setGltfModel(result);
    });
  }, [jsonStr]);

  if (!gltfModel) return null;
  return (
    <group position={[1, -2, 2]} rotation={[1, 1, 0]}>
      <primitive
        object={gltfModel.scene}
        ref={ref}
        scale={[0.5, 0.5, 0.5]}
        {...props}
      />
    </group>
  );
}


export const render = createRender(() => {
  const [gltf_data] = useModelState("gltf_data");

  return (
    <div style={{ height: "500px" }}>
      <Canvas style={{ height: "100%" }}>
        <ambientLight />
        <pointLight position={[-4, 0, 1]} />
        <Suspense fallback={null}>
          <My3DModel position={[2, -2, -2]} torusModelUrl={gltf_data} />
        </Suspense>
        <OrbitControls enablePan={false} />
        <perspectiveCamera position={[1, -3, 10]} />
      </Canvas>
    </div>
  );
});
