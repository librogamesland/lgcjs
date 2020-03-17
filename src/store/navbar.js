/*


*/
// Import languages, settings, dialogs and book
import { showCode } from '../store/settings.js'
import { confirm } from '../utils/dialogs.js'
import { download } from '../utils/file.js'
import { bookName, book } from '../store/book.js'
import exports from '../export/index.js'


const newFile = async () => {
  if (await confirm('dialogs.confirm',`dialogs.text.new`)) book.empty()
}

export default {
  file: {
    new: { type: 'button', handler: newFile },
    open: { type: 'fileinput', accept: '.xlgc', handler: book.load },
    save: { type: 'button', handler: () => book.save(download) },
  },
  export: {
    docx: { type: 'button',  handler: () => book.exportBook(exports.docx) },
    json: { type: 'button',  handler: () => book.exportBook(exports.json) },
    appjs: { type: 'button', handler: () => book.exportBook(exports.appjs) },
  },
  code: {
    togglecode: { type: 'button', handler: () => showCode.update(n => !n) },
  },
  help: {
    guide: { type: 'link', href: '' },
    forum: {
      type: 'link',
      href:
        'http://www.librogame.net/index.php/forum/topic?id=5182&p=1#p148583',
    },
    about: { type: 'button', handler: null },
  },
}
