import { download } from '../utils/file.js'
import docx   from './docx.js'
import json   from './json.js'
import appjs  from './appjs.js'

const save = (name, extension, data) => {
  download(name + '.' + extension, data)
}

/*
const json = () => book.exportBook(export.json)(name, data) =>
  download(name + '.json', JSON.stringify(data, null, 2))
)

const appjs = () => book.exportBook((name, data) =>
  download(name + '.js', appjsExport(data))
)

const docx = () => book.exportBook((name, data) =>
  docxExport(name, data)
)*/

export default {
  docx:  (name, data) => docx(name, data),
  json:  (name, data) => save(name, 'json', json(data)),
  appjs: (name, data) => save(name, 'js',   appjs(data)),

}
