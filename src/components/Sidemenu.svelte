<script>
  import { tick } from 'svelte'
  import Tabbar from './Tabbar.svelte'


  import { encode, decode } from '../utils/xlgcParser.js'
  import { currentEntity, book, bookRaw } from '../store/book.js'
  import { showCode } from '../store/settings.js'
  import { alert, confirm, entity }  from '../utils/dialogs.js'

  $: chapterList = Object.keys($book.entities).filter( k => (!$book.entities[k].type || $book.entities[k].type === 'chapter'))
  $: sectionList = Object.keys($book.entities).filter( k => $book.entities[k].type === 'section')

  export let foreground = false
  const tabs = {
    book: 'Libro',
    ...($showCode && {"code" : "Code"})
  }

  const open = (entity) => {
    foreground = false
    currentEntity.set(entity)
  }


  const getFirstAvaiableKey = () => {
    for(let i = 1; i < 5000; i++){
      const entity = String(i)
      if(entity in bookRaw.entities) continue
      return entity
    }
  }

  const addQ = () =>{
    const entity = getFirstAvaiableKey()
    bookRaw.entities[entity] = {"data": "<p></p>"}
    book.refresh()
    currentEntity.set(entity)
    foreground = false
  }

  const add = async() => {
    const entityToAdd = await entity("Add entity", getFirstAvaiableKey(), "", "", "")
    if(!entityToAdd || !entityToAdd.name) return
    if(entityToAdd.name in bookRaw.entities){
      await alert('Error', 'Entity already exists')
      return
    }
    const newEntity = {"data": "<p></p>"}
    if(entityToAdd.group)  newEntity.group = entityToAdd.group
    if(entityToAdd.type)   newEntity.type  = entityToAdd.type
    if(entityToAdd.title)  newEntity.title  = entityToAdd.title
    bookRaw.entities[String(entityToAdd.name)] = newEntity
    book.refresh()
    currentEntity.set(entityToAdd.name)
    foreground = false
  }

  const edit = async() => {
    const editedName = $currentEntity
    const editedEntity = bookRaw.entities[editedName]
    const entityToAdd = await entity(`Edit entity "${editedName}"`,
      editedName,
      editedEntity.type,
      editedEntity.group,
      editedEntity.title)
    if(!entityToAdd || !entityToAdd.name) return
    if((editedName != entityToAdd.name) && (entityToAdd.name in bookRaw.entities)){
      await alert('Error', 'New entity already exists')
      return
    }
    currentEntity.set('')
    await tick
    const newEntity = {"data": editedEntity.data }
    if(editedEntity.flags) newEntity.flags = editedEntity.flags
    if(entityToAdd.group)  newEntity.group = entityToAdd.group
    if(entityToAdd.type)   newEntity.type  = entityToAdd.type
    if(entityToAdd.title)  newEntity.title  = entityToAdd.title
    delete bookRaw.entities[editedName]
    bookRaw.entities[String(entityToAdd.name)] = newEntity
    book.refresh()
    currentEntity.set(entityToAdd.name)
    foreground = false
  }

  const del = async() => {
    const entityToDel = $currentEntity
    if(await confirm('Confirm?', `Entity ${entityToDel} will be deleted`)){
      // Set new entity as the previous
      currentEntity.set('')
      await tick
      const newIndex = Object.keys(bookRaw.entities).indexOf(entityToDel) - 1
      delete bookRaw.entities[entityToDel]
      book.refresh()
      currentEntity.set(Object.keys(bookRaw.entities)[Math.max(newIndex, 0)])
      foreground = false
    }
  }
</script>

<section class="sidemenu" class:foreground={foreground}>
  <div class="buttons">
    <div class="icon-flash"  on:click={addQ} title="Quick add"/>
    <div class="icon-plus"   on:click={add}  title="Add entity"/>
    <div class="icon-pencil" on:click={edit} title="Edit entity"/>
    <div class="icon-cancel" on:click={del}  title="Delete entity"/>
  </div>
  <div class="sidemenu-container">
    <h1>Paragrafi</h1>
    {#each chapterList as entity }
      <div
      class:selected={entity == $currentEntity}
      on:click={ () => open(entity)}
      >{entity} <b class="title"> {$book.entities[entity].title || ''}</b></div>
    {/each}
    <h1>Sezioni</h1>
    {#each sectionList as entity }
      <div
      class:selected={entity == $currentEntity}
      on:click={ () => open(entity)}
      >{entity}  <b class="title"> {$book.entities[entity].title || ''}</b></div>
    {/each}
  </div>
</section>

<style>
.title{
  margin-left: 10px;
  color: #555;
}

.buttons {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

.buttons > div {
  cursor: pointer;
  display: block;
  flex-grow: 1;
  text-align: center;
  box-sizing: border-box;
  padding: 11px;
  content: ' ';
  line-height: 0.9rem;
  height: calc(22px + 0.9rem);
  font-size: 1.1rem;
}

.buttons > div:hover {
  background-color: #ddd;
}

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
  cursor: pointer;
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
