/* Questo modulo definisce i formati presenti nell'editor
e adatta quelli già presenti per farli coincidere con
quelli di LibroGameCreator 3. Fornisce inoltre le regex dei
formati che vengono evidenziati automaticamente e uno
strumento per evidenziarli (vedi sotto)

Formati sempre presenti:
- grassetto  <b></b>
- italico    <i></i>
- align      <p alig="left"></p>


Formati che vengono evidenziati automaticamente:
(i cosiddetti "special tags")
- {link number:value}    <a></a>  (viene usato "onclick" anziché "href")
- {todo }                <todo></todo>
- {{ codice }}           <lgcode></lgcode>

*/
import { Quill, Parchment, editFormat, addInlineFormat } from './quill.js'



/* Parametri del modulo */
let linkClickHandler = () => {}
const setLinkHandler = handler => linkClickHandler = handler
/* Esporta setLinkHandler così da rendere possibile
specificare come vanno gestiti i link dall'esterno */
export { setLinkHandler }




/** Definisce i formati del modulo */
editFormat('formats/bold',   {tagName: ['B', 'STRONG']})
editFormat('formats/italic', {tagName: ['I', 'EM']}    )

let Align = new Parchment.Attributor.Attribute('align', 'align');
Quill.register('formats/align',  Align)


addInlineFormat('formats/todo',   {blotName: 'todo',   tagName: 'todo'})
addInlineFormat('formats/lgcode', {blotName: 'lgcode', tagName: 'lgcode'})

addInlineFormat('formats/link', {blotName: 'link',   tagName: 'A'}, node => {
  node.addEventListener('click', function(e) {
    const [number, title] = this.childNodes[0].nodeValue.split(':')
    linkClickHandler(number.substring(6), title.substring(0, title.length - 1))
    e.preventDefault()
    return false
  })
  node.setAttribute('href', '#')
  return node
})




/* Definisce i pattern dei tag speciali,
cioé quelli che hanno un significato particolare
e vengono evidenziati automaticamente */
const specialTags = {
  link   : /{link \w+:[^\}\{]+}/g,
  todo   : /{todo [^\}\{]+}/g,
  lgcode : /{{(?:(?!\}\})[^])*(}})/g,
}

export {specialTags}



const inlineFormats = ['bold', 'italic', 'underline']

/* Definisce una classe, Highlighter, che permette
di evideniare automaticamente gli special tags */
const formatMatches = (editor, formatName, regex) => {
  const text = editor.getText()
  let lastSearchedIndex = 0
  // Formatta tutte le stringhe che corrispondono a {link parola:parola}
  ;(text.match(regex) || []).forEach(match => {
    const index = text.indexOf(match, lastSearchedIndex)
    lastSearchedIndex = index + match.length - 1
    // Applica il link
    inlineFormats.forEach( f => editor.formatText(index, match.length, f, false))
    editor.formatText(index, match.length, formatName, true)
  })
}

const Highlighter = function(editor) {
  // Evidenzia tutti gli special tags nel testo
  const on = () => Object.keys(specialTags).forEach(format => {
    formatMatches(editor, format, specialTags[format])
  })

  // Rimuove tutti gli special tags
  const off = () => Object.keys(specialTags).forEach(format => {
    editor.formatText(0, editor.getText().length, format, false)
  })


  let enabled = false
  function debounced(delay, fn) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        if(enabled) fn(...args);
        timerId = null;
      }, delay);
    }
  }

  // Azioni da eseguire a ogni update del testo
  const onTextUpdate = debounced(300, function(delta, oldDelta, source) {
    if (source == 'user') { off(); on(); }
  })

  // Metodi pubblici
  Object.assign(this, {
    on,
    off,
    start: () => {
      enabled = true
      editor.on('text-change', onTextUpdate)
    },
    stop : () => {
      enabled = false
      editor.off('text-change', onTextUpdate)
    },
  })
}

export {Highlighter}
