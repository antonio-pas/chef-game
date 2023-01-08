import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { RecipeBook } from "$components/recipeUi";
import styles from "./game.module.css";
import { Tutorial } from "$components/tutorial";
import { Button, Icon } from "$components/ui";
import { Link } from "preact-router";
import { Egg, Kitchen } from "$lib/logic";
import { recipes, tutorialMessages } from "$lib/recipes";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { PerspectiveCamera, WebGLRenderer } from "three";

export const Game: FunctionalComponent<{}> = () => {
  const [recipe, setRecipe] = useState(0);
  const [inTutorial, setInTutorial] = useState(true);
  const div = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const kitchen = new Kitchen();
    if (div.current === null) return;
    console.log(kitchen.objects);
    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);
    window.onresize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    div.current?.appendChild(renderer.domElement);

    kitchen.add(new Egg());
    const controls = new DragControls(kitchen.objects.map((x) => x.mesh), camera, renderer.domElement);
    controls.addEventListener("hoveron", (e) => {
      e.object.material.emissive.set(0xaaaaaa);
    });
    controls.addEventListener("hoveroff", (e) => {
      e.object.material.emissive.set(0x000000);
    });

    camera.position.z = 5;

    function animate(_now: number) {
      requestAnimationFrame(animate);
      kitchen.draw(camera, renderer);
    }
    let id = requestAnimationFrame(animate);
    return () => {
      if (div.current === null) return;
      for (const child of div.current.children) {
        div.current.removeChild(child);
      }
      cancelAnimationFrame(id);
    }
  }, []);
  if (inTutorial) {
    return (
      <Tutorial messages={tutorialMessages} initialIndex={0} onTutorialEnd={() => setInTutorial(false)} />
    );
  }
  return (
    <div class={styles.container}>
      <div class={styles.top}>
        <div class={styles.buttons}>
          <Link href="/"><Button square><Icon name="home" /></Button></Link>
          <Button square onClick={() => setRecipe(x => x - 1)}><Icon name="arrow_back" /></Button>
          <Button square onClick={() => setRecipe(x => x + 1)}><Icon name="arrow_forward" /></Button>
          <Button square><Icon name="refresh" /></Button>
        </div>
        <RecipeBook currentRecipe={recipe} recipes={recipes} onRecipeChange={(i) => setRecipe(i)}></RecipeBook>
      </div>
      <div class={styles.div} ref={div}></div>
    </div>
  )
};
