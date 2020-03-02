<script>
  import Tabbar from './Tabbar.svelte'

  import { encode, decode } from '../utils/xlgcParser.js'
  import { currentEntity, chapterList, sectionList } from '../store/book.js'
  import { showCode } from '../store/settings.js'

  export let foreground = false
  const tabs = {
    book: 'Libro',
    ...($showCode && {"code" : "Code"})
  }

  const open = (entity) => {
    foreground = false
    currentEntity.set(entity)
  }
</script>

<section class="sidemenu" class:foreground={foreground}>
  <Tabbar {tabs}/>
  <div class="sidemenu-container">
    <h1>Paragrafi</h1>
    {#each $chapterList as entity }
      <div
      class:selected={entity == $currentEntity}
      on:click={ () => open(entity)}
      >{entity}</div>
    {/each}
    <h1>Sezioni</h1>
    {#each $sectionList as entity }
      <div
      class:selected={entity == $currentEntity}
      on:click={ () => open(entity)}
      >{entity}</div>
    {/each}
  </div>
</section>

<style>

:global(.sidemenu-container){
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 5rem;
  box-sizing: border-box;
}
:global(section.sidemenu){
  flex-grow: 0;
  flex-basis: auto;
  width: 200px;
}

@media only screen and (max-width: 740px) {
  :global(section.sidemenu){
    width: 160px;
  }
}

@media only screen and (max-width: 550px) {
  :global(.sidemenu.foreground){
    z-index: 10000;
  }

  :global(section.sidemenu){
    flex-grow: 1;
    flex-basis: auto;
    width: auto;
  }
}

:global(.sidemenu-container div){
  box-sizing: border-box;
  padding: 0.3rem;
  padding-left: 1rem;
}

:global(.sidemenu-container div:hover){
  background-color: #eee;
}

:global(.sidemenu-container div.selected){
  background-color: #cbdcf2;
}

:global(.sidemenu-container h1){
  font-weight: 700;
  font-size: 1rem;
  box-sizing: border-box;
  padding: 0.6rem;
  padding-top: 1.3rem;
  padding-left: 1rem;
  margin: 0;
}
</style>
