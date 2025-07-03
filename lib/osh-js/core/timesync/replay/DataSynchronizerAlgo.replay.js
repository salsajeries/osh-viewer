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
import { isDefined } from "../../utils/Utils.js";
import { Status } from "../../connector/Status.js";
import DataSynchronizerAlgo from "../DataSynchronizerAlgo";
var DataSynchronizerAlgoReplay = /** @class */ (function (_super) {
    __extends(DataSynchronizerAlgoReplay, _super);
    function DataSynchronizerAlgoReplay(dataSources, replaySpeed, startTimestamp, endTimestamp, timerResolution, version) {
        if (replaySpeed === void 0) { replaySpeed = 1; }
        if (timerResolution === void 0) { timerResolution = 5; }
        var _this = _super.call(this, dataSources, replaySpeed, timerResolution) || this;
        _this.replaySpeed = replaySpeed;
        _this.startTimestamp = startTimestamp;
        _this.endTimestamp = endTimestamp;
        _this.version = version;
        return _this;
    }
    DataSynchronizerAlgoReplay.prototype.push = function (dataSourceId, dataBlocks) {
        var _a;
        if (dataBlocks.length === 0) {
            return;
        }
        if (dataSourceId in this.dataSourceMap) {
            var ds = this.dataSourceMap[dataSourceId];
            var lastData = dataBlocks[dataBlocks.length - 1];
            if (!this.checkVersion(lastData)) {
                console.warn("[DataSynchronizer] incompatible version ".concat(lastData.version, " ~ ").concat(this.version, ", skipping data"));
                return;
            }
            (_a = ds.dataBuffer).push.apply(_a, dataBlocks);
        }
    };
    DataSynchronizerAlgoReplay.prototype.processData = function () {
        var _this = this;
        this.clockTimeRef = performance.now();
        this.interval = setInterval(function () {
            // 1) return the oldest data if any
            while (_this.computeNextData(_this.startTimestamp, _this.clockTimeRef)) {
                _this.checkEnd();
            }
            _this.checkEnd();
        }, this.timerResolution);
        console.warn("Started Replay Algorithm with tsRef=".concat(new Date(this.startTimestamp).toISOString()));
    };
    /**
     * Compute the next data if any. We return only 1 value for this iteration. If there are multiple values to return,
     * we return only the oldest one.
     * @param tsRef - the timestamp of the first data
     * @param refClockTime - the absolute diff time really spent
     */
    DataSynchronizerAlgoReplay.prototype.computeNextData = function (tsRef, refClockTime) {
        try {
            var currentDs = void 0;
            var currentDsToShift = null;
            var dClock = (performance.now() - refClockTime) * this.replaySpeed;
            var tsRun = tsRef + dClock;
            var computeNext = false;
            // compute next data to return
            for (var currentDsId in this.dataSourceMap) {
                currentDs = this.dataSourceMap[currentDsId];
                if (currentDs.skip) {
                    // if datasource is in current range
                    if (tsRun > currentDs.minTimestamp && tsRun < currentDs.maxTimestamp) {
                        currentDs.skip = false;
                    }
                }
                // skip DatSource if out of time range
                if (currentDs.skip)
                    continue;
                if (currentDs.dataBuffer.length > 0) {
                    var dTs = (currentDs.dataBuffer[0].data.timestamp - tsRef);
                    // we use an intermediate object to store the data to shift because we want to return the oldest one
                    // only
                    if (dTs <= dClock) {
                        // no other one to compare
                        if (currentDsToShift === null) {
                            currentDsToShift = currentDs;
                        }
                        else {
                            // take the oldest data
                            currentDsToShift = (currentDsToShift.dataBuffer[0].data.timestamp < currentDs.dataBuffer[0].data.timestamp) ?
                                currentDsToShift : currentDs;
                        }
                    }
                }
            }
            // finally pop the data from DS queue
            if (currentDsToShift !== null) {
                if (currentDsToShift.id in this.dataSourceMap) {
                    this.onData(currentDsToShift.id, currentDsToShift.dataBuffer.shift());
                }
                computeNext = true;
            }
            this.tsRun = tsRun;
            return computeNext;
        }
        catch (ex) {
            console.log(ex);
            return false;
        }
    };
    /**
     * Add dataSource to be synchronized
     * @param {Datasource} dataSource - the dataSource to synchronize
     */
    DataSynchronizerAlgoReplay.prototype.addDataSource = function (dataSource) {
        this.dataSourceMap[dataSource.id] = {
            dataBuffer: [],
            id: dataSource.id,
            name: dataSource.name || dataSource.id,
            status: Status.DISCONNECTED,
            minTimestamp: dataSource.minTimestamp,
            maxTimestamp: dataSource.maxTimestamp,
            skip: false
        };
        if (dataSource.maxTimestamp < this.getCurrentTimestamp() || dataSource.minTimestamp > this.getCurrentTimestamp()) {
            this.dataSourceMap[dataSource.id].skip = true;
            console.warn("Skipping new added dataSource ".concat(dataSource.id, " because timeRange of the dataSource is not intersecting the synchronizer one"));
        }
        this.datasources.push(dataSource);
    };
    DataSynchronizerAlgoReplay.prototype.checkVersion = function (dataBlock) {
        return (dataBlock.version === this.version);
    };
    /**
     * Change the dataSource status
     * @param {Status} status - the new status
     * @param {String} dataSourceId - the corresponding dataSource id
     */
    DataSynchronizerAlgoReplay.prototype.setStatus = function (dataSourceId, status) {
        if (dataSourceId in this.dataSourceMap) {
            this.dataSourceMap[dataSourceId].status = status;
            console.warn(status + ' DataSource ' + dataSourceId + ' from the synchronizer ');
        }
        this.checkStart();
    };
    DataSynchronizerAlgoReplay.prototype.checkStart = function () {
        if (!isDefined(this.interval)) {
            var nbSkip = 0;
            var nbFetch = 0;
            var totalDataSources = Object.keys(this.dataSourceMap).length;
            if (totalDataSources === 0) {
                return;
            }
            var dataSource = void 0;
            for (var dataSourceID in this.dataSourceMap) {
                dataSource = this.dataSourceMap[dataSourceID];
                dataSource.skip = (this.startTimestamp < dataSource.minTimestamp) || (this.startTimestamp > dataSource.maxTimestamp);
                if (dataSource.status === Status.FETCH_STARTED) {
                    nbFetch++;
                }
                else if (dataSource.skip) {
                    nbSkip++;
                }
            }
            console.warn("[Synchronizer] Fetched ".concat(nbFetch, "/").concat(totalDataSources, " datasources"));
            console.warn("[Synchronizer] Skipped ".concat(nbSkip, "/").concat(totalDataSources, " datasources"));
            if ((nbFetch + nbSkip) === totalDataSources) {
                console.warn('Starting Replay Algorithm...');
                this.processData();
                this.onStart();
            }
        }
    };
    DataSynchronizerAlgoReplay.prototype.checkEnd = function () {
        if (this.getCurrentTimestamp() > this.endTimestamp) {
            this.onEnd();
            this.reset();
        }
    };
    DataSynchronizerAlgoReplay.prototype.reset = function () {
        console.log('reset synchronizer algo');
        this.close();
        for (var currentDsId in this.dataSourceMap) {
            this.resetDataSource(currentDsId);
        }
        this.tsRun = undefined;
    };
    DataSynchronizerAlgoReplay.prototype.resetDataSource = function (datasourceId) {
        var currentDs = this.dataSourceMap[datasourceId];
        currentDs.dataBuffer = [];
        currentDs.status = Status.DISCONNECTED;
        currentDs.version = undefined;
        currentDs.skip = false;
    };
    DataSynchronizerAlgoReplay.prototype.removeDataSource = function (dataSourceId) {
        _super.prototype.removeDataSource.call(this, dataSourceId);
        // looking for next start Timestamp
        var currentTimestamp = this.getCurrentTimestamp();
        var min, ds;
        for (var dsKey in this.dataSourceMap) {
            ds = this.dataSourceMap[dsKey];
            if (currentTimestamp >= ds.minTimestamp && currentTimestamp <= ds.maxTimestamp) {
                // continue because this datasource is in the current range
                return;
            }
            else {
                // otherwise
                // looking for next range and reset algo
                if (!min) {
                    min = ds.minTimestamp;
                }
                else if (ds.minTimestamp < min) {
                    min = ds.minTimestamp;
                }
            }
        }
    };
    DataSynchronizerAlgoReplay.prototype.setEndTimestamp = function (maxTimestamp) {
        this.endTimestamp = maxTimestamp;
    };
    DataSynchronizerAlgoReplay.prototype.setTimeRange = function (startTimestamp, endTimestamp, replaySped) {
        this.replaySpeed = replaySped;
        this.startTimestamp = startTimestamp;
        this.endTimestamp = endTimestamp;
        this.clockTimeRef = performance.now();
        this.reset();
        this.checkStart();
    };
    DataSynchronizerAlgoReplay.prototype.onEnd = function () { };
    DataSynchronizerAlgoReplay.prototype.onStart = function () { };
    return DataSynchronizerAlgoReplay;
}(DataSynchronizerAlgo));
export default DataSynchronizerAlgoReplay;
//# sourceMappingURL=DataSynchronizerAlgo.replay.js.map