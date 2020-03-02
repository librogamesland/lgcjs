<script>
  import { onMount, tick } from 'svelte'
  import { currentEntity, book, bookRaw } from '../store/book.js'
  import LinkHighlighter from '../utils/linkHighlighter.js'

  export let foreground = false
  let editor =null

  onMount(async () => {
    await tick()

    hljs.configure({languages: ['xml']})
    editor = new window.Quill('#text-editor', {
      modules: {
        syntax: true,              // Include syntax module
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean', 'code-block', 'link']
        ]  // Include button in toolbar
      },
      theme: 'snow'
    })
    window.editor = editor

    window.quillGetHTML = function() {
      const inputDelta = editor.getContents()
      var tempQuill=new Quill(document.createElement("div"));
      tempQuill.setContents(inputDelta);
      return tempQuill.root.innerHTML;
    }


  })

  $: if(foreground && editor){ editor.focus() }


  const linkHighlighter = new LinkHighlighter(Quill, (number, value) => {
    if(!(number in $book.entities)){
      bookRaw.entities[String(number)] = { "data": "<p></p>" }
      book.refresh()
    }
    currentEntity.set(number)
  })

  let displayedEntity = ''
  $: {
    if(editor){
      const changedEntity = $currentEntity
      if( displayedEntity != ''){
        linkHighlighter.stopHighlighting(editor)
        linkHighlighter.highlight(editor, false)
        bookRaw.entities[displayedEntity].data = editor.root.innerHTML
      }
      displayedEntity = $currentEntity
      editor.setContents([])
      if(displayedEntity != ''){
        editor.clipboard.dangerouslyPasteHTML(0, bookRaw.entities[displayedEntity].data)

        linkHighlighter.highlight(editor, true)
        linkHighlighter.startHighlighting(editor)
        book.refresh()
      }
    }
  }
</script>

<div class="editor-container" style={foreground ? 'z-index: 2000;' : ''}>
  <div id="text-editor" style="border: none; font-size: 115%;">
  </div>
</div>
