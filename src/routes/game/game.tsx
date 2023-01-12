import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { RecipeBook } from "$components/recipeUi";
import styles from "./game.module.css";
import { Tutorial } from "$components/tutorial";
import { Button, Icon } from "$components/ui";
import { Link } from "preact-router";
import { Egg, Kitchen, Pan, Ingredient, CookingContainer } from "$lib/logic";
import { recipes, tutorialMessages } from "$lib/recipes";
import { PerspectiveCamera, WebGLRenderer } from "three";
export const Game: FunctionalComponent<{}> = () => {
  const [recipe, setRecipe] = useState(0);
  const [inTutorial, setInTutorial] = useState(false);
  const div = useRef<HTMLDivElement>(null);
  let kitchen: undefined | Kitchen = undefined;
  useEffect(() => {
    if (inTutorial || div.current === null) return;
    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);
    kitchen = new Kitchen(camera, renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
    window.onresize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    div.current.appendChild(renderer.domElement);

    kitchen.add(new Egg());
    kitchen.add(new Pan());
    kitchen.dragControls.addEventListener("hoveron", (e) => {
      e.object.material.emissive.set(0xeeeeee);
    });
    kitchen.dragControls.addEventListener("hoveroff", (e) => {
      e.object.material.emissive.set(0x000000);
    });
    kitchen.dragControls.addEventListener("dragend", (e) => {
      let objold = kitchen?.getObjectFromUid(e.object.uuid);
      if (objold !== undefined && "cookingContainer" in objold) {
        const obj = (objold as Ingredient);
        const cookingContainer = kitchen?.nearestObjectTo(obj, 0.3, (c) => "ingredients" in c);
        if (cookingContainer !== undefined) {
          if (obj.cookingContainer) {
            obj.cookingContainer.ingredients = [];
            obj.cookingContainer = undefined;
          } else {
            (cookingContainer as CookingContainer).ingredients.push(obj as Ingredient);
            obj.cookingContainer = cookingContainer;
            console.log(obj.cookingContainer);
          }
        }
      }
    });

    camera.position.z = 1.5;
    camera.position.y = 0.5;

    function animate(_now: number) {
      requestAnimationFrame(animate);
      kitchen?.draw(camera, renderer);
    }
    let id = requestAnimationFrame(animate);
    return () => {
      if (div.current === null) return;
      for (const child of div.current.children) {
        div.current.removeChild(child);
      }
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
