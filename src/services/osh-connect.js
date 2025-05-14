import Systems from 'osh-js/source/core/consysapi/system/Systems.js'
import SystemFilter from 'osh-js/source/core/consysapi/system/SystemFilter.js'
import System from 'osh-js/source/core/consysapi/system/System.js'
import Collection from 'osh-js/source/core/consysapi/Collection.js'
import { useNodeStore } from '@/stores/nodestore.js'
import { useSystemStore } from '@/stores/systemstore.js'
import {useDataStreamStore} from '@/stores/datastreamstore.js'
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'

let sharedStores = null;

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

  constructor() {
    const stores = getSharedStores()
    this.nodeStore = stores.nodeStore
  }

  createNode(name, host, port, endpoint, username, password) {
    let newNode = new OSHNode(name, host, port, endpoint, username, password, this)
    this.nodeStore.addNode(newNode)
    return newNode
  }
}

export class OSHNode {
  constructor(name, host, port, apiRoot, username, password, oshConnect) {
    this.name = name
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.apiRoot = apiRoot
    this.systems = []
    this.oshConnect = oshConnect
    this.systemStore = getSharedStores().systemStore
  }

  async getAllSystems() {
    let systems = new Systems({ endpointUrl: this.getEndpointUrl(), tls: false })
    let retrievedSystems = []
    let results = await systems.searchSystems(new SystemFilter(), 100)

    while (results.hasNext()) {
      console.log('New Page found, Collecting...')
      let items = await results.nextPage()
      retrievedSystems.push(...items)
    }

    console.log('retrievedSystems', retrievedSystems)
    retrievedSystems = retrievedSystems.map(sys => {
      if (!this.systemStore.checkIfSystemExists(sys.properties.id)) {
        let newSys = new CSSystem(sys, this)
        this.systemStore.addSystem(newSys)
        return newSys
      }
    });

    this.systems = retrievedSystems;

    return retrievedSystems;
  }

  async getAllDataStreams() {
    console.log("getting all data streams", this.systems)
    this.systems.map(item => {
      item.getDataStreams()
    })
  }

  getEndpointUrl() {
    return `${this.host}:${this.port}/${this.apiRoot}`
  }

  getDSStore() {
    return this.oshConnect.datastreamStore
  }
}


export class CSSystem {
  // const systemStore = useSystemStore();

  constructor(system, parentNode) {
    this.uuid = randomUUID()
    this.id = system.properties.id
    this.name = system.properties.properties.name
    this.system = system
    this.parentNode = parentNode
    const stores = getSharedStores()
    this.datastreamStore = stores.datastreamStore
  }

  async getDataStreams() {
    let result = await this.system.searchDataStreams(undefined, 100);
    let dataStreams = []

    while(result.hasNext()) {
      let items = await result.nextPage()
      dataStreams.push(...items)
    }

    console.log('dataStreams', dataStreams)

    this.dataStreams = dataStreams.map(ds => {
      if(!this.datastreamStore.checkIfDataStreamExists(ds.properties.id)) {
        let newDS = new CSDataStream(ds)
        this.datastreamStore.addDataStream(newDS)
        return newDS
      }
    })

    return this.dataStreams
  }

  getDSStore() {
    return this.parentNode.getDSStore();
  }
}

export class CSDataStream {
  constructor(dataStream, parentSystem) {
    this.uuid = randomUUID();
    this.dataStream = dataStream
    this.name = dataStream.properties.name
    this.parentSystem = parentSystem
  }
}