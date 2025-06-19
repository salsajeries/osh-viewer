<script setup lang="ts">

import { ref, onMounted, defineProps} from 'vue'
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
import VideoDataLayer from 'osh-js/source/core/ui/layer/VideoDataLayer.js'
import VideoView from 'osh-js/source/core/ui/view/video/VideoView.js'
import { createDefaultDataSource, createVideoDataSource } from '@/components/visualizations/DataComposables'
import { OSHDatastream } from '@/lib/OSHConnectDataStructs'

const props = defineProps({
  datastream: {
    type: OSHDatastream,
    required: true,
    default: null
  },
  videoTitle: {
    type: String,
    required: false,
    default: 'Video Stream'
  },
  showTime: {
    type: Boolean,
    required: false,
    default: true
  },
  showStats: {
    type: Boolean,
    required: false,
    default: true
  }
})

const videoDivId = ref('video-' + randomUUID());
// const datasource = createDefaultDataSource(props.datastream)

onMounted(() => {
  // This is where you would set up your video component
  // For example, you might want to initialize a video player or load a video source
  console.log('Video component mounted with datastream:', props.datastream);

  const datasource = createVideoDataSource(props.datastream);

  const videolayer = new VideoDataLayer({
    dataSourceId: datasource.id,
    getFrameData: (rec:any) =>  rec.img,
    getTimestamp: (rec:any) => rec.timestamp,
  })

  const videoView = new VideoView({
    container: videoDivId.value,
    // css: "video-h264",
    // name: props.videoTitle,
    showTime: true,
    showStats: true,
    useWebCodecApi: true,
    layers: [videolayer]
  });

  datasource.connect();
});

</script>

<template>

  <div :id="videoDivId" class="video-container">
    <!-- Video content will be rendered here -->
  </div>

</template>

<style scoped>

</style>