<script>
  import { _ } from 'svelte-i18n'
  import { read } from '../javascript/utils/file.js'
  import {navbar, handlers} from '../javascript/navbar'

  export let showSidemenu = false

  const handleKeydown = function(e) {
      if (e.ctrlKey) {
        const key = String.fromCharCode(e.keyCode).toUpperCase()
        if(key === 'O'){
          document.getElementById(`file_open`).click()
          e.preventDefault()
          return
        }
        if(key in handlers){
          handlers[key]()
          e.stopPropagation()
          e.stopImmediatePropagation()
          e.preventDefault()
        }
      }
  }
</script>


<svelte:window on:keydown={handleKeydown}/>

<ul>
  {#each Object.entries(navbar) as [tab, items]}
    <li class="dropdown">
      <a href="javascript:void(0)" class="dropbtn">
        {$_(`navbar.${tab}.title`)}
      </a>
      <div class="dropdown-content">
        {#each Object.entries(items) as [key, item]}
          {#if item.type === 'button'}
            <a
              href="javascript:void(0)"
              on:click={() => {
                item.handler()
              }}>
              {$_(`navbar.${tab}.items.${key}`)}
            </a>
          {:else if item.type === 'link'}
            <a href={item.href} target="_blank" rel="noopener">
              {$_(`navbar.${tab}.items.${key}`)}
            </a>
          {:else if item.type === 'fileinput'}
            <input
              type="file"
              name="file"
              id={`${tab}_${key}`}
              accept=".xlgc"
              on:change={e => read(e.srcElement, item.handler)} />
            <label for={`${tab}_${key}`}>
              {$_(`navbar.${tab}.items.${key}`)}
            </label>
          {/if}
        {/each}
      </div>
    </li>
  {/each}
  <li class="sidemenu-button">
    <a
      href="javascript:void(0)"
      aria-label={$_('sidemenu.toggle')}
      class={'dropbtn icon-' + (showSidemenu ? 'cancel' : 'menu')}
      on:click={() => (showSidemenu = !showSidemenu)} />
  </li>
</ul>


<style>
  /** Navbar ul/li/dropdown styling
Taken from https://www.w3schools.com/css/css_navbar.asp  **/
  ul {
    user-select: none;
    font-size: 0.9rem;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
    padding-left: 2.3vw;
  }

  @media only screen and (min-width: 1150px) {
    ul {
      padding-left: 11.3vw;
    }
  }

  li {
    float: left;
  }

  li a,
  .dropbtn {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 0.7rem 1rem;
    text-decoration: none;
    transition: background-color 0.17s;
  }

  li a:hover,
  .dropdown:hover .dropbtn {
    background-color: #3978cd;
  }

  li.dropdown {
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 20000;
  }

  .dropdown-content a,
  .dropdown-content label {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
  }

  .dropdown-content a:hover,
  .dropdown-content label:hover {
    background-color: #f1f1f1;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }


  @media only screen and (max-width: 680px) {
    li a,
    .dropbtn {
      padding: 0.95rem 1rem;
    }

    .dropdown-content a,
    .dropdown-content label {
      padding: 1rem 16px;
    }
  }

  @media only screen and (max-width: 365px) {
    li a,
    .dropbtn {
      padding: 0.95rem 0.85rem;
    }
  }

  @media only screen and (max-width: 328px) {
    li a,
    .dropbtn {
      padding: 0.95rem 0.6rem;
    }
  }


  /** Show/Hide sidemenu button **/
  .sidemenu-button {
    float: right;
  }
  @media only screen and (min-width: 681px) {
    .sidemenu-button {
      display: none;
    }
  }

  /** Hide browser default "choose file" component **/
  input[type='file'] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
</style>
