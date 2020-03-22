import { download } from '../utils/file.js'
import docx   from './docx.js'
import fodt   from './fodt.js'
import json   from './json.js'
import appjs  from './appjs.js'

const save = (name, extension, mimetype, data) => {
  download(name.replace('.xlgc', '') + '.' + extension, data)
}

export default {
  docx:  (name, data) => docx(name, data),
  fodt:  (name, data) => save(name, 'odt', 'application/vnd.oasis.opendocument.text', fodt(data)),
  json:  (name, data) => save(name, 'json', 'application/json', json(data)),
  appjs: (name, data) => save(name, 'js',   'application/javascript', appjs(data)),

}
