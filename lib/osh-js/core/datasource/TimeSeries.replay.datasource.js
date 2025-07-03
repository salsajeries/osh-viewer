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
import { assertDefined, isDefined } from "../utils/Utils";
import DataSource, { getDataSourceWorkers } from "./DataSource.datasource";
import { Mode } from './Mode';
/**
 * The DataSource is the abstract class used to create different datasources.
 *
 */
var TimeSeriesReplayDatasource = /** @class */ (function (_super) {
    __extends(TimeSeriesReplayDatasource, _super);
    function TimeSeriesReplayDatasource(name, properties) {
        if (name === void 0) { name = 'DataSource'; }
        var _this = _super.call(this, name, properties) || this;
        _this.setMinTime(properties.startTime);
        _this.setMaxTime(properties.endTime);
        _this.properties.startTimestamp = new Date(properties.startTime).getTime();
        _this.properties.endTimestamp = new Date(properties.endTime).getTime();
        assertDefined(properties, 'Some properties must be defined');
        _this.dataSynchronizer = undefined;
        _this.properties.version = 0;
        return _this;
    }
    TimeSeriesReplayDatasource.prototype.getTimeTopicId = function () {
        return DATASOURCE_TIME_TOPIC + this.id;
    };
    /**
     * Gets the mode
     * @returns {Mode} - Datasource mode
     */
    TimeSeriesReplayDatasource.prototype.getMode = function () {
        return this.properties.mode;
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as ISO date
     */
    TimeSeriesReplayDatasource.prototype.getStartTimeAsIsoDate = function () {
        return new Date(this.getStartTimeAsTimestamp()).toISOString();
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as unix timestamp
     */
    TimeSeriesReplayDatasource.prototype.getStartTimeAsTimestamp = function () {
        return this.properties.startTimestamp;
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesReplayDatasource.prototype.getEndTimeAsIsoDate = function () {
        return new Date(this.getEndTimeAsTimestamp()).toISOString();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as unix timestamp
     */
    TimeSeriesReplayDatasource.prototype.getEndTimeAsTimestamp = function () {
        return this.properties.endTimestamp;
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as ISO date
     */
    TimeSeriesReplayDatasource.prototype.getMinTimeAsIsoDate = function () {
        return new Date(this.getMinTimeAsTimestamp()).toISOString();
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesReplayDatasource.prototype.getMaxTimeAsIsoDate = function () {
        return new Date(this.getMaxTimeAsTimestamp()).toISOString();
    };
    /**
     * Gets the startTime
     * @returns {String} - startTime as unix timestamp
     */
    TimeSeriesReplayDatasource.prototype.getMinTimeAsTimestamp = function () {
        return this.properties.minTimestamp;
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as unix timestamp
     */
    TimeSeriesReplayDatasource.prototype.getMaxTimeAsTimestamp = function () {
        return this.properties.maxTimestamp;
    };
    /**
     * Sets the min time
     */
    TimeSeriesReplayDatasource.prototype.setMinTime = function (time) {
        this.properties.minTimestamp = new Date(time).getTime();
        this.computeMinMax();
    };
    /**
     * Sets the max time
     */
    TimeSeriesReplayDatasource.prototype.setMaxTime = function (time) {
        this.properties.maxTimestamp = new Date(time).getTime();
        this.computeMinMax();
    };
    /**
     * Sets the start time
     */
    TimeSeriesReplayDatasource.prototype.setStartTimestamp = function (timestamp) {
        this.properties.startTimestamp = timestamp;
        this.computeMinMax();
    };
    /**
     * Sets the end time
     */
    TimeSeriesReplayDatasource.prototype.setEndTimestamp = function (timestamp) {
        this.properties.endTimestamp = timestamp;
        this.computeMinMax();
    };
    /**
     * Sets the start time
     */
    TimeSeriesReplayDatasource.prototype.setStartTime = function (time) {
        this.setStartTimestamp(new Date(time).getTime());
    };
    /**
     * Sets the end time
     */
    TimeSeriesReplayDatasource.prototype.setEndTime = function (time) {
        this.setEndTimestamp(new Date(time).getTime());
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesReplayDatasource.prototype.getReplaySpeed = function () {
        return this.properties.replaySpeed;
    };
    /**
     * Gets the endTime
     * @returns {String} - endTime as ISO date
     */
    TimeSeriesReplayDatasource.prototype.setReplaySpeed = function (replaySpeed) {
        this.properties.replaySpeed = replaySpeed;
    };
    TimeSeriesReplayDatasource.prototype.setVersion = function (version) {
        this.properties.version = version;
    };
    //----------- ASYNCHRONOUS FUNCTIONS -----------------//
    /**
     * @param dataSynchronizer
     * @returns {Promise}
     */
    TimeSeriesReplayDatasource.prototype.setDataSynchronizer = function (dataSynchronizer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dataSynchronizer = dataSynchronizer;
                return [2 /*return*/, this.initDataSynchronizerIfPresent()];
            });
        });
    };
    TimeSeriesReplayDatasource.prototype.initDataSynchronizerIfPresent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var topic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dataSynchronizer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        topic = DATA_SYNCHRONIZER_TOPIC + this.dataSynchronizer.getId();
                        this.properties.version = this.dataSynchronizer.version();
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'topics',
                                topics: {
                                    data: topic,
                                    time: this.getTimeTopicId(),
                                    sync: this.dataSynchronizer.getTimeTopicId()
                                },
                                dsId: this.id,
                                mode: Mode.REPLAY,
                            })];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    TimeSeriesReplayDatasource.prototype.removeDataSynchronizer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // ISSUE: this causing loop because this.dataSynchronizer.removeDataSource(this); is calling this method
                // if(this.dataSynchronizer) {
                //     await this.dataSynchronizer.removeDataSource(this);
                // }
                this.init = undefined;
                this.dataSynchronizer = undefined;
                return [2 /*return*/, this.checkInit()];
            });
        });
    };
    /**
     * Disconnect the dataSource then the protocol will be closed as well.
     */
    TimeSeriesReplayDatasource.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (isDefined(this.init)) {
                    try {
                        return [2 /*return*/, this.getWorker().postMessageWithAck({
                                message: 'disconnect',
                                dsId: this.id,
                                mode: Mode.REPLAY,
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
    TimeSeriesReplayDatasource.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getWorker().postMessageWithAck({
                        message: 'connect',
                        startTime: this.getStartTimeAsIsoDate(),
                        version: this.version(),
                        dsId: this.id,
                        mode: Mode.REPLAY,
                    })];
            });
        });
    };
    /**
     * Inits the datasource with the constructor properties.
     * @protected
     * @param properties
     */
    TimeSeriesReplayDatasource.prototype.initDataSource = function (properties) {
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
                                mode: Mode.REPLAY,
                            }).then(function () {
                                // listen for Events to callback to subscriptions
                                var datasourceBroadcastChannel = new BroadcastChannel(_this.getTimeTopicId());
                                datasourceBroadcastChannel.onmessage = function (message) {
                                    _this.handleTimeMessage(message);
                                };
                            })];
                }
            });
        });
    };
    TimeSeriesReplayDatasource.prototype.handleTimeMessage = function (message) {
        var type = message.data.type;
        if (type in this.eventSubscriptionMap) {
            for (var i = 0; i < this.eventSubscriptionMap[type].length; i++) {
                this.eventSubscriptionMap[type][i](message.data);
            }
        }
    };
    TimeSeriesReplayDatasource.prototype.version = function () {
        return this.properties.version;
    };
    TimeSeriesReplayDatasource.prototype.computeMinMax = function () {
        // intersect end/start depending on the min/max
        if (this.properties.startTimestamp < this.properties.minTimestamp) {
            this.properties.startTimestamp = this.properties.minTimestamp;
        }
        if (this.properties.endTimestamp > this.properties.maxTimestamp) {
            this.properties.endTimestamp = this.properties.maxTimestamp;
        }
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
    TimeSeriesReplayDatasource.prototype.setTimeRange = function (startTime, endTime, replaySpeed, reconnect, mode, version) {
        if (startTime === void 0) { startTime = this.getStartTimeAsIsoDate(); }
        if (endTime === void 0) { endTime = this.getEndTimeAsIsoDate(); }
        if (replaySpeed === void 0) { replaySpeed = this.getReplaySpeed(); }
        if (reconnect === void 0) { reconnect = false; }
        if (mode === void 0) { mode = this.getMode(); }
        if (version === void 0) { version = this.version(); }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkInit()];
                    case 1:
                        _a.sent();
                        if (version !== this.version()) {
                            // update version if come in from other input
                            this.properties.version = version;
                        }
                        // compute intersection
                        this.properties.startTimestamp = new Date(startTime).getTime();
                        this.properties.endTimestamp = new Date(endTime).getTime();
                        this.computeMinMax();
                        return [2 /*return*/, this.updateProperties({
                                startTime: this.getStartTimeAsIsoDate(),
                                endTime: this.getEndTimeAsIsoDate(),
                                replaySpeed: replaySpeed,
                                reconnect: reconnect,
                                mode: mode,
                                version: version
                            })];
                }
            });
        });
    };
    TimeSeriesReplayDatasource.prototype.reset = function () {
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
    return TimeSeriesReplayDatasource;
}(DataSource));
export default TimeSeriesReplayDatasource;
//# sourceMappingURL=TimeSeries.replay.datasource.js.map