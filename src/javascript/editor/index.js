/*


*/

import { currentEntity, book } from '../store/book.js'
import { Quill } from './quill.js'
import { setLinkHandler, Highlighter} from './formats.js'

// Istanza di quill
let quillEditor = null
let highlighter = null
let displayedEntity = ''

const loadEntity = entity => {
  quillEditor.setContents([])
  const bookData = book.getData()
  quillEditor.clipboard.dangerouslyPasteHTML(0, bookData.entities[entity].data)

  highlighter.on()
  highlighter.start()
}

const unloadEntity = entity => {
  highlighter.stop()
  highlighter.off()
  book.update(bookData => {
    bookData.entities[entity].data = quillEditor.root.innerHTML
  })
}

/** Monta l'instanza  */
if (window.hljs) window.hljs.configure({ languages: ['xml'] })
const mount = querySelector => {
  quillEditor = new window.Quill(querySelector, {
    modules: {
      syntax: window.hljs ? true : false, // Include syntax module
      toolbar: [
        ['bold', 'italic', 'underline'],
        //[{ font: [] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['clean'],
      ],
    },
    theme: 'snow',
  })

  setLinkHandler((number) => {
    const bookData = book.getData()
    if (!(number in bookData.entities))
      book.update(bookData => {
        bookData.entities[String(number)] = { data: '<p></p>' }
      })
    currentEntity.set(number)
  })

  highlighter = new Highlighter(quillEditor)
  if (displayedEntity != '') loadEntity(displayedEntity)
}

/** Chiede il focus sull'editor */
const focus = () => {
  if (quillEditor) quillEditor.focus()
}


// Subscribe
currentEntity.subscribe(entity => {
  if (!quillEditor) {
    displayedEntity = entity
    return
  }

  if (displayedEntity != '') unloadEntity(displayedEntity)
  displayedEntity = entity
  if (displayedEntity != '') loadEntity(displayedEntity)
})

export { quillEditor, mount, focus }
