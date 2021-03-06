/*


*/
// Import languages, settings, dialogs and book

import { showCode } from './settings.js'
import { confirm, about } from './utils/dialogs.js'
import { download } from './utils/file.js'
import { bookName, book } from '../store/book.js'
import exports from './export/index.js'


import { language } from '../localizations'


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
    md:   { type: 'button',  handler: () => book.exportBook(exports.md)   },
    json: { type: 'button',  handler: () => book.exportBook(exports.json) },
    vuejs: { type: 'button', handler: () => book.exportBook(exports.vuejs) },
  },
  help: {
    guide: { type: 'link', href: `../guide/pdf/guide-${language}.pdf` },
    forum: {
      type: 'link',
      href:
        'http://www.librogame.net/index.php/forum/topic?id=5182&p=1#p148583',
    },
    about: { type: 'button', handler: about },
  },
}


const handlers = {
  N: () => navbar.file.new.handler(),
  S: () => {
    navbar.file.save.handler()
  },
}

export {navbar, handlers}
