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
    setTooltip('ql-firstlink','firstlink')
    setTooltip('ql-quicklink','quicklink')
  }

  const mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };



  onMount(async () => {
    await tick()
    editor.mount('#text-editor-toolbar', '#text-editor')
    await tick()
    setTooltips()
    if(mobileAndTabletCheck()){
      document.querySelector('.ql-editor').setAttribute("autocomplete", 'off')
      document.querySelector('.ql-editor').setAttribute("autocorrect", 'off')
      document.querySelector('.ql-editor').setAttribute("autocapitalize", 'on')
      document.querySelector('.ql-editor').setAttribute("spellcheck", 'false')
    }
  })

  _.subscribe( () => setTooltips())

  const handleKeydown = function(e) {
      if (e.ctrlKey) {
        const key = String.fromCharCode(e.keyCode).toUpperCase()
        if(key === 'K'){
          document.querySelector('.ql-firstlink').click()
        }else if(key === 'L'){
          document.querySelector('.ql-quicklink').click()
        }else{ return }
        e.stopPropagation()
        e.stopImmediatePropagation()
        e.preventDefault()
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
      <button class="ql-clean"></button>
      <button class="ql-firstlink" style="width: auto;">
        <div>&lbrace;<span class="icon-flash" style="width:10px;"/>&rbrace;</div>
      </button>
      <button class="ql-quicklink">
        <div>&lbrace;L&rbrace;</div>
      </button>
    </span>
  </div>
  <div id="text-editor" style="border: none; font-size: 115%;" />
</div>

<style>
:global(.ql-firstlink > div, .ql-quicklink > div){
  font-size: 20px ;
  margin-top:-3px;
  color: #505050;
  font-weight:600;
}
:global(.ql-firstlink:hover > div, .ql-quicklink:hover > div){
  color: #006ad4;
}

@media only screen and (max-width: 440px) {
  :global(.ql-clean){
    display: none !important;
  }
}

:global(.ql-firstlink .icon-flash::before){
  margin: 0.1em;
  width: auto;
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
