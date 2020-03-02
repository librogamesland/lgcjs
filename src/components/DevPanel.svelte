<script>
  import Tabbar from './Tabbar.svelte'
  import {onMount, tick} from 'svelte'
  import { _ } from 'svelte-i18n'
  import itemplate from '../emulator/template.htm'

  let iframe = null
  const refreshIFrame = () => {
    iframe.contentDocument.open()
    iframe.contentDocument.write( itemplate)
    iframe.contentDocument.close()

  }

  onMount( () => {
    refreshIFrame()
  })

  const tabs = {
    emulator: 'Emulator',
    status: 'Status',
    console: 'Console'
  }
</script>
<section class="devpanel">
  <Tabbar {tabs}/>

  <iframe title="emulator" bind:this={iframe}/>
</section>


<style>
:global(.devpanel iframe){
    margin-top: 40px;
    width: 225px;
    height: 400px;
    border: 1px #ddd solid;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    margin-left: calc((100% - 225px)/ 2);
}

section{
  flex-grow: 1;
  flex-basis: 0;
}
</style>
