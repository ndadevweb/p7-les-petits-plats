export default class AdvancedSearch {
  static INGREDIENT = 'ingredient'
  static APPLIANCE = 'appliance'
  static USTENSIL = 'ustensil'

  constructor() {
    this.selector = document.querySelector('#advanced-search')
    this.selectorIngredientsList = document.querySelector('#list-ingredients')
    this.selectorAppliancesList = document.querySelector('#list-appliances')
    this.selectorUstensilsList = document.querySelector('#list-ustensils')
  }

  /**
   *
   * @param {Array} items
   * @returns {Array}
   */
  sort(items) {
    return Array.from(items).sort((a, b) => a.localeCompare(b) > 0)
  }

  /**
   * Fills items list
   *
   * @param {String} type
   * @param {Array} items
   */
  fill(type, items) {
    const selector = this.getSelectorByType(type)

    selector.innerHTML = ''
    let iteration = 1

    const itemSorted = this.sort(items)

    itemSorted.forEach(item => {
      const itemName = this.firstLetterToUpperCase(item)
      const li = `<li tabindex="0" class="item" data-index="${iteration}" data-type="${type}">${itemName}</li>`

      selector.insertAdjacentHTML('beforeend', li)
      iteration = iteration + 1
    })
  }

  /**
   * Returns DOM selector matching with type value
   *
   * @param {String} type
   * @throws "A correct 'type' value must be defined"
   * @returns {Element}
   */
  getSelectorByType(type) {
    switch(type) {
      case AdvancedSearch.INGREDIENT :
        return this.selectorIngredientsList

      case AdvancedSearch.APPLIANCE :
        return this.selectorAppliancesList

      case AdvancedSearch.USTENSIL :
        return this.selectorUstensilsList

      default:
        throw new Error("A correct 'type' value must be defined")
    }
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
   * Check if the button is clicked
   *
   * @param {Element} target
   * @returns {Boolean}
   */
  isButtonClicked(target) {
    const button = target.closest('.btn-select-tag')
    const isClicked = button !== null

    if(isClicked === false) {
      return false
    }

    if(button.classList.contains('arrow--open') === true) {
      button.classList.remove('arrow--open')
    } else {
      button.classList.add('arrow--open')
    }

    return isClicked
  }

  open(type) {
    const selectorItems = this.getSelectorByType(type)
    const button = selectorItems.closest('.tags-selection-item').querySelector('.btn-select-tag')
    selectorItems.classList.add('items--open')
    button.classList.add('arrow--open')
  }

  close(type) {
    const selectorItems = this.getSelectorByType(type)
    const button = selectorItems.closest('.tags-selection-item').querySelector('.btn-select-tag')
    selectorItems.classList.remove('items--open')
    button.classList.remove('arrow--open')
  }

  /**
   * Open / close the list
   *
   * @param {String} type
   */
  toggleItemList(type) {
    const selector = this.getSelectorByType(type)
    selector.classList.toggle('items--open')
  }

  /**
   * Check if an item from the list is clicked
   *
   * @param {Element} target
   * @returns {Boolean}
   */
  isItemClicked(target) {
    const isClicked = target.classList.contains('item')

    return isClicked
  }

  fetchAll(type) {
    const selector = this.getSelectorByType(type)
    const items = Array.from(selector.querySelectorAll('.item'))

    return items
  }

  /**
   * Close advanced search element opened, except the element in argument
   *
   * @param {Element} elementToIgnore
   */
  closeAll(elementToIgnore) {
    const advancedSearchElements = this.selector.querySelectorAll('.tags-selection-item')

    advancedSearchElements.forEach(element => {
      const currentItemList = element.querySelector('.items')
      const canClosed = (element.dataset.openList !== elementToIgnore.dataset.openList
                        && currentItemList.classList.contains('items--open') === true)
      if(canClosed) {
        currentItemList.classList.remove('items--open')
      }
    })
  }

  /**
   * Mark the item clicked
   *
   * @param {Element} target
   * @param {Boolean} tagged
   */
  itemTagged(target, tagged = true) {
    if(tagged === true) {
      target.classList.add('item--tagged')
    } else {
      target.classList.remove('item--tagged')
    }
  }

  /**
   * Display / Hide items match or not with recipeItemList
   *
   * @param {String} type
   * @param {Array} recipeItemList
   */
  toggleWhenHasRecipeItem(type, recipeItemList) {
    const items = this.fetchAll(type)

    items.forEach(item => {
      const itemName = item.textContent.toLowerCase()

      if(recipeItemList.has(itemName) === true) {
        item.classList.remove('item--not-available')
      } else {
        item.classList.add('item--not-available')
      }
    })
  }

  /**
   * Removed the class that hide elements not match
   *
   * @param {String} type
   */
  resetMatch(type) {
    const items = this.fetchAll(type)

    items.forEach(item => {
      item.classList.remove('item--not-matched')
    })
  }

  /**
   * Returns only items matches with itemName value
   *
   * @param {String} type
   * @param {String} itemName
   * @returns {Array}
   */
  fetchMatches(type, itemName) {
    itemName = itemName.toLowerCase()
    const items = this.fetchAll(type)
    const itemsMatches = items.filter(item => item.textContent.toLowerCase().startsWith(itemName))

    return itemsMatches
  }

  /**
   * Display / Hide items match with itemName value
   *
   * @param {String} type
   * @param {String} itemName
   */
  toggleMatches(type, itemName) {
    const itemsName = this.fetchMatches(type, itemName).map(item => item.textContent)

    Array.from(this.fetchAll(type)).forEach(item => {
      if(itemsName.includes(item.textContent) === false) {
        item.classList.add('item--not-matched')
      } else {
        item.classList.remove('item--not-matched')
      }
    })
  }
}
