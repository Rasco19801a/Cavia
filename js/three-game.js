// three-game.js
// Three.js integration that mirrors the 2D game state into a 3D scene

import { CONFIG } from './config.js';
import { ANIMALS } from './animals.js';
import { eventSystem, GameEvents } from './event-system.js';

let three = null;
let renderer = null;
let scene = null;
let camera = null;
let canvasElement = null;

// Scene content
let ground = null;
let ambientLight = null;
let directionalLight = null;

// Game-driven objects
const buildingMeshes = [];
const animalMeshes = new Map(); // key: animal object, value: mesh
let playerMesh = null;

function colorToThree(color) {
    // Accept hex like #RRGGBB or color names; Three.js can parse strings
    return color || '#cccccc';
}

async function ensureThreeLoaded() {
    if (three) return three;
    const mod = await import('https://cdn.skypack.dev/three@0.161.0');
    three = mod;
    return three;
}

function getWorldGroundColor(world) {
    switch (world) {
        case 'natuur':
        case 'jungle':
            return 0x2e7d32; // greenish
        case 'strand':
            return 0xf5deb3; // sandy
        case 'winter':
            return 0xe3f2fd; // light blue/ice
        case 'woestijn':
            return 0xead39c; // desert sand
        case 'zwembad':
            return 0x81d4fa; // water-like
        case 'dierenstad':
            return 0xa1887f; // urban ground
        case 'paarden':
            return 0x81c784; // pasture
        case 'thuis':
            return 0xd7ccc8; // interior floor
        default:
            return 0x9e9e9e;
    }
}

function clearArray(arr, dispose = false) {
    while (arr.length) {
        const obj = arr.pop();
        if (obj && obj.parent) obj.parent.remove(obj);
        if (dispose && obj.geometry) obj.geometry.dispose();
        if (dispose && obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose && m.dispose());
            else obj.material.dispose && obj.material.dispose();
        }
    }
}

function disposeMesh(mesh) {
    if (!mesh) return;
    if (mesh.parent) mesh.parent.remove(mesh);
    mesh.geometry && mesh.geometry.dispose && mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose && m.dispose());
    else mesh.material && mesh.material.dispose && mesh.material.dispose();
}

