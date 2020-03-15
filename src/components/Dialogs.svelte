<script>
  import { _ } from 'svelte-i18n'
  import { dialogStore } from '../utils/dialogs.js'


  $: ok     = $_('dialogs.ok')
  $: cancel = $_('dialogs.cancel')

  /* Dialog info,
   */
  let dialog, callback, params

  // Entity input bindings
  let dialogTitle
  let key, type, group, title, flags
  const filterFlags = () => Object.keys(flags).filter(key => flags[key])

  dialogStore.subscribe(value => {
    // Retrieve basic info
    ;({ dialog, callback, params } = value)

    // Bind inputs if required
    if (dialog == 'entity') {
      key = params.key
      ;({ type, group, title } = params.props)
      const flagProps = params.props.flags || []
      flags = {
        final: flagProps.includes('final'),
        fixed: flagProps.includes('fixed'),
        death: flagProps.includes('death'),
      }
    }
  })
</script>

{#if dialog}
  <div class="dialog-mask" />
  <div class="dialog-container">
    {#if dialog === 'alert'}
      <div>
        <h3>{$_(params.title)}</h3>
        <p>{$_(params.text)}</p>
        <button autofocus class="ok" on:click={() => callback(true)}>{ok}</button>
      </div>
    {:else if dialog === 'confirm'}
      <div>
        <h3>{$_(params.title)}</h3>
        <p>{$_(params.text)}</p>
        <button autofocus class="ok" on:click={() => callback(true)}>{ok}</button>
        <button class="cancel" on:click={() => callback(false)}>{cancel}</button>
      </div>
    {:else if dialog === 'entity'}
      <div>
        <h3>{$_(params.title)}</h3>
        <p>
          <span class="min">{$_('dialogs.entity.name')}</span>
          <input bind:value={key} type="text" />
        </p>
        <p>
          <span class="min">{$_('dialogs.entity.type')}</span>
          <input bind:value={type} type="text" />
        </p>
        <p>
          <span class="min">{$_('dialogs.entity.group')}</span>
          <input bind:value={group} type="text" />
        </p>
        <p>
          <span class="min">{$_('dialogs.entity.title')}</span>
          <input bind:value={title} type="text" />
        </p>
        {#if !type || type === 'chapter'}
          <div class="flags">
            {#each ['final', 'fixed', 'death'] as flag}
              <div
                class:selected={flags[flag]}
                on:click={() => (flags[flag] = !flags[flag])}>
                <img src={`./static/flags/${flag}.png`} />
              </div>
            {/each}
          </div>
        {/if}
        <button
          autofocus
          class="ok"
          on:click={() => callback({
              key,
              obj: { type, group, title, flags: filterFlags() },
            })}>
          {ok}
        </button>
        <button class="cancel" on:click={() => callback({})}>{cancel}</button>
      </div>
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

  .flags > div:hover {
    background-color: #ddd;
  }

  .flags > div.selected {
    background-color: #cbcbcb;
  }

  img {
    box-sizing: border-box;
    margin-top: calc((2.5rem - 20px) / 2);
  }

  h3 {
    margin-left: 10px;
  }
  span.min {
    min-width: 100px;
    display: inline-block;
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
    background-color: #fff;
    opacity: 1;
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
  }

  button:hover {
    opacity: 0.7;
  }

  button.ok {
    background-color: #4670a6;
    color: white;
  }
</style>
