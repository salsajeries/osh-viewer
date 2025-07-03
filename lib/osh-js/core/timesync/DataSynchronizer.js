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
import { Mode } from "../datasource/Mode";
import DataSynchronizerReplay from "./replay/DataSynchronizer.replay";
import DataSynchronizerRealtime from "./rt/DataSynchronizer.realtime";
import { randomUUID } from "../utils/Utils";
import { EventType } from "../event/EventType";
var DataSynchronizer = /** @class */ (function () {
    /**
     * Creates The dataSynchronizer.
     * @param {Object} properties - the property of the object
     * @param {String} [properties.id=randomUUID] - id of the dataSynchronizer or random if not provided
     * @param {Number} [properties.replaySpeed=1] - replaySpeed value
     * @param {Number} [properties.timerResolution=5] - interval in which data is played (in milliseconds)
     * @param {Number} [properties.masterTimeRefreshRate=250] - interval in which time value is send through broadcast channel (in milliseconds)
     * @param {Number} [properties.mode=Mode.REPLAY] - mode of the data synchronizer
     * @param {String} properties.startTime - start time of the temporal run
     * @param {String} properties.endTime - end time of the temporal run
     * @param {Datasource[]} properties.dataSources - the dataSource array
     */
    function DataSynchronizer(properties) {
        var _this = this;
        var id = properties.id || randomUUID();
        this.dataSynchronizerReplay = new DataSynchronizerReplay(__assign(__assign({}, properties), { id: id + '-replay' }), this);
        this.dataSynchronizerRt = new DataSynchronizerRealtime(__assign(__assign({}, properties), { id: id + '-realtime' }), this);
        this.broadcastChannels = [];
        this.setMode(properties.mode || Mode.REPLAY, false).then(function () {
            _this.dataSynchronizer.onTimeChanged = function (min, max, start, end) { return _this.onTimeChanged(min, max, start, end); };
            _this.dataSynchronizer.onAddedDataSource = function (dataSourceId) { return _this.onAddedDataSource(dataSourceId); };
            _this.dataSynchronizer.onRemovedDataSource = function (dataSourceId) { return _this.onRemovedDataSource(dataSourceId); };
        });
    }
    DataSynchronizer.prototype.getId = function () {
        return this.id;
    };
    DataSynchronizer.prototype.setMode = function (mode, disconnect) {
        if (disconnect === void 0) { disconnect = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, bc, promises, _b, _c, ds;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(this.dataSynchronizer && disconnect)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dataSynchronizer.disconnect()];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2:
                        if (mode === Mode.REPLAY) {
                            this.dataSynchronizer = this.dataSynchronizerReplay;
                        }
                        else if (mode === Mode.REAL_TIME) {
                            this.dataSynchronizer = this.dataSynchronizerRt;
                        }
                        this.id = this.dataSynchronizer.id;
                        for (_i = 0, _a = this.broadcastChannels; _i < _a.length; _i++) {
                            bc = _a[_i];
                            bc.close();
                        }
                        this.initEventSubscription();
                        this.broadcastChannels = [];
                        promises = [];
                        for (_b = 0, _c = this.dataSynchronizer.getDataSources(); _b < _c.length; _b++) {
                            ds = _c[_b];
                            promises.push(ds.setMode(mode, disconnect));
                        }
                        this.dataSynchronizer.onTimeChanged = function (min, max, start, end) { return _this.onTimeChanged(min, max, start, end); };
                        this.dataSynchronizer.onAddedDataSource = function (dataSourceId) { return _this.onAddedDataSource(dataSourceId); };
                        this.dataSynchronizer.onRemovedDataSource = function (dataSourceId) { return _this.onRemovedDataSource(dataSourceId); };
                        return [2 /*return*/, Promise.all(promises).then(function () { return _this.onChangedMode(mode); })];
                }
            });
        });
    };
    DataSynchronizer.prototype.initEventSubscription = function () {
        var _this = this;
        this.eventSubscriptionMap = {};
        // listen for Events to callback to subscriptions
        this.broadcastChannels.push(new BroadcastChannel(this.getTopicId()).onmessage = function (message) {
            var type = message.data.type;
            if (type in _this.eventSubscriptionMap) {
                for (var i = 0; i < _this.eventSubscriptionMap[type].length; i++) {
                    _this.eventSubscriptionMap[type][i](message.data);
                }
            }
        });
        this.broadcastChannels.push(new BroadcastChannel(this.getTimeTopicId()).onmessage = function (message) {
            if (message.data.type === EventType.MASTER_TIME) {
                // this.properties.startTimestamp = message.data.timestamp; // save as last timestamp
                _this.dataSynchronizer.setStartTimestamp(message.data.timestamp);
            }
            var type = message.data.type;
            if (type in _this.eventSubscriptionMap) {
                for (var i = 0; i < _this.eventSubscriptionMap[type].length; i++) {
                    _this.eventSubscriptionMap[type][i](message.data);
                }
            }
        });
    };
    DataSynchronizer.prototype.subscribe = function (fn, eventTypes) {
        // associate function to eventType
        for (var i = 0; i < eventTypes.length; i++) {
            if (!(eventTypes[i] in this.eventSubscriptionMap)) {
                this.eventSubscriptionMap[eventTypes[i]] = [];
            }
            this.eventSubscriptionMap[eventTypes[i]].push(fn);
        }
    };
    DataSynchronizer.prototype.getDataSources = function () {
        return this.dataSynchronizer.getDataSources();
    };
    DataSynchronizer.prototype.getTopicId = function () {
        return this.dataSynchronizer.getTopicId();
    };
    DataSynchronizer.prototype.getTimeTopicId = function () {
        return this.dataSynchronizer.getTimeTopicId();
    };
    /**
     * Gets the startTime of the first DataSource objet
     * @returns {String} - startTime as ISO date
     */
    DataSynchronizer.prototype.getStartTimeAsIsoDate = function () {
        return this.dataSynchronizer.getStartTimeAsIsoDate();
    };
    /**
     * Gets the startTime of the first DataSource objet
     * @returns {String} - startTime as unix timestamp
     */
    DataSynchronizer.prototype.getStartTimeAsTimestamp = function () {
        return this.dataSynchronizer.getStartTimeAsTimestamp();
    };
    /**
     * Gets the endTime of the first DataSource objet
     * @returns {String} - endTime as ISO date
     */
    DataSynchronizer.prototype.getEndTimeAsIsoDate = function () {
        return this.dataSynchronizer.getEndTimeAsIsoDate();
    };
    DataSynchronizer.prototype.getEndTimeAsTimestamp = function () {
        return this.dataSynchronizer.getEndTimeAsTimestamp();
    };
    /**
     * Gets the minTime of the first DataSource objet
     * @returns {String} - startTime as ISO date
     */
    DataSynchronizer.prototype.getMinTimeAsIsoDate = function () {
        return this.dataSynchronizer.getMinTimeAsIsoDate();
    };
    /**
     * Gets the minTime of the first DataSource objet
     * @returns {String} - startTime as unix timestamp
     */
    DataSynchronizer.prototype.getMinTimeAsTimestamp = function () {
        return this.dataSynchronizer.getMinTimeAsTimestamp();
    };
    /**
     * Gets the maxTime of the first DataSource objet
     * @returns {String} - endTime as ISO date
     */
    DataSynchronizer.prototype.getMaxTimeAsIsoDate = function () {
        return this.dataSynchronizer.getMinTimeAsTimestamp();
    };
    /**
     * Gets the maxTime of the first DataSource objet
     * @returns {String} - endTime as unix timestamp
     */
    DataSynchronizer.prototype.getMaxTimeAsTimestamp = function () {
        return this.dataSynchronizer.getMaxTimeAsTimestamp();
    };
    /**
     * Gets the replaySpeed
     * @returns {Number} - the replay speed
     */
    DataSynchronizer.prototype.getReplaySpeed = function () {
        return this.dataSynchronizer.getReplaySpeed();
    };
    /**
     * Terminate the corresponding running WebWorker by calling terminate() on it.
     */
    DataSynchronizer.prototype.terminate = function () {
        if (this.dataSynchronizer) {
            return this.dataSynchronizer.terminate();
        }
    };
    DataSynchronizer.prototype.getMode = function () {
        return this.dataSynchronizer.getMode();
    };
    DataSynchronizer.prototype.autoUpdateTime = function (activate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizerReplay.autoUpdateTime(activate)];
            });
        });
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    DataSynchronizer.prototype.initDataSources = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.initDataSources()];
            });
        });
    };
    /**
     * Adds a new DataSource object to the list of datasources to synchronize.
     * note: don't forget to call reset() to be sure to re-init the synchronizer internal properties.
     * @param {TimeSeriesDataSource} dataSource - the new datasource to add
     */
    DataSynchronizer.prototype.addDataSource = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dataSynchronizerRt.addDataSource(dataSource);
                return [2 /*return*/, this.dataSynchronizerReplay.addDataSource(dataSource)];
            });
        });
    };
    /**
     * Removes a DataSource object from the list of datasources of the synchronizer.
     * @param {TimeSeriesDatasource} dataSource - the new datasource to add
     */
    DataSynchronizer.prototype.removeDataSource = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataSynchronizerRt.removeDataSource(dataSource)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.dataSynchronizerReplay.removeDataSource(dataSource)];
                }
            });
        });
    };
    /**
     * @param {String} dataSourceId - the dataSource id
     * @param {Object} data - the data to push into the data synchronizer
     */
    DataSynchronizer.prototype.push = function (dataSourceId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.push(dataSourceId, data)];
            });
        });
    };
    DataSynchronizer.prototype.version = function () {
        return this.dataSynchronizer.version();
    };
    /**
     * Connects all dataSources
     */
    DataSynchronizer.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.connect()];
            });
        });
    };
    DataSynchronizer.prototype.checkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.checkInit()];
            });
        });
    };
    DataSynchronizer.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.doConnect()];
            });
        });
    };
    /**
     * Disconnects all dataSources
     */
    DataSynchronizer.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.disconnect()];
            });
        });
    };
    /**
     * Sets the replaySpeed
     */
    DataSynchronizer.prototype.setReplaySpeed = function (replaySpeed) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.setReplaySpeed(replaySpeed)];
            });
        });
    };
    /**
     * Sets the data source time range
     * @param {String} startTime - the startTime (in date ISO)
     * @param {String} endTime - the startTime (in date ISO)
     * @param {Number} replaySpeed - the replay speed
     * @param {boolean} reconnect - reconnect if was connected
     */
    DataSynchronizer.prototype.setTimeRange = function (startTime, endTime, replaySpeed, reconnect) {
        if (startTime === void 0) { startTime = this.getStartTimeAsIsoDate(); }
        if (endTime === void 0) { endTime = this.getEndTimeAsIsoDate(); }
        if (replaySpeed === void 0) { replaySpeed = this.getReplaySpeed(); }
        if (reconnect === void 0) { reconnect = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.setTimeRange(startTime, endTime, replaySpeed, reconnect)];
            });
        });
    };
    DataSynchronizer.prototype.updateProperties = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.updateProperties(properties)];
            });
        });
    };
    /**
     * Resets reference time
     */
    DataSynchronizer.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.reset()];
            });
        });
    };
    DataSynchronizer.prototype.getCurrentTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.getCurrentTime()];
            });
        });
    };
    DataSynchronizer.prototype.setMinTime = function (minTime) {
        this.dataSynchronizer.setMinTime(minTime);
    };
    DataSynchronizer.prototype.setMaxTime = function (maxTime) {
        this.dataSynchronizer.setMaxTime(maxTime);
    };
    /**
 * Connect the dataSource then the protocol will be opened as well.
 */
    DataSynchronizer.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataSynchronizer.isConnected()];
            });
        });
    };
    DataSynchronizer.prototype.minMaxChanged = function (resetStartTimestamp) {
        if (resetStartTimestamp === void 0) { resetStartTimestamp = false; }
        if (resetStartTimestamp) {
            this.dataSynchronizerReplay.properties.startTimestamp = undefined;
            this.dataSynchronizerReplay.properties.endTimestamp = undefined;
        }
        this.dataSynchronizerReplay.computeMinMax();
        this.dataSynchronizerReplay.timeChanged();
    };
    DataSynchronizer.prototype.onTimeChanged = function (start, min) {
    };
    DataSynchronizer.prototype.onRemovedDataSource = function (dataSourceId) {
    };
    DataSynchronizer.prototype.onAddedDataSource = function (dataSourceId) {
    };
    DataSynchronizer.prototype.onChangedMode = function (mode) { };
    return DataSynchronizer;
}());
export default DataSynchronizer;
//# sourceMappingURL=DataSynchronizer.js.map