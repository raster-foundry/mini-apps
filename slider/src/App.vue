<template>
  <div id="app">
    <router-view></router-view>
    <a href="https://www.rasterfoundry.com" target="_blank"><img alt="Raster Foundry" class="logo" src="./assets/raster-foundry-logo.svg"></a>
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
  margin: 0;
  height: 35px;
  padding: 8px 15px 3px;
  background-color: rgba(70, 80, 118, 1);
  border-radius: 0 4px 0 0;
}
</style>
