// @ts-ignore
import randomUUID  from 'osh-js/source/core/utils/Utils.js'

export class OSHNode {
  id: string
  name: string
  children: OSHSystem[]
  link: string

  constructor(name: string, host: string, port: number, endpoint: string) {
    this.id = randomUUID();
    this.name = name
    this.children = []
    this.link = ''

  }
}

export class OSHSystem {
  id: string
  name: string
  type: string
  parentId: string | null
  children: OSHSystem[]
  datastreams: OSHDatastream[]

  constructor(id: string, name: string, type: string, parentId: string | null, data: any) {
    this.id = id
    this.name = name
    this.type = type
    this.parentId = parentId
    this.children = []
    this.datastreams = []
  }
}

export class OSHDatastream {
  id: string
  name: string
  type: string
  parentId: string | null
  observations: any[]

  constructor(id: string, name: string, type: string, parentId: string | null, data: any) {
    this.id = id
    this.name = name
    this.type = type
    this.parentId = parentId
    this.observations = []
  }
}

export class OSHControlStream {
  id: string
  name: string
  type: string
  parentId: string | null

  constructor(id: string, name: string, type: string, parentId: string | null, data: any) {
    this.id = id
    this.name = name
    this.type = type
    this.parentId = parentId
  }
}