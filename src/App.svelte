<script>
  import { Dialogs, Navbar, Sidemenu, Editor, DevPanel } from './components/*.svelte';
  import { addMessages, init } from 'svelte-i18n'
  import { showCode } from './store/settings.js'

  let showSidemenu = false

  import en from "./languages/en.toml"
  addMessages('en', en)
  init({
    fallbackLocale: 'en',
    initialLocale: 'en',
  })

</script>
<style>
:global(body, html) {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  margin: 0;
  padding: 0;
  height: 100%;
}

:global(main){
  flex-grow: 1;
  padding: 2.5px;
  padding-bottom: 1.6rem;
  display: flex;
  background-color: var(--color-background, #bbcee8);
  box-sizing: border-box;
}

:global(main > *){
  display: flex;
  flex-direction:column;
  box-sizing: border-box;
  margin:3px;
  border-radius: 2px;
  border: 1px solid grey;
  background-color: var(--color-section, #fff);
}



@media only screen and (min-width: 970px) {
  :global(main.resize){
    width: 100vw;
    padding-left: 7vw;
    padding-right: 9vw;
  }
}

@media only screen and (max-width: 550px) {
  :global(main){
    display: grid;
  }

  :global(main > *){
    grid-area: 1 / 1;
  }
}
</style>

<Dialogs/>
<Navbar bind:showSidemenu={showSidemenu}/>

<main class:resize={!$showCode}>
  <Sidemenu bind:foreground={showSidemenu}/>
  <Editor/>
  {#if $showCode}
    <DevPanel/>
  {/if}
</main>
