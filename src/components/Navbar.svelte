<script>
import { _ } from 'svelte-i18n'
import { download } from '../utils/file.js'

let navbar = {
  'file' : {
    'new'  : {type: 'button', handler: null},
    'open' : {type: 'fileinput', accept: ".xlgc", handler: (r) => console.log(r)},
    'save' : {type: 'button', handler: download},
  },
  'edit' : {
    'link1' : {type: 'button', handler: null},
    'link2' : {type: 'button', handler: null},
    'link4' : {type: 'button', handler: null},
  },
  'view' : {

  },
  'code' : {

  },
  'help' : {
    'guide' : {type: 'link',   href: ""},
    'forum' : {type: 'link',   href: "http://www.librogame.net/index.php/forum/forum?id=13"},
    'about' : {type: 'button', handler: null},
  }
}

const readFile = (elem, callback) => {
  // Crea una copia delle info del file
  const file = elem.files[0]
  const info = {
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    webkitRelativePath: file.webkitRelativePath,
    size: file.size,
    type: file.type
  }

  // Usa un fileReader per leggere il file come testo
  const reader = new FileReader()
  reader.onload = () => {
    callback(info, reader.result)
    elem.value = ''
  }
  reader.readAsText(file);
}

</script>

<ul>
  {#each Object.entries(navbar) as [tab, items]}
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn">{$_(`navbar.${tab}.title`)}</a>
    <div class="dropdown-content">
      {#each Object.entries(items) as [key, item]}
        {#if item.type === 'button'}
          <a href="javascript:void(0)"
          on:click={ () => {item.handler()}}
          >{$_(`navbar.${tab}.items.${key}`)}</a>
        {:else if item.type === 'link'}
          <a href={item.href} target="_blank">{$_(`navbar.${tab}.items.${key}`)}</a>
        {:else if item.type === 'fileinput'}
        <input
          type="file" name="file" id={`${tab}_${key}`}
          accept=".xlgc"
          on:change={ (e) => readFile(e.srcElement, item.handler)}
        />
        <label for={`${tab}_${key}`}>{$_(`navbar.${tab}.items.${key}`)}</label>

        {/if}
      {/each}
    </div>
  </li>
  {/each}
</ul>


<style>

/*
background-color: var(--navbar-color, #001b31);
color: var(--navbar-color-text, #fff);
*/

input[type=file] {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

ul {
  font-size: 0.9rem;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  padding-left: 2.3vw;
}

li {
  float: left;
}


li a:hover {
  background-color: #111;
}

li a, .dropbtn {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
}

li a:hover, .dropdown:hover .dropbtn {
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
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 10000;
}

.dropdown-content a, .dropdown-content label {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover, .dropdown-content label:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
