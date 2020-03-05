/*


*/
// Import languages, settings, dialogs and book
import { _ } from 'svelte-i18n'
import { showCode } from '../store/settings.js'
import { download } from '../utils/file.js'
import { confirm } from '../utils/dialogs.js'
import jsExport from '../utils/jsexport.js'
import {bookName, book, currentEntity } from '../store/book.js'

const newFile = async() => {
  if(await confirm("Confirm?", `This will override "${bookName.get()}" if not saved`))
    book.empty()
}

export default {
  'file' : {
    'new'  : {type: 'button', handler: newFile },
    'open' : {type: 'fileinput', accept: ".xlgc", handler: book.load },
    'save' : {type: 'button', handler: () => book.save(download) },
  },
 'edit' : { },
  'code' : {
    'togglecode' : {type: 'button', handler: () => showCode.update(n => !n)},
    'jsexport'   : {type: 'button', handler: () => download(bookName.get() + '.js', jsExport(book.getData()))}
  },
  'help' : {
    'guide' : {type: 'link',   href: ""},
    'forum' : {type: 'link',   href: "http://www.librogame.net/index.php/forum/topic?id=5182&p=1#p148583"},
    'about' : {type: 'button', handler: null},
  }
}
