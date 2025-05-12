import Systems from 'osh-js/source/core/consysapi/system/Systems.js'
import SystemFilter from 'osh-js/source/core/consysapi/system/SystemFilter.js'
import System from 'osh-js/source/core/consysapi/system/System.js'
import Collection from 'osh-js/source/core/consysapi/Collection.js'
import { useNodeStore } from '@/stores/nodestore.js'
import { useSystemStore } from '@/stores/systemstore.js'
import {useDataStreamStore} from '@/stores/datastreamstore.js'
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'


export class OSHConnect {

  constructor() {
    this.nodeStore = useNodeStore()
  }

  createNode(name, host, port, endpoint, username, password) {
    let newNode = new OSHNode(name, host, port, endpoint, username, password)
    this.nodeStore.addNode(newNode)
    return newNode
  }
}

export class OSHNode {
  constructor(name, host, port, apiRoot, username, password) {
    this.name = name
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.apiRoot = apiRoot
    this.systems = []
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
    this.systems = retrievedSystems.map(sys => {
      return new CSSystem(sys)
    });
    console.log("created systems", this.systems)
    return this.systems;
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
}


export class CSSystem {
  // const systemStore = useSystemStore();

  constructor(system) {
    this. uuid = randomUUID();
    this.system = system
    this.systemStore = useSystemStore();
    this.systemStore.addSystem(this);
  }

  async getDataStreams() {
    let result = await this.system.searchDataStreams(undefined, 100);
    let dataStreams = []

    while(result.hasNext()) {
      let items = await result.nextPage()
      dataStreams.push(...items)
    }

    this.dataStreams = dataStreams.map(ds => {
      return new CSDataStream(ds)
    })

    return this.dataStreams
  }
}

export class CSDataStream {
  constructor(dataStream) {
    this.uuid = randomUUID();
    this.dataStream = dataStream
    this.datastreamStore = useDataStreamStore();
    this.datastreamStore.addDataStream(this);
  }
}