/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import DataConnector from "./DataConnector";
import { assertDefined, isDefined, randomUUID } from "../utils/Utils";
import { Status } from "./Status";
import MqttProvider from "../mqtt/MqttProvider";
import ObservationFilter from "../sweapi/observation/ObservationFilter";
/**
 * Defines the MqttConnector to connect to a remote server by creating a Mqtt channel.
 * @extends DataConnector
 * @example
 * import MqttConnector from 'osh-js/dataconnector/MqttConnector.js';
 *
 * let url = ...;
 * let connector = new MqttConnector(url);
 *
 * // connect
 * connector.connect();
 *
 * // disconnect
 * connector.disconnect();
 *
 * // close
 * connector.close();
 *
 */
// TODO: Useless in WebWorker since the WebWorker has its own context.
var mqttProviders = {};
var MqttConnector = /** @class */ (function (_super) {
    __extends(MqttConnector, _super);
    /**
     *
     * @param url
     * @param properties -
     */
    function MqttConnector(url, properties) {
        var _this = _super.call(this, url, __assign({ mqttPrefix: (properties.mqttOpts && properties.mqttOpts.prefix) || '/api' }, properties)) || this;
        _this.interval = -1;
        _this.id = "mqtt-connector-".concat(randomUUID());
        _this.mqttProvider = undefined;
        return _this;
    }
    MqttConnector.prototype.initBc = function () {
        var _this = this;
        this.onMessage = function (data, topic) {
            _this.broadcastChannel.postMessage({
                data: data,
                topic: topic
            }, [data]);
        };
        this.broadcastChannel = new BroadcastChannel(this.id);
        this.broadcastChannel.onmessage = function (message) {
            if (message.data.message === 'subscribe') {
                _this.doRequest(message.data.topic);
            }
            else if (message.data.message === 'unsubscribe') {
                _this.disconnect(message.data.topic);
            }
        };
    };
    MqttConnector.prototype.getMqttProvider = function () {
        var fullUrl = this.getUrl();
        // only 1 provider by URL
        if (!this.mqttProvider) {
            var options = {
                reconnectPeriod: this.reconnectTimeout,
                connectTimeout: 30 * 1000
            };
            if (isDefined(this.properties.mqttOpts)) {
                options = __assign(__assign({}, options), this.properties.mqttOpts);
            }
            this.mqttProvider = new MqttProvider({
                endpoint: fullUrl,
                clientId: randomUUID(),
                options: options,
                mqttPrefix: this.properties.mqttPrefix
            });
            console.warn("Stored MQTT provider into cache: ".concat(fullUrl));
            this.mqttProvider.connect();
            this.mqttProvider.checkStatus = this.checkStatus;
            this.checkStatus(Status.CONNECTED);
        }
        else {
            console.warn("Getting MQTT provider from cache: ".concat(fullUrl));
        }
        return this.mqttProvider;
    };
    MqttConnector.prototype.checkStatus = function (status) {
        this.onChangeStatus(status);
        this.status = status;
    };
    /**
     * Connect to the Mqtt broker.
     */
    MqttConnector.prototype.doRequest = function (topic, queryString) {
        var _this = this;
        if (topic === void 0) { topic = ''; }
        if (queryString === void 0) { queryString = undefined; }
        var mqttProvider = this.getMqttProvider();
        mqttProvider.subscribe(topic, this.onMessage).then(function () {
            _this.onChangeStatus(Status.CONNECTED);
        });
    };
    MqttConnector.prototype.publishRequest = function (topic, payload) {
        var mqttProvider = this.getMqttProvider();
        mqttProvider.publish(topic, payload);
    };
    /**
     * Disconnects and close the mqtt client.
     */
    MqttConnector.prototype.disconnect = function (topic) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                client = this.mqttProvider;
                if (isDefined(client) && client.isConnected()) {
                    if (!topic) {
                        // unsubscribe all topics
                        return [2 /*return*/, client.unsubscribeAll()];
                        // client.disconnect();
                    }
                    else {
                        return [2 /*return*/, client.unsubscribe(topic)];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    MqttConnector.prototype.connect = function () {
        this.doRequest(this.properties.topic || '');
    };
    /**
     * The onMessage method used by the mqtt client to callback the data
     * @param data the callback data
     * @event
     */
    MqttConnector.prototype.onMessage = function (data) {
    };
    MqttConnector.prototype.isConnected = function () {
        return isDefined(this.mqttProvider) && this.mqttProvider.isConnected();
    };
    MqttConnector.prototype.reset = function () {
        this.disconnect();
        console.log("Remove provider from cache: ".concat(this.getUrl()));
        this.mqttProvider.reset();
    };
    return MqttConnector;
}(DataConnector));
export default MqttConnector;
//# sourceMappingURL=MqttConnector.js.map