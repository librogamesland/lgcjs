<script>
  import { _ } from 'svelte-i18n'
  import {book, chapter} from '../javascript/book/data.js'

  import ActionButtons from './ActionButtons.svelte'

  let selectedGroup = 'allgroupidtag'
  $: groups = [...new Set(Object.values($book.chapters).map(value => value.group || ''))].filter(key => (key && key != ''))

  $: filterChapters = book.sortedKeys($book.chapters).filter( key => {
    if(!selectedGroup || selectedGroup == 'allgroupidtag') return true
    const group = $book.chapters[key].group
    return group && group == selectedGroup
  })

  $: {
    if(![...groups, 'allgroupidtag'].includes(selectedGroup)){
      selectedGroup = 'allgroupidtag'
    }
  }



  // Regex per matchare i link in markdown
  $: linksHere = book.linksTo($chapter.key)
  export let foreground = false

</script>

<div
  class={`mask ${foreground ? 'foreground' : ''}`}
  on:click={() => foreground = false}
/>


<aside class:foreground>
  <h1>{$_('sidemenu.chapters') + ':'}
    <span class="select-dropdown">
      <select bind:value={selectedGroup}>
        <option value="allgroupidtag">All</option>
        {#each groups as group}
          <option value={group}>{group}</option>
        {/each}
      </select>
    </span>
  </h1>
  <ActionButtons/>
  <ul class="chapters">
    {#each filterChapters as chapterKey}
    <li
      class:selected={chapterKey == $chapter.key}
      on:click={() => book.update(() => ({key: chapterKey}))}>
      {chapterKey}
      <b>{$book.chapters[chapterKey].title || ''}</b>
      {#each $book.chapters[chapterKey].flags || [] as flag}
        <img src={`./static/img/flags/${flag}.png`} alt={flag}/>
      {/each}
    </li>
    {/each}
  </ul>
  <h1>{$_("sidemenu.linkshere")} {$chapter.key}:</h1>
  <ul class="links-here">
    {#each linksHere as chapterKey}
    <li
      class:selected={chapterKey == $chapter.key}
      on:click={() => book.update(() => ({key: chapterKey}))}>
      {chapterKey}
      <b>{$book.chapters[chapterKey].title || ''}</b>
      {#each $book.chapters[chapterKey].flags || [] as flag}
        <img src={`./static/img/flags/${flag}.png`} alt={flag}/>
      {/each}
    </li>
    {/each}
  </ul>
</aside>

<style>
  aside {
    user-select: none;
    grid-area: sidebar;
    background-color: #ccc;
    padding: 0px 4vw;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }



  h1 {
    font-weight: 700;
    font-size: 1.3rem;
    box-sizing: border-box;
    padding: 0.6rem;
    padding-top: 1.8rem;
    padding-left: 0.6rem;
    margin: 0;
  }

  select {
    display: inline-block;
    font-size: 1rem;
    min-height: 1.3rem;
    line-height: 1.3rem;
  }

  b {
    margin-left: 10px;
    color: #111;
  }



  div.mask {
    display: none;
  }

  ul {
    overflow-y: auto;
    list-style-type: none;
    margin: 0px;
    padding: 0px;
    background-color: #fff;
    border: 1px solid #666;
  }

  .chapters {
    flex-grow: 1;
  }

  li {
    cursor: pointer;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    margin: 0;
  }

  li:nth-child(even) {
    background-color: rgb(245, 245, 245);
  }

  li:hover {
    background-color: #ddd;
  }

  li.selected {
    background-color: #64b3e1;
  }

  .links-here {
    height: 15vh;
    flex-shrink: 0;
  }

  @media only screen and (max-width: 680px) {
    div.mask.foreground {
      display: block;
      position: fixed;
      z-index: 9900;
      top: 0;
      width: 100vw;
      height: 100vh;
      left: 0;
      background-color: black;
      opacity: 0.5;
      padding: 0;
      margin: 0;
      border: 0;
    }

    aside {
      opacity: 0;
      transition: opacity 0.2s,  transform 0.2s;
      position: fixed;
      z-index: 10000;
      top: 0;
      bottom: 0;
      right: 0;
      box-sizing: border-box;
      height: 100vh;
      width: calc(90vw - 80px);
      max-width: 320px;
      transform: translateX(317px);
      background-color: rgb(209, 209, 209);
    }
    aside.foreground {
      opacity: 1;
      display: flex;
      transform: translateX(0);
    }

    h1 {
      color: #565656;
    }
  }

  @media (any-pointer: coarse) {
    li {
      padding: 1.1rem 0.6rem;
    }
  }
 
</style>
