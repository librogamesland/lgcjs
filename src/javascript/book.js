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
    "intro": { title: "Introduzione", text: "", flags: [] },
    "rules": { title: "Regolamento", text: "", flags: [] },    
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


let data = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(test))

const beforeCallbacks = []
const beforeUpdate    = (callback) => beforeCallbacks.push(callback)


const book = (() => {
  const {set, subscribe} = new writable(data)

  const newChapter = () => ({title: "", flags:[], text: ""})
  const sanitizeKey = key => key.replace(/[^a-z0-9]/gi,'')


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

  // Something like "01 - Title"
  const fullTitle = (chapterKey) => chapterKey + (data.chapters[chapterKey].title ? ' - ' + data.chapters[chapterKey].title : '')

  const linksTo = (chapterKey) => {
    const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const keyRegex =     new RegExp(String.raw`\[([^\[]*)\](\(\s*\#${escapeRegex(chapterKey)}\s*\))`, 'g')
    return Object.keys(data.chapters).filter( key => keyRegex.test(data.chapters[key].text) )
  }

  const get = () => {
    update(()=> {})
    return JSON.parse(JSON.stringify(data))
  }

  const sortedKeys = (chapters) => Object.keys(chapters).sort( (a, b) => {
    const aIsNumber = /^-?\d+$/.test(a)
    const bIsNumber = /^-?\d+$/.test(b)

    if(!aIsNumber && bIsNumber) return -1
    if(aIsNumber && !bIsNumber) return +1
    if(!aIsNumber && !bIsNumber) return a.localeCompare(b)
    if(aIsNumber && bIsNumber) return  parseInt(a, 10) - parseInt(b, 10)
  })

  return {
    update, 
    subscribe,
    get,
    newChapter,
    availableKey,
    sanitizeKey,
    sortedKeys,
    linksTo,
    fullTitle,
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