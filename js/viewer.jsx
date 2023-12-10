import { createRender, useModelState } from "@anywidget/react";
import React, { useRef, useState, useEffect, Suspense } from "react";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
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
    <group position={[0, 0, 0]} rotation={[1, 1, 0]}>
      <primitive
        object={gltfModel.scene}
        ref={ref}
        scale={[4.5, 4.5, 4.5]}
        {...props}
      />
    </group>
  );
}

function DirectionalLight() {
  const { camera } = useThree();
  const [lightPosition, setLightPosition] = useState([0, 0, 0]);

  useFrame(() => {
    // Update the light position to match the camera position
    setLightPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  return <directionalLight position={lightPosition} intensity={2} />;
}

export const render = createRender(() => {
  const [gltf_data] = useModelState("gltf_data");

  // this links camera to light position
  const orbitControlsRef = useRef();
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (orbitControlsRef.current && orbitControlsRef.current.object) {
      setCameraPosition(orbitControlsRef.current.object.position);
    }
    console.log("hi");
  }, [orbitControlsRef]);

  return (
    <>
      <div style={{ height: "500px" }}>
        <Canvas style={{ height: "100%" }}>
          <DirectionalLight />
          {/* <gridHelper args={[20, 20]} /> */}
          <Suspense fallback={null}>
            <My3DModel position={[0, 0, 0]} torusModelUrl={gltf_data} />
          </Suspense>

          <OrbitControls ref={orbitControlsRef} enablePan={false} />
        </Canvas>
      </div>
    </>
  );
});
