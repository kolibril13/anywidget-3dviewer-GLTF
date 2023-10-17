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
      <primitive object={gltfModel.scene} ref={ref} {...props} />
    </group>
  );
}

export const render = createRender(() => {
  const [gltf_data] = useModelState("gltf_data");

  return (
    <div style={{ height: "500px" }}>
      <Canvas style={{ height: "100%" }}>
        {/* Increase the intensity of the ambient light */}
        <ambientLight intensity={1.5} />

        {/* Increase the intensity of the point light */}
        <pointLight position={[-1, 0, 1]} intensity={2} />

        {/* Add an additional point light for better illumination */}
        <pointLight position={[1, 2, -1]} intensity={1.5} />

        {/* Use a hemispheric light for soft illumination from above and below */}
        <hemisphereLight
          skyColor={"#ffffff"}
          groundColor={"#888888"}
          intensity={0.5}
        />

        <Suspense fallback={null}>
          <My3DModel position={[2, -2, -2]} torusModelUrl={gltf_data} />
        </Suspense>

        <OrbitControls enableRotate={true} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
        <perspectiveCamera position={[1, -3, 4]} />
      </Canvas>
    </div>
  );
});
