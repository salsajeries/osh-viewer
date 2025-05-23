<script setup>
import HeaderToolbar from '@/components/HeaderToolbar.vue'
import MapView from '@/components/MapView.vue'
import {OSHConnect, OSHNode} from '../services/osh-connect.js'
import SystemBrowser from '@/components/oshconnect/SystemBrowser.vue'
import DataStreamBrowser from '@/components/oshconnect/DataStreamBrowser.vue'
import { useNodeStore } from '@/stores/nodestore.ts'

const connect = new OSHConnect()
const node = connect.createNode('test', 'localhost', 8282, 'sensorhub/api/', 'admin', 'admin')
const nodeStore = useNodeStore()

const getSystems = () => {
  // This function will be called when the button is clicked
  console.log('Get Systems button clicked')

  nodeStore.nodes.forEach(node => {
    console.log('Node:', node)
    node.getAllSystems()
  })
  // node.getAllSystems()
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
    <v-container>
      <v-row no-gutters align="stretch">
        <v-col cols="6">
          <v-sheet class="pa-2 ma-2" elevation="2" width="100%">
            <v-btn @click="getSystems">Get Systems</v-btn>
            <SystemBrowser></SystemBrowser>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet class="pa-2 ma-2" elevation="2" width="100%" rounded="20">
            <v-btn @click="getDataStreams">Get DataStreams</v-btn>
            <DataStreamBrowser></DataStreamBrowser>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
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
