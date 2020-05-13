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
    setTooltip('ql-quicklink','quicklink')
  }

  onMount(async () => {
    await tick()
    editor.mount('#text-editor-toolbar', '#text-editor')
    await tick()
    setTooltips()
  })

  _.subscribe( () => setTooltips())

  const handleKeydown = function(e) {
      if (e.ctrlKey) {
        const key = String.fromCharCode(e.keyCode).toUpperCase()
        if(key === 'L'){
          document.querySelector('.ql-quicklink').click()
          e.stopPropagation()
          e.stopImmediatePropagation()
          e.preventDefault()

        }
      }
      return false
  }
//  $: if (foreground) editor.focus()
</script>

<svelte:window on:keydown={handleKeydown}/>



<div class="editor-container" style={foreground ? 'z-index: 2000;' : ''}>
  <div id="text-editor-toolbar">
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-align" value=""></button>
      <button class="ql-align" value="center"></button>
      <button class="ql-align" value="right"></button>
      <button class="ql-align" value="justify"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-clean" value=""></button>
      <button class="ql-quicklink">
        <div>&lbrace;L&rbrace;</div>
      </button>
    </span>
  </div>
  <div id="text-editor" style="border: none; font-size: 115%;" />
</div>

<style>
:global(.ql-quicklink > div){
  font-size: 20px ;
  margin-top:-3px;
  color: #505050;
  font-weight:600;
}
:global(.ql-quicklink:hover > div){
  color: #006ad4;
}
@media only screen and (max-width: 600px) {
  :global(.ql-toolbar.ql-snow .ql-formats) {
    margin-right: 5px;
  }
}

@media only screen and (max-width: 440px) {
  :global(.ql-toolbar.ql-snow .ql-formats) {
    margin-right: 3px;
  }
}

:global(.editor-container button){
  padding: 0px !important;
  margin: 8px !important;
}

:global(.editor-container .ql-formats:last-child){
  margin: 0px !important;
}


  @media only screen and (max-width: 440px) {
    :global(.editor-container button){
      margin: 8px 5.2px !important;
    }
  }

  @media only screen and (max-width: 403px) {
    :global(.editor-container button){
      margin: 8px 4px !important;
    }
    :global(.editor-container .ql-toolbar){
      padding: 8px 6px !important;
    }
  }

  @media only screen and (max-width: 368px) {
    :global(.editor-container button){
      padding: 0px !important;
      margin: 8px 3.8px !important;
    }
  }

  :global(.editor-container button.ql-quicklink){
    margin-right: 0px !important;
  }
</style>
