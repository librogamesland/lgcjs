


const parseString = (file) => {
  let result = {
    properties: {},
    chapters: {},
  }

  let key = ''

  const sanitizeLastChapter = () => {
    result.chapters[key].text = result.chapters[key].text.replace(/\n+$/, "")

  }

  file.split('\n').forEach( (oLine, i) => { 
    const line = oLine.trim()
  
    // Parsing dell'header
    if(key === '' && !line.startsWith('### ')) {
      if(line.startsWith('# ')) {
        result.properties['title'] = line.replace(/\#/g, '').trim()
        return
      }
      const semicolon = line.indexOf(':')
      if(semicolon !== -1){
        result.properties[line.substr(0, semicolon)] = line.substr(semicolon + 1)
      }
      return
    }
  
    // Parsing del testo
    if(line.startsWith('### ')){
      // crea nuova entità
      if(key !== '') sanitizeLastChapter()
      key = line.substr(4).trim()
      let title = ''
      const index = key.indexOf('{#')
      if(index != -1){
        title = key.substr(0, index - 1).trim()
        key = key.substr(index + 2,  key.lastIndexOf('}') - 2 - index).trim()
      }
      result.chapters[key] = {
        title,
        text: '',
        flags: []
      }

      return
    }
  
    if(line.includes('![flag]')){
      ;['final', 'fixed', 'death'].forEach( (flag) => {
        if(line.includes(flag + '.png')) result.chapters[key].flags.push(flag)
      })
      return
    }  

    result.chapters[key].text += oLine + '\n'

  })
  sanitizeLastChapter()


  console.log(result)
  return result
}





const example = `# My book
author: Luca Fabbian
lgc_version: 3.3.14.102
version:
revision: 1
editing_action: WRITING
table_of_contents: P(ALL)
editing_chapter: 1



### Introduction {#intro}
Introduzione del libro

### Rules {#rules}

Regole del libro
Un sacco di regole


### 1
Welcome!

Lgcjs is an *interactive fiction & gamebook editor*, each book you'll write won't be a single piece of text but will be made of entities (chapters/sections) linked between them.k
Use the buttons above to format text (**bold**, *italic*, ...), the side menu to add, edit and delete entities, the navigation bar to open, edit, save, export files and much more.

Add a link by typing {link } inside an entity, like this: [text](#2).

Other special tags are: {todo this is a comment} , or double brace this is a code.
<u>What are you waiting for? Start writing now!</u>


### Titolo paragrafo 2 {#2}
![flag](https://librogamesland.github.io/lgcjs/release/static/flags/death.png) ![flag](https://librogamesland.github.io/lgcjs/release/static/flags/final.png) ![flag](https://librogamesland.github.io/lgcjs/release/static/flags/fixed.png) 
Paragrafo 2

### 3
Paragrafo 3 è un bellissimo paragrafo

`

parseString(example)