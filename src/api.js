#!/usr/bin/env -S node -r esm

import md from './javascript/formats/md.js'
import {encodeHTML} from './javascript/formats/markedEncoder.js'


const data = md.decode(`
# Ciao
author: 
version: 



### 1
Welcome!
Lgcjs is an *interactive fiction & gamebook editor*, each book ` + "`<lgc></lgc>`" + `ll write won't be a single piece of text but will be made of entities (chapters/sections) linked between them.
Use the buttons above to format text (**bold**, *italic*, ...), the side menu to add, edit and delete entities, the navigation bar to open, edit, save, export files and much more.
Add a link by typing {link } inside an entity, like this: [text](#2).
Other special tags are: {todo this is a comment} , or double brace {{this is a code}}.
What are you waiting for? Start writing n

`)

const text = `Welcome!
Lgcjs is an *interactive fiction & gamebook editor*, each <lgc></lgc> boook ` + "`<lgc></lgc>`" + `ln't be a single piece of text but will be made of entities (chapters/sections) linked between them.
Use the buttons above to format text (**bold**, *italic*, ...), the side menu to add, edit and delete entities, the navigation bar to open, edit, save, export files and much more.
Add a link by typing {link } inside an entity, like this: [text](#2).` + "\n```javascript\nciao<f>\n```\n"+
`Other special tags are: {todo this is a comment} , or double brace {{this is a code}}.
What are you waiting for? Start writing n`

console.log(encodeHTML(text))