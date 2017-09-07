<template>
  <v-map ref="map"
         :zoom="zoom"
         :max-zoom="maxZoom"
         :center="this.center"
         @l-zoomend="onZoomEnd"
         @l-moveend="onMoveEnd($event)">
    <layer-picker>
      <v-tilelayer v-for="basemap in basemaps"
                   :key="basemap.name"
                   :url="basemap.url"
                   :params="basemap.params">
      </v-tilelayer>
    </layer-picker>
    <v-tilelayer ref="leftLayer"
                 :params="layerParams"
                 :url="leftProjectUrl">
    </v-tilelayer>
    <v-tilelayer ref="rightLayer"
                 :params="layerParams"
                 :url="rightProjectUrl">
    </v-tilelayer>
  </v-map>
</template>

<script>
import L from 'leaflet';

require('../sbs.js');

export default {
  name: 'map',
  methods: {
    onMoveEnd(event) {
      const map = event.target;
      if (map) {
        this.center = map.getCenter();
        const query = {
          coordinates: `${this.center.lat},${this.center.lng}`,
          zoom: this.zoom,
        };
        if (this.leftProject.length) {
          query.left = this.leftProject;
        }
        if (this.rightProject.length) {
          query.right = this.rightProject;
        }
        if (this.leftToken.length) {
          query.mapTokenLeft = this.leftToken;
        }
        if (this.rightToken.length) {
          query.mapTokenRight = this.rightToken;
        }
        this.$router.replace({
          name: this.$router.currentRoute.name,
          query,
        });
      }
    },
    onZoomEnd({ target: { _zoom: v } }) {
      this.zoom = v;
      const query = {
        coordinates: `${this.center.lat},${this.center.lng}`,
        zoom: v,
      };
      if (this.leftProject.length) {
        query.left = this.leftProject;
      }
      if (this.rightProject.length) {
        query.right = this.rightProject;
      }
      if (this.leftToken.length) {
        query.mapTokenLeft = this.leftToken;
      }
      if (this.rightToken.length) {
        query.mapTokenRight = this.rightToken;
      }
      this.$router.replace({
        name: this.$router.currentRoute.name,
        query,
      });
    },
  },
  beforeMount() {
    const query = this.$route.query;
    const zoom = parseInt(query.zoom, 10);
    if (Number.isFinite(zoom)) {
      this.zoom = zoom;
    }
    if (query.coordinates) {
      const coords = query.coordinates.split(',');
      if (coords.length === 2) {
        this.center = L.latLng(coords);
      }
    }
    if (query.mapTokenLeft) {
      this.leftToken = query.mapTokenLeft;
    }
    if (query.mapTokenRight) {
      this.rightToken = query.mapTokenRight;
    }
    if (query.left) {
      this.leftProject = query.left;
    }
    if (query.right) {
      this.rightProject = query.right;
    }
    if (query.mapTokenLeft) {
      this.leftToken = query.mapTokenLeft;
    }
    if (query.mapTokenRight) {
      this.rightToken = query.mapTokenRight;
    }
  },
  mounted() {
    const map = this.$refs.map.mapObject;
    map.zoomControl.remove();
    L.control.sideBySide(
      this.$refs.leftLayer.mapObject,
      this.$refs.rightLayer.mapObject,
    ).addTo(map);
  },
  data() {
    return {
      dividerPosition: 0.5,
      parentFrame: null,
      leftFrame: null,
      rightFrame: null,
      zoom: 14,
      maxZoom: 30,
      basemaps: [
        {
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          params: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">' +
              'OpenStreetMap</a> &copy;<a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 30,
            name: 'Light',
            pane: 'basemap',
          },
        },
        {
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
          params: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">' +
              'OpenStreetMap</a> &copy;<a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 30,
            name: 'Dark',
            pane: 'basemap',
          },
        },
      ],
      layerParams: { maxZoom: 30 },
      leftProject: '',
      rightProject: '',
      leftToken: '',
      rightToken: '',
      center: L.latLng([
        39.9526,
        -75.1652,
      ]),
    };
  },
  computed: {
    leftProjectUrl() {
      if (this.leftProject.length) {
        const tokenParam = this.leftToken && this.leftToken.length ?
            `?mapToken=${this.leftToken}` : '';
        return `https://tiles.rasterfoundry.com/tiles/${this.leftProject}/{z}/{x}/{y}/${tokenParam}`;
      }
      return '';
    },
    rightProjectUrl() {
      if (this.rightProject.length) {
        const tokenParam = this.rightToken && this.rightToken.length ?
            `?mapToken=${this.rightToken}` : '';
        return `https://tiles.rasterfoundry.com/tiles/${this.rightProject}/{z}/{x}/{y}/${tokenParam}`;
      }
      return '';
    },
  },
};
</script>
