import {writable} from 'svelte/store'

const openedDialog = writable(null)
let lastCallback = () => {}
const openedCallback = (...args) => lastCallback(...args)
const title = writable(null)
const text  = writable(null)

export {openedDialog, openedCallback, title, text}

const confirm = (mtitle, mtext) => new Promise( (resolve, reject) => {
  openedDialog.set('confirm')
  lastCallback = (...args) => {
    openedDialog.set(null)
    resolve(...args)
  }
  title.set(mtitle)
  text.set(mtext)
})

export {confirm}