function createGround(world) {
    const color = getWorldGroundColor(world);
    const geometry = new three.PlaneGeometry(CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    const material = new three.MeshStandardMaterial({ color, side: three.DoubleSide });
    const plane = new three.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // make it horizontal (X-Z plane)
    plane.position.set(CONFIG.WORLD_WIDTH / 2, 0, CONFIG.WORLD_HEIGHT / 2);
    plane.receiveShadow = true;
    return plane;
}

function buildBuildingsFromGame(game) {
    clearArray(buildingMeshes, true);
    if (!game.buildings) return;
    for (const b of game.buildings) {
        const geometry = new three.BoxGeometry(b.w, 80, b.h);
        const material = new three.MeshStandardMaterial({ color: colorToThree(b.color) });
        const mesh = new three.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Convert 2D top-left (x,y) to 3D center at (x + w/2, y + h/2)
        mesh.position.set(b.x + b.w / 2, 40, b.y + b.h / 2);
        scene.add(mesh);
        buildingMeshes.push(mesh);
    }
}

function createAnimalMesh(animal) {
    // Simple sphere or box per animal type
    const size = 30;
    const geometry = new three.SphereGeometry(size, 16, 12);
    const material = new three.MeshStandardMaterial({ color: colorToThree(animal.color?.body) });
    const mesh = new three.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(animal.x, size, animal.y);
    return mesh;
}

function buildAnimalsForWorld(world) {
    // Remove previous animal meshes
    for (const mesh of animalMeshes.values()) disposeMesh(mesh);
    animalMeshes.clear();

    const animals = ANIMALS[world] || [];
    for (const animal of animals) {
        const mesh = createAnimalMesh(animal);
        scene.add(mesh);
        animalMeshes.set(animal, mesh);
    }
}

function ensurePlayerMesh(game) {
    if (playerMesh) return;
    const geometry = new three.CapsuleGeometry(18, 30, 6, 12);
    const material = new three.MeshStandardMaterial({ color: colorToThree(game.player?.colors?.body || '#ffffff') });
    playerMesh = new three.Mesh(geometry, material);
    playerMesh.castShadow = true;
    playerMesh.receiveShadow = true;
    scene.add(playerMesh);
}

function updatePlayerMesh(game) {
    ensurePlayerMesh(game);
    const px = game.player.x;
    const pz = game.player.y;
    playerMesh.position.set(px, 30, pz);
}

function updateAnimalMeshes(world) {
    const animals = ANIMALS[world] || [];
    for (const animal of animals) {
        const mesh = animalMeshes.get(animal);
        if (mesh) {
            mesh.position.x = animal.x;
            mesh.position.z = animal.y;
        }
    }
}

function setupLights() {
    ambientLight = new three.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    directionalLight = new three.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 500, 300);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

function updateCameraFollow(game) {
    // Align 3D camera to 2D camera mapping so existing input math holds.
    const halfW = (canvasElement?.clientWidth || window.innerWidth) / 2;
    const halfH = (canvasElement?.clientHeight || window.innerHeight) / 2;

    // 2D camera centers on player; emulate with 3D camera looking at player
    const px = game.player.x;
    const pz = game.player.y;

    // Place camera with a slight elevation and back offset
    const camHeight = 350;
    const camDistance = 450;
    camera.position.set(px - 0, camHeight, pz + camDistance);
    camera.lookAt(px, 0, pz);
}

export async function initThreeGame(canvas, game) {
    await ensureThreeLoaded();
    canvasElement = canvas;

    renderer = new three.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);
    renderer.shadowMap.enabled = true;

    scene = new three.Scene();
    scene.background = null;

    camera = new three.PerspectiveCamera(60, (canvasElement.clientWidth || 1) / (canvasElement.clientHeight || 1), 1, 5000);

    setupLights();

    // Ground and initial content
    ground = createGround(game.currentWorld);
    scene.add(ground);
    buildBuildingsFromGame(game);
    buildAnimalsForWorld(game.currentWorld);
    ensurePlayerMesh(game);

    // Rebuild on world change
    eventSystem.on(GameEvents.WORLD_LOADED, (world) => {
        if (ground) { disposeMesh(ground); }
        ground = createGround(world);
        scene.add(ground);
        buildBuildingsFromGame(game);
        buildAnimalsForWorld(world);
    });
}

export function renderThreeGame(game) {
    if (!renderer || !scene || !camera) return;
    // Update dynamic objects
    updatePlayerMesh(game);
    updateAnimalMeshes(game.currentWorld);
    updateCameraFollow(game);

    renderer.render(scene, camera);
}

export function onResize() {
    if (!renderer || !camera || !canvasElement) return;
    const width = canvasElement.clientWidth || window.innerWidth;
    const height = canvasElement.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}

export function disposeThreeGame() {
    if (!scene) return;
    // Remove listeners
    try { eventSystem.off && eventSystem.off(GameEvents.WORLD_LOADED); } catch {}

    // Dispose scene content
    clearArray(buildingMeshes, true);
    for (const mesh of animalMeshes.values()) disposeMesh(mesh);
    animalMeshes.clear();
    disposeMesh(playerMesh); playerMesh = null;
    disposeMesh(ground); ground = null;
    if (ambientLight && ambientLight.parent) ambientLight.parent.remove(ambientLight);
    if (directionalLight && directionalLight.parent) directionalLight.parent.remove(directionalLight);
    ambientLight = null; directionalLight = null;

    if (renderer) { renderer.dispose(); renderer = null; }
    scene = null; camera = null; canvasElement = null; three = three;
}