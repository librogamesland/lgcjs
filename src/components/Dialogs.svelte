<script>
  import {openedDialog, openedCallback, title, text } from '../utils/dialogs.js'
</script>
{#if $openedDialog}
  <div class="dialog-mask"/>
  <div class="dialog-container">
    {#if $openedDialog === 'confirm'}
    <div>
      <h3>{$title} </h3>
      <p>{$text}</p>
      <button class="ok"     on:click={ () => openedCallback(true)}>Ok</button>
      <button class="cancel" on:click={ () => openedCallback(false)}>Cancel</button>
    </div>
    {/if}
  </div>
{/if}
<style>
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
    padding: 1.3rem 3rem 2rem 3rem;
    border-radius: 12px;
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
    margin: 0.5rem 1rem;
    margin-left: 0;
    border-radius: 4px;
  }

  button:hover {
    opacity: 0.7;
  }

  button.ok {
    background-color: #3978cd;
    color: white;
  }


</style>
