<script>
  import lgcdev from '../javascript/lgcdev'
  import Tabbar from './Tabbar.svelte'
  import { onMount, tick } from 'svelte'
  import { _ } from 'svelte-i18n'
  import itemplate from '../emulator/template.htm'

  let iframe = null
  const refreshIFrame = async () => {
    if(lgcdev){
      iframe.src = await lgcdev.appURL
      return
    }
    iframe.contentDocument.open()
    iframe.contentDocument.write(itemplate)
    iframe.contentDocument.close()
  }

  onMount(() => {
    refreshIFrame()
  })

  const tabs = {
    emulator: 'Emulator',
    status: 'Status',
    console: 'Console',
  }

  const refresh = () => {
    const src = iframe.src
    iframe.src = ''
    iframe.src = src
  }

  let zoom = 3
  const zoomPlus = () => {
    if(++zoom > 6) zoom = 6
  }
  const zoomMinus = () => {
    if(--zoom < 0) zoom = 0
  }

  const sendMsg = (msg) => {
    iframe.contentWindow.postMessage(msg, "*")
  }
</script>

<section class="devpanel">
  <Tabbar {tabs} />
  <div class="iframe-wrap">
    <iframe class={"zoom-" + zoom } title="emulator" bind:this={iframe} />
  </div>
  <div class="devtools">
  <button on:click={zoomMinus}> - </button>
  <button on:click={zoomPlus}> + </button>
  <button on:click={refresh}>refresh</button>
  <button on:click={() => sendMsg('msg1')}>msg1</button>
  <button on:click={() => sendMsg('msg2')}>msg2</button>
  <button on:click={() => sendMsg('msg3')}>msg3</button>
  <button on:click={() => sendMsg('msg4-' + window.prompt())}>msg4</button>

  </div>
</section>

<style>
  :global(.devpanel iframe) {
    border: 0px;
  }

  section {
    flex-grow: 1.5;
    flex-basis: 0;
  }

  .iframe-wrap{
    padding: 0; overflow: hidden;
    width: 100%;
    margin-top: 13px;
    width: 225px;
    height: 400px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    resize: both;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);

  }

  /* Zoom
    0 - 50%
    1 - 75%
    2 - 85%
    3 - 100%
    4 - 110%
    5 - 125%
    6 - 150%
  */

  iframe.zoom-0 {
    width: 200%;
    height: calc(200% - 5px);
    -ms-zoom: 0.50;
    -moz-transform: scale(0.50);
    -moz-transform-origin: 0 0;
    -o-transform: scale(0.50);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(0.50);
    -webkit-transform-origin: 0 0;
  }

  iframe.zoom-1 {
    width: 133.333%;
    height: calc(133.333% - 5px);
    -ms-zoom: 0.75;
    -moz-transform: scale(0.75);
    -moz-transform-origin: 0 0;
    -o-transform: scale(0.75);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(0.75);
    -webkit-transform-origin: 0 0;
  }

  iframe.zoom-2 {
    width: 117.647%;
    height: calc(117.647% - 5px);
    -ms-zoom: 0.85;
    -moz-transform: scale(0.85);
    -moz-transform-origin: 0 0;
    -o-transform: scale(0.85);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(0.85);
    -webkit-transform-origin: 0 0;
  }

  iframe.zoom-3 {
    width: 100%;
    height: calc(100% - 5px);

    /* Nothing! */
  }

  iframe.zoom-4 {
    width: 90.9090%;
    height: calc(90.9090% - 5px);
    -ms-zoom: 1.10;
    -moz-transform: scale(1.10);
    -moz-transform-origin: 0 0;
    -o-transform: scale(1.10);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(1.10);
    -webkit-transform-origin: 0 0;
  }

  iframe.zoom-5 {
    width: 80%;
    height: calc(80% - 5px);
    -ms-zoom: 1.25;
    -moz-transform: scale(1.25);
    -moz-transform-origin: 0 0;
    -o-transform: scale(1.25);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(1.25);
    -webkit-transform-origin: 0 0;
  }

  iframe.zoom-6 {
    width: 66.6667%;
    height: calc(66.6667% - 5px);
    -ms-zoom: 1.50;
    -moz-transform: scale(1.50);
    -moz-transform-origin: 0 0;
    -o-transform: scale(1.50);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(1.50);
    -webkit-transform-origin: 0 0;
  }

</style>
