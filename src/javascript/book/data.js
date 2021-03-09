import { Book } from './book.js'
import { derived } from 'svelte/store'

const storageKey = 'book'



const test = {
  key: "1",
  properties: {
    title: "My book",
    author: "Luca Fabbian",
    revision: "1",
  },
  chapters: {
    "intro": { title: "Introduzione", group: "", text: "", flags: [] },
    "rules": { title: "Regolamento", group: "",  text: "", flags: [] },    
    "1": {
      title: "Titolo",
      group: "",
      text: "Nel nuovo formato, si usa il doppio asterisco **per fare il grassetto**, mentre `così si fa il codice`." +
            "\nI link si fanno con [Titolo](#numero), se il titolo viene omesso verrà preso quello del paragrafo, ad esempio [](#2).",
      flags: []
    },
    "2": {
      title: "",
      group: "",
      text: "Nel menu laterale dovrebbe apparire che il paragrafo laterale ha un link verso questo paragrafo.",
      flags: ["final", "death"]
    },
  }
}


let data = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(test))


const book = new Book(data)

book.subscribe( (bookData) => {
  localStorage.setItem(storageKey, JSON.stringify(bookData))
})


const chapter = derived( book, $book => ({
    key: $book.key, 
    value: {
      ...book.newChapter(),
      ...$book.chapters[$book.key]
    }
  }))

export { book, chapter }