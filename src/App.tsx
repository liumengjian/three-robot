import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./App.css";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    /***************************************初始化****************************************/
    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(15, 12, 8);
    camera.lookAt(0, 0, 0);
    // 创建渲染器
    const renderer = new THREE.WebGL1Renderer({
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 将渲染器添加到页面中
    containerRef.current?.appendChild(renderer.domElement);

    /***************************************双脚****************************************/
    const robot = new THREE.Object3D();
    const generateLegs = (y: number, z: number) => {
      const leg1 = new THREE.CapsuleGeometry(1, 4);
      const legMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x43b988,
        roughness: 0.5,
        metalness: 1.0,
      });
      const leg1Mesh = new THREE.Mesh(leg1, legMaterial1);
      leg1Mesh.position.y = y;
      leg1Mesh.position.z = z;
      robot.add(leg1Mesh);
    };

    generateLegs(0, -2);
    generateLegs(0, 2);
    scene.add(robot);

    //材质是MeshStandardMaterial，这种材质是感光的，需要有光源照在上面才会看见，
    //所以我们还需要在场景里面添加进去光源，这里使用平行光DirectionalLight
    /***************************************添加光源****************************************/
    const straightLight = new THREE.DirectionalLight(0xffffff, 5);
    straightLight.position.x = 5;
    straightLight.position.y = 10;
    straightLight.position.z = 5;
    scene.add(straightLight);

    /***************************************身体****************************************/
    const body = new THREE.CapsuleGeometry(4, 4, 6);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x43b988,
      roughness: 0.5,
      metalness: 1.0,
    });
    const bodyMesh = new THREE.Mesh(body, bodyMaterial);
    bodyMesh.position.y = 4;
    robot.add(bodyMesh);

    /***************************************手臂****************************************/
    const generateArms = (y: number, z: number) => {
      const arm1 = new THREE.CapsuleGeometry(1, 4);
      const armMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x43b988,
        roughness: 0.5,
        metalness: 1.0,
      });
      const arm1Mesh = new THREE.Mesh(arm1, armMaterial1);
      arm1Mesh.position.y = y;
      arm1Mesh.position.z = z;
      robot.add(arm1Mesh);
    };
    generateArms(3, 5);
    generateArms(3, -5);

    /***************************************脑袋****************************************/
    const head = new THREE.SphereGeometry(
      4,
      32,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.5
    );
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0x43b988,
      roughness: 0.5,
      metalness: 1.0,
    });
    const headMesh = new THREE.Mesh(head, headMaterial);
    headMesh.position.y = 6.5;
    robot.add(headMesh);

    /***************************************触角****************************************/
    const generateEars = (y: number, z: number, angle: number) => {
      const ear = new THREE.CapsuleGeometry(0.1, 2);
      const earMaterial = new THREE.MeshStandardMaterial({
        color: 0x43b988,
        roughness: 0.5,
        metalness: 1.0,
      });
      const earMesh = new THREE.Mesh(ear, earMaterial);
      earMesh.position.y = y;
      earMesh.position.z = z;
      earMesh.rotation.x = angle;
      robot.add(earMesh);
    };
    generateEars(11, -1, (-Math.PI * 30) / 180);
    generateEars(11, 1, (Math.PI * 30) / 180);

    /***************************************眼睛****************************************/
    const generateEyes = (x: number, y: number, z: number) => {
      const eye = new THREE.SphereGeometry(
        0.5,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 2
      );
      const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x212121,
        roughness: 0.5,
        metalness: 1.0,
      });
      const eyeMesh = new THREE.Mesh(eye, eyeMaterial);
      eyeMesh.position.y = y;
      eyeMesh.position.x = x;
      eyeMesh.position.z = z;
      robot.add(eyeMesh);
    };
    generateEyes(3, 8, -2);
    generateEyes(3, 8, 2);

    /***************************************生成轨道****************************************/
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    /***************************************周围粒子****************************************/
    const stars = new THREE.Object3D();
    const obj = new THREE.SphereGeometry(0.2, 3, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x43b988,
      roughness: 0.1,
      metalness: 5,
    })
    const mesh = new THREE.Mesh(obj, material);

    for (let i = 0; i < 1000; i++) {
      const target = new THREE.Mesh();
      target.copy(mesh);
      target.position.x = Math.floor(Math.random() * 15) + Math.floor(Math.random() * -15);
      target.position.y = Math.floor(Math.random() * 15) + Math.floor(Math.random() * -15);
      target.position.z = Math.floor(Math.random() * 15) + Math.floor(Math.random() * -15);
      stars.add(target);
    }
    scene.add(stars);


    /***************************************动画循环渲染函数****************************************/
    const animate = () => {
      requestAnimationFrame(animate);
      robot.rotation.y -= 0.005;
      stars.rotation.y += 0.01;
      stars.rotation.x += 0.01;
      stars.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate(); // 开始动画循环

    // 清理函数
    return () => {
      // 当组件卸载时，进行清理
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
    
  }, [containerRef]);
  
  return <div className="app" ref={containerRef}></div>;
}

export default App;
