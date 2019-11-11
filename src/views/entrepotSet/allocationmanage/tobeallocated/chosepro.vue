  <template>
  <div class="chosepro">
    <div class="apper">
      <el-card class="m-top20">
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top50">
          <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            :data="tabList"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="storageName" label="所属仓库" width="240" sortable align="center"></el-table-column>
            <el-table-column
              prop="inventoryStatus"
              label="库存状态"
              width="240"
              sortable
              align="center"
            >
              <template slot-scope="scope">
                <div class="typeBg">
                  <p v-if="scope.row.inventoryStatus==1" class="labelicon4 labelI4">正常</p>
                  <p v-if="scope.row.inventoryStatus==2" class="labelicon labelI">严重不足</p>
                  <p v-if="scope.row.inventoryStatus==3" class="labelicon labelI">库存过少</p>
                  <p v-if="scope.row.inventoryStatus==4" class="labelicon2 labelI2">库存过多</p>
                  <p v-if="scope.row.inventoryStatus==5" class="labelicon labelI">严重过多</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="theActualInventory"
              label="库存数量"
              width="240"
              sortable
              align="center"
            ></el-table-column>

            <el-table-column align="center" prop="number" label="申请数量" width="200">
              <template slot-scope="scope">
                <div>
                  <el-input
                    v-model="scope.row.number"
                    @blur="checkNumber(scope.row.number,scope.row.theActualInventory)"
                  ></el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="commodityName" label="商品名称" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="commodityCode" label="商品编码" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="specification" label="商品规格" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="commodityModel" label="商品型号" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="classifyName" label="商品类型" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="materialName" label="商品材质" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="colourName" label="商品颜色" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="status" label="商品属性" width="240" sortable align="center">
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.status==1">正常</p>
                  <p v-if="scope.row.status==2">严重呆滞品</p>
                  <p v-if="scope.row.status==3">呆滞品</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="commodityUnit" label="计量单位" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="regionName" label="货区货位" width="240" sortable align="center"></el-table-column>
          </el-table>
        </div>

        <div class="subclick">
          <el-button class="el-button--medium" type="primary" size="medium" @click="subclick">确认调拨</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="backclick">返回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import pagination from "../../../components/pagination";
import breadcrumb from "../../../components/breadcrumb";
import { mapGetters } from "vuex";
import {
  addTransfersApply //添加调拨申请单
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
export default {
  components: {
    breadcrumb,
    pagination
  },
  computed: {
    ...mapGetters(["proList"])
  },
  watch: {
    proList: function(a, b) {
      console.log(a, b);
    }
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //头部面包屑
      elsectVal: [], //选中框
      tabList: [], //table数据
      value: "",
      show: "",
      form: {}
    };
  },

  created() {
    this.tabList = this.proList;
  },
  methods: {
    //返回
    backclick() {
      this.$router.go(-1);
    },
    // !/\d/.test(item.collarNumber) && //必须为数字
    // !(item.collarNumber <= item.number) && //必须小于可用数量
    // item.collarNumber <= 0
    //失去焦点验证
    checkNumber(num1, num2) {
      if (isNaN(num1)) {
        this.$message.warning("请填写数字");
        return false;
      }
    },

    //  提交按钮
    subclick() {
      //校验有没有勾选数据
      if (this.elsectVal.length == 0) {
        this.$message.error("您没有勾选数据");
        return;
      }

      //校验有没有空或者非数字
      let isundefined = this.elsectVal.every(item => {
        return isNaN(item.number);
      });
      if (isundefined) {
        this.$message.error("您勾选的数据有申请数量格式有误");
        return;
      }

      //校验有没有小于0的
      let zero = this.elsectVal.every(item => {
        return item.number > 0
      });

      if(!zero){
        this.$message.error('申请数量不能小于0')
        return
      }

      //校验申请数不能大于库区
      let isbig = this.elsectVal.every(item => {
        return item.number<=item.theActualInventory 
      });

      if(!isbig){
        this.$message.error('当前申请数大于库区!')
        return
      }

      let inventoryGoods = [];
      inventoryGoods = this.elsectVal.map(item => {
        return {
            storagePurchaseOrderId: item.storagePurchaseOrderId,
            number: item.number,
            inventoryGoodsId: item.inventoryGoodsId
          };
      })
      this.form.inventoryGoods = inventoryGoods;
      this.form.status = 0; //状态  0 未生成调拨单
      this.form.type = 1; //type   1商品  2 订单
      this.form.transfersSource = 2; //transfersSource2 备货 3 订单
      this.form.applyType = 5; //5 仓库
      this.form.theWarehousingId = this.$route.query.theWarehousingId; //调入仓id
      this.form.bringUpTheLibraryId = this.$route.query.bringUpTheLibraryId; //调出仓id
      let sum = 0;
      this.form.inventoryGoods.forEach(item => {
        sum = item.number*1 + sum*1;
      });
      this.form.transfersNumber = sum; //调拨总数量
      addTransfersApply(this.form)
        .then(res => {
          if (res.status == "200") {
            this.$message.success("添加待调拨任务成功");
            this.$router.push({
              path: "tobeallocated",
            });
          }
        })
        .catch(error => {
          console.log(error + "添加待调拨任务");
        });
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.chosepro {
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    span {
      min-width: 80px;
      text-align: right;
    }
    .fontMore {
      color: #d0cfcf;
    }
  }
  .subclick {
    width: 25%;
    margin: 20px auto;
  }
  .typeBg {
    display: flex;
    justify-content: center;
  }
}
</style>

