<script>
  import Tabbar from './Tabbar.svelte'

  import {test1} from '../book/tests.js'
  import { encode, decode } from '../utils/xlgcParser.js'
  import { chapterList } from '../store/book.js'
  console.log(decode(test1))

  let c = chapterList
  $: console.log($c)

  const tabs = {
    book: 'Libro',
    code: 'Code'
  }



  let selected = '1'
</script>

<section class="sidemenu">
  <Tabbar {tabs}/>
  <div class="sidemenu-container">
  <h1>{$c}</h1>
    <h1>Paragrafi</h1>
    {#each [...Array(400).keys()] as number }
      <div
      class={number == selected ? 'selected' : ''}
      on:click={ () => selected = number}
      >{number}</div>
    {/each}
    <h1>Sezioni</h1>
    <div>intro</div>
    <div>rules</div>
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
