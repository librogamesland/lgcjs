<script context="module">
  import { writable } from 'svelte/store'
  import manifest from '../../package.json'

  /* Dialogs params & state
  
  
  */
  const dialogStore = writable({})
  const openDialog = store =>
    new Promise((resolve) =>
      dialogStore.set({
        callback(...args) {
          dialogStore.set({})
          resolve(...args)
        },
        ...store,
      })
    )
  export { dialogStore }
  
  const alert = (title, text) =>
    openDialog({
      dialog: 'alert',
      params: { title, text },
    })
  
  const confirm = (title, text) =>
    openDialog({
      dialog: 'confirm',
      params: { title, text },
    })
  
    const about = () =>
      openDialog({
        dialog: 'about',
        params: { title: '', text: '' },
      })
  
  const chapter = (title, key, value) =>
    openDialog({
      dialog: 'chapter',
      params: { title, key, value },
    })

  const img = (src) =>
    openDialog({
      dialog: 'img',
      params: { src },
    })
  
  export { alert, confirm, about, chapter, img }
  </script>

<script>
  import { _ } from 'svelte-i18n'
  import { tick } from 'svelte'


  $: ok     = $_('dialogs.ok')
  $: cancel = $_('dialogs.cancel')

  /* Dialog info,
   */
  let dialog, callback, params

  // Entity input bindings
  let key, title, flags
  const filterFlags = () => Object.keys(flags).filter(key => flags[key])

  dialogStore.subscribe( async(data) => {
    // Retrieve basic info
    ;({ dialog, callback, params } = data)

    // Bind inputs if required
    if (dialog == 'chapter') {
      key = params.key
      ;({ title } = params.value)
      const flagProps = params.value.flags || []
      flags = {
        final: flagProps.includes('final'),
        fixed: flagProps.includes('fixed'),
        death: flagProps.includes('death'),
      }
    }

    await tick();
    
    const button = document.querySelector('button.ok')
    if(button) button.focus()
  })
</script>

{#if dialog}
  <div class="dialog-mask" on:click={() => callback(false)}/>
  <div class="dialog-container" on:click|self={() => callback(false)}>
    {#if dialog === 'alert'}
      <div>
        <h3>{$_(params.title)}</h3>
        <p>{$_(params.text)}</p>
        <button class="ok" on:click={() => callback(true)}>{ok}</button>
      </div>
    {:else if dialog === 'confirm'}
      <div>
        <h3>{$_(params.title)}</h3>
        <p>{$_(params.text)}</p>
        <button class="ok" on:click={() => callback(true)}>{ok}</button>
        <button class="cancel" on:click={() => callback(false)}>{cancel}</button>
      </div>
    {:else if dialog === 'about'}
      <div class="about">
        <h3>Lgcjs - v. {manifest.version}</h3>
        <img src="./static/img/logo.png" alt="Lgcjs logo">
        <br>
        <p>{@html $_('about.text')}</p>
        <p>{$_('about.contact')}: <a target="_blank" rel="noopener" href="mailto:luc.fabbian@gmail.com?subject=Lgcjs%20-%20Segnalazione">luc.fabbian@gmail.com</a></p>
        <button class="ok" on:click={() => callback(true)}>{ok}</button>
      </div>
    {:else if dialog === 'chapter'}
      <div>
        <h3>{$_(params.title)}</h3>
        <div class="input">
          <p>{$_('dialogs.entity.name')}</p>
          <input bind:value={key} type="text" />
        </div>
        <div class="input">
          <p>{$_('dialogs.entity.title')}</p>
          <input bind:value={title} type="text" />
        </div>
        <div class="flags">
          {#each ['final', 'fixed', 'death'] as flag}
            <div
              class:selected={flags[flag]}
              on:click={() => (flags[flag] = !flags[flag])}>
              <img alt={flag} src={`./static/img/flags/${flag}.png`} />
            </div>
          {/each}
        </div>
        <button
          class="ok"
          on:click={() => callback({
              key,
              value: { ...params.value, title, flags: filterFlags() },
            })}>
          {ok}
        </button>
        <button class="cancel" on:click={() => callback(false)}>{cancel}</button>
      </div>
    {:else if dialog === 'img'}
    <span class="imgbox" on:click={() => callback(false)}>
      <img class="center-fit" src={params.src} alt="book graph"/>
    </span>
    {/if}
  </div>
{/if}


<style>
  .flags {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2.5rem;
    box-sizing: border-box;
    margin: 1rem 0;
    background-color: #f3f2f2;
    border: 1px solid #555;
  }

  .flags > div {
    box-sizing: border-box;
    flex: 1 0 auto;
    text-align: center;
    height: 100%;
    justify-content: center;
  }
  @media (hover: hover) {
    .flags > div:hover {
      background-color: #ddd;
    }
  }


  .flags > div.selected {
    background-color: #8a8a8a;
  }

  img {
    box-sizing: border-box;
    margin-top: calc((2.5rem - 20px) / 2);
  }

  h3 {
    margin-left: 10px;
  }
  
  .input {
    width: 100%;
    display: flex;
    align-items: center;
  }
  
  .input > input {
    height: 1rem;
    margin: 1rem 0;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
  } 

  .input > p {
    min-width: calc(40px + 4vw);
  } 


  :global(.dialog-mask) {
    display: block;
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
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
    width: 100vw;
    height: 70vh;
    background-color: transparent;
  }

  .dialog-container > div {
    padding: 0.6rem 2rem 1.3rem 2rem;
    border-radius: 6px;
    box-sizing: border-box;
    min-height: 200px;
    max-width: calc(100vw - 30px);
    background-color: #fff;
    opacity: 1;
  }

  .dialog-container > div.about {
    width: 440px;
    max-width: calc(100vw - 30px);
    text-align: center;
  }

  .dialog-container > div.about p {
    line-height: 1.4rem;
  }


  .dialog-container > div.about img {
    width: 200px;
    max-width: calc(100vw - 90px);
  }

  .dialog-container > div.about button {
    margin-right: 0;
  }

  button {
    border: 0;
    box-sizing: border-box;
    height: 2.5rem;
    font-size: 1rem;
    padding: 0 1.5rem;
    margin: 0.5rem 0.6rem;
    margin-left: 0;
    border-radius: 4px;
    cursor: pointer
  }

  button:hover {
    opacity: 0.7;
  }

  button.ok {
    background-color: #4670a6;
    color: white;
  }

  /* https://stackoverflow.com/questions/6169666/how-to-resize-an-image-to-fit-in-the-browser-window */
  .imgbox {
    display: grid;
    height: 100%;
    align-items: center;
  }
  .center-fit {
    max-width: 95%;
    max-height: 100vh;
    margin: auto;
  }


</style>
