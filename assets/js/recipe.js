export default class Recipe {
  constructor(recipes) {
    this.recipes = recipes
  }

  /**
   * Return all recipes available without filters
   *
   * @returns {Array[<Object>]}
   */
  getAll() {
    return this.recipes
  }

  /**
   * Convert first letter to upper case value
   *
   * @param {String} value
   * @returns {String}
   */
  firstLetterToUpperCase(value) {
    return value.charAt(0).toUpperCase()+value.slice(1)
  }

  /**
   * Returns all recipe containing keyword in
   * their name or description or ingredients list
   *
   * @param {Object} recipes
   * @param {String} keywords
   * @returns {Boolean}
   */
  fetchRecipeBySimpleSearch(recipes, keyword) {
    const recipesMatches = recipe => {
      return (
        this.hasKeywordInName(recipe, keyword) === true
        || this.hasKeywordInDescription(recipe, keyword) === true
        || this.hasIngredient(recipe, keyword) === true
      )
    }

    return recipes.filter(recipesMatches)
  }

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

  fetchRecipesFiltered(recipes, options) {
    const { keyword } = options

    const keywordTrim = keyword?.trim()

    if (keywordTrim !== '' && keywordTrim.length >= 3) {
      recipes = this.fetchRecipeBySimpleSearch(recipes, keywordTrim)
    }

    return this.fetchRecipesByAdvancedSearch(recipes, options)
  }


  hasIngredientsSelected(recipe, ingredientsSelected) {
    const recipeIngredients = recipe.ingredients.map(ingredientList => ingredientList.ingredient.toLowerCase())

    return ingredientsSelected.every(ingredientSelected => recipeIngredients.includes(ingredientSelected)) === true
  }

  hasAppliancesSelected(recipe, appliancesSelected) {
    const recipeAppliances = [recipe.appliance.toLowerCase()]

    return appliancesSelected.every(applianceSelected => recipeAppliances.includes(applianceSelected)) === true
  }

  hasUstensilsSelected(recipe, ustensilsSelected) {
    const recipeUstensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase())

    return ustensilsSelected.every(ustensilSelected => recipeUstensils.includes(ustensilSelected)) === true
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

  itemWithoutExcluded(items, itemsToExclude) {
    return items.filter(item => itemsToExclude.includes(item) === false)
  }

  /**
   * Returns an array containing all ingredients
   *
   * @param {Object[]} recipes
   * @param {Array[<string>]} ingredientsToExclude
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
   * @param {Object[]} recipes
   * @param {Array[<string>]} appliancesToExclude
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
   * @param {Object[]} recipes
   * @param {Array[<string>]} ustensilsToExclude
   * @returns {Set<string>}
   */
  extractUstensils(recipes, ustensilsToExclude = []) {
    const ustensils = recipes.map(recipe => recipe.ustensils)
    let ustensilsFiltered = ustensils.reduce((acc, current) => {
      acc.push(...current)

      return acc
    }, [])

    ustensilsFiltered = ustensilsToExclude.length > 0
      ? this.itemWithoutExcluded(ustensilsFiltered, ustensilsToExclude)
      : ustensilsFiltered

    return new Set([...ustensilsFiltered])
  }
}
