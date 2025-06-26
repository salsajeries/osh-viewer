import { useUIStore } from '@/stores/uistore'
import DataStreamFilter from 'osh-js/source/core/sweapi/datastream/DataStreamFilter'

export function mineDatasourceObsProps(): {ds: any, observedProps: any} {

  const uiStore = useUIStore()
  const ds = uiStore.selectedDatastream

  if (!ds) {
    console.warn('No datastream selected');
  }

  const observedProps = ds.datastream.properties?.observedProperties || []
  console.log('[DS-Utils] Observed Properties:', observedProps)

  fetchSchema(ds.datastream);

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

export function checkDSForProps(propNames: string[], observedProps: any): any {
  let results: any = {};

  for (const propName of propNames) {
    const res = checkDSForProp(propName, observedProps);
    if (res !== false) {
      results[propName] = res;
    }
  }

  if (Object.keys(results).length === 0) {
    return false;
  } else {
    return results;
  }
}

export async function fetchSchema(datastream: any) {
  let filter = new DataStreamFilter({obsFormat: 'application/swe+json'})
  return datastream.getSchema(filter)
    .then((schemaRes: any) => {
      console.log('[DatasourceUtils] Schema fetched:', schemaRes);
      return schemaRes;
    });
}

export function matchPropAndSchema(observedProp: any, schema: any[]): any {
  let matchedProps: any = {};

  schema.filter((schemaEntry: any) => {
    if (schemaEntry.definition.includes(observedProp.definition)) {
      matchedProps[observedProp.definition] = {
        observedProperty: observedProp,
        schemaEntry: schemaEntry
      };
      return schemaEntry;
    }
    return false;
  })

  return matchedProps;
}


export class VisualizationMetadata {
  id: string;
  type: string;
  datastreamId: string;
  observedProperty: string;

  constructor(id: string, type: string, datastreamId: string, observedProperty: string) {
    this.id = id;
    this.type = type;
    this.datastreamId = datastreamId;
    this.observedProperty = observedProperty;
  }
}

export class SchemaFieldProperty {
  definition: string;
  name: string;
  type: string;
  referenceFrame?: string;
  uom?: any;

  constructor(definition: string, name: string, type: string, unitOfMeasure?: string) {
    this.definition = definition;
    this.name = name;
    this.type = type;
    this.uom = unitOfMeasure;
  }
}