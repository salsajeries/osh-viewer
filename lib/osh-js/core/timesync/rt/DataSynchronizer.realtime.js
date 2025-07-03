/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2020 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { assertDefined, isDefined, randomUUID } from "../../utils/Utils.js";
import DataSynchronizerWorker from './DataSynchronizer.realtime.worker.js';
import { DATA_SYNCHRONIZER_TOPIC, TIME_SYNCHRONIZER_TOPIC } from "../../Constants.js";
import { Mode } from "../../datasource/Mode";
import WorkerExt from "../../worker/WorkerExt";
var DataSynchronizerRealtime = /** @class */ (function () {
    /**
     * Creates The dataSynchronizer.
     * @param {Object} properties - the property of the object
     * @param {String} [properties.id=randomUUID] - id of the dataSynchronizer or random if not provided
     * @param {Number} [properties.timerResolution=5] - interval in which data is played (in milliseconds)
     * @param {Number} [properties.masterTimeRefreshRate=250] - interval in which time value is send through broadcast channel (in milliseconds)
     * @param {Datasource[]} properties.dataSources - the dataSource array
     * @param {DataSynchronizer} timeSync - dataSynchronizer
     */
    function DataSynchronizerRealtime(properties, timeSync) {
        this.bufferingTime = 1000; // default
        this.id = properties.id || randomUUID();
        this.dataSources = (properties.dataSources) ? __spreadArray([], properties.dataSources, true) : [];
        this.timerResolution = properties.timerResolution || 5;
        this.masterTimeRefreshRate = properties.masterTimeRefreshRate || 250;
        this.initialized = false;
        this.timeSync = timeSync;
        this.properties = {};
        this.properties.version = 0;
    }
    DataSynchronizerRealtime.prototype.getId = function () {
        return this.id;
    };
    DataSynchronizerRealtime.prototype.getDataSources = function () {
        return this.dataSources;
    };
    DataSynchronizerRealtime.prototype.getTopicId = function () {
        return DATA_SYNCHRONIZER_TOPIC + this.id;
    };
    DataSynchronizerRealtime.prototype.getTimeTopicId = function () {
        return TIME_SYNCHRONIZER_TOPIC + this.id;
    };
    DataSynchronizerRealtime.prototype.setStartTimestamp = function (timestamp) {
        this.properties.startTimestamp = timestamp;
    };
    /**
     * Terminate the corresponding running WebWorker by calling terminate() on it.
     */
    DataSynchronizerRealtime.prototype.terminate = function () {
        if (isDefined(this.synchronizerWorker)) {
            this.synchronizerWorker.terminate();
            this.synchronizerWorker = null;
        }
        for (var _i = 0, _a = this.dataSources; _i < _a.length; _i++) {
            var dataSource = _a[_i];
            dataSource.terminate();
        }
    };
    DataSynchronizerRealtime.prototype.getMode = function () {
        return Mode.REAL_TIME;
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    DataSynchronizerRealtime.prototype.initDataSources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dataSourcesForWorker, _i, _a, dataSource, dataSourceForWorker, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        dataSourcesForWorker = [];
                        _i = 0, _a = this.dataSources;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        dataSource = _a[_i];
                        return [4 /*yield*/, this.createDataSourceForWorker(dataSource)];
                    case 2:
                        dataSourceForWorker = _b.sent();
                        dataSourcesForWorker.push(dataSourceForWorker);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.synchronizerWorker = new WorkerExt(new DataSynchronizerWorker());
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'init',
                                dataSources: dataSourcesForWorker,
                                timerResolution: this.timerResolution,
                                masterTimeRefreshRate: this.masterTimeRefreshRate,
                                mode: Mode.REAL_TIME,
                                version: this.version(),
                                topics: {
                                    data: this.getTopicId(),
                                    time: this.getTimeTopicId()
                                }
                            }).then(function () {
                                _this.initialized = true;
                            })];
                    case 5:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private
     * @param dataSource
     */
    DataSynchronizerRealtime.prototype.createDataSourceForWorker = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = {
                            bufferingTime: dataSource.properties.bufferingTime || 0,
                            timeOut: dataSource.properties.timeOut || 0,
                            id: dataSource.id,
                            name: dataSource.name
                        };
                        // bind dataSource data onto dataSynchronizer data
                        return [4 /*yield*/, dataSource.setDataSynchronizer(this.timeSync)];
                    case 1:
                        // bind dataSource data onto dataSynchronizer data
                        _a.sent();
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    /**
     * Adds a new DataSource object to the list of datasources to synchronize.
     * note: don't forget to call reset() to be sure to re-init the synchronizer internal properties.
     * @param {TimeSeriesDataSource} dataSource - the new datasource to add
     */
    DataSynchronizerRealtime.prototype.addDataSource = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var dataSourceForWorker;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataSources.push(dataSource);
                        if (!!this.initialized) return [3 /*break*/, 1];
                        console.log("DataSynchronizer not initialized yet, add DataSource ".concat(dataSource.id, " as it"));
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.createDataSourceForWorker(dataSource)];
                    case 2:
                        dataSourceForWorker = _a.sent();
                        // add dataSource to synchronizer algorithm
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'add',
                                dataSources: [dataSourceForWorker]
                            }).then(function () {
                                _this.onAddedDataSource(dataSource.id);
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a DataSource object from the list of datasources of the synchronizer.
     * @param {TimeSeriesDatasource} dataSource - the new datasource to add
     */
    DataSynchronizerRealtime.prototype.removeDataSource = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dataSources.map(function (ds) { return ds.id; }).includes(dataSource.id)) return [3 /*break*/, 3];
                        dataSource.removeDataSynchronizer();
                        this.dataSources = this.dataSources.filter(function (elt) { return elt.id !== dataSource.getId(); });
                        dataSource.setDataSynchronizer(null);
                        if (!(this.dataSources.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reset()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.initialized) {
                            console.log("DataSynchronizer not initialized yet, remove DataSource ".concat(dataSource.id, " as it"));
                        }
                        else {
                            return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                    message: 'remove',
                                    dataSourceIds: [dataSource.getId()],
                                }).then(function () {
                                    _this.onRemovedDataSource(dataSource.id);
                                })];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {String} dataSourceId - the dataSource id
     * @param {Object} data - the data to push into the data synchronizer
     */
    DataSynchronizerRealtime.prototype.push = function (dataSourceId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.synchronizerWorker !== null) {
                    return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                            type: 'data',
                            dataSourceId: dataSourceId,
                            data: data
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    DataSynchronizerRealtime.prototype.version = function () {
        return this.properties.version;
    };
    /**
     * Connects all dataSources
     */
    DataSynchronizerRealtime.prototype.connect = function () {
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
    DataSynchronizerRealtime.prototype.checkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!isDefined(this.init)) {
                    this.init = this.initDataSources();
                }
                return [2 /*return*/, this.init];
            });
        });
    };
    DataSynchronizerRealtime.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, dataSource;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.dataSources;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        dataSource = _a[_i];
                        return [4 /*yield*/, dataSource.connect()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                            message: 'connect',
                            version: this.version()
                        })];
                }
            });
        });
    };
    /**
     * Disconnects all dataSources
     */
    DataSynchronizerRealtime.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, _a, dataSource;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('disconnect');
                        return [4 /*yield*/, this.reset()];
                    case 1:
                        _b.sent();
                        promises = [];
                        for (_i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                            dataSource = _a[_i];
                            promises.push(dataSource.disconnect());
                        }
                        return [2 /*return*/, Promise.all(promises)];
                }
            });
        });
    };
    DataSynchronizerRealtime.prototype.updateProperties = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, ds;
            return __generator(this, function (_b) {
                for (_i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                    ds = _a[_i];
                    ds.updateProperties(properties);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Resets reference time
     */
    DataSynchronizerRealtime.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'reset'
                            })];
                }
            });
        });
    };
    DataSynchronizerRealtime.prototype.getCurrentTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                        message: 'current-time'
                    })];
            });
        });
    };
    /**
     * Connect the dataSource then the protocol will be opened as well.
     */
    DataSynchronizerRealtime.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.dataSources.length === 0)) return [3 /*break*/, 1];
                        return [2 /*return*/, false];
                    case 1: return [4 /*yield*/, this.checkInit()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'is-connected'
                            }).then(function (message) { return message.data; })];
                }
            });
        });
    };
    DataSynchronizerRealtime.prototype.setMinTime = function (minTime) {
    };
    DataSynchronizerRealtime.prototype.setMaxTime = function (maxTime) {
    };
    DataSynchronizerRealtime.prototype.incVersion = function () {
        this.properties.version++;
    };
    DataSynchronizerRealtime.prototype.onTimeChanged = function (start, min) {
    };
    DataSynchronizerRealtime.prototype.onRemovedDataSource = function (dataSourceId) {
    };
    DataSynchronizerRealtime.prototype.onAddedDataSource = function (dataSourceId) {
    };
    return DataSynchronizerRealtime;
}());
export default DataSynchronizerRealtime;
//# sourceMappingURL=DataSynchronizer.realtime.js.map