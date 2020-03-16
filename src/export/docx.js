import docx from "docx";
import saveAs from 'file-saver';


export default (name, data) => {
  console.log(docx)
  console.log('link',docx.Hyperlink)
  console.log('text', docx.TextRun)
  const link = new docx.Hyperlink("Hello World");
  const doc = new docx.Document();

  doc.addSection({
      properties: {},
      children: [
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
      ],
  });

  docx.Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
  });
}
