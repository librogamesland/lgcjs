<script>
  import { onMount, tick } from 'svelte'
  import * as editor from '../javascript/editor/index.js'

  export let foreground = false

  onMount(async () => {
    await tick()
    editor.mount('#text-editor')
  })

//  $: if (foreground) editor.focus()
</script>

<div class="editor-container" style={foreground ? 'z-index: 2000;' : ''}>
  <div id="text-editor" style="border: none; font-size: 115%;" />
</div>

<style>
  @media only screen and (max-width: 550px) {
    :global(.editor-container button){
      padding: 0px !important;
      margin: 7px !important;
    }
  }

</style>
