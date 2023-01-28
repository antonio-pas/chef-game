import { Recipe } from "$lib/recipe";
import mouseClickGif from "$assets/mouse-click.gif";
export const recipes: Recipe[] = [
  {
    title: "Pasta",
    difficulty: 2,
    description: "Pasta is a type of food typically made from an unleavened dough of wheat flour mixed with water or eggs, and formed into sheets or other shapes, then cooked by boiling or baking.",
    instructions: [
      "Crack two eggs in a bowl and beat viggoruslee",
      "Season the eggs with salt and pepper",
      "Put two tablespoons of butter on a frying pan set to medium height",
      "Add the eggs",
      "Once the bottom is set, fold in half and cook until middle is done",
    ]
  },
  {
    title: "Fried Egg",
    difficulty: 3,
    description: "A fried egg, also known as sunny-side up is a cooked dish made from one or more eggs placed into a frying pan and fried.",
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
  ["Cook It Up", `Hello, welcome to Cook It Up, the game where you learn to cook through hands-on experience.\n
  Before you start cooking, let's go over some basic controls.`, ""],
  ["Controls", `Left click to pick up items and drop them.\nLet go of the left mouse button to put ingredients in a pan`, ""],
  ["Good Luck", `Below is an overview of the dishes you will cook. 
    You will start with the most simple and work your way up to more complex dishes.
    Try to not mess the dishes up, but also have fun!\n
    ${recipeOverview}`, ""]
];
