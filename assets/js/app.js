import { default as recipesData } from '../../data/recipes.js'
import Search from './utils/search.js'
import Tags from './utils/tags.js'
import AdvancedSearch from './utils/advancedSearch.js'
import Recipes from './utils/recipes.js'

class App {

  constructor() {
    this.search =  new Search
    this.tags = new Tags
    this.advancedSearch = new AdvancedSearch
    this.recipes = new Recipes(recipesData)
  }

  /**
   * Initialize
   */
  init() {
    this.bindMethods()
    this.initEvents()
    this.initAdvancedSearch()

    this.recipes.display()
  }

  bindMethods() {
    this.handleInputSearch = this.handleInputSearch.bind(this)
    this.handleClickTagsArea = this.handleClickTagsArea.bind(this)
    this.handleClickAdvancedSearch = this.handleClickAdvancedSearch.bind(this)
    this.handleInputAdvancedSearch = this.handleInputAdvancedSearch.bind(this)
  }

  initEvents() {
    this.search.initEventListener(this.handleInputSearch)
    this.tags.initEventListener(this.handleClickTagsArea)
    this.advancedSearch.initEventListener(
      this.handleClickAdvancedSearch,
      this.handleInputAdvancedSearch
    )
  }

  /**
   * Fill the content of the advanced search item elements
   */
  initAdvancedSearch() {
    const { recipeIngredients, recipeAppliances, recipeUstensils } = this.recipes.extractItems(this.recipes.recipesAll)

    this.advancedSearch.fill(AdvancedSearch.INGREDIENT, recipeIngredients)
    this.advancedSearch.fill(AdvancedSearch.APPLIANCE, recipeAppliances)
    this.advancedSearch.fill(AdvancedSearch.USTENSIL, recipeUstensils)
  }

  toggleWhenHasRecipeItem(recipesFiltered, options = {}) {
    const { recipeIngredients, recipeAppliances, recipeUstensils } = this.recipes.extractItems(recipesFiltered, options)

    this.advancedSearch.toggleWhenHasRecipeItem(AdvancedSearch.INGREDIENT, recipeIngredients)
    this.advancedSearch.toggleWhenHasRecipeItem(AdvancedSearch.APPLIANCE, recipeAppliances)
    this.advancedSearch.toggleWhenHasRecipeItem(AdvancedSearch.USTENSIL, recipeUstensils)
  }

  getOptions() {
    return {
      keyword: this.search.inputValue,
      ...this.tags.fetchEnabled()
    }
  }

  handleInputSearch(event) {
    if(this.search.isNotValid(event.target.value) === true) {
      return null
    }

    const options = this.getOptions()
    const recipesFiltered = this.recipes.fetchRecipesFiltered(options)

    this.recipes.setToDisplay(recipesFiltered)
    this.recipes.display()
    this.toggleWhenHasRecipeItem(recipesFiltered, options)
  }

  handleClickTagsArea(event) {
    if(this.tags.isButtonRemoveClicked(event.target) === true) {
      const li = event.target.closest('li')
      const { index, type } = li.dataset
      const selectorAdvancedSearch = this.advancedSearch.getSelectorByType(type)
      const selectorItem = selectorAdvancedSearch.querySelector(`[data-index="${index}"]`)

      li.remove()

      const options = this.getOptions()
      const recipesFiltered = this.recipes.fetchRecipesFiltered(options)

      this.toggleWhenHasRecipeItem(recipesFiltered)
      this.advancedSearch.itemTagged(selectorItem, false)
      this.recipes.setToDisplay(recipesFiltered)
      this.recipes.display()
    }
  }

  handleClickAdvancedSearch(event) {
    if(this.advancedSearch.isButtonClicked(event.target) === true) {
      const itemAdvancedSearch = event.target.closest('.tags-selection-item')
      const type = itemAdvancedSearch.dataset.openList
      this.advancedSearch.closeAll(itemAdvancedSearch)
      this.advancedSearch.toggleItemList(type)
    }

    if(this.advancedSearch.isItemClicked(event.target) === true) {
      this.advancedSearch.itemTagged(event.target)
      this.tags.add(event.target.textContent, event.target.dataset)

      const options = this.getOptions()
      const recipesFiltered = this.recipes.fetchRecipesFiltered(options)

      this.recipes.setToDisplay(recipesFiltered)
      this.recipes.display()
      this.toggleWhenHasRecipeItem(recipesFiltered, options)
    }
  }

  handleInputAdvancedSearch(event) {
    const advancedSearchValue = event.target.value.trim()
    const type = event.target.closest('[data-open-list]').dataset.openList

    if(advancedSearchValue === '') {
      this.advancedSearch.resetMatch(type)
      this.advancedSearch.close(type)
    } else {
      this.advancedSearch.toggleMatches(type, advancedSearchValue)
      this.advancedSearch.open(type)
    }

    this.advancedSearch.toggleMessageWhenNoItems(type)
  }
}

const app = new App
app.init()