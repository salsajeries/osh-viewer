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
import SweApi from 'osh-js/source/core/datasource/sweapi/SweApi.datasource.js'

const visualizationStore = useVisualizationStore()
const mapLayerType = ref('cesium')
const mapView = ref<any>(null)
const currentVisualizations = ref<OSHVisualization[]>([])
const pmLayers = ref([])

const mapVisualizations = computed(() => {
  return visualizationStore.getVisualizationsByType('pointmarker')
})

const featureVisualizations = computed(() => {
  return visualizationStore.getVisualizationsByType('pointmarker-feature')
})


let pointMarker = new PointMarkerLayer({
  location: {
    x: 0,
    y: 0,
    z: 0
  }
})

// Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZWYzYjhiMy0wMzcwLTQxMTktOGY1OS0wYzM1NzNlOTI3NDMiLCJpZCI6Mzk4MzMsImlhdCI6MTc0ODIwNDA4OX0.HBox4N50pESMU1yJs33-0cNd22sTvIv0KetnMAJMdXU'



onMounted(() => {

  if (mapLayerType.value === 'leaflet') {
    const leafletMapView = new LeafletView({
      container: 'cesiumContainer',
      layers: [pointMarker],
      autoZoomOnFirstMarker: true
    })

    mapView.value = leafletMapView;

  } else {

    const cesiumView = new CesiumView({
      container: 'cesiumContainer',
      layers: [
        pointMarker
      ]
    })
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDlhZDVkOC0yMWZmLTQyMzYtYTU5Zi0yNTQ3MjAxYzFiM2YiLCJpZCI6Mzk4MzMsImlhdCI6MTc1MTk1MTk0OH0.0eS77LohXhxKTRDy9yhLo-wmYGTn9mz31-f4xer7eT0'
    cesiumView.viewer.terrainProvider = new EllipsoidTerrainProvider()

    let tp = new CesiumTerrainProvider({
      url: IonResource.fromAssetId(1),
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDlhZDVkOC0yMWZmLTQyMzYtYTU5Zi0yNTQ3MjAxYzFiM2YiLCJpZCI6Mzk4MzMsImlhdCI6MTc1MTk1MTk0OH0.0eS77LohXhxKTRDy9yhLo-wmYGTn9mz31-f4xer7eT0',
      requestVertexNormals: true,
      requestWaterMask: true
    })

    // leafletMapView.viewer.terrainProvider = Cesium.CesiumTerrainProvider.fromIonAssetId(

    //   1, {
    //     requestVertexNormals: true,
    //     requestWaterMask: true
    //   })
    cesiumView.viewer.terrainProvider = tp

    mapView.value = cesiumView
  }
})

watch(mapVisualizations, (updated) => {
  // Remove visualizations that are no longer present
  const removed = currentVisualizations.value.filter(val => !updated.includes(val))
  for (const viz of removed) {
    // Remove corresponding layer from pmLayers and map
    const idx = currentVisualizations.value.indexOf(viz)
    if (idx !== -1) {
      currentVisualizations.value.splice(idx, 1)
      // Remove layer from pmLayers and mapView
      const pmLayer = pmLayers.value[idx]
      if (pmLayer && mapView.value) {
        mapView.value.removeLayer?.(pmLayer)
      }
      pmLayers.value.splice(idx, 1)
    }
  }

  // Add new visualizations
  const newFiltered = updated.filter(val => !currentVisualizations.value.includes(val))
  console.log('New visualizations:', newFiltered)
  for (const viz of newFiltered) {
    currentVisualizations.value.push(viz)
    let dsInstance = new SweApi('pm-datasource', {
      endpointUrl: viz.visualizationComponents.dataSource.endpointUrl,
      resource: viz.visualizationComponents.dataSource.resource,
      tls: viz.visualizationComponents.dataSource.tls,
      protocol: viz.visualizationComponents.dataSource.protocol,
      startTime: viz.visualizationComponents.dataSource.startTime,
      endTime: viz.visualizationComponents.dataSource.endTime,
      mode: viz.visualizationComponents.dataSource.mode,
    })
    console.log('[MapView] Creating datasource for PointMarkerLayer:', dsInstance)
    const layerOpts = viz.visualizationComponents.dataLayer
    const pmLayer = new PointMarkerLayer({
      name: viz.name,
      dataSourceIds: [dsInstance.id],
      getLocation: layerOpts.getLocation,
      label: viz.visualizationComponents.dataLayer.name,
      icon: '/icons/map/map-marker.svg',
      labelOffset: [-16, -32],
    })
    pmLayers.value.push(pmLayer)
    mapView.value.addLayer(pmLayer)
    console.log('[MapView] Creating PointMarkerLayer:', pmLayer)
    dsInstance.connect()
  }
}, { deep: true })

watch(featureVisualizations, (updated) => {
  // Remove feature visualizations that are no longer present
  const removed = currentVisualizations.value.filter(val => !updated.includes(val))
  for (const viz of removed) {
    const idx = currentVisualizations.value.indexOf(viz)
    if (idx !== -1) {
      currentVisualizations.value.splice(idx, 1)
      // Optionally remove marker from mapView if needed
    }
  }

  // Add new feature visualizations
  const newFiltered = updated.filter(val => !currentVisualizations.value.includes(val))
  for (const viz of newFiltered) {
    currentVisualizations.value.push(viz)
    mapView.value.addMarker({
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


</script>

<template>
  <div class="cesium-container" id="cesiumContainer"></div>
</template>

<style scoped>

</style>
