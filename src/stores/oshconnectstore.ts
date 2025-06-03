import { defineStore } from 'pinia'
import { OSHConnect } from '@/services/OSHConnectDataStructs'

export const useOSHConnectStore = defineStore('oshconnect', {
  state: () => ({
    instance: new OSHConnect()
  }),
  actions: {
    getInstance(): OSHConnect {
      return this.instance
    }
  }
})