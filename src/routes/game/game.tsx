import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { RecipeBook } from "$components/recipeUi";
import styles from "./game.module.css";
import { Tutorial } from "$components/tutorial";
import { Button, Icon } from "$components/ui";
import { Link } from "preact-router";
import { Egg, Kitchen, Pan, Ingredient, CookingContainer, Stovetop, Spaghetti, SaucePan } from "$lib/logic";
import { recipes, tutorialMessages } from "$lib/recipes";
import { PerspectiveCamera, sRGBEncoding, WebGLRenderer } from "three";
export const Game: FunctionalComponent<{}> = () => {
  const [recipe, setRecipe] = useState(0);
  const [inTutorial, setInTutorial] = useState(true);
  const div = useRef<HTMLDivElement>(null);
  let kitchen: undefined | Kitchen = undefined;
  useEffect(() => {
    if (inTutorial || div.current === null) return;
    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 1.1;
    camera.position.y = 1.0;
    camera.rotateX(-0.55);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true,  });
    renderer.outputEncoding = sRGBEncoding;
    renderer.setClearColor(0xffffff, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);
    window.onresize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    div.current.replaceChildren();
    div.current.appendChild(renderer.domElement);



    kitchen = new Kitchen(camera, renderer.domElement);

    kitchen.add(new Egg());
    kitchen.add(new Spaghetti());
    const pans = [new Pan(), new SaucePan()];
    pans.forEach((p) => kitchen?.add(p));



    const cancelIntervals = pans.map((p) => p.init((old, new_) => {
      old.sceneObject.removeFromParent();
      if (kitchen) {
        console.log("sd;kjkl")
        kitchen.change(old, new_);
      }
    }));
    const stovetop = new Stovetop();
    stovetop.isOn = true;
    stovetop.sceneObject.position.set(0.0, 0.35, 0.05);
    kitchen.add(new Stovetop());
    kitchen.dragControls.addEventListener("hoveron", (e) => {
      e.object.material.emissive.set(0xeeeeee);
    });
    kitchen.dragControls.addEventListener("hoveroff", (e) => {
      e.object.material.emissive.set(0x000000);
    });
    kitchen.dragControls.addEventListener("dragstart", (e) => {
      console.log(kitchen);
      let obj = kitchen?.getObjectFromUid(e.object.uuid);
      if (obj !== undefined && "cookingContainer" in obj) {
        const objIngredient = (obj as Ingredient);
        console.log(objIngredient);
        if (objIngredient.cookingContainer !== undefined) {
        console.log("is currently in container");
          objIngredient.cookingContainer.ingredients.splice(objIngredient.cookingContainer.ingredients.indexOf(objIngredient), 1);
          objIngredient.cookingContainer = undefined;
          return;
        }
      }
    });
    kitchen.dragControls.addEventListener("dragend", (e) => {
      let obj = kitchen?.getObjectFromUid(e.object.uuid);
      if (obj !== undefined && "cookingContainer" in obj) {
        const objIngredient = (obj as Ingredient);
        const cookingContainer = kitchen?.nearestObjectTo(objIngredient, 0.3, (c) => "ingredients" in c);
        if (cookingContainer !== undefined) {
          if (objIngredient.cookingContainer) {
            objIngredient.cookingContainer.ingredients = [];
            objIngredient.cookingContainer = undefined;
          } else {
            (cookingContainer as CookingContainer).ingredients.push(objIngredient as Ingredient);
            objIngredient.cookingContainer = cookingContainer as CookingContainer;
          }
        }
      }
    });

    function animate(_now: number) {
      requestAnimationFrame(animate);
      stovetop.heatPans(pans);
      kitchen?.draw(camera, renderer);
    }
    let id = requestAnimationFrame(animate);
    return () => {
      if (div.current === null) return;
      for (const child of div.current.children) {
        div.current.removeChild(child);
      }
      cancelIntervals.forEach((c) => clearInterval(c));
      cancelAnimationFrame(id);
    }
  }, [inTutorial]);
  if (inTutorial) {
    return (
      <Tutorial messages={tutorialMessages} initialIndex={0} onTutorialEnd={() => setInTutorial(false)} />
    );
  }
  return (
    <>
      <div class={styles.container}>
        <div class={styles.top}>
          <div class={styles.buttons}>
            <Link href="/"><Button square><Icon name="home" /></Button></Link>
            <Button square onClick={() => setRecipe(x => x - 1)}><Icon name="arrow_back" /></Button>
            <Button square onClick={() => setRecipe(x => x + 1)}><Icon name="arrow_forward" /></Button>
            <Button square onClick={() => {
              console.log(kitchen);
              kitchen?.objects[0].sceneObject.children.forEach((c) => (c as THREE.Mesh).translateY(5))
            }}><Icon name="refresh" /></Button>
          </div>
          <RecipeBook currentRecipe={recipe} recipes={recipes} onRecipeChange={(i) => setRecipe(i)}></RecipeBook>
        </div>
        <div class={styles.div} ref={div}></div>
      </div>
    </>
  )
};
