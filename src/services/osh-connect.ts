// @ts-ignore
import Systems from 'osh-js/source/core/consysapi/system/Systems.js'
// @ts-ignore
import SystemFilter from 'osh-js/source/core/consysapi/system/SystemFilter.js'
// @ts-ignore
import System from 'osh-js/source/core/consysapi/system/System.js'
// @ts-ignore
import Collection from 'osh-js/source/core/consysapi/Collection.js'
import { useNodeStore } from '@/stores/nodestore'
import { useSystemStore } from '@/stores/systemstore'
import { useDataStreamStore } from '@/stores/datastreamstore'
// @ts-ignore
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'

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
}

export class OSHNode {
  name: string;
  host: string;
  port: string | number;
  username: string;
  password: string;
  apiRoot: string;
  systems: CSSystem[];
  oshConnect: OSHConnect;
  systemStore: any;

  constructor(
    name: string,
    host: string,
    port: string | number,
    apiRoot: string,
    username: string,
    password: string,
    oshConnect: OSHConnect
  ) {
    this.name = name;
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.apiRoot = apiRoot;
    this.systems = [];
    this.oshConnect = oshConnect;
    this.systemStore = getSharedStores().systemStore;
  }

  async getAllSystems(): Promise<CSSystem[]> {
    const systems: any = new Systems({ endpointUrl: this.getEndpointUrl(), tls: false });
    let retrievedSystems: any[] = [];
    const results: System = await systems.searchSystems(new SystemFilter(), 100);

    while (results.hasNext()) {
      console.log('New Page found, Collecting...');
      const items: any[] = await results.nextPage();
      retrievedSystems.push(...items);
    }

    console.log('retrievedSystems', retrievedSystems);
    const mappedSystems: CSSystem[] = retrievedSystems.map((sys: any) => {
      if (!this.systemStore.checkIfSystemExists(sys.properties.id)) {
        const newSys = new CSSystem(sys, this);
        this.systemStore.addSystem(newSys);
        return newSys;
      }
      return undefined;
    }).filter(Boolean) as CSSystem[];

    this.systems = mappedSystems;
    return mappedSystems;
  }

  async getAllDataStreams(): Promise<void> {
    console.log('getting all data streams', this.systems);
    this.systems.forEach((item) => {
      item.getDataStreams();
    });
  }

  getEndpointUrl(): string {
    return `${this.host}:${this.port}/${this.apiRoot}`;
  }

  // getDSStore(): any {
  //   return this.oshConnect.datastreamStore;
  // }
}

export class CSSystem {
  uuid: string;
  id: string;
  name: string;
  system: any;
  parentNode: OSHNode;
  datastreamStore: any;
  dataStreams?: CSDataStream[];

  constructor(system: any, parentNode: OSHNode) {
    this.uuid = randomUUID();
    this.id = system.properties.id;
    this.name = system.properties.properties.name;
    this.system = system;
    this.parentNode = parentNode;
    const stores = getSharedStores();
    this.datastreamStore = stores.datastreamStore;
  }

  async getDataStreams(): Promise<CSDataStream[]> {
    const result: any = await this.system.searchDataStreams(undefined, 100);
    let dataStreams: any[] = [];

    while (result.hasNext()) {
      const items: any[] = await result.nextPage();
      dataStreams.push(...items);
    }

    console.log('dataStreams', dataStreams);

    const mappedStreams: CSDataStream[] = dataStreams.map((ds: any) => {
      if (!this.datastreamStore.checkIfDataStreamExists(ds.properties.id)) {
        const newDS = new CSDataStream(ds, this);
        this.datastreamStore.addDataStream(newDS);
        return newDS;
      }
      return undefined;
    }).filter(Boolean) as CSDataStream[];

    this.dataStreams = mappedStreams;
    return mappedStreams;
  }

  // getDSStore(): any {
  //   return this.parentNode.getDSStore();
  // }
}

export class CSDataStream {
  uuid: string;
  dataStream: any;
  name: string;
  parentSystem: CSSystem;

  constructor(dataStream: any, parentSystem: CSSystem) {
    this.uuid = randomUUID();
    this.dataStream = dataStream;
    this.name = dataStream.properties.name;
    this.parentSystem = parentSystem;
  }
}

