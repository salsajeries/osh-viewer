import { useUIStore } from '@/stores/uistore'

export function mineDatasourceObsProps(): {ds: any, observedProps: any} {

  const uiStore = useUIStore()
  const ds = uiStore.selectedDatastream

  if (!ds) {
    console.warn('No datastream selected');
  }

  const observedProps = ds.datastream.properties?.observedProperties || []
  console.log('[DS-Utils] Observed Properties:', observedProps)

  return { ds, observedProps };
}

export function checkDSForProp(propName: string, observedProps: any): any {
  for(const prop of observedProps) {
    if (prop.definition.includes(propName)) {
      console.log(`[DS-Utils] Found property: ${propName}`);
      return prop;
    }
  }

  return false;
}

export class VisualizationMetadata {
  id: string;
  type: string;
  datastreamId: string;
  observedProperty: string;

  constructor(id: string, type: string, datastreamId: string) {
    this.id = id;
    this.type = type;
    this.datastreamId = datastreamId;
    this.observedProperty = '';
  }
}