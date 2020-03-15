/*


*/
// Import languages, settings, dialogs and book
import { showCode } from '../store/settings.js'
import { download } from '../utils/file.js'
import { confirm } from '../utils/dialogs.js'
import appjsExport from '../utils/appjsExport.js'
import { bookName, book } from '../store/book.js'

const newFile = async () => {
  if (
    await confirm(
      'dialogs.confirm',
      `dialogs.text.new`
    )
  )
    book.empty()
}

const json = () => {
  book.exportBook((name, data) =>
    download(name + '.json', JSON.stringify(data, null, 2))
  )
}

const appjs = () => {
  book.exportBook((name, data) => download(name + '.js', appjsExport(data)))
}

export default {
  file: {
    new: { type: 'button', handler: newFile },
    open: { type: 'fileinput', accept: '.xlgc', handler: book.load },
    save: { type: 'button', handler: () => book.save(download) },
  },
  export: {
    json: { type: 'button', handler: json },
    appjs: { type: 'button', handler: appjs },
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
