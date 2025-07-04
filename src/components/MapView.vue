<script setup xmlns="http://www.w3.org/1999/html" lang="ts">
import PointMarkerLayer from 'osh-js/source/core/ui/layer/PointMarkerLayer'
import CesiumView from 'osh-js/source/core/ui/view/map/CesiumView'
import { CesiumTerrainProvider, EllipsoidTerrainProvider, Ion, IonResource } from 'cesium'
import * as Cesium from 'cesium'
import LeafletView from 'osh-js/source/core/ui/view/map/LeafletView'
import { computed, onMounted, ref, watch } from 'vue'
import { useVisualizationStore } from '../stores/visualizationstore'
import { OSHVisualization } from '@/lib/OSHConnectDataStructs'
import { createLocationDataSource } from '@/components/visualizations/DataComposables'


let pointMarker = new PointMarkerLayer({
  location: {
    x: 0,
    y: 0,
    z: 0
  }
})

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
  const leafletMapView = new LeafletView({
    container: 'cesiumContainer',
    layers: [pointMarker],
    autoZoomOnFirstMarker: true
  })

  const visualizationStore = useVisualizationStore()
// const mapVisualizations = ref(visualizationStore.getVisualizationsByType('pointmarker'))
  const currentVisualizations = ref<OSHVisualization[]>([])
  const pmLayers = ref([])

  const mapVisualizations = computed(() => {
    return visualizationStore.getVisualizationsByType('pointmarker')
  })

  const featureVisualizations = computed(() => {
    return visualizationStore.getVisualizationsByType('pointmarker-feature')
  })

  watch(mapVisualizations, (updated) => {
    // do stuff with new items in list
    const remFiltered = currentVisualizations.value.filter(val => !updated.includes(val))
    const newFiltered = updated.filter(val => !currentVisualizations.value.includes(val))
    console.log('New visualizations:', newFiltered)
    currentVisualizations.value.push(...newFiltered)

    for (const viz of newFiltered) {
      const datasource = createLocationDataSource(viz.parentDatastream)

      const pmLayer = new PointMarkerLayer({
        name: viz.name,
        dataSourceIds: [datasource.id],
        getLocation: (rec: any) => {
          console.log(`getLocation called for record: ${rec}`)
          return {
            x: rec.location.lon,
            y: rec.location.lat,
            z: rec.location.alt
          }
        }
      })
      pmLayers.value.push(pmLayer)
      leafletMapView.addLayer(pmLayer)
      datasource.connect()
    }
  }, { deep: true })

  watch(featureVisualizations, (updated) => {
    console.log('Feature visualizations updated:', updated)
    const newFiltered = updated.filter(val => !currentVisualizations.value.includes(val))

    for (const viz of newFiltered) {
      const pmLayer = new PointMarkerLayer({
        name: viz.name,
        dataSourceIds: [],
        location: {
          x: viz.geometry.coordinates[0],
          y: viz.geometry.coordinates[1],
          z: viz.geometry.coordinates[2]
        }
      })

      console.log('[MapView] Adding feature visualization layer:', pmLayer)

      pmLayers.value.push(pmLayer)
      leafletMapView.addMarker({
        location: {
          x: viz.geometry.coordinates[0],
          y: viz.geometry.coordinates[1],
          z: viz.geometry.coordinates[2]
        },
        label: viz.name,
        labelOffset: [0, 0],
        icon: '/icons/map/map-marker.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }

  }, { deep: true })
})


</script>

<template>
  <div class="cesium-container" id="cesiumContainer"></div>
</template>

<style scoped>

</style>
