<script setup>
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemstore.js'
import { useDataStreamStore } from '@/stores/datastreamstore.js'

const datastreams = useDataStreamStore().dataStreams

</script>
<template>
  <v-treeview
    width="100%"
    :items="datastreams"
    item-value="uuid"
    item-title="name"
    color="primary"
    theme="dark"
    activatable>
  </v-treeview>
</template>

<style scoped>

</style>