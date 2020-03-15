<script>
  import { tick } from 'svelte'
  import { _ } from 'svelte-i18n'

  import * as dialog from '../utils/dialogs.js'
  import { currentEntity, book, entities } from '../store/book.js'

  export let foreground = false
  const open = entity => {
    foreground = false
    currentEntity.set(entity)
  }

  const addQ = () => {
    const entity = book.availableKey()
    book.update(bookData => {
      bookData.entities[entity] = { data: '<p></p>' }
    })
    currentEntity.set(entity)
    foreground = false
  }

  const add = async () => {
    const entity = entities.empty()
    const { key, obj } = await dialog.entity(
      'dialogs.entity.add',
      book.availableKey(),
      entity
    )

    if (!key) return
    if (key in $book.entities) {
      await alert('dialogs.error', 'dialogs.entity.exists')
      return
    }
    book.update(bookData => {
      bookData.entities[key] = entities.format({ ...entity, ...obj })
    })
    open(key)
  }

  const edit = async () => {
    const entity = currentEntity.unload()
    const entityObj = $book.entities[entity]
    const { key, obj } = await dialog.entity(
      'dialogs.entity.edit',
      entity,
      entityObj
    )
    if (!key) {
      currentEntity.set(entity)
      return
    }
    if (entity !== key && key in $book.entities) {
      currentEntity.set(entity)
      await dialog.alert('dialog.error', 'dialogs.entity.exists')
      return
    }
    await tick()
    book.update(bookData => {
      delete bookData.entities[entity]
      bookData.entities[key] = { ...entityObj, ...obj }
    })
    currentEntity.set(key)
    foreground = false
  }

  const del = async () => {
    const entity = currentEntity.unload()
    if (await dialog.confirm('dialogs.confirm', `dialogs.entity.delete`)) {
      // Set new entity as the previous
      await tick()
      const entityIndex = Object.keys($book.entities).indexOf(entity) - 1
      book.update(bookData => {
        delete bookData.entities[entity]
      })
      currentEntity.set(Object.keys($book.entities)[Math.max(entityIndex, 0)])
      foreground = false
    } else {
      currentEntity.set(entity)
    }
  }
</script>

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

<div class="buttons">
  <div class="icon-flash" on:click={addQ} title={$_('sidemenu.actions.quickadd')} />
  <div class="icon-plus" on:click={add} title={$_('sidemenu.actions.add')} />
  <div class="icon-pencil" on:click={edit} title={$_('sidemenu.actions.edit')} />
  <div class="icon-cancel" on:click={del} title={$_('sidemenu.actions.delete')} />
</div>
