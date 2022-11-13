export default class RecipesList {

  constructor() {
    this.recipes = []
  }

  /**
   * Recipes list to displayed
   *
   * @param {Array[<Object>]} recipes
   */
  setRecipes(recipes) {
    this.recipes = recipes
  }

  /**
   * Build li element containing ingredient's informations
   *
   * @param {Object} ingredients
   * @returns {String}
   */
  buildLiElements(ingredients)  {
    let li = ''
    let index = 0
    const maxIndex = ingredients.length
    const ingredientDetails = (value) => {
      let quantity = value?.quantity ? value.quantity : ''
      let unit = value?.unit ? value.unit : ''

      if (quantity === '' && unit === '') {
        return ''
      }

      return `: ${quantity} ${unit}`
    }

    for(index; index < maxIndex; index += 1) {
      li += `<li><strong>${ingredients[index].ingredient}</strong> ${ingredientDetails(ingredients[index])}</li>`
    }

    return li
  }

  /**
   *  Build card containing recipe's informations
   *
   * @param {Object} recipe
   * @returns {String}
   */
  buildCard(recipe) {
      return `
        <article class="recipe-item">
          <div class="recipe-image"></div>

          <h3 class="recipe-title">
            ${recipe.name}
            <span class="duration">
              <i class="far fa-clock"></i>
              <strong>${recipe.time} min</strong>
            </span>
          </h3>

          <ul class="recipe-ingredients">
            ${this.buildLiElements(recipe.ingredients)}
          </ul>

          <p class="recipe-description">${recipe.description}</p>
        </article>
      `
  }

  /**
   * Selector of the element will contain recipes
   *
   * @param {String} selector
   */
  render(selector) {
    const domSelector = document.querySelector(selector)

    domSelector.innerHTML = ''

    this.recipes.forEach(recipe => {
      document.querySelector(selector).insertAdjacentHTML('afterbegin', this.buildCard(recipe))
    })
  }
}