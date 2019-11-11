<template>
  <div class="detachableparts">
    <el-dialog :visible.sync="outerVisible" :before-close="handleClose" width="70%">
      <div>
        <div class="titlecals">拆套列表</div>
        <div class="table_list lvs attribute" style="padding:0 30px;">
          <el-table
            border
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @selection-change="chooseDelete"
            :data="tableData"
          >
            <el-table-column align="center" type="selection" fixed></el-table-column>
            <el-table-column align="center" prop="storageName" label="所属仓库" width="200"></el-table-column>
            <el-table-column align="center" prop="commodityCode" label="商品编码" sortable width="200"></el-table-column>
            <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
            <el-table-column align="center" prop="commodityModel" label="商品规格" width="200"></el-table-column>
            <el-table-column align="center" prop="brandName" label="商品品牌" width="200"></el-table-column>
            <el-table-column align="center" prop="categoryName" label="商品类型" width="200"></el-table-column>
            <el-table-column
              align="center"
              prop="siteCode"
              label="所在货位"
              width="200"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="piece" label="库存件" width="200"></el-table-column>
            <el-table-column align="center" prop="inventoryNumber" label="库存套" width="200"></el-table-column>

            <el-table-column align="center" label="被拆件" width="200">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.combinationPiece" size="mini"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="被拆套" width="200">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.combinationAmount" size="mini"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="m-top50">
        <div class="titlecals">成件列表</div>

        <div class="table_list lvs attribute component">
          <el-button size="small" class="button-96 m-bottom10" @click="butGroupAction">货位分配</el-button>
          <!-- 分配货区货位 -->
          <div class="quantity" v-if="isShow" @click.stop>
            <div class="close">
              <span @click="closeBox">x</span>
            </div>
            <div class="input_numbers bk">
              <span>数量：</span>
              <el-input-number :disabled="isNums" size="small" :min="1" v-model="Cargonum"></el-input-number>
            </div>
            <div class="areaorlocation">
              <ul class="area">
                <li
                  v-for="(item,index) in arealocation"
                  :class="indexs==index?'areabg':''"
                  :key="index"
                  @click="areaFun(index)"
                >{{item.regionName}}</li>
              </ul>
              <ul class="location">
                <li
                  v-for="(item,index) in arealocation[indexs].siteList"
                  :key="index"
                  :title="item.siteCode"
                  @click="locationFun(item)"
                >{{item.siteCode}}</li>
              </ul>
            </div>
          </div>
          <el-table
            border
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @selection-change="chooseArrChange"
            :data="tableList"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" prop="receiptsNum" label="所属仓库" width="200"></el-table-column>
            <el-table-column align="center" prop="commodityCode" label="商品编码" sortable width="200"></el-table-column>
            <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
            <el-table-column align="center" prop="commodityModel" label="商品规格" width="200"></el-table-column>
            <el-table-column align="center" prop="brandName" label="商品品牌" width="200"></el-table-column>
            <el-table-column align="center" prop="categoryName" label="商品类型" width="200"></el-table-column>
            <el-table-column align="center" prop="inventoryNumber" label="商品数量" width="200"></el-table-column>
            <el-table-column
              align="center"
              prop="agro"
              label="所在货位"
              width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  <div v-for="(item,index) in scope.row.cargoList" :key="index">
                    <p>{{item.regionSiteName}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量" width="200">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.amount" size="mini"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submittedFn">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog width="50%" top="10%" :visible.sync="innerVisible" append-to-body>
      <div class="titlecals">货位分配</div>
      <storageassignment></storageassignment>
    </el-dialog>-->
  </div>
</template>
<script>
import storageassignment from "./storageassignment";
import {
  getcombinationDetachable,
  getStockUpGoodsInventoryById,
  getTreeById,
  goodsDetachable
} from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock";
export default {
  components: {
    storageassignment
  },
  props: ["skuGoodsId", "outerVisible", "storageId"],
  data() {
    return {
      tableData: [], //商品列表
      tableList: [], //拆件列表
      charArr: [], //拆套勾选
      completeArr: [], //成件
      contentText: "",
      innerVisible: false,
      isShow: false, //货区货位显示
      indexs: 0, //货区状态
      arealocation: [], //货区货位数据
      Cargonum: 0, //数量
      backupsnum: 0, //备份数量
      indexs: 0, //点击选择货区货位状态
      quantitative: 0, //判断数量是否超出
      isNums: false
    };
  },
  created() {
    this.getTree();
  },
  mounted() {
    this.getData();
    this.getList();
  },
  methods: {
    //选择货区货位
    getTree() {
      let data = {
        storageId: this.storageId,
        theStaging: 0
      };
      getTreeById(data)
        .then(res => {
          console.log(res);
          this.arealocation = res.data;
        })
        .catch(error => {
          console.error("获取货区货位", error);
        });
    },
    //根据sku商品id获取可拆商品信息
    getData() {
      let data = {
        skuGoodsId: this.skuGoodsId
      };
      getcombinationDetachable(data)
        .then(res => {
          console.log(res);
          this.tableList = res.data.map(item => {
            return { cargoList: [], amount: 0, ...item };
          });
        })
        .catch(error => {
          console.error("根据sku商品id获取可拆商品信息", error);
        });
    },
    //库存类型获取备货商品信息*********拆套
    getList() {
      let data = {
        skuGoodsId: this.skuGoodsId,
        storageId: this.storageId
      };
      getStockUpGoodsInventoryById(data)
        .then(res => {
          this.tableData = res.data.map(item => {
            return { combinationAmount: "", ...item };
          });
        })
        .catch(error => {
          console.error("库存类型获取备货商品信息", error);
        });
    },
    handleClose() {
      this.$emit("outerVisibleFun");
    },
    //拆套勾选
    chooseDelete(val) {
      this.charArr = val;
    },
    //成件勾选
    chooseArrChange(val) {
      this.completeArr = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //关闭货区
    closeBox() {
      this.isShow = false;
    },
    //货位分配
    butGroupAction() {
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.completeArr.forEach(item => {
        sum += item.inventoryNumber * 1;
        num++;
      });

      this.isShow = !this.isShow;
      this.isNums = num > 1;
      this.Cargonum = sum;
      this.backupsnum = sum;
    },
    //点击货区
    areaFun(i) {
      this.indexs = i;
    },
    //点击货位
    locationFun(obj) {
      let receivable = 0; //
      let carNum = 0; //货位数量相加
      this.completeArr.forEach(item => {
        receivable = item.inventoryNumber;
        item.cargoList.forEach(val => {
          carNum += val.num;
          this.quantitative = carNum + this.Cargonum;
        });
      });

      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.completeArr.forEach(item => {
          this.tableList.forEach(attr => {
            if (item.skuGoodsId == attr.skuGoodsId) {
              attr.cargoList = [];
              attr.cargoList.push({
                regionSiteName:
                  obj.regionSiteName + " " + item.inventoryNumber + "数量",
                siteId: obj.siteId,
                regionId: obj.regionId,
                num: item.inventoryNumber
              });
            }
          });
        });
      } else {
        console.log(this.quantitative, receivable);

        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          return;
        }
        this.completeArr.forEach(item => {
          this.tableList.forEach(attr => {
            if (item.skuGoodsId == attr.skuGoodsId) {
              attr.cargoList.push({
                regionSiteName:
                  obj.regionSiteName + " " + this.Cargonum + "数量",
                num: this.Cargonum,
                siteId: obj.siteId,
                regionId: obj.regionId
              });
            }
          });
        });
      }
    },
    //提交
    submittedFn() {
      if (this.charArr < 1) {
        this.$message.error("你未拆套勾选!");
      } else if (this.charArr > 1) {
        this.$message.error("只能勾选一个!");
      } else {
        if (
          this.charArr[0].combinationAmount > this.charArr[0].inventoryNumber
        ) {
          this.$message.error("当前拆套数量大于商品数量!");
          return;
        }
        let arr = [];
        this.tableList.forEach(item => {
          item.cargoList.forEach(attr => {
            arr.push({
              amount: item.amount,
              storageId: this.charArr[0].storageId,
              regionId: attr.regionId,
              siteId: attr.siteId,
              skuGoodsId: item.skuGoodsId,
              storagePurchaseOrderId: this.charArr[0].storagePurchaseOrderId,
              purchaseOrderId: this.charArr[0].purchaseOrderId
            });
          });
        });
        let data = {
          inventoryGoodsId: this.charArr[0].inventoryGoodsId,
          combinationAmount: this.charArr[0].combinationAmount,
          combinationPiece: this.charArr[0].combinationPiece,
          goodsList: arr
        };
        goodsDetachable(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("提交成功!");
              this.handleClose();
            }
          })
          .catch(error => {
            console.error("拆件提交", error);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.detachableparts {
  .component {
    padding: 0 30px;
    position: relative;
  }
  .quantity {
    width: 200px;
    position: absolute;
    background: #333333;
    z-index: 2;
    top: 31px;
    left: 0;
    color: #fff;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 10px;
      height: 1px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #c5c5c5;
    }
  }
  .input_numbers {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
    padding-bottom: 5px;
  }

  .areaorlocation {
    display: flex;
  }
  .areabg {
    background: #a2a2a2 !important;
  }
  .area {
    width: 45%;
    li {
      width: 100%;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    li:last-child {
      border-bottom: none;
    }
  }
  .location {
    width: 55%;
    li {
      height: 30px;
      width: 100%;
      line-height: 30px;
      border-bottom: 1px solid #ebeef5;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        background: #797979;
      }
    }
    li:last-child {
      border-bottom: none;
    }
  }
  .input_numbers {
    display: flex;
    align-items: center;
    margin: 5px 0;
    padding: 0 0 5px 17px;
  }

  .bk {
    border-bottom: 1px solid #ebeef5;
  }
  .close {
    display: flex;
    flex-direction: row-reverse;
    span {
      cursor: pointer;
      display: block;
      margin-right: 10px;
    }
  }
}
</style>
