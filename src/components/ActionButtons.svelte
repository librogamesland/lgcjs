<script>
  import { _ } from 'svelte-i18n'
  import {book, chapter} from '../javascript/book/data.js'
  import { ctrlShortcuts } from '../javascript/shortcuts.js'
  // Dialogs
  import { dialog } from './Dialogs.svelte'
  import Chapter    from './dialogs/Chapter.svelte'


  const add = async () => {
    const newChapter = book.newChapter()
    const result = await dialog(
      Chapter,
      $_('dialogs.entity.add'),
      book.availableKey(),
      newChapter
      
    )
    if(!result) return
    let { key, value } = result
    key = book.sanitizeKey(key)
    value.group = book.sanitizeKey(value.group || '')


    if (!key) return
    book.update( ({chapters }) => {
      if (key in chapters) {
        dialog(Alert, $_('dialogs.error'), $_('dialogs.entity.exists'))
        return {}
      }

      chapters[key] = value
      return {key, chapters}
    })
  }


  const edit = async () => {
    const result = await dialog(
      Chapter,
      $_('dialogs.entity.edit'),
      $chapter.key,
      $chapter.value
    )
    if(!result) return
    let { key, value } = result
    key = book.sanitizeKey(key)
    value.group = book.sanitizeKey(value.group || '')


    if (!key) return
    book.update( ({chapters }) => {
      // Non permette la sovrascrittura di altri
      // paragrafi oltre a quello attuale
      if (key !== $chapter.key && key in chapters) {
        dialog(Alert, $_('dialogs.error'), $_('dialogs.entity.exists'))
        return {}
      }

      delete chapters[$chapter.key]
      chapters[key] = value
      return {key, chapters}
    })
  }


  const del = async () => {
    if (await dialog(Confirm, $_('dialogs.confirm'), $_(`dialogs.entity.delete`))) {
      book.update( ({chapters }) => {
        const index = Object.keys(chapters).indexOf($chapter.key) - 1
        delete chapters[$chapter.key]
        return { key: Object.keys(chapters)[index], chapters}
      })
    }
  }

  ctrlShortcuts({
    'R': () => add(),
    'E': () => edit(),
    'D': () => del(),
  })

</script>

<div class="buttons">
  <div class="icon-plus" on:click={add} title={$_('sidemenu.actions.add')} />
  <div class="icon-pencil" on:click={edit} title={$_('sidemenu.actions.edit')} />
  <div class="icon-trash" on:click={del} title={$_('sidemenu.actions.delete')} />
</div>

<style>
  .buttons {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border: 1px solid #666;
    border-bottom: none;

    background-color: #f1f1f1;
  }

  .buttons > div {
    cursor: pointer;
    display: block;
    flex-grow: 1;
    text-align: center;
    box-sizing: border-box;
    padding: 0.7rem 11px;
    content: ' ';
    font-size: 1.3rem;
  }

  .buttons > div:hover {
    background-color: #ddd;
  }

</style>
