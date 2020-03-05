import {writable} from 'svelte/store'


/* Dialogs params & state


*/
const dialogStore = writable({})
const openDialog = (store) => new Promise( (resolve, reject) => dialogStore.set({
  callback(...args){
    dialogStore.set({})
    resolve(...args)
  },
  ...store,
}))
export { dialogStore }



const alert = (title, text) => openDialog({
  dialog: 'alert',
  params: {title, text}
})

const confirm = (title, text) => openDialog({
  dialog: 'confirm',
  params: {title, text}
})

const entity = (title, key, props) => openDialog({
  dialog: 'entity',
  params: {title, key, props}
})

export {alert, confirm, entity}
