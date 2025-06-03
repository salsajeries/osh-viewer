<script setup>

import NodeManager from '@/components/oshconnect/NodeManager.vue'
import NodeBrowser from '@/components/oshconnect/NodeBrowser.vue'
import HeaderToolbar from '@/components/HeaderToolbar.vue'
</script>

<template>
  <v-card theme="dark">
    <v-container>
      <v-row no-gutters align="stretch">
        <v-col cols="12" md="4">
          <NodeManager></NodeManager>
        </v-col>
        <v-col cols="12" md="4">
          <v-card title="Nodes" width="100%">
            <NodeBrowser></NodeBrowser>
          </v-card>
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

</style>