var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import DataConnector from "./DataConnector";
import { Status } from "./Status";
/**
 * Defines the MqttTopicConnector to communicate with Shared MqttConnector using broadcast channel
 * @extends DataConnector
 */
var MqttTopicConnector = /** @class */ (function (_super) {
    __extends(MqttTopicConnector, _super);
    /**
     *
     * @param properties -
     */
    function MqttTopicConnector(url, properties) {
        var _this = _super.call(this, url, properties) || this;
        _this.lastReceiveTime = -1;
        _this.interval = -1;
        _this.broadcastChannel = new BroadcastChannel(url);
        _this.broadcastChannel.onmessage = function (message) {
            if (message.data.topic === _this.fullTopic) {
                _this.onMessage(message.data.data);
            }
        };
        _this.topics = [];
        return _this;
    }
    MqttTopicConnector.prototype.doRequest = function (topic, queryString) {
        if (topic === void 0) { topic = ''; }
        if (queryString === void 0) { queryString = undefined; }
        this.fullTopic = topic + '?' + queryString;
        this.broadcastChannel.postMessage({
            message: 'subscribe',
            connectorId: this.id,
            topic: this.fullTopic
        });
        this.topics.push(this.fullTopic);
        this.onChangeStatus(Status.CONNECTED);
    };
    /**
     * Disconnects.
     */
    MqttTopicConnector.prototype.disconnect = function () {
        this.fullDisconnect(true);
    };
    /**
     * Fully disconnect the websocket connection by sending a close message to the webWorker.
     * @param {Boolean} removeInterval  - force removing the interval
     */
    MqttTopicConnector.prototype.fullDisconnect = function (removeInterval) {
        if (this.broadcastChannel != null) {
            for (var _i = 0, _a = this.topics; _i < _a.length; _i++) {
                var topic = _a[_i];
                this.broadcastChannel.postMessage({
                    message: 'unsubscribe',
                    connectorId: this.id,
                    topic: topic,
                });
            }
            this.broadcastChannel.close();
            this.broadcastChannel = null;
            this.topics = [];
        }
        if (removeInterval) {
            clearInterval(this.interval);
        }
        this.opened = false;
    };
    /**
     * Try to reconnect if the connexion if closed
     */
    MqttTopicConnector.prototype.reconnect = function () {
        this.onReconnect();
        if (this.init) {
            this.fullDisconnect(false);
        }
        this.connect();
    };
    /**
     * The onMessage method used by the websocket to callback the data
     * @param data the callback data
     * @event
     */
    MqttTopicConnector.prototype.onMessage = function (data) {
    };
    /**
     * Closes the webSocket.
     */
    MqttTopicConnector.prototype.close = function () {
        this.disconnect();
    };
    MqttTopicConnector.prototype.isConnected = function () {
        return this.broadcastChannel !== null && this.opened;
    };
    MqttTopicConnector.prototype.checkStatus = function (status) {
        this.onChangeStatus(status);
        this.status = status;
    };
    return MqttTopicConnector;
}(DataConnector));
export default MqttTopicConnector;
//# sourceMappingURL=MqttTopicConnector.js.map