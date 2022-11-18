import { default as recipesData } from '../../data/recipes.js'
import Search from './app/search.js'
import Tags from './app/tags.js'
import AdvancedSearch from './app/advancedSearch.js'
import Recipes from './app/recipes.js'

class App {

  /**
   * Initialize object to interact with the application
   */
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

  /**
   * Init event handle to interact with ui
   */
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

  /**
   * Display / Hide items match or not with recipeItemList
   *
   * @param {Array} recipesFiltered
   * @param {Object} options
   */
  toggleWhenHasRecipeItem(recipesFiltered, options = {}) {
    const { recipeIngredients, recipeAppliances, recipeUstensils } = this.recipes.extractItems(recipesFiltered, options)

    this.advancedSearch.toggleWhenHasRecipeItem(AdvancedSearch.INGREDIENT, recipeIngredients)
    this.advancedSearch.toggleWhenHasRecipeItem(AdvancedSearch.APPLIANCE, recipeAppliances)
    this.advancedSearch.toggleWhenHasRecipeItem(AdvancedSearch.USTENSIL, recipeUstensils)
  }

  /**
   * Return keywords and enabled tags
   *
   * @returns {Object}
   */
  getOptions() {
    return {
      keyword: this.search.inputValue,
      ...this.tags.fetchEnabled()
    }
  }

  /**
   * Callback handler to interact with input search
   *
   * @param {Event} event
   * @returns null
   */
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

  /**
   * Callback handler to remove enabled item tags
   * inside tags area
   *
   * @param {Event} event
   */
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
      this.advancedSearch.toggleMessageWhenNoItems(type)
      this.recipes.setToDisplay(recipesFiltered)
      this.recipes.display()
    }
  }

  /**
   * Callback handler to interact with items
   * displayed inside advanced search
   *
   * @param {Event} event
   */
  handleClickAdvancedSearch(event) {
    if(this.advancedSearch.isButtonClicked(event.target) === true) {
      const itemAdvancedSearch = event.target.closest('.tags-selection-item')
      const type = itemAdvancedSearch.dataset.openList
      this.advancedSearch.closeAllExceptOne(itemAdvancedSearch)
      this.advancedSearch.toggleItemList(type)
    }

    if(this.advancedSearch.isItemClicked(event.target) === true) {
      this.advancedSearch.itemTagged(event.target)
      this.tags.add(event.target.textContent, event.target.dataset)

      const options = this.getOptions()
      const recipesFiltered = this.recipes.fetchRecipesFiltered(options)
      const type = event.target.closest('.tags-selection-item').dataset.openList

      this.recipes.setToDisplay(recipesFiltered)
      this.recipes.display()
      this.toggleWhenHasRecipeItem(recipesFiltered, options)
      this.advancedSearch.toggleMessageWhenNoItems(type)
    }
  }

  /**
   * Callback handler to interact with
   * advanced search input
   *
   * @param {Event} event
   */
  handleInputAdvancedSearch(event) {
    const advancedSearchValue = event.target.value.trim()
    const type = event.target.closest('[data-open-list]').dataset.openList

    // Close all element if are open except one that is defined in argument
    this.advancedSearch.closeAllExceptOne(event.target)

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