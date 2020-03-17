/* Quill LinkHighlighter
Estensione dell'editor di testo quill che consente di evidenziare
automaticamente i link fra i paragrafi.
Riconosce il "vecchio" formato link {link numero:testo}

Uso:
import LinkHighlighter from './linkHighlighter.js'

// Inizializza passando la referenza a Quill
const highlighter = new LinkHighlighter(Quill, editor, (number, value) => { handleClick()})

highlighter.highlight(enable = true) // Mette/toglie tutti i link
highlighter.start()                  // Inizia a controllare
highlighter.stop()                   // Termina di controllare

*/

const setTag = (Quill, formatName, tagName) => {
  const Format = Quill.import(formatName)
  Format.tagName = tagName
  Quill.register(formatName, Format)
}

const setKey = (Quill, formatName, keyName) => {
  const Format = Quill.import(formatName)
  Format.keyName = keyName
  Quill.register(formatName, Format)
}

const addInlineFormat = (
  Quill,
  registerName,
  blotName,
  tagName,
  onCreate = node => node
) => {

  const Format = class extends Quill.import('blots/inline') {
    static create() {
      return onCreate(super.create())
    }
    static formats() {
      return ''
    }
    formatAt(index, length, name, value) {
      if (name === blotName) return super.formatAt(index, length, name, value)
      // Previene grassetto/corsivo
    }
  }
  // Registra l'oggetto Link in modo che sovrascriva quello usuale
  Format.blotName = blotName
  Format.tagName = tagName
  Quill.register(registerName, Format)
}

const formatMatches = (editor, formatName, regex) => {
  const text = editor.getText()
  let lastSearchedIndex = 0
  // Formatta tutte le stringhe che corrispondono a {link parola:parola}
  ;(text.match(regex) || []).forEach(match => {
    const index = text.indexOf(match, lastSearchedIndex)
    lastSearchedIndex = index + match.length - 1
    // Applica il link
    editor.formatText(index, match.length, formatName, true)
  })
}

//
export default function(Quill, editor, clickHandler) {
  Quill.debug('error')

  setTag(Quill, 'formats/bold', ['B', 'STRONG'])
  setTag(Quill, 'formats/italic', ['I', 'EM'])

  const Parchment = Quill.import('parchment')

  let Align = new Parchment.Attributor.Attribute('align', 'align');
  Quill.register('formats/align', Align)

  //setKey(Quill, 'formats/align', 'align')

  console.log(Quill.import('formats/align'))

  addInlineFormat(Quill, 'formats/link', 'link', 'A', node => {
    node.addEventListener('click', function() {
      const [number, title] = this.childNodes[0].nodeValue.split(':')
      clickHandler(number.substring(6), title.substring(0, title.length - 1))
    })
    node.setAttribute('href', '#')
    return node
  })

  addInlineFormat(Quill, 'formats/todo', 'todo', 'todo')
  addInlineFormat(Quill, 'formats/lgcode', 'lgcode', 'lgcode')

  const formats = {
    link: /{link \w+:(\w|@)+}/g,
    todo: /{todo [^\}\{]+}/g,
    lgcode: /{{(?:(?!\}\})[^])*(}})/g,
  }

  // Evidenzia/Toglie i link nel testo
  const highlight = (on = true) => {
    if (on) {
      Object.keys(formats).forEach(format => {
        formatMatches(editor, format, formats[format])
      })
    } else {
      // Rimuove tutti i link dall'inizio alla fine
      Object.keys(formats).forEach(format => {
        editor.formatText(0, editor.getText().length, format, false)
      })
    }
  }

  // Azioni da eseguire a ogni update del testo
  const onTextUpdate = function(delta, oldDelta, source) {
    if (source == 'user') {
      highlight(false)
      highlight(true)
    }
  }

  this.highlight = highlight
  this.start = () => editor.on('text-change', onTextUpdate)
  this.stop = () => editor.off('text-change', onTextUpdate)
}
