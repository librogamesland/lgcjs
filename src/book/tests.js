const test1 = `<?xml version="1.0" encoding="UTF-8"?><entities><entity group="" name="1" type="chapter"><attribute name="description" type="string"><![CDATA[<p><pre class="ql-syntax" spellcheck="false">La tua avventura inizia.
<b>Testo in grassetto</b>
Testo non in grassetto
Scegli se andare a {link 2:destra} o a {link 4:@T}</pre>
  </p>]]></attribute><attribute name="chapter_title" type="string"/><attribute name="flag_final" type="boolean"><![CDATA[false]]></attribute><attribute name="flag_fixed" type="boolean"><![CDATA[true]]></attribute><attribute name="flag_death" type="boolean"><![CDATA[false]]></attribute></entity><entity group="" name="2" type="chapter"><attribute name="description" type="string"><![CDATA[<p>Risposta sbagliata, hai perso.</p><p>Ritorna al {link intro:intro}</p>
  ]]></attribute><attribute name="chapter_title" type="string"/><attribute name="flag_final" type="boolean"><![CDATA[false]]></attribute><attribute name="flag_fixed" type="boolean"><![CDATA[false]]></attribute><attribute name="flag_death" type="boolean"><![CDATA[true]]></attribute></entity><entity group="" name="4" type="chapter"><attribute name="description" type="string"><![CDATA[<p>Risposta giusta, hai vinto</p><p>O no?</p><p>Prosegui al [2]</p>
  ]]></attribute><attribute name="chapter_title" type="string"><![CDATA[sinistra]]></attribute><attribute name="flag_final" type="boolean"><![CDATA[true]]></attribute><attribute name="flag_fixed" type="boolean"><![CDATA[false]]></attribute><attribute name="flag_death" type="boolean"><![CDATA[false]]></attribute></entity><entity group="speciale" name="custom" type="section"><attribute name="description" type="string"><![CDATA[<p>questa &#232; una sezione <i>speciale
</i>    </p><p>infatti si chiama custom ed &#232; nel gruppo speciale. </p>
  ]]></attribute><attribute name="chapter_title" type="string"><![CDATA[Sezione speciale]]></attribute></entity><entity group="setup" name="game" type="entity"><attribute name="description" type="string"><![CDATA[<p></p>]]></attribute><attribute name="chapter_title" type="string"/><attribute name="lgc_version" type="string"><![CDATA[3.3.14.102]]></attribute><attribute name="title" type="string"/><attribute name="author" type="string"/><attribute name="version" type="string"/><attribute name="revision" type="integer"><![CDATA[23]]></attribute><attribute name="editing_action" type="string"><![CDATA[WRITING]]></attribute><attribute name="table_of_contents" type="string"><![CDATA[P(ALL)]]></attribute><attribute name="editing_chapter" type="string"><![CDATA[1]]></attribute></entity><entity group="" name="intro" type="section"><attribute name="description" type="string"><![CDATA[<p>L'introduzione contiene</p><p>Testo a destra</p><p>Testo a sinistra</p><p>Testo giustificato</p><p></p><p>Un link per le {link rules:Regole}</p>
  ]]></attribute><attribute name="chapter_title" type="string"><![CDATA[Introduzione]]></attribute></entity><entity group="" name="rules" type="section"><attribute name="description" type="string"><![CDATA[<p>Esempio di codice</p><p>Hello World!</p><pre class="ql-syntax" spellcheck="false"><span class="hljs-built_in">console</span>.log(<span class="hljs-string">&quot;hello world&quot;</span>)

<span class="hljs-keyword">function</span><span class="hljs-function"> </span><span class="hljs-title">myHelloWorld</span><span class="hljs-function">()</span>{
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}


Prosegui al {link 1:1}</pre>
  ]]></attribute><attribute name="chapter_title" type="string"><![CDATA[Regole]]></attribute></entity></entities>`

export {test1}
