<script>
  import Tabbar from './Tabbar.svelte'
  import TextEditor from './TextEditor.svelte'
  import { currentEntity, book } from '../javascript/store/book.js'
  import { showCode } from '../javascript/store/settings.js'

  // Editor tabs
  let active = 'text'
  $: tabs = {
    text:
      $currentEntity == ''
        ? ''
        : `${$currentEntity} ${
            $book.entities[$currentEntity].title
              ? ' - ' + $book.entities[$currentEntity].title
              : ''
          }`,
    ...($showCode && { code: 'CodeEditor' }),
  }
</script>

<style>
  /* Markup editor */
  :global(.editor todo) {
    font-weight: 600;
    background-color: #f1ceff;
  }

  :global(.editor lgcode) {
    /*background-color: #f5efef; */
    color: #9f0000;
    font-weight: 550;
    font-family: monospace, monospace;
  }
  :global(.editor a) {
    font-weight: 600;
  }

  /* Markup del componente */
  :global(section.editor) {
    flex-grow: 2;
    flex-basis: 0;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto 1fr;
  }
  :global(.editor-container) {
    display: flex;
    flex-direction: column;
  }

  :global(#text-editor) {
    overflow-y: auto;
    flex-grow: 1;
    flex-basis: 0;
    min-height: 70vh;
  }

  @media only screen and (max-height: 650px) {
    :global(#text-editor) {
      min-height: 60vh;
    }
  }

  @media only screen and (max-height: 400px) {
    :global(#text-editor) {
      min-height: 45vh;
    }
  }

  :global(#code-editor, .editor-container) {
    grid-area: 2 / 1;
    background-color: #fff;
  }

  :global(.editor-container .ql-toolbar) {
    border: 0 !important;
    border-bottom: 1px solid #ccc !important;
  }
</style>

<section class="editor">
  <Tabbar {tabs} bind:active />
  <TextEditor foreground={active === 'text'} />
</section>
