import * as THREE from "three";
export interface CookingObject {
  mesh: THREE.Mesh;
  draggable: boolean;
}
export interface Ingredient extends CookingObject {
  name: string;
  cooked: boolean;
}
export interface CookingContainer extends CookingObject {
  ingredients: Ingredient[];
}
export class Egg implements Ingredient {
  mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2), new THREE.MeshLambertMaterial());
  cooked = false;
  name = "egg";
  draggable = true;
}
export class Bowl implements CookingContainer {
  mesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshLambertMaterial({ color: 0xaaaaaa }));
  ingredients = [];
  draggable = true;
}
export class Counter implements CookingObject {
  mesh = new  THREE.Mesh(new THREE.BoxGeometry(5, 1, 1.5), new THREE.MeshLambertMaterial( { color: 0xf36f40 } ));
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
  defaultObjects() {
    const light = new THREE.DirectionalLight();
    light.position.set(0, 1, 0.2);
    this.scene.add(light);
    const light2 = new THREE.HemisphereLight(0x111111);
    this.scene.add(light2);

    const counter = new Counter();
    counter.mesh.position.y = -2;
    this.add(new Counter());
  }
  getDraggableObjects() {
    return this.objects.filter((o) => o.draggable).map((o) => o.mesh);
  }
  constructor() {
    this.scene = new THREE.Scene();
    this.objects = [];
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
    this.scene.add(object.mesh);
    return id;
  }
  get(id: number) {
    return this.objects[id];
  }
  remove(object: CookingObject) {
    return this.objects.splice(this.objects.indexOf(object), 1);
  }
  nearestObjectTo(object: CookingObject, noFurtherThan: number): undefined | CookingObject {
    let closest = noFurtherThan;
    let id = -1;
    this.objects.forEach((sceneObject, i) => {
      let position = new THREE.Vector3();
      sceneObject.mesh.getWorldPosition(position);
      const distance = position.distanceTo(object.mesh.position);
      if (distance < closest) {
        id = i;
        closest = distance;
      }
    });
    if (id == -1) return undefined;
    return this.get(id);
  }
  draw(camera: THREE.Camera, renderer: THREE.Renderer) {
    renderer.render(this.scene, camera);
  }
}
