import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const gltfLoader = new GLTFLoader();
const modelNames = [
  "egg",
  "largebowl",
  "counter",
  "sunnysideup",
  "frypan"
];
const models: { [key: string]: THREE.Object3D } = {};
for (const modelName of modelNames) {
  const gltf = await gltfLoader.loadAsync(`/models/${modelName}.glb`);
  const model = gltf.scene.children[0];
  models[modelName] = model as THREE.Mesh;
}
export class Cookedness {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
  isRaw() {
    return this.value < 0;
  }
  isOvercooked() {
    return this.value > 100;
  }
  isCooked() {
    return this.value >= 0;
  }
}
export interface CookingObject {
  sceneObject: THREE.Object3D;
  draggable: boolean;
}
export interface CookingContainer extends CookingObject {
  ingredients: Ingredient[];
}
export interface Ingredient extends CookingObject {
  cookedness: Cookedness;
  draggable: boolean;
  sceneObject: THREE.Object3D<THREE.Event>;
  cookingContainer: CookingContainer | undefined;
}
export class Egg implements Ingredient {
  cookingContainer = undefined;
  sceneObject = models["egg"];
  draggable = true;
  cookedness = new Cookedness(-30);
}
export class Bowl implements CookingContainer {
  sceneObject = models["largebowl"];
  draggable = true;
  ingredients = [];
}
export class Pan implements CookingContainer {
  sceneObject = models["frypan"];
  draggable = true;
  ingredients = [];
}
export class Counter implements CookingObject {
  sceneObject = models["counter"];
  draggable = false;
}
export interface KitchenModificationEvent { }
export class ResetKitchenEvent implements KitchenModificationEvent {}
export class AddObjectEvent implements KitchenModificationEvent {
  constructor(public object: CookingObject) {}
}
export class RemoveObjectEvent implements KitchenModificationEvent {
  constructor(public object: CookingObject) {}
}
export class Kitchen {
  scene: THREE.Scene;
  objects: CookingObject[];
  dragControls: DragControls;
  defaultObjects() {
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    this.scene.add( hemiLight );

    const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    this.scene.add( hemiLightHelper );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    this.scene.add( dirLight );

    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
    this.scene.add( dirLightHelper );

    const counter = new Counter();
    counter.sceneObject.rotateY(1.57);
    this.add(new Counter());
  }
  getObjectFromUid(uuid: string) {
    for (const object of this.objects) {
      if (object.sceneObject.uuid == uuid) {
        return object;
      }
    }
  }
  getDraggableObjects() {
    return this.objects.filter((o) => o.draggable).map((o) => o.sceneObject);
  }
  constructor(camera: THREE.Camera, domElement: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.objects = [];
    this.dragControls = new DragControls([], camera, domElement);
    this.defaultObjects();
  }
  processEvent(event: KitchenModificationEvent) {
    if (event instanceof ResetKitchenEvent) {
      this.scene.clear();
      this.objects = [];
      this.defaultObjects();
    } else if (event instanceof AddObjectEvent) {
      this.add(event.object);
    } else if (event instanceof RemoveObjectEvent) {
      this.remove(event.object);
    }
  }
  add(object: CookingObject) {
    const id = this.objects.length;
    this.objects.push(object);
    this.scene.add(object.sceneObject);
    if (object.draggable) {
      this.dragControls.getObjects().push(object.sceneObject);
    }
    return id;
  }
  get(id: number) {
    return this.objects[id];
  }
  remove(object: CookingObject) {
    this.objects.splice(this.objects.indexOf(object), 1);
    this.scene.remove(object.sceneObject);
  }
  nearestObjectTo(object: CookingObject, noFurtherThan: number, check: (c: CookingObject) => boolean): undefined | CookingObject {
    let closest = noFurtherThan;
    let id = -1;
    this.objects.forEach((sceneObject, i) => {
      let position = new THREE.Vector3();
      sceneObject.sceneObject.getWorldPosition(position);
      const distance = position.distanceTo(object.sceneObject.position);
      if (distance < closest && check(sceneObject)) {
        id = i;
        closest = distance;
      }
    });
    if (id == -1) return undefined;
    return this.get(id);
  }
  draw(camera: THREE.Camera, renderer: THREE.Renderer) {
    for (const object of this.objects) {
      if ("cookingContainer" in object) {
        if (object.cookingContainer !== undefined) {
          (object as Ingredient).sceneObject.position.copy((object.cookingContainer as CookingContainer).sceneObject.position);
        }
      }
    }
    renderer.render(this.scene, camera);
  }
}
