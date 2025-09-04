// @ts-ignore
import { randomUUID }  from 'osh-js/source/core/utils/Utils.js'
import Systems from 'osh-js/source/core/sweapi/system/Systems.js'
import SystemFilter from 'osh-js/source/core/sweapi/system/SystemFilter.js'
import System from 'osh-js/source/core/sweapi/system/System.js'
import DataSynchronizer from 'osh-js/source/core/timesync/DataSynchronizer.js'
import FeatureOfInterestFilter from 'osh-js/source/core/sweapi/featureofinterest/FeatureOfInterestFilter.js'
import { useNodeStore } from '@/stores/nodestore'
import { useSystemStore } from '@/stores/systemstore'
import { useDataStreamStore } from '@/stores/datastreamstore'
import { VisualizationComponents } from '@/lib/VisualizationHelpers'

let sharedStores: any = null;

function getSharedStores() {
  if (!sharedStores) {
    sharedStores = {
      nodeStore: useNodeStore(),
      systemStore: useSystemStore(),
      datastreamStore: useDataStreamStore()
    }
  }
  return sharedStores;
}

export class OSHConnect {
  nodeStore: any;

  constructor() {
    const stores = getSharedStores()
    this.nodeStore = stores.nodeStore
  }

  createNode(
    name: string,
    host: string,
    port: string | number,
    endpoint: string,
    username: string,
    password: string
  ): OSHNode {
    const newNode = new OSHNode(
      name,
      host,
      port,
      endpoint,
      username,
      password,
      this
    );
    this.nodeStore.addNode(newNode);
    return newNode;
  }

  // Fetch all resources that are relatively static
  fetchSlowResources(): void {
    console.log('Fetching slow resources...');
    // fetch all systems of all nodes'
    const nodes = this.nodeStore.nodes;
    for (const node of nodes) {
      node.collectAndStoreSystems()
        .then((systems: OSHSystem[]) => {
          console.log(`Collected ${systems.length} systems for node ${node.name}`);
        })
        .catch((error: any) => {
          console.error(`Error collecting systems for node ${node.name}:`, error);
        });
    }
  }

  fetchDataStreamsOfSystem(system: OSHSystem): void {
    const datastreamStore = getSharedStores().datastreamStore;
    system.getDataStreams()
      .then((dataStreams: any[]) => {
        console.log(`Collected ${dataStreams.length} data streams for system ${system.name}`);
      })
      .catch((error: any) => {
        console.error(`Error collecting data streams for system ${system.name}:`, error);
      });
  }
}

export class OSHNode {
  uuid: string;
  name: string;
  children: OSHSystem[] = [];
  link: string = '';
  host: string = '';
  port: string | number = '';
  username: string = '';
  password: string = '';
  apiRoot: string = '';
  systems: OSHSystem[] = [];
  oshConnect: OSHConnect;

  constructor(
    name: string,
    host: string,
    port: number | string,
    apiRoot: string,
    username: string,
    password: string,
    oshConnect: OSHConnect
  ) {
    this.uuid = randomUUID();
    this.name = name;
    this.host = host;
    this.port = port;
    this.apiRoot = apiRoot;
    this.username = username;
    this.password = password;
    this.children = [];
    this.oshConnect = oshConnect;
  }

  async collectAndStoreSystems(): Promise<OSHSystem[]> {
    // make request
    const systems: any = new Systems({ endpointUrl: this.getEndpointUrl(), tls: false });
    let retrievedSystems: any[] = [];
    const results: System = await systems.searchSystems(new SystemFilter(), 100);

    // collect all results
    while (results.hasNext()) {
      const items: any[] = await results.nextPage();
      retrievedSystems.push(...items);
    }

    const systemStore = getSharedStores().systemStore;

    // transform results into OSHSystem objects for state management and keep OSH-JS references
    const mappedSystems: OSHSystem[] = retrievedSystems.map((sys: any) => {
      if (!systemStore?.checkIfSystemExists?.(sys.properties.id)) {
        const newSys = new OSHSystem(sys, this);
        newSys.getDataStreams();
        newSys.getSamplingFeatures();
        systemStore?.addSystem?.(newSys);
        return newSys;
      }
      return undefined;
    }).filter(Boolean) as OSHSystem[];

    this.systems = mappedSystems;
    return mappedSystems;
  }

  getEndpointUrl(): string {
    return `${this.host}:${this.port}/${this.apiRoot}`;
  }
}

export class OSHSystem {
  uuid: string;
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  system: System;
  parentNode: OSHNode;
  children: string[];
  subsystems: string[] = [];
  samplingFeatures: any[]= [];

  constructor(system: any, parentNode: OSHNode) {
    this.uuid = randomUUID();
    this.id = system.properties.id;
    this.name = system.properties.properties.name;
    this.type = system.properties.type;
    this.parentId = system.properties.parentId || null;
    this.system = system;
    this.parentNode = parentNode;
    this.children = [];
  }

  async getDataStreams(): Promise<any[]> {
    const result: any = await this.system.searchDataStreams(undefined, 100);
    let dataStreams: any[] = [];

    const datastreamStore = getSharedStores().datastreamStore;

    while (result.hasNext()) {
      const items: any[] = await result.nextPage();
      // dataStreams.push(...items);

      // create new OSHDatastream objects for each item
      items.forEach((item: any) => {
        console.log(`result data:`, item)
        const newStream = new OSHDatastream(item.properties.name, item, this.id);
        datastreamStore?.addDataStream?.(newStream);
        this.children.push(newStream.uuid)
      });
    }
    return dataStreams;
  }

  async getSamplingFeatures(): Promise<any[]> {
    const result: any = await this.system.searchFeaturesOfInterest(new FeatureOfInterestFilter(), 100);
    let samplingFeatures: any[] = [];

    while (result.hasNext()) {
      const items: any[] = await result.nextPage();
      samplingFeatures.push(...items);
    }
    this.samplingFeatures = samplingFeatures;
    console.log('[OSHConnect-System] Collected sampling features:', samplingFeatures);
    return samplingFeatures;
  }

  getDSChildren(): OSHDatastream[] {
    const datastreamStore = getSharedStores().datastreamStore;
    return datastreamStore.getDataStreamsById(this.children)
  }
}

export class OSHDatastream {
  uuid: string
  name: string
  id: string
  parentId: string | null
  datastream: any
  children: string[] = [];

  constructor(name: string, datastream: any, parentId: string) {
    this.uuid = randomUUID();
    this.name = name
    this.parentId = parentId
    this.datastream = datastream;
    this.id = datastream.properties.id;
  }

  registerWithSynchronizer(synchronizer: DataSynchronizer): void {
    synchronizer.addDataSource(this.datastream);
  }

  getParentSystem(): OSHSystem {
    const systemStore = getSharedStores().systemStore;
    return systemStore.getSystemById(this.parentId);
  }
}

export class OSHControlStream {
  id: string
  name: string
  type: string
  parentId: string | null

  constructor(name: string, type: string, parentId: string | null, data: any) {
    this.id = randomUUID();
    this.name = name
    this.type = type
    this.parentId = parentId
  }
}

export class OSHVisualization {
  id: string
  name: string
  type: string
  parentId: string | null
  parentDatastream: OSHDatastream
  visualizationComponents!: VisualizationComponents

  constructor(id: string, name: string, type: string, parentId: string | null, parentDatastream: OSHDatastream) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.parentId = parentId;
    this.parentDatastream = parentDatastream;
  }

  setVisualizationComponents(components: VisualizationComponents): void {
    this.visualizationComponents = components;
  }
}
