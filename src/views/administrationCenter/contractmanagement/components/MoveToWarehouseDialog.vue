<template>
    <div>
      <el-dialog title="加入库取" :visible.sync="visible" :before-close="beforeClose" custom-class="customDialogTitle" append-to-body :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape">
        <div class="table_list unsortable warehouseDialog">
          <h4 class="moduleHeaderBorder clearfix">
            <span class="fl classifyNumber m-right20">{{ dataTable.info.commodityCode }}</span>
            <span class="fl classifyName">{{ dataTable.info.commodityName }}</span>
            <span class="fr">采购单购买数量：{{ dataTable.info.amount }}</span>
          </h4>
          <el-table border :data="dataTable.tableData" show-summary :summary-method="getSummaries" max-height="350">
            <el-table-column align="center" prop="storageName" label="仓库"></el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="scope">
                <div v-if="scope.row.storageName == '所有仓库'">
                  <p class="storageType">样品</p>
<!--                  <p class="storageType">在途可用</p>-->
                </div>
                <div v-if="scope.row.storageName != '所有仓库'">
                  <p class="storageType">可用</p>
                  <p class="storageType">暂扣</p>
                  <p class="storageType">占用</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量">
              <template slot-scope="scope">
                <div v-if="scope.row.storageName == '所有仓库'">
                  <p class="storageType">
                    <el-button type="text" size="medium" @click="showSampleDialog" :disabled="scope.row.inventorySample == 0">{{ scope.row.inventorySample }}</el-button>
                  </p>
