/*


*/

import { currentEntity, book, setFlushHandler } from '../store/book.js'
import { Quill } from './quill.js'
import { setLinkHandler, Highlighter} from './formats.js'

// Istanza di quill
let quillEditor = null
let highlighter = null
let displayedEntity = ''


const fixEntity = e => e.replace(/<br>/g, '')

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
    bookData.entities[entity].data = fixEntity(quillEditor.root.innerHTML)
  })
}

const tempCont = document.createElement('div');
const tempEditor = new Quill(tempCont);
tempEditor.disable()
const tempHighlighter = new Highlighter(tempEditor)

const getQuillHtml = (editor) => {
	tempEditor.setContents(editor.getContents());
  tempHighlighter.off()
	return fixEntity('' + tempEditor.root.innerHTML);
}

setFlushHandler( entity => {
  book.update(bookData => {
    bookData.entities[entity].data = getQuillHtml(quillEditor)
  })
})



/** Monta l'instanza  */
if (window.hljs) window.hljs.configure({ languages: ['xml'] })
const mount = (toolbarSelector, querySelector) => {
  quillEditor = new window.Quill(querySelector, {
    formats: [
      'bold', 'italic', 'underline', 'align', 'link', 'todo', 'lgcode'
    ],
    modules: {
      syntax: window.hljs ? true : false, // Include syntax module
      toolbar: toolbarSelector,
      /*[
        ['bold', 'italic', 'underline'],
        //[{ font: [] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['clean'],
      ],*/
    },
    theme: 'snow',
  })

  document.querySelector('.ql-quicklink').addEventListener('click', function() {
    const sel = (quillEditor.getSelection() || {index: quillEditor.getLength()}).index 
    quillEditor.insertText(sel, "{link :@T}", "user")
    quillEditor.setSelection(sel +6)
  });

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
