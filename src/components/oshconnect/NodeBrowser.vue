<script setup>
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemstore.js'
import { useDataStreamStore } from '@/stores/datastreamstore.js'
import { useNodeStore } from '@/stores/nodestore.js'

const nodes = useNodeStore().nodes

</script>
<template>
  <v-treeview
    width="100%"
    :items="nodes"
    item-value="uuid"
    item-title="name"
    color="primary"
    theme="dark"
    activatable>
  </v-treeview>
</template>

<style scoped>

</style>