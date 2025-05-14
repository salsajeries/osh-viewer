<script setup>
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemstore.js'

const systems = useSystemStore().systems

</script>
<template>
  <v-treeview
    width="100%"
    :items="systems"
    item-value="uuid"
    item-title="name"
    item-children="dataStreams"
    color="primary"
    theme="dark"
    activatable>
  </v-treeview>
</template>

<style scoped>

</style>