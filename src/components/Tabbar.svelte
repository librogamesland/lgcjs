<script>

  export let tabs = { }
  export let active = Object.keys(tabs)[0]
  export let expandable = false
</script>

<div class="tab">
  {#each Object.entries(tabs) as [key, label]}
    <button
    class={'tablinks' + (key === active ? ' active' : '')}
    on:click={ () => active = key}
    >{label}</button>
  {/each}
</div>

<style>
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons inside the tab */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 10px 0.9rem;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}
</style>
