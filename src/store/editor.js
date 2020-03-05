/*


*/

import { currentEntity, book } from '../store/book.js'
import LinkHighlighter from '../utils/highlighter.js'

// Istanza di quill
let quillEditor = null
let linkHighlighter = null
let displayedEntity = ''

const loadEntity = (entity) => {
  quillEditor.setContents([])
  const bookData = book.getData()
  quillEditor.clipboard.dangerouslyPasteHTML(0, bookData.entities[entity].data)

  linkHighlighter.highlight(true)
  linkHighlighter.start()
}

const unloadEntity = (entity) => {
  linkHighlighter.stop()
  linkHighlighter.highlight(false)
  book.update(bookData => {
    bookData.entities[entity].data = quillEditor.root.innerHTML
  })
}


/** Monta l'instanza  */
if(window.hljs) window.hljs.configure({languages: ['xml']})
const mount = (querySelector) => {
  quillEditor = new window.Quill(querySelector, {
    modules: {
      syntax: window.hljs ? true : false, // Include syntax module
      toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean', 'code-block' ]
      ]
    },
    theme: 'snow'
  })

  linkHighlighter = new LinkHighlighter(Quill,  quillEditor, (number, value) => {
    const bookData = book.getData()
    if(!(number in bookData.entities)) book.update( (bookData) => {
      bookData.entities[String(number)] = { "data": "<p></p>" }
    })
    currentEntity.set(number)
  })

  if(displayedEntity != '') loadEntity(displayedEntity)
}

/** Chiede il focus sull'editor */
const focus = () => { if(quillEditor) quillEditor.focus() }




currentEntity.subscribe(entity => {
  if(!quillEditor){
    displayedEntity = entity
    return
  }

  if( displayedEntity != '') unloadEntity(displayedEntity)
  displayedEntity = entity
  if(displayedEntity != '') loadEntity(displayedEntity)
})


export {quillEditor, mount, focus }
