import { tick } from 'svelte'
import { writable} from 'svelte/store'
import { encode, decode } from '../utils/xlgcParser.js'
import emptyBook from './empty.xlgc'
import * as storage from './storage.js'


const deepCopy = (obj) => JSON.parse(JSON.stringify(obj))

const bookName = new function(){
  let name = storage.get(storage.keys.BOOK_NAME, 'empty.xlgc')
  const {subscribe, set} = writable(name)
  Object.assign(this, {
    subscribe,
    set: (value) => (name = value, set(value)),
    get: () => name
  })
}

let bookData = storage.getObj(storage.keys.BOOK_DATA, decode(emptyBook))
window.book = () => bookData

/* CurrentEntity store, hold reference to loaded entity */
const currentEntity = new function(){
  let key = ''
  const {subscribe, set } = writable(null)
  // Safe version of set - do not accept non existent keys
  const safeSet = (value) => {
    const oldkey = key
    key = ((value === '') || (value && (value in bookData.entities)))
            ? value : Object.keys(bookData.entities)[0]
    set(key)
    return oldkey
  }
  // Init object with value from localStorage
  safeSet(storage.get(storage.keys.CURRENT_ENTITY))
  // Public api
  Object.assign(this,{
    subscribe,
    set: safeSet,
    update: (handler) => safeSet(handler(key)),
    unload: () => safeSet(''),
    getObj: () => deepCopy(book.entities[key]),
  })
}

const book = new function(){
  const {subscribe, set} = writable(bookData)

  const getData = () => Object.freeze(deepCopy(bookData))
  const safeSet = (value) => {
    bookData = value
    currentEntity.update(key => key)
    set(getData())
  }

  const load = async(name, text) => {
    currentEntity.unload()
    await tick()
    bookName.set(name)
    safeSet(decode(text))
    currentEntity.set(Object.keys(bookData.entities)[0])
  }

  const save = async(handler) => {
    const oldKey = currentEntity.unload()
    await tick()
    await handler(bookName.get(), encode(bookData))
    currentEntity.set(oldKey)
  }

  const exportBook = async(handler) => {
    const oldKey = currentEntity.unload()
    await tick()
    await handler(bookName.get(), getData())
    currentEntity.set(oldKey)
  }

  const availableKey = () => {
    for(let i = 1; i < 5000; i++){
      const entity = String(i)
      if(entity in bookData.entities) continue
      return entity
    }
  }

  // Public api
  Object.assign(this, {
    getData,
    subscribe,
    set: safeSet,
    update: (handler) => safeSet(handler(bookData) || bookData),
    load,
    save,
    exportBook,
    empty: () => load("empty.xlgc", emptyBook),
    availableKey,
  })
}

export {bookName, book, currentEntity}


// Save on local storage on change / page unload
bookName.subscribe( value => localStorage.setItem(storage.keys.BOOK_NAME, value))
currentEntity.subscribe(value => localStorage.setItem(storage.keys.CURRENT_ENTITY, value))
book.subscribe(value => localStorage.setItem(storage.keys.BOOK_DATA, JSON.stringify(bookData)))
window.addEventListener("unload", (event) => {
  localStorage.setItem(storage.keys.CURRENT_ENTITY, currentEntity.unload())
});

const entities = {
  empty: () => ({
    type:  '',
    group: '',
    title: '',
    flags: [],
    data : '<p></p>'
  }),
  format: (rawEntity) => {
    const entity = {
      ...entities.empty(),
      ...rawEntity
    }
    if(entity.title == '') delete entity.title
    if(entity.group == '') delete entity.group
    if(entity.type  == '' || entity.type  == 'chapter') delete entity.type
    if(!entity.flags || entity.flags.length === 0) delete entity.flags
    return entity
  }
}

export {entities}
