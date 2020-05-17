
let lgcdev = null

if(window.__lgcdevVersion){

  lgcdev = {
    version: window.__lgcdevVersion("0.1.6"),
    appURL:  window.__lgcdevAppURL(),

    read:  ()     => window.__lgcdevReadBook(),
    write: (text) => window.__lgcdevWriteBook(text),
  }
}


export default lgcdev
