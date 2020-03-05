<script>
  import { dialogStore } from '../utils/dialogs.js'


  /* Dialog info,
  */
  let dialog, callback, params

  // Entity input bindings
  let key, type, group, title

  dialogStore.subscribe( (value) => {
    // Retrieve basic info
    ;({dialog, callback, params} = value)
    // Bind inputs if required
    if(dialog == 'entity'){
      key = params.key
      ;({type, group, title} = params.props)
    }
  })


</script>

{#if dialog}
  <div class="dialog-mask"/>
  <div class="dialog-container">
    {#if dialog === 'alert'}
    <div>
      <h3>{params.title} </h3>
      <p>{params.text}</p>
      <button autofocus class="ok" on:click={ () => callback(true)}>Ok</button>
    </div>
    {:else if dialog === 'confirm'}
    <div>
      <h3>{params.title} </h3>
      <p>{params.text}</p>
      <button autofocus class="ok"     on:click={ () => callback(true)}>Ok</button>
      <button class="cancel" on:click={ () => callback(false)}>Cancel</button>
    </div>
    {:else if dialog === 'entity'}
    <div>
      <h3>{params.title} </h3>
      <p><span class="min">Name </span><input
        bind:value={key}
        type='text'
      ></p>
      <p><span class="min">Type </span><input
        bind:value={type}
        type='text'
      ></p>
      <p><span class="min">Group </span><input
        bind:value={group}
        type='text'
      ></p>
      <p><span class="min">Title </span><input
        bind:value={title}
        type='text'
      ></p>
      <button autofocus class="ok"     on:click={ () => callback({key, obj: {type, group, title}})}>Ok</button>
      <button class="cancel" on:click={ () => callback({}) }>Cancel</button>
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
