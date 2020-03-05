import App from './App.svelte';

// Set language support
import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n'
import * as languages from "./languages/*.toml"

Object.keys(languages).forEach(key => addMessages(key, languages[key]))
init({
  fallbackLocale: 'en',
  initialLocale: 'en', // getLocaleFromNavigator(),
})


// Export app
export default new App({
  target: document.body
})
