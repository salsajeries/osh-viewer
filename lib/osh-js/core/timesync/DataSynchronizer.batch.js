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
import { Mode } from "../datasource/Mode";
import DataSynchronizerReplay from "./replay/DataSynchronizer.replay";
var DataSynchronizerBatch = /** @class */ (function (_super) {
    __extends(DataSynchronizerBatch, _super);
    /**
     * Creates The dataSynchronizer.
     * @param {Object} properties - the property of the object
     * @param {String} [properties.id=randomUUID] - id of the dataSynchronizer or random if not provided
     * @param {Number} [properties.replaySpeed=1] - replaySpeed value
     * @param {Number} [properties.timerResolution=5] - interval in which data is played (in milliseconds)
     * @param {Number} [properties.masterTimeRefreshRate=250] - interval in which time value is send through broadcast channel (in milliseconds)
     * @param {Number} [properties.mode=Mode.BATCH] - mode of the data synchronizer
     * @param {String} properties.startTime - start time of the temporal run
     * @param {String} properties.endTime - end time of the temporal run
     * @param {Datasource[]} properties.dataSources - the dataSource array
     */
    function DataSynchronizerBatch(properties) {
        return _super.call(this, properties) || this;
    }
    DataSynchronizerBatch.prototype.getMode = function () {
        return Mode.BATCH;
    };
    return DataSynchronizerBatch;
}(DataSynchronizerReplay));
export default DataSynchronizerBatch;
//# sourceMappingURL=DataSynchronizer.batch.js.map