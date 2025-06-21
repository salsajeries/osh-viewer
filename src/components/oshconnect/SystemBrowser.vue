<script setup>
import { computed, ref } from 'vue'
import { useSystemStore } from '@/stores/systemstore.ts'
import { useNodeStore } from '@/stores/nodestore.js'
import { useOSHConnectStore } from '@/stores/oshconnectstore.js'
import { useDataStreamStore } from '@/stores/datastreamstore.js'
import { useUIStore } from '@/stores/uistore.ts'
import { useVisualizationStore } from '@/stores/visualizationstore.js'
import { checkDSForProp, mineDatasourceObsProps } from '@/lib/DatasourceUtils.js'
import { OSHVisualization } from '@/lib/OSHConnectDataStructs.js'
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'

const oshConnect = useOSHConnectStore().getInstance();
const nodeStore = useNodeStore()
const systems = useSystemStore().systems
const datastreamStore = useDataStreamStore()
const visualizationStore = useVisualizationStore()
const uiStore = useUIStore()
const activeTab = ref('systems') // Default active tab
const tabLabels = ref(['Systems', 'DataStreams', 'Nodes'])

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

const addVisualization = (item) => {
  console.log('Item properties:', Object.keys(item));
  console.log('Add Visualization button clicked for item:', item);
  uiStore.setSelectedDatastream(item)
  const { ds, observedProps } = mineDatasourceObsProps()

  console.log('Observed Props:', observedProps)
  if (checkDSForProp('SensorLocation', observedProps)) {
    console.log('Location property found, adding visualization')
    const newMapViz = new OSHVisualization('pointmarker-' + randomUUID(),
      item.name,
      'pointmarker',
      null,
      ds
    )

    visualizationStore.addVisualization(newMapViz);
  }
}

const getItemChildren = computed(() => {
  return (item) => {
    return item?.getDSChildren ? item.getDSChildren() : []
  }
})

</script>
<template>
  <v-tabs
    v-model="activeTab">
    <v-tab
      v-for="(label, index) in tabLabels"
      :key="index"
      :value="label.toLowerCase()">
      {{ label }}

    </v-tab>
  </v-tabs>
  <v-btn @click="fetchResources">Fetch Resources</v-btn>
  <v-btn @click="getSystems">Get Systems</v-btn>
  <v-btn @click="getAllDatastreams">Get DataStreams</v-btn>

  <v-tabs-window v-model="activeTab">
    <v-tabs-window-item value="systems">
      <v-treeview
        width="100%"
        :items="systems"
        item-value="uuid"
        item-title="name"
        :item-children="getItemChildren"
        color="primary"
        theme="dark"
        activatable>
        <template v-slot:prepend>
          <v-icon icon="mdi-cogs"></v-icon>
        </template>
      </v-treeview>
    </v-tabs-window-item>

    <v-tabs-window-item value="datastreams">
      <v-treeview
        width="100%"
        :items="datastreamStore.dataStreams"
        item-value="uuid"
        item-title="name"
        color="primary"
        theme="dark"
        activatable>
        <template v-slot:prepend>
          <v-icon icon="mdi-cable-data"></v-icon>
        </template>
        <template v-slot:append="{ item }">
          <v-tooltip text="Add Visualization" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-eye-plus" size="small" @click="() => addVisualization(item)"></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Properties" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-list-box-outline" size="small"></v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-treeview>
    </v-tabs-window-item>

    <v-tabs-window-item value="nodes">
      <v-treeview
        width="100%"
        :items="nodeStore.nodes"
        item-value="uuid"
        item-title="name"
        color="primary"
        theme="dark"
        activatable>
        <template v-slot:prepend>
          <v-icon icon="mdi-server"></v-icon>
        </template>
      </v-treeview>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<style scoped>

</style>
