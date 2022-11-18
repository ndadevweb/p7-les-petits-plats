export default class Search {
  static SEARCH_MIN_SIZE_REQUIRED = 3

  /**
   * Initialize tags with which to interact
   */
  constructor() {
    this.form = document.querySelector('#search-bar')
    this.selector = document.querySelector('#search')
    this.inputValue = ''
  }

  /**
   * Initialize the listener using callbacks
   *
   * @param {Function} callback
   */
  initEventListener(callback) {
    this.form.addEventListener('submit', event => event.preventDefault())

    this.selector.addEventListener('input', (event) => {
      this.inputValue = event.target.value.trim()
      callback(event)
    })
  }

  /**
   * Check if value argument is valid
   *
   * @param {String} value
   * @returns {Boolean}
   */
  isNotValid(value) {
    return (
      this.inputValue !== '' &&
      this.inputValue.length < Search.SEARCH_MIN_SIZE_REQUIRED
    ) === true
  }
}