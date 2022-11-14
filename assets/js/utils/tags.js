export default class Tags {
  static INGREDIENT = 'ingredient'
  static APPLIANCE = 'appliance'
  static USTENSIL = 'ustensil'

  constructor() {
    this.selector = document.querySelector('#tags-area')
  }

  /**
   * Returns all tags added
   *
   * @returns {Object}
   */
  fetchEnabled() {
    return {
      ingredients: Array.from(this.selector.querySelectorAll('li[data-type="ingredient"] > span')).map(li => li.textContent),
      appliances: Array.from(this.selector.querySelectorAll('li[data-type="appliance"] > span')).map(li => li.textContent),
      ustensils: Array.from(this.selector.querySelectorAll('li[data-type="ustensil"] > span')).map(li => li.textContent)
    }
  }

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

  isButtonRemoveClicked(target) {
    return target.closest('.btn-select-tag') !== null
  }
}