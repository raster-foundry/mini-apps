<template>
  <div class="control-container">
    <div class="control">
      <button @click.stop="zoomIn"
              @dblclick.stop=""
              >
        <span class="icon-plus"></span>
      </button>
      <button @click.stop="zoomOut"
              @dblclick.stop=""
              >
        <span class="icon-minus"></span>
      </button>
    </div>
    <div class="control"
         :class="{ showing: showPicker }"
         >
      <div class="btn">
        <button @click.stop="onClick($event);"
                @dblclick.stop=""
                :class="{ showing: showPicker }"
                >
          <span class="icon-project"></span>
        </button>
        <slot></slot>
      </div>
      <div class="picker-options"
           @mousedown.stop=""
           @dblclick.stop=""
           v-if="showPicker">
        <div class="picker-option-item"
             v-for="(layer, index) in layers"
             @click="setBasemap(layer)"
             :style="getBasemapImage(layer)"
             >
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import L from 'leaflet';

  export default {
    mounted() {
      this.layers = this.$children;
    },
    methods: {
      zoomIn() {
        this.parent.zoomIn();
      },
      zoomOut() {
        this.parent.zoomOut();
      },
      onClick() {
        this.showPicker = !this.showPicker;
      },
      setBasemap(basemap) {
        this.layers.forEach((layer) => {
          this.parent.removeLayer(layer.mapObject);
        });
        basemap.mapObject.addTo(this.parent);
      },
      getBasemapImage(basemap) {
        const url = L.Util.template(
          basemap.url,
          Object.assign(
            {
              s: basemap.params.subdomains && basemap.params.subdomains[0] ?
                basemap.params.subdomain[0] : 'a',
              z: '4',
              x: '8',
              y: '6',
            },
          ),
        );
        return { background: `url(${url}) no-repeat center` };
      },
      deferredMountedTo(parent) {
        this.layers = this.$children;
        this.parent = parent;
        this.parent.createPane('basemap');
        this.parent.getPane('basemap').style.zIndex = 150;
        this.$children.forEach((child) => {
          child.deferredMountedTo(parent);
        });
      },
    },
    data() {
      return {
        parent: null,
        layers: [],
        showPicker: false,
      };
    },
  };
</script>

<style lang="scss">

.control-container {
  position: absolute;
  top: 0.5em;
  right: 1em;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.control {
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  border-radius: 5px;
  button {
    margin-top: 0.5em;
  }
}

button {
  padding: 1em;
  background: #465076;
  border-radius: 5px;
  color: white;
  border: none;
  cursor: pointer;
  &:active, &:hover {
    background: darken(#465076, 0.5);
  }
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}
.showing {
  border-radius: 5px 5px 0 0;
}
.picker-options {
  position: absolute;
  background: #465076;
  bottom: 0;
  right: 0;
  transform: translateY(100%);
  border-radius: 5px 0 5px 5px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  padding: .5em .5em 0 .5em;
}
.picker-option-item {
  width: 12em;
  height: 4em;
  margin-bottom: .5em;
  cursor: pointer;
}
</style>
