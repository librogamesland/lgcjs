<script>
  import {openedDialog, openedCallback, title, text,
            eName, eType, eGroup, eTitle} from '../utils/dialogs.js'

  let entityName = ''
  let entityType = ''
  let entityGroup = ''
  let entityTitle = ''

  $: {
    entityName  = $eName
    entityType  = $eType
    entityGroup = $eGroup
    entityTitle = $eTitle
  }

  const returnEntity = () => openedCallback({
    name: entityName,
    type: entityType,
    group: entityGroup,
    title: entityTitle,
  })
</script>
{#if $openedDialog}
  <div class="dialog-mask"/>
  <div class="dialog-container">
    {#if $openedDialog === 'alert'}
    <div>
      <h3>{$title} </h3>
      <p>{$text}</p>
      <button class="ok"     on:click={ () => openedCallback()}>Ok</button>
    </div>
    {:else if $openedDialog === 'confirm'}
    <div>
      <h3>{$title} </h3>
      <p>{$text}</p>
      <button class="ok"     on:click={ () => openedCallback(true)}>Ok</button>
      <button class="cancel" on:click={ () => openedCallback(false)}>Cancel</button>
    </div>
    {:else if $openedDialog === 'entity'}
    <div>
      <h3>{$title} </h3>
      <p><span class="min">Name </span><input
        bind:value={entityName}
        type='text'
      ></p>
      <p><span class="min">Type </span><input
        bind:value={entityType}
        type='text'
      ></p>
      <p><span class="min">Group </span><input
        bind:value={entityGroup}
        type='text'
      ></p>
      <p><span class="min">Title </span><input
        bind:value={entityTitle}
        type='text'
      ></p>
      <button class="ok"     on:click={returnEntity}>Ok</button>
      <button class="cancel" on:click={ () => openedCallback(false)}>Cancel</button>
    </div>
    {/if}
  </div>
{/if}
<style>
  h3 {
    margin-left: 10px;
  }
  span.min {
    min-width: 100px;
    display: inline-block;
  }
  :global(.dialog-mask){
    display: block;
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    width:  100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
  }

  :global(.dialog-container) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    width:  100vw;
    height: 70vh;
    background-color: transparent;
  }

  .dialog-container > div {
    padding: 0.6rem 2rem 1.3rem 2rem;
    border-radius: 6px;
    box-sizing: border-box;
    min-height: 200px;
    background-color: #fff;
    opacity: 1;
  }

  button {
    border: 0;
    box-sizing:border-box;
    height: 2.5rem;
    font-size: 1rem;
    padding: 0 1.5rem;
    margin: 0.5rem 0.6rem;
    margin-left: 0;
    border-radius: 4px;
  }

  button:hover {
    opacity: 0.7;
  }

  button.ok {
    background-color: #4670a6;
    color: white;
  }


</style>
