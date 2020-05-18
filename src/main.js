import App from './App.svelte'
import lgcdev from './javascript/lgcdev'


import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n'
import * as languages from './translations/*.toml'


window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if(event.data.type === 'console'){
    console[event.data.call](...event.data.args)
  }
}


// Set language support
Object.entries(languages).forEach( ([k, l]) => addMessages(k, l))
init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator().split('-')[0],
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
