<script>
  import { Navbar, Sidemenu, Editor, DevPanel } from './components/*.svelte';
  import { addMessages, init } from 'svelte-i18n'

  import en from "./languages/en.toml"
  addMessages('en', en)
  init({
    fallbackLocale: 'en',
    initialLocale: 'en',
  })

</script>
<style>
:global(body, html) {
  overflow-y: hidden;
  margin: 0;
  padding: 0;
}

:global(main){
  height: calc(100vh - 2.3rem);
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

</style>
<Navbar/>

<main>
  <Sidemenu/>
  <Editor/>
  <DevPanel/>
</main>
