import { tick } from 'svelte'
import {writable} from 'svelte/store'
import { encode, decode } from '../utils/xlgcParser.js'
import emptyBook from './empty.xlgc'
import testBook from  '../tests/1.xlgc'
import { download } from '../utils/file.js'


const refreshable = (constructor) => {
  const  { subscribe, set } = writable(constructor());
  return { subscribe, refresh: () => set(constructor())  }
}

const STORAGE_FILENAME = 'lgcjs-filename'
const STORAGE_BOOK = 'lgcjs-book'
const STORAGE_CURRENTENTITY = 'lgcjs-currententity'

let filename = localStorage.getItem(STORAGE_FILENAME) || 'empty.xlgc'
let book = JSON.parse(localStorage.getItem(STORAGE_BOOK) || 'null') || decode(emptyBook)
let bookStore = refreshable(() => Object.freeze(JSON.parse(JSON.stringify(book))))

const currentEntity = writable(localStorage.getItem(STORAGE_CURRENTENTITY) || Object.keys(book.entities)[0])
currentEntity.subscribe(value => localStorage.setItem(STORAGE_CURRENTENTITY, value) )

const loadXlgc = async(lFilename, text) => {
  currentEntity.set('')
  await tick
  filename = lFilename
  book = decode(text)
  currentEntity.set(Object.keys(book.entities)[0])
  bookStore.refresh()
}

const loadEmptyXlgc = () => loadXlgc("empty.xlgc", emptyBook)

const saveXlgc = async() => {
  let oldentity = ''
  currentEntity.update(n => {
    oldentity = n
    return ''
  })
  await tick
  download(filename, encode(book))
  currentEntity.set(oldentity)
}



const entityList  = refreshable(() => Object.keys(book.entities))
const chapterList = refreshable(() => Object.keys(book.entities).filter( k => (!book.entities[k].type || book.entities[k].type === 'chapter')))
const sectionList = refreshable(() => Object.keys(book.entities).filter( k => book.entities[k].type === 'section'))



bookStore.subscribe( () => {
  localStorage.setItem(STORAGE_FILENAME, filename)
  localStorage.setItem(STORAGE_BOOK, JSON.stringify(book))
  entityList.refresh()
  chapterList.refresh()
  sectionList.refresh()
})

export {book as bookRaw, bookStore as book, loadEmptyXlgc, loadXlgc, saveXlgc, entityList, chapterList, sectionList, currentEntity}
