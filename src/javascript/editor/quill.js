/* Questo modulo contiene utils per interagire
con la libreria di quill, per creare formati,
sovrascriverli, ... */

// Quill e sistema di creazione formati di quill
const Quill = window.Quill
const Parchment =  Quill.import('parchment')
Quill.debug('error')  // Disabilita log quill

export { Quill, Parchment }




// Utils relative a quill

/* Consente "al volo" di sovrascrivere proprietà
di un formato, come il tag, la key, il nome, ... */
const editFormat = (formatName, properties) => {
  const Format = Quill.import(formatName) // Importa il formato
  Object.assign(Format, properties)       // Aggiunge le proprietà
  Quill.register(formatName, Format)      // Lo registra con lo stesso nome
}

/* Aggiunge al volo un nuovo formato "inline",
i formati aggiunti sono, di default, immutabili */
const addInlineFormat = (registerName, properties, onCreate = n => n) => {
  const blotName = properties.blotName || ''
  // Importa la base dei formati inline
  const Format = class extends Quill.import('blots/inline') {
    // Chiama onCreate all'interno del costruttore
    static create() { return onCreate(super.create()) }
    // Impedisce formattazioni strane
    static formats() { return '' }
    // Impedisce che le formattazioni si sovrappongano
    formatAt(index, length, name, value) {
      if (name === blotName) return super.formatAt(index, length, name, value)
    }
  }
  // Aggiunge le proprietà e registra il formato
  Object.assign(Format, properties)
  Quill.register(registerName, Format)
}

export { editFormat, addInlineFormat}
