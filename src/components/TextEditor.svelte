<script>
  import { onMount, tick } from 'svelte'
  import LinkHighlighter from '../utils/linkHighlighter.js'

  export let foreground = false
  let editor =null

  const linkHighlighter = new LinkHighlighter(Quill, (number,value) => {
    console.log(`a${number}bc${value}d`)
  })
  window.linkHighlighter = linkHighlighter
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
</script>

<div class="editor-container" style={foreground ? 'z-index: 2000;' : ''}>
  <div id="text-editor">
    <p>Hello World!</p>
    <p>{'{link 10:2}'} ssdsfsvfsv</p>
    <pre>cdscdsds</pre>
  </div>
</div>
