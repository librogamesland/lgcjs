<script>
  import { _ } from 'svelte-i18n'

  import Tabbar from './Tabbar.svelte'
  import ActionButtons from './ActionButtons.svelte'

  import { currentEntity, book } from '../javascript/store/book.js'
  import { showCode } from '../javascript/store/settings.js'


  function isNaturalNumber(n) {
      n = n.toString(); // force the value incase it is not
      var n1 = Math.abs(n), n2 = parseInt(n, 10);
      return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  $: chapterList = Object.keys($book.entities).filter(
    k => !$book.entities[k].type && isNaturalNumber(k)
  )
  $: sectionList = Object.keys($book.entities).filter(
    k => !$book.entities[k].type && !isNaturalNumber(k)
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

<div
  class={`mask ${foreground ? 'foreground' : ''}`}
  on:click={() => foreground = false}
/>
<section class:foreground>
  <ActionButtons bind:foreground />
  <div>
    <h1>{$_('sidemenu.chapters')}</h1>
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
    <h1>{$_('sidemenu.sections')}</h1>
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

<style>
  section {
    user-select: none;
  }

  b {
    margin-left: 10px;
    color: #555;
  }

  input {
    flex: 0 0 auto;
    height: 41px;
    box-sizing: border-box;
    padding-left: 10px;
    border: 0;
    border-bottom: 1px solid #cccccc;
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

  div.mask {
    display: none;
  }

  @media only screen and (max-width: 550px) {
    div.mask.foreground {
      display: block;
      position: fixed;
      z-index: 9900;
      top: 0;
      width: 100vw;
      height: 100vh;
      left: 0;
      background-color: black;
      opacity: 0.3;
      padding: 0;
      margin: 0;
      border: 0;
    }

    section {
      opacity: 0;
      transition: opacity 0.2s,  transform 0.2s;
      position: fixed;
      z-index: 10000;
      top: 0;
      bottom: 0;
      left: 0;
      padding: 7px;
      box-sizing: border-box;
      height: 100vh;
      width: calc(100vw - 50px);
      max-width: 250px;
      transform: translateX(-250px);
    }
    section.foreground {
      opacity: 1;
      display: flex;
      transform: translateX(0);
    }

    p {
      padding: 0.8rem 0.6rem !important;
      border-radius: 4px;
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
