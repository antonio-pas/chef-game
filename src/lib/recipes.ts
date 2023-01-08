import { Recipe } from "$lib/recipe";
import mouseClickGif from "$assets/mouse-click.gif";
export const recipes: Recipe[] = [
  {
    title: "Omelette",
    difficulty: 2,
    description: "An omelette is a dish made from beaten eggs cooked in butter or oil in a pan.",
    instructions: [
      "Crack two eggs in a bowl and beat viggoruslee",
      "Season the eggs with salt and pepper",
      "Put two tablespoons of butter on a frying pan set to medium height",
      "Add the eggs",
      "Once the bottom is set, fold in half and cook until middle is done",
    ]
  },
  {
    title: "Pasta Alla Carbonara",
    difficulty: 4,
    description: "Carbonara is an Italian pasta dish made with eggs, cheese, pork, and black pepper.",
    instructions: [
      "Set a pot of water to boil and add a generous amount of salt",
      "While the water is boiling, crack two eggs in a bowl and grate 100g of pecorino romano",
      "Mix well",
      "Put guanciale (or pancetta) in a cold pan and turn the heat on medium to render the fat out",
      "Add the pasta and combine the guanciale fat with the egg and cheese mixture",
      "Toast black pepper in a frying pan set on medium heat",
      "Turn to low heat and add pasta water, pasta, and the egg mixture",
      "Cook until sauce has thickened to your liking"
    ]
  },
  {
    title: "Chocolate Cake",
    difficulty: 3,
    description: "Chocolate cake is a cake flavored with melted chocolate.",
    instructions: [
      "TO DO: Add instructions"
    ]
  }
];
const recipeOverview = recipes.map((r, i) => `${i + 1}. ${r.title}`).join('\n');
export const tutorialMessages: [string, string, string][] = [
  ["Chef Game", `Hello, welcome to chef game, the game where you learn to cook through hands-on experience.\n
  Before you start cooking, let's go over some basic controls.`, ""],
  ["Controls", `Left click to pick up items and drop them`, mouseClickGif],
  ["Good Luck", `Below is an overview of the dishes you will cook. 
    You will start with the most simple and work your way up to more complex dishes.
    Try to not mess the dishes up, but also have fun!\n
    ${recipeOverview}`, ""]
];
