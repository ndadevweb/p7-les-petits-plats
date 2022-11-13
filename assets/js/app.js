// Faire une mega refactorisation :)

import recipes from '../../data/recipes.js'
import Recipe from './recipe.js'
import RecipesList from './components/recipesList.js'

function getTagsEnabled(tagsAreaDOM) {
  return {
    ingredients: Array.from(tagsAreaDOM.querySelectorAll('li[data-type="ingredient"] > span')).map(li => li.textContent),
    appliances: Array.from(tagsAreaDOM.querySelectorAll('li[data-type="appliance"] > span')).map(li => li.textContent),
    ustensils: Array.from(tagsAreaDOM.querySelectorAll('li[data-type="ustensil"] > span')).map(li => li.textContent)
  }
}

function tagToggle(selector, recipeItemList) {
  const advancedItems = document.querySelectorAll(selector)

  advancedItems.forEach(item => {
    if (recipeItemList.has(item.textContent) === true) {
      item.classList.remove('item--not-available')
    } else {
      item.classList.add('item--not-available')
    }
  })
}

// Utiliser cette fonction seulement au chargement de la page ( changer le nom de cette fonction )
function updateAdvancedSearchItem(selector, type, items) {
  const listItem = document.querySelector(selector)

  listItem.innerHTML = ''

  let iteration = 1

  items.forEach(item => {
    const li = `<li tabindex="0" class="item" data-index="${iteration}" data-type="${type}">${item}</li>`

    listItem.insertAdjacentHTML('afterbegin', li)
    iteration = iteration + 1
  })
}

function addTag(itemName, dataset) {
  let classNameType = ''

  switch (dataset.type) {
    case 'ingredient':
      classNameType = 'background--ingredient'
      break
    case 'appliance':
      classNameType = 'background--appliance'
      break
    case 'ustensil':
      classNameType = 'background--ustensil'
      break
    default:
      classNameType = ''
  }

  const li = `
    <li class="tag ${classNameType}" data-index="${dataset.index}" data-type="${dataset.type}">
      <span>${itemName}</span>
      <button type="button"><i class="far fa-times-circle"></i></button>
    </li>
  `
  document.querySelector('#tags-area').insertAdjacentHTML('beforeend', li)
}

const searchMinSize = 3
const searchElement = document.querySelector('#search')

const recipe = new Recipe(recipes)

const recipesList = new RecipesList()

recipesList.setRecipes(recipes)
recipesList.render('#recipes')

let keywordFromMainSearch = ''

// Main search
searchElement.addEventListener('input', event => {
  keywordFromMainSearch = event.target.value

  if (keywordFromMainSearch.length === 0) {
    const options = { keyword: '',  ...getTagsEnabled(tagsArea) }
    const recipesFiltered = recipe.fetchRecipesFiltered(recipes, options)

    recipesList.setRecipes(recipesFiltered)
    recipesList.render('#recipes')

    const recipeIngredients = recipe.extractIngredients(recipesFiltered)
    const recipeAppliances = recipe.extractAppliances(recipesFiltered)
    const recipeUstensils = recipe.extractUstensils(recipesFiltered)

    tagToggle('#list-ingredients > li', recipeIngredients)
    tagToggle('#list-appliances > li', recipeAppliances)
    tagToggle('#list-ustensils > li', recipeUstensils)
  } else if (keywordFromMainSearch.length >= searchMinSize) {
    const options = { keyword: keywordFromMainSearch,  ...getTagsEnabled(tagsArea) }
    const recipesFiltered = recipe.fetchRecipesFiltered(recipes, options)

    recipesList.setRecipes(recipesFiltered)
    recipesList.render('#recipes')

    const recipeIngredients = recipe.extractIngredients(recipesFiltered)
    const recipeAppliances = recipe.extractAppliances(recipesFiltered)
    const recipeUstensils = recipe.extractUstensils(recipesFiltered)

    tagToggle('#list-ingredients > li', recipeIngredients)
    tagToggle('#list-appliances > li', recipeAppliances)
    tagToggle('#list-ustensils > li', recipeUstensils)
  }
})

// tags area
const tagsArea = document.querySelector('#tags-area')

