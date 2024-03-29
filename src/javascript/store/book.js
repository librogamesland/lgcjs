import { tick } from 'svelte'
import { writable } from 'svelte/store'
import { encode, decode } from 'rollup-plugin-lgcjs/js/xlgcParser.js'
import { getLocaleFromNavigator } from 'svelte-i18n'

import lgcdev from '../lgcdev'
import emptyBook from '../books/empty.xlgc'
import welcomeBookEn from '../books/welcome-en.xlgc'
import welcomeBookIt from '../books/welcome-it.xlgc'
import * as storage from './storage.js'


const welcomeBooks = {
  'en': welcomeBookEn,
  'it': welcomeBookIt
}

const language = getLocaleFromNavigator().split('-')[0]
const welcomeBook = welcomeBooks[(language in welcomeBooks) ? language : 'en']


const deepCopy = obj => JSON.parse(JSON.stringify(obj))

const bookName = new (function() {
  let name = storage.get(storage.keys.BOOK_NAME, 'empty.xlgc')
  const { subscribe, set } = writable(name)
  Object.assign(this, {
    subscribe,
    set: value => ((name = value), set(value)),
    get: () => name,
  })
})()

let bookData = storage.getObj(storage.keys.BOOK_DATA, decode(welcomeBook))
if(Object.keys(bookData.entities || {}).length == 0){
  bookData = decode(welcomeBook)
}
window.book = () => bookData

let flushHandler = () => {}
const setFlushHandler = handler => flushHandler = handler

export {setFlushHandler}

/* CurrentEntity store, hold reference to loaded entity */
const currentEntity = new (function() {
  let key = ''
  const { subscribe, set } = writable(null)
  // Safe version of set - do not accept non existent keys
  const safeSet = value => {
    const oldkey = key
    key =
      value === '' || (value && value in bookData.entities)
        ? value
        : Object.keys(bookData.entities)[0]
    set(key)
    return oldkey
  }
  // Init object with value from localStorage
  safeSet(storage.get(storage.keys.CURRENT_ENTITY))
  // Public api
  Object.assign(this, {
    subscribe,
    set: safeSet,
    flush: () => flushHandler(key),
    update: handler => safeSet(handler(key)),
    unload: () => safeSet(''),
    getObj: () => deepCopy(book.entities[key]),
  })
})()

const book = new (function() {
  const { subscribe, set } = writable(bookData)

  const getData = () => Object.freeze(deepCopy(bookData))
  const safeSet = value => {
    bookData = value
    currentEntity.update(key => key)
    set(getData())
  }

  const load = async (name, text) => {
    currentEntity.unload()
    await tick()
    bookName.set(name)
    safeSet(decode(text))
    currentEntity.set(Object.keys(bookData.entities)[0])
  }

  const save = async handler => {
    currentEntity.flush()
    await handler(bookName.get(), encode(bookData))
  }

  const exportBook = async handler => {
    currentEntity.flush()
    await handler(bookName.get(), getData())
  }

  const availableKey = () => {
    for (let i = 1; i < 5000; i++) {
      const entity = String(i)
      if (entity in bookData.entities) continue
      return entity
    }
  }

  if(lgcdev){
    lgcdev.read().then( text => load("devmode", text))
  }

  // Public api
  Object.assign(this, {
    getData,
    subscribe,
    set: safeSet,
    flush: () => flushHandler(),
    update: handler => safeSet(handler(bookData) || bookData),
    load,
    save,
    exportBook,
    empty: () => load('empty.xlgc', emptyBook),
    availableKey,
  })
})()

export { bookName, book, currentEntity }

// Save on local storage on change / page unload
bookName.subscribe(value => localStorage.setItem(storage.keys.BOOK_NAME, value))
currentEntity.subscribe(value =>
  localStorage.setItem(storage.keys.CURRENT_ENTITY, value)
)
book.subscribe( () =>
  localStorage.setItem(storage.keys.BOOK_DATA, JSON.stringify(bookData))
)
window.addEventListener('unload', () => {
  localStorage.setItem(storage.keys.CURRENT_ENTITY, currentEntity.unload())
})

const entities = {
  empty: () => ({
    group: '',
    title: '',
    flags: [],
    data: '<p></p>',
  }),
  format: rawEntity => {
    const entity = {
      ...entities.empty(),
      ...rawEntity,
    }
    if (entity.title == '') delete entity.title
    if (entity.group == '') delete entity.group
    if (entity.type == '' || entity.type == 'chapter') delete entity.type
    if (!entity.flags || entity.flags.length === 0) delete entity.flags
    return entity
  },
}

export { entities }
