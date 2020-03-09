<script>
  import { onMount, tick } from 'svelte'

  export let foreground = false
  const fontSize = '18px'
  let editor = null

  onMount(async () => {
    await tick()
    editor = ace.edit('code-editor')
    editor.setOptions({
      fontSize,
      tabSize: 2,
      useSoftTabs: true,
    })
    editor.setTheme('ace/theme/xcode')
    editor.session.setMode('ace/mode/javascript')
  })

  $: if (foreground && editor) {
    editor.focus()
  }
</script>

<div
  id="code-editor"
  style={`font-size:${fontSize}; ${foreground ? 'z-index: 2000;' : ''}`}>
  {`
if(highlight){
  console.log("highlight is working!")
}`}
</div>