tagsArea.addEventListener('click', event => {
  if (event.target.closest('button')) {
    const li = event.target.closest('li')
    const itemType = li.dataset.type
    const itemIndex = li.dataset.index
    let selectorAdvancedSearchItem = ''

    switch (itemType) {
      case 'ingredient':
        selectorAdvancedSearchItem = `#list-ingredients > [data-index="${itemIndex}"]`
      break

      case 'appliance':
        selectorAdvancedSearchItem = `#list-appliances > [data-index="${itemIndex}"]`
      break

      case 'ustensil':
        selectorAdvancedSearchItem = `#list-ustensils > [data-index="${itemIndex}"]`
      break
    }

    li.remove()

    const options = { keyword: keywordFromMainSearch,  ...getTagsEnabled(tagsArea) }
    const recipesFiltered = recipe.fetchRecipesFiltered(recipes, options)

    const recipeIngredients = recipe.extractIngredients(recipesFiltered)
    const recipeAppliances = recipe.extractAppliances(recipesFiltered)
    const recipeUstensils = recipe.extractUstensils(recipesFiltered)

    tagToggle('#list-ingredients > li', recipeIngredients)
    tagToggle('#list-appliances > li', recipeAppliances)
    tagToggle('#list-ustensils > li', recipeUstensils)

    document.querySelector(selectorAdvancedSearchItem).classList.remove('item--tagged')

    recipesList.setRecipes(recipesFiltered)
    recipesList.render('#recipes')
  }
})


// Advanced search ( ingredients, appliances, ustensils )
const ingredients = recipe.extractIngredients(recipes)
const appliances = recipe.extractAppliances(recipes)
const ustensils = recipe.extractUstensils(recipes)

updateAdvancedSearchItem('#list-ingredients', 'ingredient', ingredients)
updateAdvancedSearchItem('#list-appliances', 'appliance', appliances)
updateAdvancedSearchItem('#list-ustensils', 'ustensil', ustensils)

const formAdvancedSearch = document.querySelector('#advanced-search')

formAdvancedSearch.addEventListener('click', event => {
  if (event.target.closest('button')) {
    event.target.closest('button').classList.toggle('arrow--open')
    event.target.closest('.tags-selection-item').querySelector('ul').classList.toggle('items--open')
  }

  if (event.target.classList.contains('item') === true) {
    const itemName = event.target.textContent
    event.target.classList.add('item--tagged')
    addTag(itemName, event.target.dataset)

    const recipeAll = recipe.getAll()

    const options = { keyword: keywordFromMainSearch,  ...getTagsEnabled(tagsArea) }
    const recipesFiltered = recipe.fetchRecipesFiltered(recipeAll, options)

    recipesList.setRecipes(recipesFiltered)
    recipesList.render('#recipes')

    const recipeIngredients = recipe.extractIngredients(recipesFiltered, options.ingredients)
    const recipeAppliances = recipe.extractAppliances(recipesFiltered, options.appliances)
    const recipeUstensils = recipe.extractUstensils(recipesFiltered, options.ustensils)

    tagToggle('#list-ingredients > li', recipeIngredients)
    tagToggle('#list-appliances > li', recipeAppliances)
    tagToggle('#list-ustensils > li', recipeUstensils)
  }
})

formAdvancedSearch.addEventListener('input', event => {
  const inputValue = event.target.value.trim()
  const itemList = event.target.closest('fieldset').querySelector('ul')
  const button = event.target.closest('.input-component').querySelector('button')

  if (itemList.classList.contains('items--open') === false) {
    itemList.classList.add('items--open')
    button.classList.add('arrow--open')
  }

  const itemNoOneMatch = itemList?.querySelector('.no-one-match')
  if (itemNoOneMatch) {
    itemNoOneMatch.remove()
  }

  if (inputValue === '') {
    Array.from(itemList.querySelectorAll('li')).forEach(item => {
      item.classList.remove('item--not-matched')
    })
  } else {
    const itemsMatch = Array.from(itemList.querySelectorAll('li')).filter(item => {
      return item.textContent.startsWith(inputValue)
    })

    const itemsName = itemsMatch.map(item => item.textContent)

    if (itemsName.length === 0) {
      if (itemList.querySelector('.no-one-match')) {
        itemList.querySelector('.no-one-match').remove()
      }
        const itemError = '<li class="no-one-match">Aucuns elements ne correspond à cette recherche</li>'
        itemList.insertAdjacentHTML('beforeend', itemError)
    }

    Array.from(itemList.querySelectorAll('li')).forEach(item => {
      if (item.classList.contains('no-one-match')) {
        return null
      }

      if (itemsName.includes(item.textContent) === false) {
        item.classList.add('item--not-matched')
      } else {
        item.classList.remove('item--not-matched')
      }
    })
  }
})