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
import { Mode } from './Mode';
import TimeSeriesRealtimeDatasource from "./TimeSeries.realtime.datasource";
import TimeSeriesReplayDatasource from "./TimeSeries.replay.datasource";
import { isDefined, randomUUID } from "../utils/Utils";
/**
 * The DataSource is the abstract class used to create different datasources.
 *
 */
var TimeSeriesDatasource = /** @class */ (function () {
    function TimeSeriesDatasource(name, properties) {
        var id = randomUUID();
        this.timeSeriesRealtimeDataSource = new TimeSeriesRealtimeDatasource(name, __assign({ id: id }, properties));
        this.timeSeriesReplayDataSource = new TimeSeriesReplayDatasource(name, __assign({ id: id }, properties));
        this.setMode(properties.mode, false);
    }
    TimeSeriesDatasource.prototype.setMode = function (mode, disconnect) {
        if (disconnect === void 0) { disconnect = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(disconnect && this.timeSeriesDataSource)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.timeSeriesDataSource.disconnect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.timeSeriesDataSource || mode !== this.timeSeriesDataSource.getMode()) {
                            if (mode === Mode.REAL_TIME) {
                                this.timeSeriesDataSource = this.timeSeriesRealtimeDataSource;
                            }
                            else {
                                this.timeSeriesDataSource = this.timeSeriesReplayDataSource;
                            }
                            this.timeSeriesDataSource.resetInit();
                            // bind properties
                            this.properties = this.timeSeriesDataSource.properties;
                            this.id = this.timeSeriesDataSource.id;
                            this.name = this.timeSeriesDataSource.name;
                            this.properties.mode = mode;
                            return [2 /*return*/, this.timeSeriesDataSource.initDataSynchronizerIfPresent()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TimeSeriesDatasource.prototype.getTimeTopicId = function () {
        return this.timeSeriesDataSource.getTimeTopicId();
    };
    /**
     * Gets the mode
     * @returns {Mode} - Datasource mode
     */
    TimeSeriesDatasource.prototype.getMode = function () {
        return this.timeSeriesDataSource.getMode();
    };
    TimeSeriesDatasource.prototype.setVersion = function (version) {
        this.timeSeriesDataSource.setVersion(version);
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as ISO date
     */
    TimeSeriesDatasource.prototype.getStartTimeAsIsoDate = function () {
        return this.timeSeriesDataSource.getStartTimeAsIsoDate();
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as unix timestamp
     */
    TimeSeriesDatasource.prototype.getStartTimeAsTimestamp = function () {
        return this.timeSeriesDataSource.getStartTimeAsTimestamp();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesDatasource.prototype.getEndTimeAsIsoDate = function () {
        return this.timeSeriesDataSource.getEndTimeAsIsoDate();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as unix timestamp
     */
    TimeSeriesDatasource.prototype.getEndTimeAsTimestamp = function () {
        return this.timeSeriesDataSource.getEndTimeAsTimestamp();
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as ISO date
     */
    TimeSeriesDatasource.prototype.getMinTimeAsIsoDate = function () {
        return this.timeSeriesDataSource.getMinTimeAsIsoDate();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesDatasource.prototype.getMaxTimeAsIsoDate = function () {
        return this.timeSeriesDataSource.getMaxTimeAsIsoDate();
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as unix timestamp
     */
    TimeSeriesDatasource.prototype.getMinTimeAsTimestamp = function () {
        return this.timeSeriesDataSource.getMinTimeAsTimestamp();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as unix timestamp
     */
    TimeSeriesDatasource.prototype.getMaxTimeAsTimestamp = function () {
        return this.timeSeriesDataSource.getMaxTimeAsTimestamp();
    };
    /**
     * Sets the min time
     */
    TimeSeriesDatasource.prototype.setMinTime = function (time) {
        this.timeSeriesDataSource.setMinTime(time);
    };
    /**
     * Sets the max time
     */
    TimeSeriesDatasource.prototype.setMaxTime = function (time) {
        this.timeSeriesDataSource.setMaxTime(time);
    };
    /**
     * Sets the start time
     */
    TimeSeriesDatasource.prototype.setStartTimestamp = function (timestamp) {
        this.timeSeriesDataSource.setStartTimestamp(timestamp);
    };
    /**
     * Sets the end time
     */
    TimeSeriesDatasource.prototype.setEndTimestamp = function (timestamp) {
        this.timeSeriesDataSource.setEndTimestamp(timestamp);
    };
    /**
     * Sets the start time
     */
    TimeSeriesDatasource.prototype.setStartTime = function (time) {
        this.timeSeriesDataSource.setStartTime(time);
    };
    /**
     * Sets the end time
     */
    TimeSeriesDatasource.prototype.setEndTime = function (time) {
        this.timeSeriesDataSource.setEndTime(time);
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesDatasource.prototype.getReplaySpeed = function () {
        return this.timeSeriesDataSource.getReplaySpeed();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesDatasource.prototype.setReplaySpeed = function (replaySpeed) {
        this.timeSeriesDataSource.setReplaySpeed(replaySpeed);
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    /**
     * @param dataSynchronizer
     * @returns {Promise}
     */
    TimeSeriesDatasource.prototype.setDataSynchronizer = function (dataSynchronizer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isDefined(dataSynchronizer)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setMode(dataSynchronizer.getMode(), false)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.timeSeriesDataSource.setDataSynchronizer(dataSynchronizer)];
                }
            });
        });
    };
    TimeSeriesDatasource.prototype.getDataSynchronizer = function () {
        return this.timeSeriesDataSource.dataSynchronizer;
    };
    TimeSeriesDatasource.prototype.removeDataSynchronizer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.removeDataSynchronizer()];
            });
        });
    };
    /**
     * Disconnect the dataSource then the protocol will be closed as well.
     */
    TimeSeriesDatasource.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.disconnect()];
            });
        });
    };
    TimeSeriesDatasource.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.doConnect()];
            });
        });
    };
    /**
     * Inits the datasource with the constructor properties.
     * @protected
     * @param properties
     */
    TimeSeriesDatasource.prototype.initDataSource = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.initDataSource(properties)];
            });
        });
    };
    TimeSeriesDatasource.prototype.version = function () {
        return this.timeSeriesDataSource.version();
    };
    /**
     * Sets the data source time range
     * @param {String} startTime - the startTime (in date ISO)
     * @param {String} endTime - the startTime (in date ISO)
     * @param {Number} replaySpeed - the replay speed
     * @param {boolean} reconnect - reconnect if was connected
     * @param {Mode} mode - default dataSource mode
     * @param {Number} version - version of data
     */
    TimeSeriesDatasource.prototype.setTimeRange = function (startTime, endTime, replaySpeed, reconnect, mode, version) {
        if (startTime === void 0) { startTime = this.getStartTimeAsIsoDate(); }
        if (endTime === void 0) { endTime = this.getEndTimeAsIsoDate(); }
        if (replaySpeed === void 0) { replaySpeed = this.getReplaySpeed(); }
        if (reconnect === void 0) { reconnect = false; }
        if (mode === void 0) { mode = this.getMode(); }
        if (version === void 0) { version = this.version(); }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.setTimeRange(startTime, endTime, replaySpeed, reconnect, mode, version)];
            });
        });
    };
    /***********************************/
    /**
     * Gets the datasource id.
     * @return {String} the datasource id
     */
    TimeSeriesDatasource.prototype.getId = function () {
        return this.timeSeriesDataSource.getId();
    };
    /**
     * Gets the datasource name.
     * @return {String} the datasource name
     */
    TimeSeriesDatasource.prototype.getName = function () {
        return this.timeSeriesDataSource.getName();
    };
    TimeSeriesDatasource.prototype.terminate = function () {
        this.timeSeriesDataSource.terminate();
    };
    TimeSeriesDatasource.prototype.getTopicId = function () {
        return this.timeSeriesDataSource.getTopicId();
    };
    TimeSeriesDatasource.prototype.subscribe = function (fn, eventTypes) {
        this.timeSeriesDataSource.subscribe(fn, eventTypes);
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
    TimeSeriesDatasource.prototype.updateProperties = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.updateProperties(properties)];
            });
        });
    };
    /**
     * Connect the dataSource then the protocol will be opened as well.
     */
    TimeSeriesDatasource.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.connect()];
            });
        });
    };
    TimeSeriesDatasource.prototype.checkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.checkInit()];
            });
        });
    };
    TimeSeriesDatasource.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.isConnected()];
            });
        });
    };
    TimeSeriesDatasource.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.timeSeriesDataSource.reset()];
            });
        });
    };
    TimeSeriesDatasource.prototype.onTimeChanged = function (min, max, start, end) {
    };
    TimeSeriesDatasource.prototype.autoUpdateTime = function (activate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (activate) {
                    return [2 /*return*/, this.createTimeUpdater()];
                }
                else {
                    this.destroyTimeUpdater();
                }
                return [2 /*return*/];
            });
        });
    };
    // abstract
    TimeSeriesDatasource.prototype.createTimeUpdater = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    // abstract
    TimeSeriesDatasource.prototype.destroyTimeUpdater = function () { };
    return TimeSeriesDatasource;
}());
export default TimeSeriesDatasource;
//# sourceMappingURL=TimeSeries.datasource.js.map