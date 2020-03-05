const keys = {
  BOOK_NAME     : 'lgcjs-filename',
  BOOK_DATA     : 'lgcjs-book',
  CURRENT_ENTITY: 'lgcjs-currententity',
}

const get    = (key, value) => localStorage.getItem(key) || value
const getObj = (key, value) => JSON.parse(get(key, 'null')) || value

export {keys, get, getObj}
