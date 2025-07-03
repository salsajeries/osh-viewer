/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

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
import { DATA_SYNCHRONIZER_TOPIC, DATASOURCE_TIME_TOPIC } from "../Constants";
import DataSource from "./DataSource.datasource";
import { Mode } from './Mode';
import MqttConnector from "../connector/MqttConnector";
import { isDefined } from "../utils/Utils";
/**
 * The DataSource is the abstract class used to create different datasources.
 *
 */
var mqttConnectors = {};
function createSharedMqttConnector(properties, topic) {
    var endpoint = properties.mqttOpts.endpointUrl;
    if (endpoint.endsWith('/')) {
        endpoint = endpoint.substring(0, endpoint.length - 1);
    }
    var tls = (properties.tls) ? 's' : '';
    var url = 'mqtt' + tls + '://' + endpoint;
    if (!(url in mqttConnectors)) {
        mqttConnectors[url] = new MqttConnector(url, properties);
        mqttConnectors[url].initBc();
    }
    else {
        console.log("Reuse shared MqttConnector instance for ".concat(url));
    }
    return mqttConnectors[url].id;
}
var TimeSeriesRealtimeDatasource = /** @class */ (function (_super) {
    __extends(TimeSeriesRealtimeDatasource, _super);
    function TimeSeriesRealtimeDatasource(name, properties) {
        var _this = _super.call(this, name, properties) || this;
        _this.dataSynchronizer = undefined;
        _this.properties.version = 0;
        if (properties.protocol === 'mqtt') {
            _this.properties.mqttOpts.bcId = createSharedMqttConnector(properties);
        }
        return _this;
    }
    TimeSeriesRealtimeDatasource.prototype.getTimeTopicId = function () {
        return DATASOURCE_TIME_TOPIC + this.id;
    };
    /**
     * Gets the mode
     * @returns {Mode} - Datasource mode
     */
    TimeSeriesRealtimeDatasource.prototype.getMode = function () {
        return Mode.REAL_TIME;
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as ISO date
     */
    TimeSeriesRealtimeDatasource.prototype.getStartTimeAsIsoDate = function () {
        return 'now';
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as unix timestamp
     */
    TimeSeriesRealtimeDatasource.prototype.getStartTimeAsTimestamp = function () {
        return Date.now();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesRealtimeDatasource.prototype.getEndTimeAsIsoDate = function () {
        return this.getMaxTimeAsTimestamp();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as unix timestamp
     */
    TimeSeriesRealtimeDatasource.prototype.getEndTimeAsTimestamp = function () {
        return this.getMaxTimeAsTimestamp();
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as ISO date
     */
    TimeSeriesRealtimeDatasource.prototype.getMinTimeAsIsoDate = function () {
        return 'now';
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesRealtimeDatasource.prototype.getMaxTimeAsIsoDate = function () {
        return '2055-01-01Z';
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as unix timestamp
     */
    TimeSeriesRealtimeDatasource.prototype.getMinTimeAsTimestamp = function () {
        return Date.now(); // or should we use first timestamp of last data received???
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as unix timestamp
     */
    TimeSeriesRealtimeDatasource.prototype.getMaxTimeAsTimestamp = function () {
        return new Date('2055-01-01Z').toISOString();
    };
    /**
     * Sets the min time
     */
    TimeSeriesRealtimeDatasource.prototype.setMinTime = function (time) {
    };
    /**
     * Sets the max time
     */
    TimeSeriesRealtimeDatasource.prototype.setMaxTime = function (time) {
    };
    /**
     * Sets the start time
     */
    TimeSeriesRealtimeDatasource.prototype.setStartTimestamp = function (timestamp) {
    };
    /**
     * Sets the end time
     */
    TimeSeriesRealtimeDatasource.prototype.setEndTimestamp = function (timestamp) {
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesRealtimeDatasource.prototype.getReplaySpeed = function () {
        return 1.0;
    };
    TimeSeriesRealtimeDatasource.prototype.setReplaySpeed = function (replaySpeed) {
    };
    TimeSeriesRealtimeDatasource.prototype.setVersion = function (version) {
        this.properties.version = version;
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    /**
     * @param dataSynchronizer
     * @returns {Promise}
     */
    TimeSeriesRealtimeDatasource.prototype.setDataSynchronizer = function (dataSynchronizer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dataSynchronizer = dataSynchronizer;
                return [2 /*return*/, this.initDataSynchronizerIfPresent()];
            });
        });
    };
    TimeSeriesRealtimeDatasource.prototype.initDataSynchronizerIfPresent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var topic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dataSynchronizer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        topic = DATA_SYNCHRONIZER_TOPIC + this.dataSynchronizer.id;
                        this.properties.version = this.dataSynchronizer.version();
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'topics',
                                topics: {
                                    data: topic,
                                    time: this.getTimeTopicId(),
                                    mode: Mode.REAL_TIME,
                                    sync: this.dataSynchronizer.getTimeTopicId()
                                },
                                dsId: this.id,
                                mode: Mode.REAL_TIME,
                            })];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    TimeSeriesRealtimeDatasource.prototype.removeDataSynchronizer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dataSynchronizer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dataSynchronizer.removeDataSource(this)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.dataSynchronizer = undefined;
                        // remove datasynchronizer
                        // restore datasource topic
                        this.properties.version = 0;
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'topics',
                                topics: {
                                    data: this.getTopicId(),
                                    time: this.getTimeTopicId()
                                },
                                dsId: this.id,
                                mode: Mode.REAL_TIME,
                            })];
                }
            });
        });
    };
    /**
     * Disconnect the dataSource then the protocol will be closed as well.
     */
    TimeSeriesRealtimeDatasource.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (isDefined(this.init)) {
                    try {
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'disconnect',
                                dsId: this.id,
                                mode: Mode.REAL_TIME,
                            })];
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    TimeSeriesRealtimeDatasource.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'connect',
                                startTime: 'now',
                                version: this.version(),
                                dsId: this.id,
                                mode: Mode.REAL_TIME,
                            })];
                }
            });
        });
    };
    /**
     * Inits the datasource with the constructor properties.
     * @protected
     * @param properties
     */
    TimeSeriesRealtimeDatasource.prototype.initDataSource = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var topics;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initDataSource.call(this, properties)];
                    case 1:
                        _a.sent();
                        topics = {
                            data: this.getTopicId(),
                            time: this.getTimeTopicId()
                        };
                        if (this.dataSynchronizer) {
                            topics.sync = this.dataSynchronizer.getTimeTopicId();
                        }
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'topics',
                                topics: topics,
                                dsId: this.id,
                                mode: Mode.REAL_TIME,
                            }).then(function () {
                                // listen for Events to callback to subscriptions
                                var datasourceBroadcastChannel = new BroadcastChannel(_this.getTimeTopicId());
                                datasourceBroadcastChannel.onmessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.handleTimeMessage(message)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); };
                            })];
                }
            });
        });
    };
    TimeSeriesRealtimeDatasource.prototype.handleTimeMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var type, i;
            return __generator(this, function (_a) {
                type = message.data.type;
                if (type in this.eventSubscriptionMap) {
                    for (i = 0; i < this.eventSubscriptionMap[type].length; i++) {
                        this.eventSubscriptionMap[type][i](message.data);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    TimeSeriesRealtimeDatasource.prototype.version = function () {
        return this.properties.version;
    };
    TimeSeriesRealtimeDatasource.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.warn("dataSource ".concat(this.id, " has been reset"));
                        return [4 /*yield*/, _super.prototype.reset.call(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.doConnect()];
                }
            });
        });
    };
    return TimeSeriesRealtimeDatasource;
}(DataSource));
export default TimeSeriesRealtimeDatasource;
//# sourceMappingURL=TimeSeries.realtime.datasource.js.map