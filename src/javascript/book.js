import { derived, writable } from 'svelte/store'


const storageKey = 'book'



const test = {
  key: "1",
  properties: {
    title: "My book",
    author: "Luca Fabbian",
    revision: "1",
  },
  chapters: {
    "1": {
      title: "Titolo",
      text: "Nel nuovo formato, si usa il doppio asterisco **per fare il grassetto**, mentre `così si fa il codice`." +
            "\nI link si fanno con [Titolo](#numero), se il titolo viene omesso verrà preso quello del paragrafo, ad esempio [](#2).",
      flags: []
    },
    "2": {
      title: "",
      text: "Nel menu laterale dovrebbe apparire che il paragrafo laterale ha un link verso questo paragrafo.",
      flags: ["final", "death"]
    },
  }
}


//let data = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(test))
let data = test

const beforeCallbacks = []
const beforeUpdate    = (callback) => beforeCallbacks.push(callback)


const book = (() => {
  const {set, subscribe} = new writable(data)

  const newChapter = () => ({title: "", flags:[], text: ""})

  const update = (callback) => {
    const callbacks = [...beforeCallbacks, callback]
    callbacks.forEach( (fun) => {
      data = {...data, ...fun(data)}
    })

    if(!data.chapters || Object.keys(data.chapters).length == 0){
      data.chapters = { "1": newChapter() }
    }

    if(!(data.chapters[data.key])){
      data.key = Object.keys(data.chapters)[0]
    }
    localStorage.setItem(storageKey, JSON.stringify(data))
    set(data) 
  }

  const availableKey = () => {
    for (let i = 1; i < 5000; i++) {
      const key = String(i)
      if (data.chapters[key]) continue
      return key
    }
  }

  return {
    update, 
    subscribe,
    get: () => JSON.parse(JSON.stringify(data)),
    newChapter,
    availableKey,
  }
})()



const chapter = derived( book, $book => ({
    key: $book.key, 
    value: {
      ...book.newChapter(),
      ...$book.chapters[$book.key]
    }
  }))

export {book, chapter, beforeUpdate }