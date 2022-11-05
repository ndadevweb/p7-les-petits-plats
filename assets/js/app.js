import recipes from '../../data/recipes.js'
import Recipe from './recipe.js'
import RecipesList from './components/recipesList.js'

function updateAdvancedSearchItem(selector, items) {
  const listItem = document.querySelector(selector)

  listItem.innerHTML = ''

  items.forEach(item => {
    const li = `<li tabindex="0">${item}</li>`

    listItem.insertAdjacentHTML('afterbegin', li)
  })
}

const searchMinSize = 3
const searchElement = document.querySelector('#search')

const recipe = new Recipe(recipes)

const recipesList = new RecipesList()
recipesList.setRecipes(recipes)
recipesList.render('#recipes')


// Main search
searchElement.addEventListener('input', event => {
  const keyword = event.target.value

  if (keyword.length === 0) {
    const recipesAll = recipe.getAll()
    recipesList.setRecipes(recipesAll)
    recipesList.render('#recipes')

    const ingredients = recipe.extractIngredients(recipesAll)
    const appliances = recipe.extractAppliances(recipesAll)
    const ustensils = recipe.extractUstensils(recipesAll)

    updateAdvancedSearchItem('#list-ingredients', ingredients)
    updateAdvancedSearchItem('#list-appliances', appliances)
    updateAdvancedSearchItem('#list-ustensils', ustensils)
  } else if (keyword.length >= searchMinSize) {
    const recipesFiltered = recipe.fetchRecipesByKeyword(recipes, keyword)

    recipesList.setRecipes(recipesFiltered)
    recipesList.render('#recipes')

    const ingredients = recipe.extractIngredients(recipesFiltered)
    const appliances = recipe.extractAppliances(recipesFiltered)
    const ustensils = recipe.extractUstensils(recipesFiltered)

    updateAdvancedSearchItem('#list-ingredients', ingredients)
    updateAdvancedSearchItem('#list-appliances', appliances)
    updateAdvancedSearchItem('#list-ustensils', ustensils)
  }
})

// Advanced search ( ingredients, appliances, ustensils )
const ingredients = recipe.extractIngredients(recipes)
const appliances = recipe.extractAppliances(recipes)
const ustensils = recipe.extractUstensils(recipes)

updateAdvancedSearchItem('#list-ingredients', ingredients)
updateAdvancedSearchItem('#list-appliances', appliances)
updateAdvancedSearchItem('#list-ustensils', ustensils)

const formAdvancedSearch = document.querySelector('#advanced-search')

formAdvancedSearch.addEventListener('click', event => {
  if (event.target.closest('button')) {
    event.target.closest('button').classList.toggle('arrow--open')
    event.target.closest('.tags-selection-item').querySelector('ul').classList.toggle('items--open')
  }
})