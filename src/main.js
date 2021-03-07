/* Punto d'ingresso dell'applicazione
 Importa App.svelte, aggiunge supporto multilingua e offline
 @Luca Fabbian - v1.0 */
import App from './App.svelte'
import {book} from './javascript/book.js'

// Multi language support
import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n'
import en from './localizations/en.toml'
import it from './localizations/it.toml'

const locale = getLocaleFromNavigator().split('-')[0];
addMessages('en', en)
addMessages('it', it)
init({ fallbackLocale: 'en', initialLocale: locale })  


window.onbeforeunload = function(){
  book.update( () => {})
};

setInterval( () => {
  book.update( () => {})
}, 15000)

// Offline support
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
