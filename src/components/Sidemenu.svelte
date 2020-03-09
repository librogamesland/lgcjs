<script>
  import Tabbar from './Tabbar.svelte'
  import ActionButtons from './ActionButtons.svelte'

  import { currentEntity, book } from '../store/book.js'
  import { showCode } from '../store/settings.js'

  $: chapterList = Object.keys($book.entities).filter(
    k => !$book.entities[k].type || $book.entities[k].type === 'chapter'
  )
  $: sectionList = Object.keys($book.entities).filter(
    k => $book.entities[k].type === 'section'
  )

  const open = entity => {
    foreground = false
    currentEntity.set(entity)
  }

  export let foreground = false
  const tabs = {
    book: 'Libro',
    ...($showCode && { code: 'Code' }),
  }
</script>

<style>
  b {
    margin-left: 10px;
    color: #555;
  }

  section {
    flex-grow: 0;
    flex-basis: auto;
    width: 200px;
  }

  section > div {
    overflow-y: scroll;
    height: 100%;
    padding-bottom: 5rem;
    box-sizing: border-box;
  }

  @media only screen and (max-width: 550px) {
    section.foreground {
      z-index: 10000;
    }

    section {
      flex-grow: 1;
      flex-basis: auto;
      width: auto;
    }
  }

  p {
    cursor: pointer;
    box-sizing: border-box;
    padding: 0.3rem;
    padding-left: 1rem;
    margin: 0;
  }

  p:hover {
    background-color: #eee;
  }

  p.selected {
    background-color: #cbdcf2;
  }

  h1 {
    font-weight: 700;
    font-size: 1rem;
    box-sizing: border-box;
    padding: 0.6rem;
    padding-top: 1.3rem;
    padding-left: 1rem;
    margin: 0;
  }
</style>

<section class:foreground>
  <ActionButtons bind:foreground />
  <div>
    <h1>Chapters</h1>
    {#each chapterList as entity}
      <p
        class:selected={entity == $currentEntity}
        on:click={() => open(entity)}>
        {entity}
        <b>{$book.entities[entity].title || ''}</b>
        {#each $book.entities[entity].flags || [] as flag}
          <img src={`./static/flags/${flag}.png`} />
        {/each}
      </p>
    {/each}
    <h1>Sections</h1>
    {#each sectionList as entity}
      <p
        class:selected={entity == $currentEntity}
        on:click={() => open(entity)}>
        {entity}
        <b>{$book.entities[entity].title || ''}</b>
      </p>
    {/each}
  </div>
</section>
