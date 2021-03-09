import { writable} from 'svelte/store'
import { book } from './book/data.js'
import * as md from './formats/md.js'

const filename = (() => {
	const { subscribe, set } = writable(0);
  let data = localStorage.getItem('file-path') || 'book.md'
	return {
		subscribe,
		set: (value) => {
      data = value
      localStorage.setItem('file-path', value)
      set(value)
    },
    get: () => data,
	};
})()


const formats = {
  'md': md,
}


const newBook = () => {
  book.update( () => ({
    key: "1",
    properties: {
      title: "My book",
      author: "Web editor",
      revision: "1",
    },
    chapters: {
      "intro": {title:"Introduction", text:"", flags: []},
      "rules": {title:"Rules", text:"", flags: []},
      "1": {title:"", text:"", flags: []},
    }
  }))
  filename.set('book.md')
}



// Read file from fileinput
const open = (elem) => {
  // Crea una copia delle info del file
  const file = elem.files[0]
  const fileName = file.name

  // Usa un fileReader per leggere il file come testo
  const reader = new FileReader()
  reader.onload = () => {
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1)
    if(!['md'].includes(extension)){
      console.error("Unsupported format")
      return
    }
    console.log(extension, formats)
    book.update(() => formats[extension].decode(reader.result))
    filename.set(fileName)

    elem.value = ''
  }
  reader.readAsText(file)
}


// Download file
const download = (formatKey, book) => {
  const format = formats[formatKey]
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:${format.mimetype};charset=utf-8,${encodeURIComponent(format.encode(book))}`
  )
  element.setAttribute('download', filename.get())

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}


export { newBook, open, download, filename}
