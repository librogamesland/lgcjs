<script>
  // Import components
  import { Dialogs, Navbar, Sidemenu, Editor,  DevPanel, } from './components/*.svelte'

  // Component state
  import { bookName } from './javascript/store/book.js'
  import { showCode } from './javascript/store/settings.js'
  let showSidemenu = false
</script>

<svelte:head>
  {#if !(/bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i
    .test(navigator.userAgent))}
  <title>{$bookName}</title>
  {/if}
</svelte:head>


<Dialogs />
<Navbar bind:showSidemenu />
<main class:resize={!$showCode}>
  <Sidemenu bind:foreground={showSidemenu} />
  <Editor />
  {#if $showCode}
    <DevPanel />
  {/if}
</main>

<style>
  :global(body, html) {
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    margin: 0;
    padding: 0;
    height: 100%;
    color: black;
  }

  :global(main) {
    height: 0;
    flex-grow: 1;
    padding: 2.5px;
    padding-bottom: 1.3rem;
    display: flex;
    background-color: var(--color-background, #bbcee8);
    box-sizing: border-box;
  }

  :global(main > *) {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 3px;
    border-radius: 2px;
    border: 1px solid grey;
    background-color: var(--color-section, #fff);
  }

  @media only screen and (min-width: 1150px) {
    :global(main.resize) {
      width: 100vw;
      padding-left: 7vw;
      padding-right: 9vw;
    }
  }

  @media only screen and (max-width: 680px) {
    :global(main) {
      display: grid;
      grid-template-rows: 100%;
    }

    :global(main > *) {
      grid-area: 1 / 1;
    }
  }
</style>
