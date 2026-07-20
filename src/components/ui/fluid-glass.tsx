import * as THREE from 'three';
import { useRef, useState, useEffect, memo, Suspense } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial
} from '@react-three/drei';
import { easing } from 'maath';

interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: any;
  barProps?: any;
  cubeProps?: any;
  scale?: number;
  ior?: number;
}

// Animate abstract colored shapes in 3D space to create a dynamic background
function MedscopeBackgroundShapes() {
  const { width, height } = useThree((s) => s.viewport);
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const mesh3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Slow organic floating motion for background blobs
    if (mesh1.current) {
      mesh1.current.position.x = Math.sin(t * 0.15) * (width * 0.25);
      mesh1.current.position.y = Math.cos(t * 0.2) * (height * 0.2);
    }
    if (mesh2.current) {
      mesh2.current.position.x = Math.cos(t * 0.2 + 1.5) * (width * 0.25);
      mesh2.current.position.y = Math.sin(t * 0.1 + 1.5) * (height * 0.2);
    }
    if (mesh3.current) {
      mesh3.current.position.x = Math.sin(t * 0.25 + 3.0) * (width * 0.2);
      mesh3.current.position.y = Math.cos(t * 0.15 + 3.0) * (height * 0.15);
    }
  });

  return (
    <group>
      {/* Primary Blue blob */}
      <mesh ref={mesh1} position={[-2, 1, -2]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      {/* Purple blob */}
      <mesh ref={mesh2} position={[2, -1.5, -1]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
      {/* Fuchsia/Pink blob */}
      <mesh ref={mesh3} position={[-0.5, -2, -3]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>
    </group>
  );
}

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    ...modeProps
  } = rawOverrides;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <ScrollControls damping={0.2} pages={1} distance={0.4}>
            <Wrapper modeProps={modeProps}>
              <MedscopeBackgroundShapes />
              <Preload />
            </Wrapper>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

interface WrapperProps {
  children: React.ReactNode;
  modeProps?: any;
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: WrapperProps & { glb: string; geometryKey: string; lockToBottom?: boolean; followPointer?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF(glb) as any;
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

      if (modeProps.scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.15, desired));
      }
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Transparent clear background to allow tailwind/theme backgrounds to show
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent opacity={1} />
      </mesh>
      {nodes[geometryKey] && (
        <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} geometry={nodes[geometryKey].geometry} {...props}>
          <MeshTransmissionMaterial
            buffer={buffer.texture}
            ior={ior ?? 1.15}
            thickness={thickness ?? 5}
            anisotropy={anisotropy ?? 0.01}
            chromaticAberration={chromaticAberration ?? 0.1}
            transmission={1.0}
            roughness={0}
            {...extraMat}
          />
        </mesh>
      )}
    </>
  );
});

function Lens({ modeProps, ...p }: WrapperProps) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: WrapperProps) {
  return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: WrapperProps) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

// Preload the GLB assets to prevent frame drops
useGLTF.preload('/assets/3d/lens.glb');
useGLTF.preload('/assets/3d/cube.glb');
useGLTF.preload('/assets/3d/bar.glb');
