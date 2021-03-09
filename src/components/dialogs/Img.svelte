<script>
  export let params
  export let callback

  if(callback){}
</script>

<div class="imgbox" on:click={() => callback(false)}>
  <img class="center-fit" src={$params[0]} alt="book graph"/>
</div>

<style>
  /* https://stackoverflow.com/questions/6169666/how-to-resize-an-image-to-fit-in-the-browser-window */
  .imgbox {
    display: grid;
    height: 100%;
    align-items: center;
  }
  .center-fit {
    max-width: 95%;
    max-height: 100vh;
    margin: auto;
  }
</style>