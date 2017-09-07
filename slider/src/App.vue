<template>
  <div id="app">
    <router-view></router-view>
    <img alt="Raster Foundry" class="logo" src="./assets/raster-foundry-logo.png">
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import "../node_modules/leaflet/dist/leaflet.css";
@import "./assets/fonts/fontello/css/fontello.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
html {
  width: 100%;
  height: 100%;
}
.logo {
  z-index: 9999;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 1em;
  user-select: none;
  pointer-events: none;
  height: 5vh;
  min-height: 1em;
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.4);
}
</style>
