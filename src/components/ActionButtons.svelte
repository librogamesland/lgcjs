<script>
  import { tick } from 'svelte'
  import * as dialog from '../utils/dialogs.js'
  import { currentEntity, book, entities } from '../store/book.js'


  export let foreground = false
  const open = (entity) => {
    foreground = false
    currentEntity.set(entity)
  }


  const addQ = () =>{
    const entity = book.availableKey()
    book.update( bookData => {
      bookData.entities[entity] = {"data": "<p></p>"}
    })
    currentEntity.set(entity)
    foreground = false
  }

  const add = async() => {
    const entity = entities.empty()
    const {key, obj} = await dialog.entity(
      "Add entity", book.availableKey(), entity
    )

    if(!key) return
    if(key in $book.entities){
      await alert('Error', 'Entity already exists')
      return
    }
    book.update( bookData =>{
      bookData.entities[key] = entities.format({...entity, ...obj})
    })
    open(key)
  }

  const edit = async() => {
    const entity    = currentEntity.unload()
    const entityObj = $book.entities[entity]
    const {key, obj} = await dialog.entity(`Edit entity "${entity}"`, entity, entityObj)
    if(!key) return
    if((entity !== key) && (key in $book.entities)){
      await dialog.alert('Error', 'New entity already exists')
      return
    }
    await tick()
    book.update( bookData => {
      delete bookData.entities[entity]
      bookData.entities[key] = {...entityObj, ...obj}
    })
    currentEntity.set(key)
    foreground = false
  }

  const del = async() => {
    const entity = currentEntity.unload()
    if(await dialog.confirm('Confirm?', `Entity ${entity} will be deleted`)){
      // Set new entity as the previous
      await tick()
      const entityIndex = Object.keys($book.entities).indexOf(entity) - 1
      book.update( bookData => {
        delete bookData.entities[entity]
      })
      currentEntity.set(Object.keys($book.entities)[Math.max(entityIndex, 0)])
      foreground = false
    }else{
      currentEntity.set(entity)
    }
  }

</script>

<div class="buttons">
  <div class="icon-flash"  on:click={addQ} title="Quick add"/>
  <div class="icon-plus"   on:click={add}  title="Add entity"/>
  <div class="icon-pencil" on:click={edit} title="Edit entity"/>
  <div class="icon-cancel" on:click={del}  title="Delete entity"/>
</div>

<style>

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
</style>
