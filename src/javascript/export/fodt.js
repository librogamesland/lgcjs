import {customStyles, testContent, template} from './templates/fodt-template.js'
import {specialTags} from '../editor/formats.js'


const tmp = document.createElement('div')

function stripHtml(html) {
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const bookmark = (number, title) =>
`<text:span text:style-name="bold"><text:bookmark-start text:name="lgcjs${number}"/>${title}<text:bookmark-end text:name="lgcjs${number}"/></text:span>`

const addEntity = (book, entity, inlineStyle = false, breakAfter = false ) => {
  const entityTitle = book.entities[entity].title || entity
  const entityText  = book.entities[entity].data || '<p></p>'

  const l = document.createElement("div")
  let parsedText = entityText
      .replace(specialTags.todo, '')
      .replace(specialTags.lgcode, '')
      .replace(/<br>/g, '')
  l.innerHTML = parsedText

  let result = ''
  if(!inlineStyle){
    result += `<text:p text:style-name="center">${bookmark(entity, entityTitle)}</text:p>`
  }

  const childNodes = l.childNodes
  childNodes.forEach( (p, i) =>{
    const alignment = p.getAttribute('align') || 'Standard'
    let text = p.innerHTML
      .replace(/<b>/g, `<text:span text:style-name="bold">`)
      .replace(/<\/b>/g, `</text:span>`)
      .replace(/<i>/g, `<text:span text:style-name="italic">`)
      .replace(/<\/i>/g, `</text:span>`)
      .replace(/<u>/g, `<text:span text:style-name="underline">`)
      .replace(/<\/u>/g, `</text:span>`)

    result += `<text:p text:style-name="${alignment}">${text}</text:p>`
  })

  ;(result.match(/{link \w+:(\w|@)+}/g) || [])
    .forEach(match => {
      let [number, title] = match.split(':')
      number = stripHtml(number.substring(6))
      title = stripHtml(title.substring(0, title.length - 1).trim())
      if (title === '@T') title = book.entities[number].title || number
      result = result.replace(
        match,
        `<text:a xlink:type="simple" xlink:href="#lgcjs${number}" text:style-name="Internet_20_link" text:visited-style-name="Visited_20_Internet_20_Link">${title}</text:a>`
      )
    })

  if(inlineStyle){
    console.log('inline')
    result = result.replace('>', '>' + bookmark(entity, `${entityTitle}. `))
  }

  result += `<text:p text:style-name="${breakAfter ? 'break' : 'Standard'}"/>`
  return result
}



export default book => {
  const content = []

  content.push(addEntity(book, 'intro', false, false))
  content.push(addEntity(book, 'rules', false, true))

  function isNaturalNumber(n) {
      n = n.toString(); // force the value incase it is not
      var n1 = Math.abs(n),
          n2 = parseInt(n, 10);
      return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  Object.keys(book.entities).filter( k => isNaturalNumber(k)).forEach( k => {
    content.push(addEntity(book, k, true, false))
  })
  return template(content.join('\n'))
}
