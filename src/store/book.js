import {writable} from 'svelte/store'
import {test1} from '../book/tests.js'
import { encode, decode } from '../utils/xlgcParser.js'
import emptyBook from './empty.xlgc'


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


const Entity = () => ({
  save: "ed",
  open: "f"
})

const currentEntity = Entity()

export {entityList, chapterList, sectionList, currentEntity}
