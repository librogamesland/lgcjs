// Download file
const download = (filename, text) => {
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/xml;charset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Read file from fileinput
const read = (elem, callback) => {
  // Crea una copia delle info del file
  const file = elem.files[0]
  const name = file.name

  // Usa un fileReader per leggere il file come testo
  const reader = new FileReader()
  reader.onload = () => {
    callback(name, reader.result)
    elem.value = ''
  }
  reader.readAsText(file)
}

export { download, read }
