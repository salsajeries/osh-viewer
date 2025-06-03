<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  vizType: { type: String, required: true },
  vizProps: { type: Object, default: () => ({}) },
  customClass: { type: String, default: '' },
});

// Map visualization types to components
const visualizationMap: Record<string, any> = {
  chart: () => import('./Chart.vue'),
  // Add more visualization types here as needed
};

const VisualizationComponent = computed(() => visualizationMap[props.vizType]);
</script>

<template>
  <div :class="['visualization-wrapper', customClass]">
    <slot name="before" />
    <component
      :is="VisualizationComponent"
      v-bind="vizProps"
      class="visualization-content"
    />
    <slot name="after" />
    <slot name="overlay" />
  </div>
</template>

<style scoped>
.visualization-wrapper {
  position: relative;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 1rem;
}
.visualization-content {
  width: 100%;
  height: 100%;
}
</style>

