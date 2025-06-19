<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
// @ts-ignore
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
// @ts-ignore
import { createDefaultDataSource } from './DataComposables'
// @ts-ignore
import SweApi  from 'osh-js/source/core/datasource/sweapi/SweApi.datasource.js'
// import SweApiDatasource from "osh-js/core/datasource/sweapi/SweApi.datasource";
// import DataSynchronizer from 'osh-js/core/timesync/DataSynchronizer';
// @ts-ignore
import { Mode } from 'osh-js/source/core/datasource/Mode'
// @ts-ignore
import ChartJsView from 'osh-js/source/core/ui/view/chart/ChartJsView.js'
// @ts-ignore
import CurveLayer from 'osh-js/source/core/ui/layer/CurveLayer.js'
import DataSynchronizer from 'osh-js/source/core/timesync/DataSynchronizer.js'

import ConSysApi from 'osh-js/source/core/datasource/consysapi/ConSysApi.datasource'

// Generate a random ID when the component is created
const chartId = ref('chart-' + randomUUID())
const chartDatasource = ref<any>(null)
let chartLayer: any = null
let chartView: any = null

const props = defineProps({
  datastream: {
    type: Object,
    required: false,
    default: null
  }
})

function setChartDatasource() {
  if (props.datastream) {
    // this should be a valid the CS API Datastream
    chartDatasource.value = props.datastream.datastream
    return
  }
  const ds = new SweApi('test-chart', {
    endpointUrl: 'localhost:8282/sensorhub/api',
    resource: '/datastreams/efd58gkad5hfq/observations',
    tls: false,
    startTime: 'now',
    endTime: '2025-08-01T00:00:00Z',
    mode: Mode.REAL_TIME,
    responseFormat: 'application/swe+json'
  })
  chartDatasource.value = ds
}

onMounted(() => {
  setChartDatasource()
  const ds = chartDatasource.value;
  const dsConverted = new ConSysApi(ds.properties.name, {
    endpointUrl: ds.networkProperties.endpointUrl,
    resource: `/datastreams/${ds.properties.id}/observations`,
    tls: false,
    protocol: 'ws',
    startTime: 'now',
    endTime: '2025-08-01T00:00:00Z',
    mode: Mode.REAL_TIME,
    responseFormat: 'application/swe+json'
  })

  chartLayer = new CurveLayer({
    maxValues: 1000,
    // dataSourceId: chartDatasource.value.properties.id,
    dataSourceId: dsConverted.id,
    getValues: (rec: any, timestamp: any) => {
      console.log(`getValues called for record: ${rec}`)
      return {
        x: rec.timestamp,
        y: rec.temperature
      }
    },
    lineColor: 'rgba(0,220,204,0.5)',
    backgroundColor: 'rgba(49,47,47,0.64)',
    fill: true,
    getCurveId: (rec: any, timestamp: any) => 2,
    name: 'Temperature (°)'
  })

  chartView = new ChartJsView({
    container: chartId.value,
    layers: [chartLayer],
    css: 'chart-view',
    datasetOptions: {
      tension: 0.2 // for 'line'
    },
    refreshRate: 1000
  })

  if (chartDatasource.value && typeof chartDatasource.value.connect === 'function') {
    console.log(`Connecting to datasource: ${chartDatasource.value}`)
    // chartDatasource.value.streamObservations(undefined, (data: any) => {
    //   console.log('Received data:', data)
    // });

    dsConverted.connect();

    // const dataSynchronizer = new DataSynchronizer({
    //   replaySpeed: 1,
    //   dataSources: [chartDatasource.value]
    // })
    // dataSynchronizer.connect();
  }
})
</script>

<template>
  <div :id="chartId">
    <p>I'm a Chart</p>
  </div>
</template>

<style scoped>

</style>
