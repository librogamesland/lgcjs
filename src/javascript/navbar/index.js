/*


*/
// Import languages, settings, dialogs and book
import lgcdev from '../lgcdev'

import { showCode } from '../store/settings.js'
import { confirm, about } from '../utils/dialogs.js'
import { download } from '../utils/file.js'
import { bookName, book } from '../store/book.js'
import exports from '../export/index.js'


import { getLocaleFromNavigator } from 'svelte-i18n'

// Trova la guida da mostrare
const avaiableGuides = ['en', 'it']
const language = getLocaleFromNavigator().split('-')[0]
const guide = `../guide/pdf/guide-${avaiableGuides.includes(language) ? language : 'en'}.pdf`


const newFile = async () => {
  if (await confirm('dialogs.confirm',`dialogs.text.new`)) book.empty()
}

const navbar = {
  file: {
    new: { type: 'button', handler: newFile },
    open: { type: 'fileinput', accept: '.xlgc', handler: book.load },
    save: { type: 'button', handler: () => book.save(download) },
  },
  view: {
    togglecode: { type: 'button', handler: () => showCode.update(n => !n) },
  },
  export: {
    docx: { type: 'button',  handler: () => book.exportBook(exports.docx) },
    fodt: { type: 'button',  handler: () => book.exportBook(exports.fodt) },
    json: { type: 'button',  handler: () => book.exportBook(exports.json) },
    vuejs: { type: 'button', handler: () => book.exportBook(exports.vuejs) },
  },
  help: {
    guide: { type: 'link', href: guide },
    forum: {
      type: 'link',
      href:
        'http://www.librogame.net/index.php/forum/topic?id=5182&p=1#p148583',
    },
    about: { type: 'button', handler: about },
  },
}

// Add sync to devmode
if(lgcdev){
  navbar.file["sync"] = {
    type: 'button',
    handler: () => book.save((filename, text) => lgcdev.write(text))
  }
}

const handlers = {
  N: () => navbar.file.new.handler(),
  S: () => {
    // If devmode sync instead of saving
    if(lgcdev){
      navbar.file.sync.handler()
      return
    }
    navbar.file.save.handler()
  },
}

export {navbar, handlers}
