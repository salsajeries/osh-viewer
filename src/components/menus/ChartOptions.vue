<script setup lang="ts">
import { fetchSchema, mineDatasourceObsProps, SchemaFieldProperty } from '@/lib/DatasourceUtils'
import { OSHVisualization } from '@/lib/OSHConnectDataStructs'
import { nextTick, onMounted, ref, watch } from 'vue'
import { randomUUID } from 'osh-js/source/core/utils/Utils'
import { useVisualizationStore } from '@/stores/visualizationstore'
import { useUIStore } from '@/stores/uistore'

const props = defineProps<{
  // onAddChart: () => void;
  // observedProperties: any[];
  // dsName: string;
}>()

const isOpen = ref<boolean>(false)
const visualizationStore = useVisualizationStore()
const chartDS = ref<any>(null)
const selectedProperty = ref<SchemaFieldProperty | null>(null)
const obsProps = ref<{ 'definition': string, 'label': string }[]>([])
const dsSchema = ref<any>(null)
const uiStore = useUIStore()

const emit = defineEmits(['update:selectedProperty'])

async function fetchProps() {
  const { ds, observedProps } = mineDatasourceObsProps()
  chartDS.value = ds
  obsProps.value = observedProps

  const schema = await fetchSchema(ds.datastream)
  dsSchema.value = schema
}

onMounted(async () => {
  fetchProps()
})

watch(selectedProperty, (val) => {
  emit('update:selectedProperty', val)
})
</script>

<template>
  <v-card class="pa-4" elevation="2">
    <h3 class="mb-4">Chart Options</h3>
    <v-radio-group v-model="selectedProperty" v-if="dsSchema">
      <v-radio disabled :value="null">
        <template v-slot:label>
          <div class="property-row no-wrap">
            <span class="pa-2 property-label font-weight-bold">Label</span>
            <span class="pa-2 property-name">Name</span>
            <span class="pa-2 property-definition">Definition</span>
          </div>
        </template>
      </v-radio>
      <v-radio
        v-for="property in dsSchema.recordSchema.fields"
        :key="property.definition"
        :value="property">
        <template v-slot:label>
          <div class="property-row no-wrap">
            <span class="pa-2 property-label font-weight-bold">{{ property.label }}</span>
            <span class="pa-2 property-name text-grey-darken-1">{{ property.name }}</span>
            <span class="pa-2 property-definition text-caption text-grey">{{ property.definition }}</span>
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </v-card>
</template>

<style scoped>

</style>