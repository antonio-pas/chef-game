import { FunctionComponent } from "preact";

import { Recipe as RecipeInterface } from "$lib/recipe";

import styles from "./recipeUi.module.css";
import { Button } from "./ui";

interface RecipeProps {
  recipe: RecipeInterface,
  selected: boolean,
  onSelect: () => void;
}

export const Recipe: FunctionComponent<RecipeProps> = ({ recipe, selected, onSelect }) => {
  return (
    <div class={styles.recipe}>
      <h1 class={styles.recipeHeader}>{recipe.title}</h1>
      <h2 class={styles.recipeDifficulty}>difficulty: {recipe.difficulty}</h2>
      <p>{recipe.description}</p>
      {selected ? <Button disabled>Already selected</Button> : <Button onClick={onSelect}>Cook This</Button>}
    </div>
  );
};

export const RecipeBook: FunctionComponent<{ recipes: RecipeInterface[], currentRecipe: number, onRecipeChange: (i: number) => void }> = ({ recipes, currentRecipe, onRecipeChange }) => {
  return (
    <div class={styles.recipeBook}>
      <h1 class={styles.recipeBookHeader}>Recipes:</h1>
      {recipes.map((r, i) => <Recipe recipe={r} selected={i == currentRecipe} onSelect={() => onRecipeChange(i)} />)}
    </div>
  )
};
