import {writable} from 'svelte/store'
import { encode, decode } from '../utils/xlgcParser.js'
import emptyBook from '../tests/1.xlgc' // './empty.xlgc'


let filename = "empty"
let book = decode(emptyBook)
console.log(book)


const load = (fileName, text) => {

}


const refreshable = (constructor) => {
  const  { subscribe, set } = writable(constructor());
  return { subscribe, refresh: () => set(constructor())  }
}


const entityList  = refreshable(() => Object.keys(book.entities))
const chapterList = refreshable(() => Object.keys(book.entities).filter( k => (!book.entities[k].type || book.entities[k].type === 'chapter')))
const sectionList = refreshable(() => Object.keys(book.entities).filter( k => book.entities[k].type === 'section'))


const currentEntity = writable("1")

export {entityList, chapterList, sectionList, currentEntity}
