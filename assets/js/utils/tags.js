export default class Tags {
  static INGREDIENT = 'ingredient'
  static APPLIANCE = 'appliance'
  static USTENSIL = 'ustensil'

  constructor() {
    this.selector = document.querySelector('#tags-area')
  }

  /**
   * Initialize the listener using callbacks
   *
   * @param {Function} callback
   */
  initEventListener(callback) {
    this.selector.addEventListener('click', callback)
  }

  /**
   * Returns all tags added
   *
   * @returns {Object}
   */
  fetchEnabled() {
    const ingredientItems = this.selector.querySelectorAll('li[data-type="ingredient"] > span')
    const applianceItems = this.selector.querySelectorAll('li[data-type="appliance"] > span')
    const ustensilItems = this.selector.querySelectorAll('li[data-type="ustensil"] > span')

    return {
      ingredients: Array.from(ingredientItems).map(li => li.textContent),
      appliances: Array.from(applianceItems).map(li => li.textContent),
      ustensils: Array.from(ustensilItems).map(li => li.textContent)
    }
  }

  /**
   * Add a tag in the tags area list
   *
   * @param {String} name
   * @param {DOMStringMap} dataset
   */
  add(name, dataset) {
    const { index, type } = dataset
    let classNameType = ''

    switch(type) {
      case Tags.INGREDIENT :
      case Tags.APPLIANCE :
      case Tags.USTENSIL :
        classNameType = `background--${type}`
        break
      default:
        throw new Error("A correct 'type' value must be defined")
    }

    const li = `
      <li class="tag ${classNameType}" data-index="${index}" data-type="${type}">
        <span>${name}</span>
        <button type="button" class="btn-select-tag"><i class="far fa-times-circle"></i></button>
      </li>
    `
    this.selector.insertAdjacentHTML('beforeend', li)
  }

  /**
   * Check if button to remove tag is clicked
   *
   * @param {Element} target
   * @returns {Boolean}
   */
  isButtonRemoveClicked(target) {
    return target.closest('.btn-select-tag') !== null
  }
}