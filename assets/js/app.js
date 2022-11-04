import recipes from '../../data/recipes.js'
import Recipe from './recipe.js'
import RecipesList from './components/recipesList.js'

const searchMinSize = 3
const searchElement = document.querySelector('#search')

const recipe = new Recipe(recipes)

const recipesList = new RecipesList()
recipesList.setRecipes(recipes)
recipesList.render('#recipes')

searchElement.addEventListener('input', event => {
  const keyword = event.target.value

  if (keyword.length === 0) {
    recipesList.setRecipes(recipe.getAll())
    recipesList.render('#recipes')
  } else if (keyword.length >= searchMinSize) {
    const recipesToDisplay = recipe.fetchRecipesByKeyword(recipes, keyword)

    recipesList.setRecipes(recipesToDisplay)
    recipesList.render('#recipes')
  }
})