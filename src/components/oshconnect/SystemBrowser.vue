<script setup>
import { computed, ref } from 'vue'
import { useSystemStore } from '@/stores/systemstore.ts'
import { useNodeStore } from '@/stores/nodestore.js'
import { useOSHConnectStore } from '@/stores/oshconnectstore.js'

const oshConnect = useOSHConnectStore().getInstance();
const nodeStore = useNodeStore()
const systems = useSystemStore().systems

const getSystems = () => {
  // This function will be called when the button is clicked
  console.log('Get Systems button clicked')

  nodeStore.nodes.forEach((node) => {
    console.log('Node:', node)
    node.getAllSystems()
  })
  // node.getAllSystems()
}

const getAllDatastreams = () => {
  console.log('Get Data Streams button clicked')
  nodeStore.nodes.forEach((node) => {
    console.log('Node:', node)
    node.getAllDataStreams()
  })
}

const fetchResources = () => {
  console.log('Fetch Resources button clicked', oshConnect)
  oshConnect.fetchSlowResources();
}

const getItemChildren = computed(() => {
  return (item) => {
    return item?.getDSChildren ? item.getDSChildren() : []
  }
})

</script>
<template>
  <v-btn @click="fetchResources">Fetch Resources</v-btn>
  <v-btn @click="getSystems">Get Systems</v-btn>
  <v-btn @click="getAllDatastreams">Get DataStreams</v-btn>
  <v-treeview
    width="100%"
    :items="systems"
    item-value="uuid"
    item-title="name"
    :item-children="getItemChildren"
    color="primary"
    theme="dark"
    activatable>
  </v-treeview>
</template>

<style scoped>

</style>
