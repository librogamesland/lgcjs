<script>
  import { onMount, tick } from 'svelte'
  import { _ } from 'svelte-i18n'
  import * as editor from '../javascript/editor/index.js'

  export let foreground = false

  const setTooltip = (bClass, cTooltip) => {
    const el = document.querySelector(`.editor-container button.${bClass}`)
    const tooltip = $_(`editor.buttons.${cTooltip}`)
    if(!el) return
    el.setAttribute('title', tooltip)
    el.setAttribute('aria-label', tooltip)
  }

  const setTooltips = () => {
    setTooltip('ql-bold','bold')
    setTooltip('ql-italic','italic')
    setTooltip('ql-underline','underline')
    setTooltip('ql-align','left')
    setTooltip('ql-align[value="center"]','right')
    setTooltip('ql-align[value="right"]','center')
    setTooltip('ql-align[value="justify"]','justify')
    setTooltip('ql-clean','clean')
  }

  onMount(async () => {
    await tick()
    editor.mount('#text-editor')
    await tick()
    setTooltips()
  })

  _.subscribe( () => setTooltips())

//  $: if (foreground) editor.focus()
</script>

<div class="editor-container" style={foreground ? 'z-index: 2000;' : ''}>
  <div id="text-editor" style="border: none; font-size: 115%;" />
</div>

<style>
:global(.editor-container button){
  padding: 0px !important;
  margin: 8px !important;
}

:global(.editor-container .ql-formats:last-child){
  margin: 0px !important;
}


  @media only screen and (max-width: 440px) {
    :global(.editor-container button){
      margin: 8px 6.2px !important;
    }
  }

  @media only screen and (max-width: 403px) {
    :global(.editor-container button){
      margin: 8px 5.2px !important;
    }
    :global(.editor-container .ql-toolbar){
      padding: 8px 6px !important;
    }
  }

  @media only screen and (max-width: 368px) {
    :global(.editor-container button){
      padding: 0px !important;
      margin: 8px 4.3px !important;
    }
  }

</style>
