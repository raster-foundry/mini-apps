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

const HERE_APP_ID = 'v88MqS5fQgxuHyIWJYX7';
const HERE_APP_CODE = '5pn07ENomTHOap0u7nQSFA';

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
        {
          url: 'https://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/hybrid.day/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}',
          params: {
            attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
            subdomains: '1234',
            mapID: 'newest',
            app_id: HERE_APP_ID,
            app_code: HERE_APP_CODE,
            base: 'aerial',
            maxZoom: 30,
            maxNativeZoom: 20,
            type: 'maptile',
            language: 'eng',
            format: 'png8',
            size: '256',
            name: 'Aerial',
            pane: 'basemap',
          },
        },
        {
          url: 'https://{s}.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}',
          params: {
            attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
            subdomains: '1234',
            app_id: HERE_APP_ID,
            app_code: HERE_APP_CODE,
            name: 'Streets',
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
        return `https://tiles.rasterfoundry.com/${this.leftProject}/{z}/{x}/{y}/${tokenParam}`;
      }
      return '';
    },
    rightProjectUrl() {
      if (this.rightProject.length) {
        const tokenParam = this.rightToken && this.rightToken.length ?
            `?mapToken=${this.rightToken}` : '';
        return `https://tiles.rasterfoundry.com/${this.rightProject}/{z}/{x}/{y}/${tokenParam}`;
      }
      return '';
    },
  },
};
</script>
