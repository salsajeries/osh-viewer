<script setup>
</script>

<template>
  <v-toolbar title="OSH Viewer" color="blue" density="comfortable">
    <v-btn icon="mdi-home" to="/" />
    <v-btn icon plain to="/nodemanager">
      <v-icon>mdi-server</v-icon>
      <v-tooltip activator="parent" location="bottom">
        Node Manager
      </v-tooltip>
    </v-btn>
    <v-btn icon="mdi-account" />
    <v-btn icon="mdi-menu" />
    <v-btn icon="mdi-magnify" />
  </v-toolbar>
</template>

<style scoped>
/*header {
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  align-items: start;
  padding: 0.5rem;
  background-color: var(--color-background-soft);
}*/
</style>