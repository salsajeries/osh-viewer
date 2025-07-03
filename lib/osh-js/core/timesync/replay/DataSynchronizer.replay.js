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
import DataSynchronizerWorker from './DataSynchronizer.replay.worker.js';
import { DATA_SYNCHRONIZER_TOPIC, TIME_SYNCHRONIZER_TOPIC } from "../../Constants.js";
import { Mode } from "../../datasource/Mode";
import { EventType } from "../../event/EventType";
import WorkerExt from "../../worker/WorkerExt";
var DataSynchronizerReplay = /** @class */ (function () {
    /**
     * Creates The dataSynchronizer.
     * @param {Object} properties - the property of the object
     * @param {String} [properties.id=randomUUID] - id of the dataSynchronizer or random if not provided
     * @param {Number} [properties.replaySpeed=1] - replaySpeed value
     * @param {Number} [properties.timerResolution=5] - interval in which data is played (in milliseconds)
     * @param {Number} [properties.masterTimeRefreshRate=250] - interval in which time value is send through broadcast channel (in milliseconds)
     * @param {Number} [properties.mode=Mode.REPLAY] - mode of the data synchronizer
     * @param {String} properties.minTime - min range time as ISO date
     * @param {String} properties.maxTime - max range time as ISO date
     * @param {Datasource[]} properties.dataSources - the dataSource array
     * @param {DataSynchronizer} timeSync - dataSynchronizer
     */
    function DataSynchronizerReplay(properties, timeSync) {
        this.bufferingTime = 1000; // default
        this.id = properties.id || randomUUID();
        this.dataSources = (properties.dataSources) ? __spreadArray([], properties.dataSources, true) : [];
        this.replaySpeed = properties.replaySpeed || 1;
        this.timerResolution = properties.timerResolution || 5;
        this.masterTimeRefreshRate = properties.masterTimeRefreshRate || 250;
        this.initialized = false;
        this.timeSync = timeSync;
        this.properties = {};
        this.properties.replaySpeed = this.replaySpeed;
        this.properties.startTimestamp = undefined;
        this.properties.endTimestamp = undefined;
        this.properties.minTimestamp = undefined;
        this.properties.maxTimestamp = undefined;
        this.properties.version = 0;
        if (isDefined(properties)) {
            if (isDefined(properties.minTime)) {
                this.minTimestamp = new Date(properties.minTime).getTime();
            }
            if (isDefined(properties.maxTime)) {
                this.maxTimestamp = new Date(properties.maxTime).getTime();
            }
        }
        this.computeMinMax();
    }
    DataSynchronizerReplay.prototype.getId = function () {
        return this.id;
    };
    DataSynchronizerReplay.prototype.getTopicId = function () {
        return DATA_SYNCHRONIZER_TOPIC + this.id;
    };
    DataSynchronizerReplay.prototype.getTimeTopicId = function () {
        return TIME_SYNCHRONIZER_TOPIC + this.id;
    };
    DataSynchronizerReplay.prototype.getDataSources = function () {
        return this.dataSources;
    };
    DataSynchronizerReplay.prototype.computeMinMax = function () {
        if (this.dataSources.length > 0) {
            var minTimestamp = Number.MAX_VALUE, maxTimestamp = Number.MIN_VALUE;
            // default min/max will be adjusted on the most min/max DataSource
            for (var _i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                var ds = _a[_i];
                // compute min/max range of dataSynchronizer
                var dsMinTimestamp = ds.getMinTimeAsTimestamp();
                var dsMaxTimestamp = ds.getMaxTimeAsTimestamp();
                if (dsMinTimestamp < minTimestamp) {
                    minTimestamp = dsMinTimestamp;
                }
                if (dsMaxTimestamp > maxTimestamp) {
                    maxTimestamp = dsMaxTimestamp;
                }
            }
            // check if a default Min/Max has been defined into DataSynchronizer forcing intersection with current computed ones
            if (isDefined(this.minTimestamp) && this.minTimestamp > minTimestamp) {
                // intersect and takes the min of dataSynchronizer
                minTimestamp = this.minTimestamp;
            }
            if (isDefined(this.maxTimestamp) && this.maxTimestamp > maxTimestamp) {
                // intersect and takes the min of dataSynchronizer
                maxTimestamp = this.maxTimestamp;
            }
            this.properties.minTimestamp = minTimestamp;
            this.properties.maxTimestamp = maxTimestamp;
        }
        else {
            var st = new Date('1970-01-01T00:00:00Z').getTime();
            var end = new Date('2055-01-01T00:00:00Z').getTime();
            this.properties.minTimestamp = this.properties.startTimestamp = st;
            this.properties.maxTimestamp = this.properties.endTimestamp = end;
        }
        if (this.properties.startTimestamp < this.properties.minTimestamp || this.properties.startTimestamp > this.properties.maxTimestamp) {
            this.properties.startTimestamp = this.properties.minTimestamp;
        }
        if (this.properties.endTimestamp > this.properties.maxTimestamp || this.properties.endTimestamp < this.properties.minTimestamp) {
            this.properties.endTimestamp = this.properties.maxTimestamp;
        }
    };
    /**
     * Gets the startTime of the first DataSource objet
     * @returns {String} - startTime as ISO date
     */
    DataSynchronizerReplay.prototype.getStartTimeAsIsoDate = function () {
        if (this.properties.startTimestamp) {
            return new Date(this.properties.startTimestamp).toISOString();
        }
        else {
            return this.getMinTimeAsIsoDate();
        }
    };
    /**
     * Gets the startTime of the first DataSource objet
     * @returns {String} - startTime as unix timestamp
     */
    DataSynchronizerReplay.prototype.getStartTimeAsTimestamp = function () {
        return this.properties.startTimestamp;
    };
    /**
     * Gets the endTime of the first DataSource objet
     * @returns {String} - endTime as ISO date
     */
    DataSynchronizerReplay.prototype.getEndTimeAsIsoDate = function () {
        if (this.properties.endTimestamp) {
            return new Date(this.properties.endTimestamp).toISOString();
        }
        else {
            return this.getMaxTimeAsIsoDate();
        }
    };
    DataSynchronizerReplay.prototype.getEndTimeAsTimestamp = function () {
        return this.properties.endTimestamp;
    };
    /**
     * Gets the minTime of the first DataSource objet
     * @returns {String} - startTime as ISO date
     */
    DataSynchronizerReplay.prototype.getMinTimeAsIsoDate = function () {
        return new Date(this.properties.minTimestamp).toISOString();
    };
    /**
     * Gets the minTime of the first DataSource objet
     * @returns {String} - startTime as unix timestamp
     */
    DataSynchronizerReplay.prototype.getMinTimeAsTimestamp = function () {
        return this.properties.minTimestamp;
    };
    /**
     * Gets the maxTime of the first DataSource objet
     * @returns {String} - endTime as ISO date
     */
    DataSynchronizerReplay.prototype.getMaxTimeAsIsoDate = function () {
        return new Date(this.properties.maxTimestamp).toISOString();
    };
    /**
     * Gets the maxTime of the first DataSource objet
     * @returns {String} - endTime as unix timestamp
     */
    DataSynchronizerReplay.prototype.getMaxTimeAsTimestamp = function () {
        return this.properties.maxTimestamp;
    };
    DataSynchronizerReplay.prototype.setStartTime = function (time, lazy) {
        if (lazy === void 0) { lazy = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.properties.startTimestamp = new Date(time).getTime();
                        if (!!lazy) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateAlgo()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DataSynchronizerReplay.prototype.setEndTime = function (time, lazy) {
        if (lazy === void 0) { lazy = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.properties.endTimestamp = new Date(time).getTime();
                        if (!!lazy) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateAlgo()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DataSynchronizerReplay.prototype.setMinTime = function (minTime, resetStartTime) {
        if (resetStartTime === void 0) { resetStartTime = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.minTimestamp = new Date(minTime).getTime();
                this.computeMinMax();
                this.timeChanged();
                return [2 /*return*/];
            });
        });
    };
    DataSynchronizerReplay.prototype.setMaxTime = function (maxTime, resetStartTime) {
        if (resetStartTime === void 0) { resetStartTime = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.maxTimestamp = new Date(maxTime).getTime();
                this.computeMinMax();
                this.timeChanged();
                return [2 /*return*/];
            });
        });
    };
    /**
     * Gets the replaySpeed
     * @returns {Number} - the replay speed
     */
    DataSynchronizerReplay.prototype.getReplaySpeed = function () {
        return this.replaySpeed;
    };
    /**
     * Terminate the corresponding running WebWorker by calling terminate() on it.
     */
    DataSynchronizerReplay.prototype.terminate = function () {
        if (isDefined(this.synchronizerWorker)) {
            this.synchronizerWorker.terminate();
            this.synchronizerWorker = null;
        }
        for (var _i = 0, _a = this.dataSources; _i < _a.length; _i++) {
            var dataSource = _a[_i];
            dataSource.terminate();
        }
    };
    DataSynchronizerReplay.prototype.getMode = function () {
        return Mode.REPLAY;
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    DataSynchronizerReplay.prototype.initDataSources = function () {
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
                                replaySpeed: this.replaySpeed,
                                timerResolution: this.timerResolution,
                                masterTimeRefreshRate: this.masterTimeRefreshRate,
                                startTimestamp: this.getStartTimeAsTimestamp(),
                                endTimestamp: this.getEndTimeAsTimestamp(),
                                mode: this.getMode(),
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
                        console.error(error_1);
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
    DataSynchronizerReplay.prototype.createDataSourceForWorker = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = {
                            bufferingTime: dataSource.properties.bufferingTime || 0,
                            timeOut: dataSource.properties.timeOut || 0,
                            id: dataSource.getId(),
                            name: dataSource.getName(),
                            minTimestamp: dataSource.getMinTimeAsTimestamp(),
                            maxTimestamp: dataSource.getMaxTimeAsTimestamp()
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataSource.setDataSynchronizer(this.timeSync)];
                    case 2:
                        _a.sent();
                        dataSource.properties.replaySpeed = this.replaySpeed;
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        console.error("Cannot set the synchronizer to this DataSource", ex_1);
                        throw ex_1;
                    case 4: return [2 /*return*/, obj];
                }
            });
        });
    };
    DataSynchronizerReplay.prototype.timeChanged = function () {
        this.onTimeChanged(this.getMinTimeAsTimestamp(), this.getMaxTimeAsTimestamp(), this.getStartTimeAsTimestamp(), this.getEndTimeAsTimestamp());
    };
    /**
     * Adds a new DataSource object to the list of datasources to synchronize.
     * note: don't forget to call reset() to be sure to re-init the synchronizer internal properties.
     * @param {TimeSeriesDataSource} dataSource - the new datasource to add
     */
    DataSynchronizerReplay.prototype.addDataSource = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var dataSourceForWorker;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.dataSources.map(function (ds) { return ds.id; }).includes(dataSource.id)) return [3 /*break*/, 3];
                        this.dataSources.push(dataSource);
                        this.computeMinMax();
                        console.log('time changed');
                        if (!!this.initialized) return [3 /*break*/, 1];
                        console.log("DataSynchronizer not initialized yet, add DataSource ".concat(dataSource.id, " as it"));
                        this.timeChanged();
                        this.onAddedDataSource(dataSource.id);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                resolve();
                            })];
                    case 1:
                        dataSource.setStartTime(this.getStartTimeAsIsoDate());
                        dataSource.setEndTime(this.getEndTimeAsIsoDate());
                        return [4 /*yield*/, this.createDataSourceForWorker(dataSource)];
                    case 2:
                        dataSourceForWorker = _a.sent();
                        // add dataSource to synchronizer algorithm
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'add',
                                dataSources: [dataSourceForWorker],
                                startTimestamp: this.getStartTimeAsTimestamp(),
                                endTimestamp: this.getEndTimeAsTimestamp()
                            }).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.isConnected()];
                                        case 1:
                                            if (!!(_a.sent())) return [3 /*break*/, 3];
                                            return [4 /*yield*/, dataSource.connect()];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            this.onAddedDataSource(dataSource.id);
                                            this.timeChanged();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a DataSource object from the list of datasources of the synchronizer.
     * @param {TimeSeriesDatasource} dataSource - the new datasource to add
     */
    DataSynchronizerReplay.prototype.removeDataSource = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dataSources.map(function (ds) { return ds.id; }).includes(dataSource.id)) return [3 /*break*/, 7];
                        this.dataSources = this.dataSources.filter(function (elt) { return elt.id !== dataSource.getId(); });
                        if (!!this.initialized) return [3 /*break*/, 2];
                        console.log("DataSynchronizer not initialized yet, remove DataSource ".concat(dataSource.id, " as it"));
                        return [4 /*yield*/, dataSource.removeDataSynchronizer()];
                    case 1:
                        _a.sent();
                        this.timeChanged();
                        this.onRemovedDataSource(dataSource.id);
                        return [3 /*break*/, 7];
                    case 2:
                        if (!(this.dataSources.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reset()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.computeMinMax();
                        return [4 /*yield*/, dataSource.disconnect()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, dataSource.removeDataSynchronizer()];
                    case 6:
                        _a.sent();
                        // if any
                        dataSource.destroyTimeUpdater();
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'remove',
                                dataSourceIds: [dataSource.getId()],
                                startTimestamp: this.getStartTimeAsTimestamp(),
                                endTimestamp: this.getEndTimeAsTimestamp()
                            }).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.disconnect()];
                                        case 1:
                                            _a.sent();
                                            this.timeChanged();
                                            this.onRemovedDataSource(dataSource.id);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {String} dataSourceId - the dataSource id
     * @param {Object} data - the data to push into the data synchronizer
     */
    DataSynchronizerReplay.prototype.push = function (dataSourceId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.synchronizerWorker) {
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
    DataSynchronizerReplay.prototype.version = function () {
        return this.properties.version;
    };
    /**
     * Connects all dataSources
     */
    DataSynchronizerReplay.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.dataSources.length > 0) {
                    return [2 /*return*/, this.checkInit().then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var isConnected;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.isConnected()];
                                    case 1:
                                        isConnected = _a.sent();
                                        return [2 /*return*/, isConnected ? isConnected : this.doConnect()];
                                }
                            });
                        }); })];
                }
                return [2 /*return*/];
            });
        });
    };
    DataSynchronizerReplay.prototype.checkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!isDefined(this.init)) {
                    this.init = this.initDataSources();
                }
                return [2 /*return*/, this.init];
            });
        });
    };
    DataSynchronizerReplay.prototype.checkStartEndTime = function () {
        if (!this.properties.startTimestamp) {
            this.properties.startTimestamp = this.properties.minTimestamp;
        }
        if (!this.properties.endTimestamp) {
            this.properties.endTimestamp = this.properties.maxTimestamp;
        }
    };
    DataSynchronizerReplay.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, dataSource;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.checkStartEndTime();
                        return [4 /*yield*/, this.updateAlgo()];
                    case 1:
                        _b.sent();
                        _i = 0, _a = this.dataSources;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        dataSource = _a[_i];
                        return [4 /*yield*/, dataSource.setTimeRange(this.getStartTimeAsIsoDate(), this.getEndTimeAsIsoDate(), this.getReplaySpeed(), true)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
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
    DataSynchronizerReplay.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, _a, dataSource;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.reset()];
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
    /**
     * Sets the replaySpeed
     */
    DataSynchronizerReplay.prototype.setReplaySpeed = function (replaySpeed) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.replaySpeed = replaySpeed;
                this.properties.replaySpeed = replaySpeed;
                return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                        message: 'replay-speed',
                        replaySpeed: replaySpeed,
                    })];
            });
        });
    };
    /**
     * Sets the data source time range
     * @param {String} startTime - the startTime (in date ISO)
     * @param {String} endTime - the startTime (in date ISO)
     * @param {Number} replaySpeed - the replay speed
     * @param {boolean} reconnect - reconnect if was connected
     * @param {Mode} mode - default dataSource mode
     */
    DataSynchronizerReplay.prototype.setTimeRange = function (startTime, endTime, replaySpeed, reconnect) {
        if (startTime === void 0) { startTime = this.getStartTimeAsIsoDate(); }
        if (endTime === void 0) { endTime = this.getEndTimeAsIsoDate(); }
        if (replaySpeed === void 0) { replaySpeed = this.getReplaySpeed(); }
        if (reconnect === void 0) { reconnect = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, _a, ds;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.disconnect()];
                    case 1:
                        _b.sent();
                        this.incVersion();
                        // update properties of DataSynchronizer
                        this.replaySpeed = replaySpeed;
                        return [4 /*yield*/, this.setStartTime(startTime, false)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.setEndTime(endTime, false)];
                    case 3:
                        _b.sent();
                        promises = [];
                        // update properties of each DataSource
                        for (_i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                            ds = _a[_i];
                            promises.push(ds.setTimeRange(this.getStartTimeAsIsoDate(), this.getEndTimeAsIsoDate(), this.getReplaySpeed(), false, this.getMode(), this.version()));
                        }
                        return [2 /*return*/, Promise.all(promises)];
                }
            });
        });
    };
    DataSynchronizerReplay.prototype.setStartTimestamp = function (timestamp) {
        this.properties.startTimestamp = timestamp;
    };
    DataSynchronizerReplay.prototype.updateAlgo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, dataSource, dataSourcesForWorker, _b, _c, dataSource, obj;
            return __generator(this, function (_d) {
                // synchronize startTimestamp of synchronizer to datasources
                for (_i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                    dataSource = _a[_i];
                    dataSource.setStartTimestamp(this.getStartTimeAsTimestamp());
                    dataSource.setEndTimestamp(this.getEndTimeAsTimestamp());
                }
                // re-compute new min/max of synchronizer
                this.computeMinMax();
                dataSourcesForWorker = [];
                for (_b = 0, _c = this.dataSources; _b < _c.length; _b++) {
                    dataSource = _c[_b];
                    obj = {
                        bufferingTime: dataSource.properties.bufferingTime || 0,
                        timeOut: dataSource.properties.timeOut || 0,
                        id: dataSource.getId(),
                        name: dataSource.getName(),
                        minTimestamp: dataSource.getMinTimeAsTimestamp(),
                        maxTimestamp: dataSource.getMaxTimeAsTimestamp()
                    };
                    dataSourcesForWorker.push(obj);
                }
                return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                        message: 'time-range',
                        mode: this.getMode(),
                        replaySpeed: this.getReplaySpeed(),
                        startTimestamp: this.getStartTimeAsTimestamp(),
                        endTimestamp: this.getEndTimeAsTimestamp(),
                        version: this.version(),
                        dataSources: dataSourcesForWorker
                    })];
            });
        });
    };
    DataSynchronizerReplay.prototype.updateProperties = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, _a, ds;
            return __generator(this, function (_b) {
                promises = [];
                for (_i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                    ds = _a[_i];
                    promises.push(ds.updateProperties(properties));
                }
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    DataSynchronizerReplay.prototype.resetTimes = function () {
        this.computeMinMax();
    };
    /**
     * Resets reference time
     */
    DataSynchronizerReplay.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isDefined(this.synchronizerWorker)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.synchronizerWorker.postMessageWithAck({
                                message: 'reset'
                            }).then(function () { return _this.resetTimes(); })];
                    case 2: return [2 /*return*/, this.checkInit()];
                }
            });
        });
    };
    DataSynchronizerReplay.prototype.getCurrentTime = function () {
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
    DataSynchronizerReplay.prototype.isConnected = function () {
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
                            }).then(function (v) { return v.data; })];
                }
            });
        });
    };
    DataSynchronizerReplay.prototype.incVersion = function () {
        this.properties.version++;
    };
    DataSynchronizerReplay.prototype.autoUpdateTime = function (activate) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, _a, ds;
            return __generator(this, function (_b) {
                promises = [];
                for (_i = 0, _a = this.dataSources; _i < _a.length; _i++) {
                    ds = _a[_i];
                    promises.push(ds.autoUpdateTime(activate));
                }
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    DataSynchronizerReplay.prototype.onTimeChanged = function (min, max, start, end) {
    };
    DataSynchronizerReplay.prototype.onRemovedDataSource = function (dataSourceId) {
    };
    DataSynchronizerReplay.prototype.onAddedDataSource = function (dataSourceId) {
    };
    return DataSynchronizerReplay;
}());
export default DataSynchronizerReplay;
//# sourceMappingURL=DataSynchronizer.replay.js.map