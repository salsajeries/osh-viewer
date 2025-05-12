import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStreamStore = defineStore('datastreams', () => {
  const dataStreams = ref([])

  const addDataStream = (dataStream) => {
    dataStreams.value.push(dataStream)
  }

  const removeDataStream = (dataStream) => {
    dataStreams.value = dataStreams.value.filter(ds => ds !== dataStream)
  }

  const getDataStreamByName = (name) => {
    return dataStreams.value.find(dataStream => dataStream.name === name)
  }

  return { dataStreams, addDataStream, removeDataStream, getDataStreamByName }
})