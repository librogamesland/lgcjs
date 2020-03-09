import App from './App.svelte'

// Set language support
import { addMessages, init } from 'svelte-i18n'
import * as languages from './languages/*.toml'

Object.keys(languages).forEach(key => addMessages(key, languages[key]))
init({
  fallbackLocale: 'en',
  initialLocale: 'en', // getLocaleFromNavigator(),
})

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
  })
}

// Export app
export default new App({
  target: document.body,
})
