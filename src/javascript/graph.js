import {img} from '../components/Dialogs.svelte'

const workerURL = 'static/graphviz/lite.render.js';
let viz = new Viz({ workerURL });

const sanitizeLabel = (text) => text.replace(/\//g, "\\").replace(/\"/g, '\"')

const generateGraph = (book) => {
  const data = book.get()
  let s = 'digraph{\n'
  Object.keys(data.chapters).forEach(key => {
    s += `${key} [label="${sanitizeLabel(book.fullTitle(key))}"]\n`
    book.linksTo(key).forEach(otherKey => {
      s += `${otherKey} -> ${key}\n`
    })
  });
  return s + '}'
}



const openGraph = (book) => {

  viz.renderImageElement(generateGraph(book))
    .then(function(element) {
      img(element.getAttribute('src'));
    })
    .catch(error => {
      console.error(error);
    });
}

export {openGraph}