<script setup lang="ts">

import { ref, onMounted, defineProps} from 'vue'
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
import VideoDataLayer from 'osh-js/source/core/ui/layer/VideoDataLayer.js'
import VideoView from 'osh-js/source/core/ui/view/video/VideoView.js'
import { createDefaultDataSource, createVideoDataSource } from '@/components/visualizations/DataComposables'
import { OSHDatastream, OSHVisualization } from '@/lib/OSHConnectDataStructs'

const props = defineProps({
  visualization: {
    type: OSHVisualization,
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
const videoCanvas = ref<HTMLCanvasElement | null>(null);
// const datasource = createDefaultDataSource(props.datastream)

onMounted(() => {
  console.log('Video component mounted with OSHVisualization:', props.visualization);

  const datasource = createVideoDataSource(props.visualization.parentDatastream);

  const videolayer = new VideoDataLayer({
    dataSourceId: datasource.id,
    getFrameData: (rec:any) =>  rec.img,
    getTimestamp: (rec:any) => rec.timestamp,
  })

  const videoView = new VideoView({
    container: videoDivId.value,
    css: "video-h264",
    // name: props.videoTitle,
    showTime: true,
    showStats: true,
    useWebCodecApi: true,
    width: 480,
    height: 360,
    layers: [videolayer]
  });
  // NOTE: The width and height parameters are disregarded in the standard OSH-JS.
  // If yours is not working, you may have to modify the source code of the VideoView class.
  // And you may need to modify WebCodecView, FFMPEGView, etc.

  datasource.connect();

  // to find video canvas
  let canvases = document.getElementById(videoDivId.value)?.getElementsByTagName("canvas")
  videoCanvas.value = canvases[0] as HTMLCanvasElement;
  console.log('[VideoVue] Video canvas element:', videoCanvas.value);
  videoCanvas.value.classList.add("test-canvas-class");
  videoCanvas.value.style.width = "480px";
});

</script>

<template>

  <div :id="videoDivId" class="video-container">
    <!-- Video content will be rendered here -->
  </div>

</template>

<style scoped>
.video-h264 {
  width: 100%;
  height: 100%;
}
</style>