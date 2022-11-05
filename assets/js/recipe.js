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
  fetchRecipesByKeyword(recipes, keyword) {
    const recipesMatches = recipe => {
      return (
        this.hasKeywordInName(recipe, keyword) === true
        || this.hasKeywordInDescription(recipe, keyword) === true
        || this.hasIngredient(recipe, keyword) === true
      )
    }

    return recipes.filter(recipesMatches)
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
   * Returns an array containing all ingredients
   *
   * @param {Object[]} recipes
   * @returns {Set<string>}
   */
  extractIngredients(recipes) {
    const recipeReducer = (acc, current) => acc = current.ingredient.toLowerCase()
    const recipeIngredients = recipe => recipe.ingredients.reduce(recipeReducer, [])

    return new Set([...recipes.map(recipeIngredients)])
  }

  /**
   * Returns an array containing all appliances
   *
   * @param {Object[]} recipes
   * @returns {Set<string>}
   */
  extractAppliances(recipes) {
    const recipeAppliances = recipes.map(recipe => recipe.appliance.toLowerCase())

    return new Set([...recipeAppliances])
  }

  /**
   * Returns an array containing all ustensils
   *
   * @param {Object[]} recipes
   * @returns {Set<string>}
   */
  extractUstensils(recipes) {
    const recipeReducer = (acc, current) => acc = current.toLowerCase()
    const recipeUstensils = recipe => recipe.ustensils.reduce(recipeReducer, [])

    return new Set([...recipes.map(recipeUstensils)])
  }

  /**
   * Returns an array containing all ingredients
   *
   * @param {Object[]} recipes
   * @returns {Set<string>}
   */
   extractIngredients(recipes) {
    const recipeReducer = (acc, current) => acc = current.ingredient.toLowerCase()
    const recipeIngredients = recipe => recipe.ingredients.reduce(recipeReducer, [])

    return new Set([...recipes.map(recipeIngredients)])
  }

  /**
   * Returns an array containing all appliances
   *
   * @param {Object[]} recipes
   * @returns {Set<string>}
   */
  extractAppliances(recipes) {
    const recipeAppliances = recipes.map(recipe => recipe.appliance.toLowerCase())

    return new Set([...recipeAppliances])
  }

  /**
   * Returns an array containing all ustensils
   *
   * @param {Object[]} recipes
   * @returns {Set<string>}
   */
  extractUstensils(recipes) {
    const recipeReducer = (acc, current) => acc = current.toLowerCase()
    const recipeUstensils = recipe => recipe.ustensils.reduce(recipeReducer, [])

    return new Set([...recipes.map(recipeUstensils)])
  }
}
