<script setup xmlns="http://www.w3.org/1999/html" lang="ts">
import PointMarkerLayer from 'osh-js/source/core/ui/layer/PointMarkerLayer'
import CesiumView from 'osh-js/source/core/ui/view/map/CesiumView'
import { CesiumTerrainProvider, EllipsoidTerrainProvider, Ion, IonResource } from 'cesium'
import * as Cesium from 'cesium'
import LeafletView from 'osh-js/source/core/ui/view/map/LeafletView'
import { onMounted } from 'vue'


let pointMarker = new PointMarkerLayer({
  location: {
    x: 0,
    y: 0,
    z: 0
  }
})

let leafletMapView

/*Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZWYzYjhiMy0wMzcwLTQxMTktOGY1OS0wYzM1NzNlOTI3NDMiLCJpZCI6Mzk4MzMsImlhdCI6MTc0ODIwNDA4OX0.HBox4N50pESMU1yJs33-0cNd22sTvIv0KetnMAJMdXU'

let cesiumView = new CesiumView({
  container: 'cesiumContainer',
  layers: [
    pointMarker
  ]
})

/!*let tp = new CesiumTerrainProvider({
  url: IonResource.fromAssetId(1),
  accessToken: Ion.defaultAccessToken,
  requestVertexNormals: true,
  requestWaterMask: true
})*!/

cesiumView.viewer.terrainProvider = Cesium.CesiumTerrainProvider.fromIonAssetId(
  1, {
      requestVertexNormals: true,
      requestWaterMask: true
    })*/
onMounted(() => {
  leafletMapView = new LeafletView({
    container: 'cesiumContainer',
    layers: [pointMarker],
    autoZoomOnFirstMarker: true
  })
})

</script>

<template>
  <div class="cesium-container" id="cesiumContainer"></div>
</template>

<style scoped>

</style>
