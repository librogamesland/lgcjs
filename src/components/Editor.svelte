<script>
import Tabbar     from './Tabbar.svelte'
import TextEditor from './TextEditor.svelte'
import CodeEditor from './CodeEditor.svelte'
import { currentEntity, bookRaw } from '../store/book.js'
import { showCode } from '../store/settings.js'

$: tabs = {
  "text" : $currentEntity == '' ?
    '' : `${$currentEntity}   ${bookRaw.entities[$currentEntity].title || ''}`,
  ...($showCode && {"code" : "CodeEditor"})
}

let active='text'
</script>

<section class="editor">
  <Tabbar {tabs} bind:active={active}/>
  <TextEditor foreground={active === 'text'}/>
  <CodeEditor foreground={active === 'code'}/>
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
  overflow-y: hidden;
  flex-grow: 1;
  flex-basis: 0;
}

:global(#code-editor, .editor-container){
  grid-area: 2 / 1;
  background-color: #fff;
}

:global(.editor-container .ql-toolbar){
  border: 0 !important;
  border-bottom: 1px solid #ccc !important;
}
</style>
