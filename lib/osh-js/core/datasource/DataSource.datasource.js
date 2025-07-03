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
import { isDefined, randomUUID } from '../utils/Utils.js';
import { DATASOURCE_DATA_TOPIC } from "../Constants";
import DataSourceWorker from './worker/DataSource.worker';
import { Mode } from "./Mode";
import WorkerExt from "../worker/WorkerExt";
import MqttConnector from "../connector/MqttConnector";
/**
 * The DataSource is the abstract class used to create different datasources.
 *
 */
// global worker
var maxPoolSize = 5;
var workersPool = [];
var currentInsertPoolIdx = 0;
var dataSourceWorkers = {};
export function getDataSourceWorkers() {
    return dataSourceWorkers;
}
var DataSource = /** @class */ (function () {
    function DataSource(name, properties) {
        this.id = properties.id || "DataSource-" + randomUUID();
        this.name = name;
        this.properties = properties;
        this.eventSubscriptionMap = {};
        this.init = undefined;
        this.mode = Mode.REAL_TIME;
        if (isDefined(properties.mode)) {
            this.mode = properties.mode;
        }
    }
    /**
     * Gets the datasource id.
     * @return {String} the datasource id
     */
    DataSource.prototype.getId = function () {
        return this.id;
    };
    /**
     * Gets the datasource name.
     * @return {String} the datasource name
     */
    DataSource.prototype.getName = function () {
        return this.name;
    };
    DataSource.prototype.terminate = function () {
        if (this.getWorker() !== null) {
            this.getWorker().terminate();
        }
    };
    DataSource.prototype.getTopicId = function () {
        return DATASOURCE_DATA_TOPIC + this.id;
    };
    DataSource.prototype.subscribe = function (fn, eventTypes) {
        // associate function to eventType
        for (var i = 0; i < eventTypes.length; i++) {
            if (!(eventTypes[i] in this.eventSubscriptionMap)) {
                this.eventSubscriptionMap[eventTypes[i]] = [];
            }
            this.eventSubscriptionMap[eventTypes[i]].push(fn);
        }
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    DataSource.prototype.createWorker = function (properties) {
        return new WorkerExt(new DataSourceWorker());
    };
    /**
     * Update properties
     * @param {String} name - the datasource name
     * @param {Object} properties - the datasource properties
     * @param {Number} properties.bufferingTime - defines the time during the data has to be buffered
     * @param {Number} properties.timeOut - defines the limit time before data has to be skipped
     * @param {String} properties.protocol - defines the protocol of the datasource. @see {@link DataConnector}
     * @param {String} properties.endpointUrl the endpoint url
     * @param {String} properties.service the service
     * @param {Number} properties.responseFormat the response format (e.g video/mp4)
     * @param {Number} properties.reconnectTimeout - the timeout before reconnecting
     */
    DataSource.prototype.updateProperties = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.properties = __assign(__assign({}, this.properties), properties);
                return [2 /*return*/, this.getWorker().postMessageWithAck({
                        message: 'update-properties',
                        data: properties,
                        dsId: this.id
                    })];
            });
        });
    };
    /**
     * Connect the dataSource then the protocol will be opened as well.
     */
    DataSource.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.doConnect()];
                }
            });
        });
    };
    DataSource.prototype.getWorker = function () {
        if (!(this.id in dataSourceWorkers)) {
            // create new worker for this DS
            if (!isDefined(workersPool[currentInsertPoolIdx])) {
                workersPool[currentInsertPoolIdx] = this.createWorker();
            }
            dataSourceWorkers[this.id] = currentInsertPoolIdx;
            currentInsertPoolIdx = (currentInsertPoolIdx + 1) % maxPoolSize;
        }
        // store worker idx into map for fast-mapping
        return workersPool[dataSourceWorkers[this.id]];
    };
    DataSource.prototype.initDataSource = function (properties) {
        if (properties === void 0) { properties = this.properties; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getWorker().postMessageWithAck({
                        message: 'init',
                        id: this.id,
                        properties: properties,
                        topics: {
                            data: this.getTopicId()
                        },
                        dsId: this.id
                    }).then(function () {
                        // listen for Events to callback to subscriptions
                        var datasourceBroadcastChannel = new BroadcastChannel(_this.getTopicId());
                        datasourceBroadcastChannel.onmessage = function (message) {
                            _this.handleMessage(message);
                        };
                        _this.isInitialized = true;
                    })];
            });
        });
    };
    DataSource.prototype.handleMessage = function (message) {
        var type = message.data.type;
        if (type in this.eventSubscriptionMap) {
            for (var i = 0; i < this.eventSubscriptionMap[type].length; i++) {
                this.eventSubscriptionMap[type][i](message.data);
            }
        }
    };
    DataSource.prototype.resetInit = function () {
        this.init = undefined;
    };
    DataSource.prototype.checkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!isDefined(this.init)) {
                    this.init = this.initDataSource();
                }
                return [2 /*return*/, this.init];
            });
        });
    };
    DataSource.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getWorker().postMessageWithAck({
                        message: 'connect',
                        dsId: this.id
                    })];
            });
        });
    };
    DataSource.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.init) {
                    return [2 /*return*/, false];
                }
                else {
                    return [2 /*return*/, this.checkInit().then(function () {
                            return _this.getWorker().postMessageWithAck({
                                message: 'is-connected',
                                dsId: _this.id
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Disconnect the dataSource then the protocol will be closed as well.
     */
    DataSource.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'disconnect',
                                dsId: this.id
                            })];
                }
            });
        });
    };
    DataSource.prototype.onDisconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DataSource.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.disconnect()];
                    case 1:
                        _a.sent();
                        this.resetInit();
                        return [2 /*return*/, this.removeWorker()];
                }
            });
        });
    };
    DataSource.prototype.removeWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.id in dataSourceWorkers) {
                    return [2 /*return*/, this.getWorker().postMessageWithAck({
                            message: 'remove-handler',
                            dsId: this.id
                        }).then(function () {
                            delete dataSourceWorkers[_this.id]; // delete index from pool
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    DataSource.prototype.onRemovedDataSource = function (dataSourceId) {
    };
    DataSource.prototype.onAddedDataSource = function (dataSourceId) {
    };
    return DataSource;
}());
export default DataSource;
//# sourceMappingURL=DataSource.datasource.js.map