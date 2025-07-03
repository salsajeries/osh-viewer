import SosGetResultHandler from "../sos/handler/SosGetResult.handler";
import SosGetFoisHandler from "../sos/handler/SosGetFois.handler";
import SweApiHandler from "../sweapi/handler/SweApi.handler";
var DataSourceWorker = /** @class */ (function () {
    function DataSourceWorker() {
        this.dataSourceHandlers = {};
    }
    DataSourceWorker.prototype.handleMessage = function (event) {
        var resp = {};
        if (event.data.ackId) {
            resp.ackId = event.data.ackId;
        }
        var eventData = event.data;
        try {
            if (eventData.message === 'init') {
                this.handleInit(eventData, resp);
            }
            if (eventData.message === 'connect') {
                this.handleConnect(eventData, resp);
            }
            else if (eventData.message === 'disconnect') {
                this.handleDisconnect(eventData, resp);
            }
            else if (eventData.message === 'topics') {
                this.handleTopics(eventData, resp);
            }
            else if (eventData.message === 'update-properties') {
                this.handleUpdateProperties(eventData, resp);
            }
            else if (eventData.message === 'is-connected') {
                this.handleIsConnected(eventData, resp);
            }
            else if (eventData.message === 'is-init') {
                this.handleIsInit(eventData, resp);
            }
            else if (eventData.message === 'remove-handler') {
                this.handleRemoveHandler(eventData, resp);
            }
        }
        catch (ex) {
            console.error(ex);
            resp.error = ex;
            this.postMessage(resp);
        }
        finally {
            // resp.data = returnValue;
            // this.postMessage(resp);
        }
    };
    DataSourceWorker.prototype.handleInit = function (eventData, resp) {
        var _this = this;
        var dsId = eventData.dsId;
        this.dataSourceHandlers[dsId] = this.createHandlerFromProperties(eventData.properties);
        this.dataSourceHandlers[dsId].init(eventData.properties, eventData.topics, eventData.id).then(function () {
            resp.data = _this.dataSourceHandlers[dsId].isInitialized();
            _this.postMessage(resp);
        });
    };
    DataSourceWorker.prototype.handleConnect = function (eventData, resp) {
        var _this = this;
        var dsId = eventData.dsId;
        if (dsId in this.dataSourceHandlers) {
            this.dataSourceHandlers[dsId].connect(eventData.startTime, eventData.version).then(function () {
                _this.postMessage(resp);
            });
        }
    };
    DataSourceWorker.prototype.handleDisconnect = function (eventData, resp) {
        var _this = this;
        var dsId = eventData.dsId;
        if (dsId in this.dataSourceHandlers) {
            this.dataSourceHandlers[dsId].disconnect().then(function () {
                _this.postMessage(resp);
            });
        }
    };
    DataSourceWorker.prototype.handleTopics = function (eventData, resp) {
        var dsId = eventData.dsId;
        if (dsId in this.dataSourceHandlers) {
            this.dataSourceHandlers[dsId].setTopics(eventData.topics);
            this.postMessage(resp);
        }
    };
    DataSourceWorker.prototype.handleUpdateProperties = function (eventData, resp) {
        var dsId = eventData.dsId;
        if (dsId in this.dataSourceHandlers) {
            this.dataSourceHandlers[dsId].updateProperties(eventData.data);
            this.postMessage(resp);
        }
    };
    DataSourceWorker.prototype.handleIsConnected = function (eventData, resp) {
        var dsId = eventData.dsId;
        if (dsId in this.dataSourceHandlers) {
            resp.data = this.dataSourceHandlers[dsId].isConnected();
            this.postMessage(resp);
        }
    };
    DataSourceWorker.prototype.handleRemoveHandler = function (eventData, resp) {
        var dsId = eventData.dsId;
        delete this.dataSourceHandlers[dsId];
        this.postMessage(resp);
    };
    DataSourceWorker.prototype.handleIsInit = function (eventData, resp) {
        var dsId = eventData.dsId;
        resp.data = this.dataSourceHandlers[dsId].isInitialized();
        this.postMessage(resp);
    };
    DataSourceWorker.prototype.postMessage = function (message) {
    };
    DataSourceWorker.prototype.createHandlerFromProperties = function (properties) {
        if (properties.type === 'SosGetResult') {
            return new SosGetResultHandler();
        }
        else if (properties.type === 'SosGetFois') {
            return new SosGetFoisHandler();
        }
        else if (properties.type === 'SweApiStream') {
            return new SweApiHandler();
        }
        else {
            throw Error('Unsupported SOS service Error');
        }
    };
    return DataSourceWorker;
}());
export default DataSourceWorker;
//# sourceMappingURL=DataSourceWorker.js.map