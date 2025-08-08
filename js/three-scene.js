// three-scene.js
// Minimal Three.js scene management for a rotating cube

let three = null;
let renderer = null;
let scene = null;
let camera = null;
let animationId = null;
let cube = null;
let canvasElement = null;
let orthoFrustumSize = 4; // controls zoom scale for orthographic camera

async function ensureThreeLoaded() {
    if (three) return three;
    // Dynamically import from Skypack/CDN to avoid bundling
    const mod = await import('https://cdn.skypack.dev/three@0.161.0');
    three = mod;
    return three;
}

export async function initThreeScene(canvas) {
    await ensureThreeLoaded();
    canvasElement = canvas;

    renderer = new three.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

    scene = new three.Scene();
    scene.background = null; // transparent to let UI show

    // Orthographic camera for isometric view
    const width = Math.max(1, canvasElement.clientWidth);
    const height = Math.max(1, canvasElement.clientHeight);
    const aspect = width / height;
    const top = orthoFrustumSize;
    const bottom = -orthoFrustumSize;
    const left = -orthoFrustumSize * aspect;
    const right = orthoFrustumSize * aspect;
    camera = new three.OrthographicCamera(left, right, top, bottom, 0.1, 2000);

    // Position camera in classic isometric direction (equal on x,y,z)
    const isoDir = new three.Vector3(1, 1, 1).normalize();
    const distance = 6;
    const offset = isoDir.multiplyScalar(distance);
    camera.position.set(offset.x, offset.y, offset.z);
    camera.lookAt(0, 0, 0);

    // Simple lighting
    const ambient = new three.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const dir = new three.DirectionalLight(0xffffff, 0.6);
    dir.position.set(3, 5, 2);
    scene.add(dir);

    // Rotating cube placeholder
    const geometry = new three.BoxGeometry(1, 1, 1);
    const material = new three.MeshStandardMaterial({ color: 0x8e44ad });
    cube = new three.Mesh(geometry, material);
    scene.add(cube);

    onResize();
}

function renderFrame() {
    if (!renderer || !scene || !camera) return;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.015;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(renderFrame);
}

export function startThreeScene() {
    if (animationId) return; // already running
    renderFrame();
}

export function stopThreeScene() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

export function disposeThreeScene() {
    stopThreeScene();
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    if (scene) {
        // dispose basic resources
        scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.geometry && obj.geometry.dispose && obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose && m.dispose());
                    else obj.material.dispose && obj.material.dispose();
                }
            }
        });
    }
    three = null;
    scene = null;
    camera = null;
    cube = null;
}

export function onResize() {
    if (!renderer || !camera || !canvasElement) return;
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    if (width === 0 || height === 0) return;

    // Update orthographic bounds
    const aspect = width / height;
    camera.left = -orthoFrustumSize * aspect;
    camera.right = orthoFrustumSize * aspect;
    camera.top = orthoFrustumSize;
    camera.bottom = -orthoFrustumSize;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}