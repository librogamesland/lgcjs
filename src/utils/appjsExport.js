// From https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
/* .map() equivalent for objects */
const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

const tmp = document.createElement('div')

function stripHtml(html) {
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export default book =>
  'export default ' +
  JSON.stringify({
    info: { ...book.info },
    entities: objectMap(book.entities, (rawEntity) => {
      let data = rawEntity.data
        .replace(/<p[^>]*>/g, '')
        .replace(/<\/p>/g, '<br>')
        .replace(/{todo [^\}\{]+}/g, '')
        .replace(/{{( )*\/if( )*}}/g, '</lgc-if>')
        .replace(/{{( )*else( )*}}/g, '</lgc-if><lgc-if v-else>')

      // Parse links
      ;(data.match(/{link \w+:(\w|@)+}/g) || [])
        .forEach(match => {
          let [number, title] = match.split(':')
          number = stripHtml(number.substring(6))
          title = stripHtml(title.substring(0, title.length - 1).trim())
          if (title === '@T') title = book.entities[number].title || number
          data = data.replace(
            match,
            `<lgc-link to="${number}">${title}</lgc-link>`
          )
        })

      // Replace every code inside {{ }} with text
      ;(data.match(/{{(?:(?!}})[^])*(}})/g) || [])
        .forEach(match => {
          data = data.replace(match, stripHtml(match))
        })

      // Parse if
      ;(data.match(/{{if(\s)*\"(?:(?!\}\})[^])+\"(\s)*(}})/g) || [] )
        .forEach(match => {
          const condition = match.substring(
            match.indexOf('"') + 1,
            match.lastIndexOf('"')
          )
          data = data.replace(match, `<lgc-if v-if="${condition}">`)
        })

      // Parse html
      ;(data.match(/{{(\s)*\<(?:(?!\>( )*\}\})[^])+\>(\s)*(}})/g) || [] )
        .forEach(match => {
          const html = match.substring(
            match.indexOf('<'),
            match.lastIndexOf('>') + 1
          )
          data = data.replace(match, html)
        })

      const entity = { data }
      if (rawEntity.title && rawEntity.title !== '')
        entity.title = rawEntity.title
      return entity
    }),
  }) //, null, 2) // Uncomment for pretty printing
