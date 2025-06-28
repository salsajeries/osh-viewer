import SweApi from 'osh-js/source/core/datasource/sweapi/SweApi.datasource.js'

export interface IVisualizationHelper {
}

export interface DataSourceProperties {
}

export interface ISweApiDataSourceProperties extends DataSourceProperties{
  endpointUrl: string
  resource: string
  tls: boolean
  protocol: string
  startTime?: string
  endTime?: string
  mode: string
  responseFormat: string
}

export interface DataLayerProperties {

}

export interface DataViewProperties {

}

export interface ICurveLayerProperties extends DataLayerProperties{
  maxValues: number
  dataSourceId: string
  getValues: (rec: any, timestamp: any) => { x: any, y: any }
  lineColor: string
  backgroundColor: string
  fill: boolean
  getCurveId?: (rec: any, timestamp: any) => string
  name: string
}

export class ChartHelper implements IVisualizationHelper {
  xAxisProperty: string
  yAxisProperty: string
  xAxisLabel: string

  constructor(xAxisProperty: string, yAxisProperty: string, xAxisLabel: string) {
    this.xAxisProperty = xAxisProperty
    this.yAxisProperty = yAxisProperty
    this.xAxisLabel = xAxisLabel
  }
}

export interface IChartViewProperties extends DataViewProperties{
  container: string
  layers: ICurveLayerProperties[]
  css: string
  datasetOptions?: any
  refreshRate?: number
}

export class VisualizationComponents {
  dataLayer: DataLayerProperties
  dataView: DataViewProperties
  dataSource: DataSourceProperties

  constructor(datasource: SweApi, dataLayer: any, dataView: any) {
    this.dataSource = datasource
    this.dataLayer = dataLayer
    this.dataView = dataView
  }
}

export class SweApiDataSourceProperties implements ISweApiDataSourceProperties {
  endpointUrl: string;
  resource: string;
  tls: boolean;
  protocol: string;
  startTime?: string;
  endTime?: string;
  mode: string;
  responseFormat: string;

  constructor(props: ISweApiDataSourceProperties) {
    this.endpointUrl = props.endpointUrl;
    this.resource = props.resource;
    this.tls = props.tls;
    this.protocol = props.protocol;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.mode = props.mode;
    this.responseFormat = props.responseFormat;
  }
}

export class CurveLayerProperties implements ICurveLayerProperties {
  maxValues: number;
  dataSourceId: string;
  getValues: (rec: any, timestamp: any) => { x: any, y: any };
  lineColor: string;
  backgroundColor: string;
  fill: boolean;
  getCurveId?: (rec: any, timestamp: any) => string;
  name: string;

  constructor(props: ICurveLayerProperties) {
    this.maxValues = props.maxValues;
    this.dataSourceId = props.dataSourceId;
    this.getValues = props.getValues;
    this.lineColor = props.lineColor;
    this.backgroundColor = props.backgroundColor;
    this.fill = props.fill;
    this.getCurveId = props.getCurveId;
    this.name = props.name;
  }
}

export class ChartViewProperties implements IChartViewProperties {
  container: string;
  layers: ICurveLayerProperties[];
  css: string;
  datasetOptions?: any;
  refreshRate?: number;

  constructor(props: IChartViewProperties) {
    this.container = props.container;
    this.layers = props.layers;
    this.css = props.css;
    this.datasetOptions = props.datasetOptions;
    this.refreshRate = props.refreshRate;
  }
}
