/**
 * Return a string with letters without accents
 *
 * @param {String} value string to converted
 * @returns {String}
 */
function convertAccentsToUnaccented(value) {
  const correspondence = {
    'à': 'a',
    'á': 'a',
    'â': 'a',
    'ä': 'a',
    'ç': 'c',
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e',
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i',
    'ñ': 'n',
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'ö': 'o',
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'u',
    'ý': 'y',
    'ÿ': 'y'
  }

  const stringConverted = value.replace(/[àáâäçèéêëìíîïñòóôöùúûüýÿ]/gi, character => correspondence[character])

  return stringConverted
}

export { convertAccentsToUnaccented }