<script setup lang="ts">
import { fetchSchema, mineDatasourceObsProps, SchemaFieldProperty } from '@/lib/DatasourceUtils'
import { OSHVisualization } from '@/lib/OSHConnectDataStructs'
import { nextTick, onMounted, ref, watch } from 'vue'
import { randomUUID } from 'osh-js/source/core/utils/Utils'
import { useVisualizationStore } from '@/stores/visualizationstore'
import { useUIStore } from '@/stores/uistore'
import DataSourcePicker from '@/components/menus/DataSourcePicker.vue'

const props = defineProps<{
  // onAddVideo: () => void;
  // observedProperties: any[];
  // dsName: string;
}>()

const isOpen = ref<boolean>(false)
const visualizationStore = useVisualizationStore()
const videoDS = ref<any>(null)
// const selectedProperty = ref<SchemaFieldProperty | null>(null)
const selectedProperty = defineModel('selectedProperty', {
  type: SchemaFieldProperty,
  default: null
})
// const videoType = ref<string>('H264') // Default video type
const videoType = defineModel('videoType', {
  type: String,
  default: 'H264'
})
const obsProps = ref<{ 'definition': string, 'label': string }[]>([])
const dsSchema = ref<any>(null)
const uiStore = useUIStore()

const emit = defineEmits(['update:selectedProperty', 'update:videoType'])

async function fetchProps() {
  const { ds, observedProps } = mineDatasourceObsProps()
  videoDS.value = ds
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

watch(videoType, (val) => {
  console.log('[VideoOptions] Video type changed:', val)
  emit('update:videoType', val)
})
</script>

<template>
  <v-card>
    <DataSourcePicker title="Video Options" v-model:selectedProperty="selectedProperty" />

    <v-card class="pa-4" elevation="2">
      <h3>Video Type</h3>
      <v-radio-group v-model="videoType">
        <v-radio :value="'H264'" label="H264" />
        <v-radio :value="'MJPEG'" label="MJPEG" />
      </v-radio-group>
    </v-card>

  </v-card>
</template>

<style scoped>

</style>