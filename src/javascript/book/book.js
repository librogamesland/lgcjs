import {writable } from 'svelte/store'

// Book constructor
const Book = function(data){
  const beforeCallbacks = []
  const beforeUpdate    = (callback) => beforeCallbacks.push(callback)

  const {set, subscribe} = new writable(data)

  const newChapter = () => ({title: "", group: "", flags:[], text: ""})
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

  const sortedKeys = (chapters = data.chapters) => Object.keys(chapters).sort( (a, b) => {
    const aIsNumber = /^-?\d+$/.test(a)
    const bIsNumber = /^-?\d+$/.test(b)

    if(!aIsNumber && bIsNumber) return -1
    if(aIsNumber && !bIsNumber) return +1
    if(!aIsNumber && !bIsNumber) return a.localeCompare(b)
    if(aIsNumber && bIsNumber) return  parseInt(a, 10) - parseInt(b, 10)
  })

  // Return
  Object.assign(this, {
    beforeUpdate,
    update, 
    subscribe,
    get,
    newChapter,
    availableKey,
    sanitizeKey,
    sortedKeys,
    linksTo,
    fullTitle,
  })
}

export {Book}