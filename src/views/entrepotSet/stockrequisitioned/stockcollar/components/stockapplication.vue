<template>
  <div class="auxiliarymaterials">
    <div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <!-- <div class="infoform_item">
            <el-form-item label="领用单号">
              <p>{{recipientsNo}}</p>
            </el-form-item>
          </div>-->
          <div class="infoform_item">
            <el-form-item label="合同号" prop="contractNumber">
              <!-- <el-input v-model="ruleForm.contractNumber" placeholder="请输入合同号" class="width-100"></el-input> -->
              <el-select filterable clearable v-model="ruleForm.customerContractId" placeholder="请选择" @change="contractFn" class="width-100">
                <el-option
                  v-for="item in contract"
                  :key="item.customerContractId"
                  :label="item.purchaseContractCode"
                  :value="item.customerContractId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="客户姓名">
              <el-input disabled v-model="customerName" placeholder="客户姓名" class="width-100"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="客户电话">
              <el-input disabled v-model="customerPhone" placeholder="客户电话" class="width-100"></el-input>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="申请时间" prop="applyTime">
              <el-date-picker
                v-model="ruleForm.applyTime"
                style="width:100%"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-M-dd HH:mm:ss"
                format="yyyy-M-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="申请人" prop="applyAt">
              <el-input v-model="name" :disabled="true" placeholder="请输入申请人" class="width-100"></el-input>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="领用仓库" prop="storageId">
              <el-select v-model="ruleForm.storageId" filterable clearable placeholder="请选择" class="width-100">
                <el-option
                  v-for="item in options"
                  :key="item.storageId"
                  :label="item.storageName"
                  :value="item.storageId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="infoform_item"></div>
          <div class="infoform_item"></div>
        </div>

        <div class="infoform">
          <el-form-item style="width:100%" label="申请原因" prop="applyCause">
            <el-input
              style="width:100%"
              type="textarea"
              autosize
              resize="none"
              v-model="ruleForm.applyCause"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 列表 -->
    <div class="m-top20">
      <div class="btn_style m-bottom10">
        <el-button size="small" class="button-96 m-left10" @click="delCommodity">删除</el-button>
        <el-button size="small" class="button-96" @click="addCommodity">添加商品</el-button>
      </div>
      <div class="table-width lvs attribute">
        <el-table
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="chooseDelete"
          :data="tableData"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="specification" label="商品规格" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="availableInventory" label="商品数量" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="领用数量" width="150">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.recipientsNum" @input="appropriation(scope.row)"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="classifyName" label="商品分类" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="materialName" label="商品材质" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="colourName" label="商品颜色" width="150" show-overflow-tooltip></el-table-column>>
        </el-table>
      </div>
    </div>

    <!-- 选择成品库存列表 -->
    <productComm
      :storageId='ruleForm.storageId'
      v-if="dialogVisible"
      :isT="isT"
      :dialogVisible="dialogVisible"
      @closeFn="closeFn"
      @newlyAdded="newlyAdded"
    ></productComm>
  </div>
</template>
<script>
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { listCustomerContract } from "api/entrepotSet/stockrequisitioned/stockcollar";
import productComm from "./productComm";
import { mapGetters } from "vuex";
export default {
  components: {
    productComm
  },
  // props: ["recipientsNo"],
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      tableData: [], //列表数据
      contract: [], //合同号
      options: [], //所属仓库
      ruleForm: {}, //条件
      choseArr: [], //
      customerName: '', //姓名
      customerPhone: '', //电话
      isT: false,
      dialogVisible: false, //成品库存列表
      rules: {
        contractNumber: [
          { required: true, message: "请输入合同号", trigger: "blur" }
        ],
        applyTime: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        storageId: [
          { required: true, message: "请选择仓库", trigger: "change" }
        ],
        applyAt: [{ required: true, message: "请输入申请人", trigger: "blur" }],
        applyCause: [
          {
            required: true,
            message: "请输入申请原因",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getList();
    this.getData()
  },
  methods: {
    //合同号change
    contractFn(id){
      if(!id){
        this.customerName = '';
        this.customerPhone = '';
        this.ruleForm.contractNumber = ''
        return
      }
      let obj = this.contract.filter(item=>{
        return item.customerContractId == id;
      })[0];
      this.ruleForm.contractNumber = obj.purchaseContractCode;
      this.customerName = obj.customerName;
      this.customerPhone = obj.customerPhone;
    },
    //添加商品数据
    newlyAdded(val) {
      val.forEach(item => {
        this.tableData.push(item);
      });
    },
    //修改领用数量判断
    appropriation(row) {
      if (row.recipientsNum > row.availableInventory) {
        this.$message.error("领用数量大于实际数量");
        this.tableData.forEach(item => {
          if (item.skuGoodsId == row.skuGoodsId) {
            item.recipientsNum = row.theActualInventory;
          }
        });
      }
    },
    //获取合同号
    getData(){
      listCustomerContract().then(res=>{
        if(res.status == 200){
          this.contract = res.data;
        }
      }).catch(error=>{
        console.error('获取合同号',error);
      })
    },
    //获取仓库
    getList() {
      getStorageList()
        .then(res => {
          this.options = res.data;
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    //添加商品
    addCommodity() {
       if(!this.ruleForm.storageId){
        this.$message.error('没有选择仓库!')
        return
      }
      this.dialogVisible = true;
    },
    //删除商品
    delCommodity() {
      this.choseArr.forEach(attr => {
        this.tableData = this.tableData.filter(item => {
          return item.skuGoodsId !== attr.skuGoodsId;
        });
      });
    },
    //关闭弹框
    closeFn() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.auxiliarymaterials {
  .form_class {
    // width: 90%;
    // margin: 0 auto;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      // justify-content: space-between;
      .infoform_item {
        width: 400px;
      }
    }
  }
  .span_width {
    min-width: 80px;
    text-align: right;
  }
  .applicationreason {
    display: flex;
  }
  .btn_style {
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
