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
import { DATASOURCE_DATA_TOPIC } from "../../Constants.js";
import { EventType } from "../../event/EventType.js";
import { isDefined } from "../../utils/Utils";
import DataSynchronizerAlgoRealtime from "./DataSynchronizerAlgo.realtime.js";
var bcChannels = {};
var dataSynchronizerAlgo;
var init = false;
var dataSynchronizerBroadCastChannel = null;
var lastData = undefined;
var dataSources = {};
var timeBroadcastChannel = null;
var topicTime;
var topicData;
var masterTimeInterval = undefined;
var cTime;
var cId;
var lastTime = -1;
var version = -1;
var promise;
var masterTimeRefreshRate;
self.onmessage = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        handleMessage(event);
        return [2 /*return*/];
    });
}); };
function handleMessage(event) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, data, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resp = {};
                    if (event.data.ackId) {
                        resp.ackId = event.data.ackId;
                    }
                    data = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, 10, 11]);
                    if (!(event.data.message === 'init')) return [3 /*break*/, 2];
                    version = event.data.version;
                    dataSynchronizerAlgo = new DataSynchronizerAlgoRealtime(event.data.dataSources, event.data.replaySpeed, event.data.timerResolution);
                    dataSynchronizerAlgo.onData = onData;
                    init = true;
                    addDataSources(event.data.dataSources);
                    topicData = event.data.topics.data;
                    topicTime = event.data.topics.time;
                    initBroadcastChannel(topicData, topicTime);
                    masterTimeRefreshRate = event.data.masterTimeRefreshRate;
                    return [3 /*break*/, 8];
                case 2:
                    if (!(event.data.message === 'add' && event.data.dataSources)) return [3 /*break*/, 3];
                    console.log('Add datasource to synchronizer..');
                    addDataSources(event.data.dataSources);
                    return [3 /*break*/, 8];
                case 3:
                    if (!(event.data.message === 'connect')) return [3 /*break*/, 4];
                    startMasterTimeInterval(masterTimeRefreshRate);
                    dataSynchronizerAlgo.checkStart();
                    version = event.data.version;
                    return [3 /*break*/, 8];
                case 4:
                    if (!(event.data.message === 'is-connected')) return [3 /*break*/, 5];
                    data = {
                        message: 'is-connected',
                        data: isDefined(masterTimeInterval)
                    };
                    return [3 /*break*/, 8];
                case 5:
                    if (!(event.data.message === 'remove' && event.data.dataSourceIds)) return [3 /*break*/, 7];
                    console.log('Remove datasource from synchronizer..');
                    return [4 /*yield*/, removeDataSources(event.data.dataSourceIds)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    if (event.data.message === 'current-time') {
                        data = {
                            message: 'current-time',
                            data: dataSynchronizerAlgo.getCurrentTimestamp()
                        };
                    }
                    else if (event.data.message === 'reset') {
                        reset();
                    }
                    else if (event.data.message === 'replay-speed') {
                        if (dataSynchronizerAlgo !== null) {
                            reset();
                        }
                    }
                    else if (event.data.message === 'data') {
                        checkMasterTime();
                        if (dataSynchronizerAlgo !== null) {
                            dataSynchronizerAlgo.push(event.data.dataSourceId, event.data.data);
                        }
                    }
                    _a.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    ex_1 = _a.sent();
                    console.error(ex_1);
                    resp.error = ex_1;
                    return [3 /*break*/, 11];
                case 10:
                    resp.data = data;
                    self.postMessage(resp);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function reset() {
    clearInterval(masterTimeInterval);
    masterTimeInterval = undefined;
    if (dataSynchronizerAlgo !== null) {
        dataSynchronizerAlgo.reset();
    }
    timeBroadcastChannel.postMessage({
        type: EventType.TIME_CHANGED
    });
    timeBroadcastChannel.postMessage({
        type: EventType.CLOSED
    });
    dataSynchronizerBroadCastChannel.postMessage({
        type: EventType.STATUS,
        status: 'not_running',
    });
}
function initBroadcastChannel(dataTopic, timeTopic) {
    console.log('listen on topic ', dataTopic);
    dataSynchronizerBroadCastChannel = new BroadcastChannel(dataTopic);
    dataSynchronizerBroadCastChannel.onmessage = function (event) {
        checkMasterTime();
        if (event.data.type === EventType.DATA) {
            dataSynchronizerAlgo.push(event.data.dataSourceId, event.data.values);
        }
        else if (event.data.type === EventType.STATUS) {
            var dataSourceId = event.data.dataSourceId;
            dataSynchronizerAlgo.setStatus(dataSourceId, event.data.status);
            // bubble the message
            if (dataSourceId in bcChannels) {
                console.log(dataSources[dataSourceId].name + ": status=" + event.data.status);
                bcChannels[dataSourceId].postMessage(event.data);
            }
        }
    };
    timeBroadcastChannel = new BroadcastChannel(timeTopic);
}
/**
 *
 * @param dataSources
 */
function addDataSources(dataSources) {
    for (var _i = 0, dataSources_1 = dataSources; _i < dataSources_1.length; _i++) {
        var dataSource = dataSources_1[_i];
        addDataSource(dataSource);
    }
}
function addDataSource(dataSource) {
    dataSynchronizerAlgo.addDataSource(dataSource);
    // create a BC to push back the synchronized data into the DATA Stream.
    bcChannels[dataSource.id] = new BroadcastChannel(DATASOURCE_DATA_TOPIC + dataSource.id);
    if (!(dataSource.id in dataSources)) {
        dataSources[dataSource.id] = dataSource;
    }
}
/**
 *
 * @param dataSourceIds
 */
function removeDataSources(dataSourceIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, dataSourceIds_1, dataSourceId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, dataSourceIds_1 = dataSourceIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < dataSourceIds_1.length)) return [3 /*break*/, 4];
                    dataSourceId = dataSourceIds_1[_i];
                    return [4 /*yield*/, removeDataSource(dataSourceId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function removeDataSource(dataSourceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataSynchronizerAlgo.removeDataSource(dataSourceId)];
                case 1:
                    _a.sent();
                    // create a BC to push back the synchronized data into the DATA Stream.
                    console.log('deleting BC for datasource ' + dataSourceId);
                    delete bcChannels[dataSourceId];
                    delete dataSources[dataSourceId];
                    return [2 /*return*/];
            }
        });
    });
}
function checkMasterTime() {
    if (!isDefined(masterTimeInterval)) {
        startMasterTimeInterval(masterTimeRefreshRate);
    }
}
function onEnd() {
    return __awaiter(this, void 0, void 0, function () {
        var masterTime;
        return __generator(this, function (_a) {
            masterTime = dataSynchronizerAlgo.getCurrentTimestamp();
            clearInterval(masterTimeInterval);
            masterTimeInterval = undefined;
            // end at this time
            timeBroadcastChannel.postMessage({
                timestamp: masterTime,
                type: EventType.MASTER_TIME
            });
            return [2 /*return*/];
        });
    });
}
function onStart() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            checkMasterTime();
            return [2 /*return*/];
        });
    });
}
function onClose() {
    timeBroadcastChannel.postMessage({
        type: EventType.CLOSED
    });
}
function onData(dataSourceId, dataBlock) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (dataBlock.version !== version) {
                console.error('version are different:', dataBlock.version, version);
                return [2 /*return*/];
            }
            lastData = {
                dataSourceId: dataSourceId,
                dataBlock: dataBlock,
            };
            bcChannels[dataSourceId].postMessage({
                values: [dataBlock],
                dataSourceId: dataSourceId,
                type: EventType.DATA
            });
            return [2 /*return*/];
        });
    });
}
self.onclose = function () {
    dataSynchronizerAlgo.close();
    console.log("Data Synchronizer has been terminated successfully");
};
var masterTime;
function startMasterTimeInterval(masterTimeRefreshRate) {
    if (!isDefined(masterTimeInterval)) {
        masterTimeInterval = setInterval(function () {
            masterTime = dataSynchronizerAlgo.getCurrentTimestamp();
            if (isDefined(masterTime)) {
                timeBroadcastChannel.postMessage({
                    timestamp: masterTime,
                    type: EventType.MASTER_TIME
                });
            }
            if (isDefined(lastData)) {
                cTime = lastData.dataBlock.data.timestamp;
                cId = lastData.dataSourceId;
                if ((cTime !== -1 && lastTime === -1) || (lastTime !== -1 && cTime !== lastTime)) { // does not send the same data twice
                    timeBroadcastChannel.postMessage({
                        timestamp: cTime,
                        dataSourceId: cId,
                        type: EventType.LAST_TIME
                    });
                }
                lastTime = cTime;
            }
        }, masterTimeRefreshRate);
        dataSynchronizerBroadCastChannel.postMessage({
            type: EventType.STATUS,
            status: 'running',
        });
    }
}
//# sourceMappingURL=DataSynchronizer.realtime.worker.js.map