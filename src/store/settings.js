import {writable} from 'svelte/store'

const STORAGE_SETTINGS = 'lgcjs-settings'

const settings = JSON.parse(localStorage.getItem(STORAGE_SETTINGS) || "{}")

const localStorageWritable = (key, defaultValue) => {
  const value = settings.hasOwnProperty(key) ? settings[key] : defaultValue
  const {set, update, subscribe} = writable(value)
  const save = () => localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings))

  const nset = (value) => {
    settings[key] = value
    save()
    set(value)
  }

  const nupdate = (updater) => update( value => {
    settings[key] = updater(value)
    save()
    return settings[key]
  })

  return {set: nset, update: nupdate, subscribe}
}




const showCode = localStorageWritable("showcode", true)

export { showCode }
