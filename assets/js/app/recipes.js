export default class Recipes {
  /**
   * @param {Array<Object>} recipes Must contains all recipes
   */
  constructor(recipes) {
    this.recipesAll = recipes
    this.recipesToDisplay = [...recipes]
    this.selectorRecipes = document.querySelector('#recipes')
    this.selectorRecipesList = this.selectorRecipes.querySelector('div')
    this.selectorRecipesError = this.selectorRecipes.querySelector('.no-recipes')
  }

  /**
   * Returns all recipes available without filters
   *
   * @returns {Array<Object>}
   */
  fetchAll() {
    return this.recipesAll
  }

  /**
   * Returns recipes matching with search text and
   * advanced search items if one or more selected
   *
   * @param {Object} options
   * @returns {Array}
   */
  fetchRecipesFiltered(options) {
    const { keyword } = options

    const keywordTrim = keyword?.trim()
    const recipes = []

    if (keywordTrim !== '') {
      recipes.push(...this.fetchRecipeBySimpleSearch(keywordTrim))
    } else {
      recipes.push(...this.recipesAll)
    }

    return this.fetchRecipesByAdvancedSearch(recipes, options)
  }

  /**
   * Returns all recipe containing keyword in
   * their name or description or ingredients list
   *
   * @param {Object} recipes
   * @param {String} keywords
   * @returns {Boolean}
   */
  fetchRecipeBySimpleSearch(keyword) {
    const recipesMatches = recipe => {
      return (
        this.hasKeywordInName(recipe, keyword) === true
        || this.hasKeywordInDescription(recipe, keyword) === true
        || this.hasIngredient(recipe, keyword) === true
      )
    }

    return this.recipesAll.filter(recipesMatches)
  }

  /**
   * Returns recipes filtered by items selected
   * in advanced search
   *
   * @param {Array} recipes
   * @param {Object} options
   * @returns {Array}
   */
  fetchRecipesByAdvancedSearch(recipes, options) {
    return recipes.filter(recipe => {
      const { ingredients, appliances, ustensils } = options

      const hasIngredientSelected = ingredients.length > 0 ? this.hasIngredientsSelected(recipe, ingredients) : true
      const hasAppliancesSelected = appliances.length > 0 ? this.hasAppliancesSelected(recipe, appliances) : true
      const hasUstensilsSelected = ustensils.length > 0 ? this.hasUstensilsSelected(recipe, ustensils) : true

      return (
        hasIngredientSelected === true
        && hasAppliancesSelected === true
        && hasUstensilsSelected === true
      )
    })
  }

  /**
   * Returns items not in itemsToExclude list
   *
   * @param {Array} items
   * @param {Array} itemsToExclude
   * @returns {Array}
   */
  itemWithoutExcluded(items, itemsToExclude) {
    return items.filter(item => itemsToExclude.includes(item) === false)
  }

  /**
   *
   * @param {Array} recipes
   * @param {Array} itemsToExclude
   * @returns {Object}
   */
  extractItems(recipes, itemsToExclude = []) {
    return {
      recipeIngredients: this.extractIngredients(recipes, itemsToExclude.ingredients),
      recipeAppliances: this.extractAppliances(recipes, itemsToExclude.appliances),
      recipeUstensils: this.extractUstensils(recipes, itemsToExclude.ustensils)
    }
  }

  /**
   * Returns an array containing all ingredients
   *
   * @param {Object} recipes
   * @param {Array<string>} ingredientsToExclude
   * @returns {Set<string>}
   */
   extractIngredients(recipes, ingredientsToExclude = []) {
    const ingredients = recipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()))
    let ingredientsFiltered = ingredients.reduce((acc, current) => {
      acc.push(...current)
      return acc
    }, [])

    ingredientsFiltered = ingredientsToExclude.length > 0
      ? this.itemWithoutExcluded(ingredientsFiltered, ingredientsToExclude)
      : ingredientsFiltered

    return new Set([...ingredientsFiltered])
  }

  /**
   * Returns an array containing all appliances
   *
   * @param {Object} recipes
   * @param {Array<string>} appliancesToExclude
   * @returns {Set<string>}
   */
  extractAppliances(recipes, appliancesToExclude = []) {
    let appliancesFiltered = recipes.map(recipe => recipe.appliance.toLowerCase())

    appliancesFiltered = appliancesToExclude.length > 0
      ? this.itemWithoutExcluded(appliancesFiltered, appliancesToExclude)
      : appliancesFiltered

    return new Set([...appliancesFiltered])
  }

  /**
   * Returns an array containing all ustensils
   *
   * @param {Object} recipes
   * @param {Array<string>} ustensilsToExclude
   * @returns {Set<string>}
   */
  extractUstensils(recipes, ustensilsToExclude = []) {
    const ustensils = recipes.map(recipe => recipe.ustensils.map(ustensil => ustensil.toLowerCase()))
    let ustensilsFiltered = ustensils.reduce((acc, current) => {
      acc.push(...current)

      return acc
    }, [])

    ustensilsFiltered = ustensilsToExclude.length > 0
      ? this.itemWithoutExcluded(ustensilsFiltered, ustensilsToExclude)
      : ustensilsFiltered

    return new Set([...ustensilsFiltered])
  }

  /**
   * Check if recipe name contains 'keyword' value
   *
   * @param {Object} recipe
   * @param {String} keyword
   * @returns {Boolean}
   */
  hasKeywordInName(recipe, keyword) {
    const keywordToLower = keyword.toLowerCase()

    return recipe.name.toLowerCase().indexOf(keywordToLower) !== -1
  }

  /**
   * Check if recipe description contains 'keyword' value
   *
   * @param {Object} recipe
   * @param {String} keyword
   * @returns {Boolean}
   */
  hasKeywordInDescription(recipe, keyword) {
    const keywordToLower = keyword.toLowerCase()

    return recipe.description.toLowerCase().indexOf(keywordToLower) !== -1
  }

  /**
   * Check if a recipe has an ingredient in its list
   *
   * @param {Object} recipe
   * @param {String} keyword
   * @returns {Boolean}
   */
  hasIngredient(recipe, keyword) {
    const keywordToLower = keyword.toLowerCase()

    return recipe.ingredients.some(detail => detail.ingredient.toLowerCase().includes(keywordToLower))
  }

  /**
   * Checks if the recipe contains each ingredient determined
   * by the list ingredientsSelected
   *
   * @param {Array} recipe
   * @param {String} ingredientsSelected
   * @returns {Array}
   */
  hasIngredientsSelected(recipe, ingredientsSelected) {
    const recipeIngredients = recipe.ingredients.map(ingredientList => ingredientList.ingredient.toLowerCase())

    return ingredientsSelected.every(ingredientSelected => recipeIngredients.includes(ingredientSelected.toLowerCase())) === true
  }

  /**
   * Checks if the recipe contains each appliance determined
   * by the list ingredientsSelected
   *
   * @param {Array} recipe
   * @param {String} appliancesSelected
   * @returns {Array}
   */
  hasAppliancesSelected(recipe, appliancesSelected) {
    const recipeAppliances = [recipe.appliance.toLowerCase()]

    return appliancesSelected.every(applianceSelected => recipeAppliances.includes(applianceSelected.toLowerCase())) === true
  }

  /**
   * Checks if the recipe contains each ustensil determined
   * by the list ingredientsSelected
   *
   * @param {Array} recipe
   * @param {String} ustensilsSelected
   * @returns {Array}
   */
  hasUstensilsSelected(recipe, ustensilsSelected) {
    const recipeUstensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase())

    return ustensilsSelected.every(ustensilSelected => recipeUstensils.includes(ustensilSelected.toLowerCase())) === true
  }

  /**
   * Defines recipes to display
   *
   * @param {Array<Object>} recipesToDisplay
   */
  setToDisplay(recipesToDisplay) {
    this.recipesToDisplay = recipesToDisplay
  }

  /**
   * Displaying recipes or information message when no recipes to display
   */
  display() {
    this.selectorRecipesList.innerHTML = ''

    if(this.recipesToDisplay.length === 0) {
      this.selectorRecipesError.classList.add('no-recipes--show')
    } else {
      this.selectorRecipesError.classList.remove('no-recipes--show')
      this.recipesToDisplay.forEach(recipe => {
        this.selectorRecipesList.insertAdjacentHTML('beforeend', this.buildRecipeCardToDisplay(recipe))
      })
    }
  }

  /**
   * Build li element containing ingredient's informations
   *
   * @param {Object} ingredients
   * @returns {String}
   */
  buildIngredientsToDisplay(ingredients) {
    const ul = document.createElement('ul')
    ul.classList.add('recipe-ingredients')

    const ingredientDetails = (ingredientDetails) => {
      const name = `<strong>${ingredientDetails.ingredient}</strong>`
      const quantity = ingredientDetails?.quantity ? ingredientDetails.quantity : ''
      const unit = ingredientDetails?.unit ? ingredientDetails.unit : ''

      if (quantity === '' && unit === '') {
        return `<li>${name}</li>`
      }

      return `<li>${name}: ${quantity} ${unit}</li>`
    }

    ingredients.forEach(details => ul.insertAdjacentHTML('afterbegin', ingredientDetails(details)));

    return ul.outerHTML
  }

  /**
   * Build card containing recipe's informations
   *
   * @param {Object} recipe
   * @returns {String}
   */
  buildRecipeCardToDisplay(recipe) {
    return `
      <article class="recipe-item">
        <div class="recipe-image"></div>

        <h3 class="recipe-title">
          ${recipe.name}
          <span class="recipe-duration">
            <i class="far fa-clock"></i>
            <strong>${recipe.time} min</strong>
          </span>
        </h3>

        ${this.buildIngredientsToDisplay(recipe.ingredients)}

        <p class="recipe-description">${recipe.description}</p>
      </article>
    `
  }
}
