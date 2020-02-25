/* Quill LinkHighlighter
Estensione dell'editor di testo quill che consente di evidenziare
automaticamente i link fra i paragrafi.
Riconosce il "vecchio" formato link {link numero:testo}

Uso:
import LinkHighlighter from './linkHighlighter.js'

// Inizializza passando la referenza a Quill
const linkHighlighter = new LinkHighlighter(Quill)

linkHighlighter.highlight(editor, enable = true) // Tro
linkHighlighter.startHighlighting(editor)        // Inizia a controllare

*/

//
export default function(Quill, clickHandler){
  // Ridefinisce l'oggetto link
  class Link extends Quill.import('blots/inline') {
    static create() {
      let node = super.create();
      // Aggiunge l'handler quando il link viene cliccato
      node.addEventListener("click", function(){
        const [number, title] = this.childNodes[0].nodeValue.split(':')
        clickHandler(number.substring(6), title.substring(0, title.length - 1))
      })
      node.setAttribute('href', '#');
      return node;
    }
    static formats(domNode) { return '' }
    formatAt(index, length, name, value) {} // Previene grassetto/corsivo
  }
  // Registra l'oggetto Link in modo che sovrascriva quello usuale
  Link.blotName = 'link';
  Link.tagName = 'A';
  Quill.register('formats/link', Link);

  // Evidenzia/Toglie i link nel testo
  const highlight = (editor, on = true) => {
    if(on){
      const text  = editor.getText()
      let lastSearchedIndex = 0
      // Formatta tutte le stringhe che corrispondono a {link parola:parola}
      ;(text.match(/\{link \w+:(\w|@)+\}/g) || []).forEach( (match) => {
        const index = text.indexOf(match, lastSearchedIndex)
        lastSearchedIndex = index + match.length - 1
        // Applica il link
        editor.formatText(index, match.length,'link', true);
      })
    }else{
      // Rimuove tutti i link dall'inizio alla fine
      editor.formatText(0, editor.getText().length,'link', false);
    }
  }

  // Azioni da eseguire a ogni update del testo
  const onTextUpdate = function(delta, oldDelta, source) {
    if (source == 'user'){
      highlight(editor, false)
      highlight(editor, true)
    }
  }


  this.highlight = highlight
  this.startHighlighting = (editor) => editor.on('text-change', onTextUpdate)
  this.stopHighlighting  = (editor) => editor.off('text-change', onTextUpdate)

}