<!--                  <p class="storageType" v-if="scope.$index == 0">-->
<!--                    <el-button type="text" size="medium" @click="showInRoadDialog" :disabled="scope.row.inventoryTransit == 0">{{ scope.row.inventoryTransit }}</el-button>-->
<!--                  </p>-->
                </div>
                <div v-if="scope.row.storageName != '所有仓库'">
                  <p class="storageType">{{ scope.row.available }}</p>
                  <p class="storageType">
                    <el-button type="text" size="medium" @click="showWithholdDialog(scope.row.storageId,scope.$index)" :disabled="scope.row.deducted == 0">{{ scope.row.deducted }}</el-button>
                  </p>
                  <p class="storageType">{{ scope.row.takeInventory }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="购买数量" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.storageName == '所有仓库'">
                  <p class="storageType">{{ scope.row.inventorySampleBuyNum }}</p>
<!--                  <p class="storageType" v-if="scope.$index == 0">{{ scope.row.inventoryTransitBuyNum }}</p>-->
                </div>
                <div v-if="scope.row.storageName != '所有仓库'">
                  <p class="storageType">
                    <el-input-number v-model="scope.row.buyNum" :size="size" :controls="controls" :min="min" placeholder="购买数量" @blur="buyNumChange($event,scope.row.available,scope.$index, 1)"></el-input-number>
                  </p>
                  <p class="storageType">{{ scope.row.deductedBuyNum }}</p>
                  <p class="storageType"></p>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="moveToWareHouseListConfirm" :loading="loadingBtn">确 定</el-button>
          <el-button @click="beforeClose">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="sampleVisible" append-to-body :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape">
        <div class="table_list">
          <el-table border :data="sampleData">
            <el-table-column property="storageName" label="所属仓库" align="center"></el-table-column>
            <el-table-column property="inventoryNumber" label="样品可用数量" align="center"></el-table-column>
            <el-table-column property="address" label="购买数量" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.buyNum" :size="size" :controls="controls" :min="min" placeholder="购买数量" @blur="buyNumChange($event,scope.row.inventoryNumber,scope.$index,'sampleData')"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sampleConfirm">确 定</el-button>
          <el-button @click="sampleVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="inRoadVisible" append-to-body :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape">
        <div class="table_list">
          <el-table border :data="inRoadData">
            <el-table-column property="purchaseNumber" label="采购单号" align="center"></el-table-column>
            <el-table-column property="predictArrivalTime" label="预计到货时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="number" label="在途可用数量" align="center"></el-table-column>
            <el-table-column property="address" label="购买数量" align="center" width="150">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.buyNum" :size="size" :controls="controls" :min="min" placeholder="购买数量" @blur="buyNumChange($event,scope.row.number,scope.$index,'inRoadData')"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="inRoadConfirm">确 定</el-button>
          <el-button @click="inRoadVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="withholdVisible" append-to-body :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape">
        <div class="table_list">
          <el-table border :data="withholdData">
            <el-table-column property="salesman" label="销售员" align="center"></el-table-column>
            <el-table-column property="inventoryNumber" label="暂扣数量" align="center"></el-table-column>
            <el-table-column property="address" label="购买数量" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.buyNum" :size="size" :controls="controls" :min="min" placeholder="购买数量" @blur="buyNumChange($event,scope.row.inventoryNumber,scope.$index,'withholdData')"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="withholdConfirm">确 定</el-button>
          <el-button @click="withholdVisible = false;storageIndex=''">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { listWithholdStorageCommodity, listSampleStorageCommodity, listTransitStorageCommodity, getLibrariesTake } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
  import { getUUID } from 'api/pulicJava';
  export default {
    name: 'MoveToWarehouseDialog',
    props: ['visible', 'datas'],
    data() {
      return {
        size: 'small',
        btnSize: 'small',
        controls: false,
        min: 0,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        withholdData: [],
        inRoadData: [],
        sampleData: [],
        withholdVisible: false,
        inRoadVisible: false,
        sampleVisible: false,
        buyNumTotal: this.datas.info.amount,
        dataTable: this.datas,
        storageIndex: '',
        dataAll: [],
        loadingBtn: false // 加入库取按钮loading
      }
    },
    methods: {
      // 在途弹出层
      showInRoadDialog() {
        let params = {
          commoditySKUId: this.datas.commoditySKUId
        }
        listTransitStorageCommodity(params)
          .then(response => {
            this.inRoadData = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/components/PurchaseContract.vue:showInRoadDialog'+ error)
          })
        this.inRoadVisible = true;
      },
      // 样品弹出层
      showSampleDialog() {
        let params = {
          commoditySKUId: this.datas.commoditySKUId
        }
        listSampleStorageCommodity(params)
          .then(response => {
            this.sampleData = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/components/PurchaseContract.vue:showSampleDialog' + error)
          })
        this.sampleVisible = true;
      },
      // 暂扣弹出层
      showWithholdDialog(storageId, storageIndex) {
        this.storageIndex = storageIndex;
        let params = {
          commoditySKUId: this.datas.commoditySKUId,
          storageId
        }
        listWithholdStorageCommodity(params)
          .then(response => {
            this.withholdData = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/components/PurchaseContract.vue:listWithholdStorageCommodity' + error)
          })
        this.withholdVisible = true;
      },
      // 加入库取关闭弹窗前
      beforeClose() {
        this.$emit('close');
      },
      // 样品弹窗确定
      sampleConfirm() {
        let buyNum = 0;
        this.sampleData.forEach(item => {
          buyNum += item.buyNum;
        })
        this.dataTable.tableData[0].inventorySampleBuyNum = buyNum;
        this.sampleVisible = false;
      },
      // 在途弹窗确定
      inRoadConfirm() {
        let buyNum = 0;
        this.inRoadData.forEach(item => {
          buyNum += item.buyNum;
        })
        this.dataTable.tableData[0].inventoryTransitBuyNum = buyNum;
        this.inRoadVisible = false;
      },
      // 暂扣弹窗确定
      withholdConfirm() {
        let buyNum = 0;
        this.withholdData.forEach(item => {
          buyNum += item.buyNum;
        })
        this.dataTable.tableData[this.storageIndex].deductedBuyNum = buyNum;
        this.withholdVisible = false;
      },
      // 手输购买数量
      buyNumChange(event, max, index, dataType) {
        let inputNum = 0;
        if (dataType == 1) {
          inputNum = this.dataTable.tableData[index].buyNum;
        } else {
          inputNum = this[dataType][index].buyNum;
        }
        if (max > this.buyNumTotal) {
          if (inputNum > this.buyNumTotal) {
            setTimeout(() => {
              if (dataType == 1) {
                this.$set(this.dataTable.tableData[index], 'buyNum', 0);
              } else {
                this.$set(this[dataType][index], 'buyNum', 0);
              }
            }, 0)
            this.$message.error('购买数量不能大于采购单采购数量');
          }
        } else {
          if (inputNum > max) {
            setTimeout(() => {
              if (dataType == 1) {
                this.$set(this.dataTable.tableData[index], 'buyNum', 0);
              } else {
                this.$set(this[dataType][index], 'buyNum', 0);
              }
            }, 0)
            this.$message.error('购买数量不能大于可用数量');
          }
        }
      },
      // 小计
      getSummaries(param) {
        const sums = [];
        sums[0] = '小计';
        sums[3] = this.calTotalCount;
        return sums;
      },
      // 确定加入库取
      moveToWareHouseListConfirm() {
        this.dataAll = [];
        if (this.calTotalCount > this.buyNumTotal) {
          this.$message.error('购买数量不能大于采购单采购数量');
        } else {
          this.dataTable.tableData.forEach((item, index) => {
            if (item.storageName == '所有仓库') {
              this.pushData(4, item.inventorySampleBuyNum, item.storageId);
              this.pushData(3, item.inventoryTransitBuyNum, item.storageId);
            } else {
              this.pushData(1, item.buyNum, item.storageId);
              this.pushData(2, item.deductedBuyNum, item.storageId);
            }
          })
          let dataAllNew = this.dataAll.filter(item => {
            return item.num !=0 && item.num != '' && item.num != undefined;
          })
          if (dataAllNew.length) {
            this.loadingBtn = true;
            let val = {
              orderId: this.$route.query.orderId,
              budgetRoomId: this.dataTable.info.roomId,
              commoditySKUId: this.dataTable.info.commoditySKUId,
              purchaseOrderCommodityId: this.dataTable.info.purchaseOrderCommodityId || "",
              storageTakeDetail: dataAllNew,
              librariesTakeType: this.dataTable.librariesTakeType || 2,
              num: this.calTotalCount
            };
            getLibrariesTake({ orderId: this.$route.query.orderId })
              .then(res => {
                if (res.data && res.data.librariesTakeId) {
                  val.librariesTakeNumber = res.data.librariesTakeNumber;
                  this.$emit('confirm', val);
                } else {
                  getUUID({ serialNumber: 'WO' })
                    .then(response => {
                      val.librariesTakeNumber = response.data;
                      this.$emit('confirm', val);
                    })
                    .catch(error => {
                      console.log('公共获取编码-getUUID:' + error);
                    })
                }
              })
              .catch(error => {
                console.log('views/administrationcenter/contractmanagement/components/MoveToWarehouseDialog.vue-moveToWareHouseListConfirm:' + error);
              })
          } else {
            this.$message.error('数量为0,将不进行任何操作');
            this.cancelMove();
          }
        }
      },
      // 取消加入库取
      cancelMove() {
        this.$store.dispatch('MOVETO_WAREHOUSE', {});
      },
      // 加入库取将仓库里的项拆出来
      pushData(occupyType, num, storageId) {
        this.dataAll.push({
          occupyType: occupyType,
          storageId: storageId || '',
          num: num
        })
      }
    },
    computed: {
      ...mapGetters([
        'moveSelectRow',
        'tablesData'
      ]),
      // 计算购买数量总数（用加入库取弹框计算）
      calTotalCount() {
        let totalNum = 0;
        this.dataTable.tableData.forEach((item, index) => {
          if (item.storageName == '所有仓库') {
            totalNum += item.inventorySampleBuyNum || 0;
            totalNum += item.inventoryTransitBuyNum || 0;
          } else {
            totalNum += item.deductedBuyNum || 0;
            totalNum += item.buyNum || 0;
          }
        })
        return totalNum;
      }
    }
  }
</script>
