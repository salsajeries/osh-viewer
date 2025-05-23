<script setup>
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemstore.ts'
import { useDataStreamStore } from '@/stores/datastreamstore.ts'
import { useNodeStore } from '@/stores/nodestore.ts'

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