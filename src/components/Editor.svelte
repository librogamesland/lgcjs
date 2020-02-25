<script>
import Tabbar     from './Tabbar.svelte'
import TextEditor from './TextEditor.svelte'
import CodeEditor from './CodeEditor.svelte'

  const tabs = {
    "esp1" : "CodeEditor",
    "esp2" : "TextEditor"
  }

  let active='esp2'
</script>

<section class="editor">
  <Tabbar {tabs} bind:active={active}/>
  <TextEditor foreground={active === 'esp2'}/>
  <CodeEditor foreground={active === 'esp1'}/>
</section>

<style>
:global(section.editor){
  flex-grow: 2;
  flex-basis: 0;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr;
}
:global(.editor-container){
  display: flex;
  flex-direction: column;
}

:global(#text-editor){
  height: auto !important;
  overflow-y: hidden;
  flex-grow: 1;
  flex-basis: 0;
}

:global(#code-editor, .editor-container){
  grid-area: 2 / 1;
  background-color: #fff;
}
</style>
