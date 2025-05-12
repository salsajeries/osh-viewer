<script setup>
import HeaderToolbar from '@/components/HeaderToolbar.vue'
import MapView from '@/components/MapView.vue'
import {OSHConnect, OSHNode} from '../services/osh-connect'

const connect = new OSHConnect()
const node = connect.createNode('test', 'localhost', 8282, 'sensorhub/api/', 'admin', 'admin')

const getSystems = () => {
  // This function will be called when the button is clicked
  console.log('Get Systems button clicked')
  console.log('Node:', node)
  node.getAllSystems()
}

const getDataStreams = () => {
  console.log('Get Data Streams button clicked')
  console.log('Node:', node)
  node.getAllDataStreams()
}
</script>

<template>
  <v-card>
    <HeaderToolbar />
<!--    <MapView></MapView>-->
    <v-btn @click="getSystems">Get Systems</v-btn>
    <v-btn @click="getDataStreams">Get DataStreams</v-btn>
  </v-card>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  width: 100vw;
  background-color: var(--color-background);
}

p {
  margin: 10px;
}
</style>
