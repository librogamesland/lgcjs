<script>
  import { _ } from 'svelte-i18n'
  import { ctrlShortcuts } from '../javascript/shortcuts.js'
  import { book } from '../javascript/book/data.js';
  import { graphToImg } from '../javascript/graph.js'
  import { newBook, open, download } from '../javascript/file.js'
  import { encode } from '../javascript/formats/vuejs.js'
  // Dialogs
  import { dialog } from './Dialogs.svelte'
  import About      from './dialogs/About.svelte'
  import Confirm    from './dialogs/Confirm.svelte'
  import Img        from './dialogs/Img.svelte'



  encode(book)

  export let showSidemenu = false

  const newClick = async() => {
    if (await dialog(Confirm, $_('dialogs.confirm'),$_(`dialogs.text.new`))) newBook()
  }


  ctrlShortcuts({
    'N': () => newClick(),
    'S': () => download('md', book),
    'O': () => document.getElementById('open').click()
  })

 
</script>


<nav>
  <div>
    <h1>{$_('navbar.file.title')}</h1>
    <div class="content">
      <p on:click={newClick}>{$_('navbar.file.new')}</p>
      <input type="file" name="open" id="open"
        accept=".xlgc,.json,.md"
        on:change={e => open(e.target )} />
      <label for="open">{$_("navbar.file.open")} </label>
      <p on:click={() => download('md', book)}>{$_('navbar.file.save')}</p>
    </div>
  </div>

  <div>
    <h1>{$_('navbar.book.title')}</h1>
    <div class="content">
      <p on:click={async() => dialog(Img, await graphToImg(book))}>{$_('navbar.book.graph')}</p>
    </div>
  </div>

  <div>
    <h1>{$_('navbar.export.title')}</h1>
    <div class="content">
      <p>{$_('navbar.export.docx')}</p>
      <p>{$_('navbar.export.fodt')}</p>
      <p>{$_('navbar.export.json')}</p>
      <p>{$_('navbar.export.vuejs')}</p>
    </div>
  </div>

  <!-- Help -->
  <div>
    <h1>{$_('navbar.help.title')}</h1>
    <div class="content">
      <a href={'../guide/pdf/' + $_('navbar.help.guidefile')} target="_blank" rel="noopener">
        {$_('navbar.help.guide')}
      </a>
      <a href="http://www.librogame.net/index.php/forum/topic?id=5182&p=1#p148583" target="_blank" rel="noopener">
        {$_('navbar.help.forum')}
      </a>
      <p on:click={() => dialog(About)}>{$_('navbar.help.about')}</p>
    </div>
  </div>

  <div class="sidemenu-button">
    <span aria-label={$_('sidemenu.toggle')} class="dropbtn icon-menu"
      on:click={() => (showSidemenu = !showSidemenu)} />
  </div>
</nav>


<style>
  nav {
    grid-area: navbar;
    display: flex;
    flex-direction: row;
    background-color: #333;
    color: #fff;
    user-select: none;
    padding-left: calc(5.5vw - 24px);
    box-sizing: border-box;
  }

  .content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    color: black;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 20000;
  }

  h1, .dropbtn, .content > * {
    display: block;
    padding: 0.9rem calc(0.8rem + 1.5vw);
    font-size: 1.1rem !important;
    margin: 0;
    font-weight: normal;
    cursor: pointer;
  }

  @media (max-width: 450px){
    h1, .dropbtn, .content > * {
      padding: 1rem 3.6vw;
      font-size: 10px;
    }

    .content { min-width: calc(40px + 24vw);}

  }

  /*@media (any-pointer: coarse) {
    h1, .dropbtn, .content > * {
      padding-top: 0.9rem;
      padding-bottom: 0.9rem;
    }
  }*/


  .dropbtn { display: none;}
  @media only screen and (max-width: 680px) {
    .dropbtn { display: block;}
  }

  .content > * {
    background-color: #f9f9f9;
    color: black;
    text-decoration: none;
  }

  div:hover h1, div:hover .dropbtn{
    background-color: #345b73;
  }

  .content > *:hover {
    background-color: #ddd;
  }

  div:hover .content{
    display: block;
  }


  .sidemenu-button {
    margin-left: auto;
  }

  input[type='file'] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

</style>


