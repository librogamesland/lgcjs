import docx from "docx";
import saveAs from 'file-saver';


const mapChildren = node => {

}

export default (name, data) => {
  const link = new docx.Hyperlink("Hello World");
  const doc = new docx.Document();

  const l = document.createElement("div")
  l.innerHTML = '<p>E chissenefrega della musica,</p><p>di tutti quei problemi sulla musica</p><p>di tutti quegli a<b>rtisti</b></p><p><b>di tutti gli attivi<i>sti gli a</i>ttivisti</b>ll</p>'
  window.l = l

  function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
  }

  console.log(textNodesUnder(l))
  doc.addSection({
      properties: {},
      children: [... l.childNodes].map( p =>{
        const children = []
        textNodesUnder(p).forEach( (node) => {
          let bold      = false
          let italics   = false
          let underline = false

          let domElement = node.parentNode
          while(domElement.tagName !== 'P'){
            const tag = domElement.tagName
            if(tag === 'B') bold      = true
            if(tag === 'I') italics   = true
            if(tag === 'U') underline = true
            domElement = domElement.parentNode
          }

          console.log(p.innerText, node)
          children.push(new docx.TextRun({
            bold, italics, underline,
            text: node.nodeValue
          }))
        })

        return new docx.Paragraph({
            children,
        })
      }),
/*
      new docx.Paragraph({
          children: [
              new docx.TextRun({
                bold: true,
                text: 'hdllo',
              }),
              new docx.PageBreak(),

          ],
      }),

    ]*/
      /*[
          new docx.Paragraph({
              heading: docx.HeadingLevel.HEADING_1,
              children: [
                  new docx.Bookmark("p001", "Paragrafo 1"),
                  new docx.PageBreak(),

              ],
          }),
          new docx.Paragraph({
              children: [
                  new docx.TextRun("Documento generato con lgcjs"),
                  new docx.PageBreak(),

              ],
          }),
          new docx.Paragraph({
              children: [
                  new docx.Hyperlink("link al paragrafo 1", "", "p001"),

              ],
          }),
      ],*/
  });
  docx.Packer.toBlob(doc).then(blob => {
      saveAs(blob, "example.docx");
  });
}
