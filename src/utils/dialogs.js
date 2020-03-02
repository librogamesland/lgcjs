import {writable} from 'svelte/store'

const openedDialog = writable(null)
let lastCallback = () => {}
const openedCallback = (...args) => lastCallback(...args)
const title = writable(null)
const text  = writable(null)

const eName  = writable(null)
const eType  = writable(null)
const eGroup = writable(null)
const eTitle = writable(null)

export {openedDialog, openedCallback, title, text,
             eName, eType, eGroup, eTitle}

const alert = (mtitle, mtext) => new Promise( (resolve, reject) => {
  openedDialog.set('alert')
  lastCallback = (...args) => {
   openedDialog.set(null)
   resolve(...args)
  }
  title.set(mtitle)
  text.set(mtext)
})

const confirm = (mtitle, mtext) => new Promise( (resolve, reject) => {
  openedDialog.set('confirm')
  lastCallback = (...args) => {
    openedDialog.set(null)
    resolve(...args)
  }
  title.set(mtitle)
  text.set(mtext)
})

const entity = (mtitle, mName, mType, mGroup, mTitle) => new Promise( (resolve, reject) => {
  openedDialog.set('entity')
  lastCallback = (...args) => {
    openedDialog.set(null)
    resolve(...args)
  }
  title.set(mtitle)
  eName .set(mName)
  eType .set(mType)
  eGroup.set(mGroup)
  eTitle.set(mTitle)
})

export {alert, confirm, entity}
