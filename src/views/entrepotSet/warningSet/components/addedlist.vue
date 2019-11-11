<template>
  <div class="addedlist">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <el-form
        :rules="rules"
        label-width="120px"
        :model="ruleForm"
        ref="ruleForm"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="策略名称" prop="strategyName">
              <el-input v-model="ruleForm.strategyName"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="所属仓库" prop="storageId">
              <el-select v-model="ruleForm.storageId" placeholder="选择" class="width-100">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.storageId"
                  :label="item.storageName"
                  :value="item.storageId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="策略状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="创建人">
              <span>{{name}}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- 新增 -->
      <div class="btn_list_1">
        <el-button size="small" class="button-96" type="default" @click="newladded">新增</el-button>
        <el-button size="small" class="button-96" type="default" @click="deleteFun">删除</el-button>
      </div>
      <!-- 弹窗 -->
      <el-dialog
        title="选择商品"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="handleClose"
        custom-class="customDialogTitle"
        top='20px'
      >
        <select-commodity
          v-if="dialogVisible"
          @selectionChange="selectionChange"
          ref="selectedCommodities"
          :select-list="selectList"
        ></select-commodity>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="SureFun">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 列表 -->
      <div class="table_list lvs attribute">
        <el-table
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="chooseDelete"
          :data="tableData"
        >
          <el-table-column fixed type="selection" width="40"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
          <el-table-column align="center" prop="brand_name" label="品牌" width="200"></el-table-column>
          <el-table-column align="center" prop="category_name" label="品类" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="classifyName"
            label="商品分类"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="valuationMethod" label="单位" width="200"></el-table-column>
          <el-table-column align="center" label="库存预警值" width="200">
            <template slot-scope="scope">
              <div>
                <p class="limits">
                  <span>上限</span>
                  <el-input v-model="scope.row.warningUpperLimit" size="mini"></el-input>
                </p>
                <p class="limits">
                  <span>下限</span>
                  <el-input v-model="scope.row.warningLowerLimit" size="mini"></el-input>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="库存严重预警" width="200">
            <template slot-scope="scope">
              <div>
                <p class="limits">
                  <span>上限</span>
                  <el-input v-model="scope.row.seriousUpperLimit" size="mini"></el-input>
                </p>
                <p class="limits">
                  <span>下限</span>
                  <el-input v-model="scope.row.seriousLowerLimit" size="mini"></el-input>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="呆滞时间预警值" width="200">
            <template slot-scope="scope">
              <div>
                <p class="limits">
                  <el-input v-model="scope.row.warningDays" size="mini"></el-input>
                  <span>天</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="呆滞时间严重预警值" width="200">
            <template slot-scope="scope">
              <div>
                <p class="limits">
                  <el-input v-model="scope.row.seriousDays" size="mini"></el-input>
                  <span>天</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="200">
            <template slot-scope="scope">
              <div>
                <el-radio v-model="scope.row.status" label="1">启用</el-radio>
                <el-radio v-model="scope.row.status" label="0">停用</el-radio>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="onSubmit" :loading="loadingbtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import selectCommodity from "@/views/components/selectCommodity";
import { mapGetters } from "vuex";
import {
  addStorageWarningStrategy,
  getStorageList,
  getStorageWarningCommodityList
} from "api/entrepotSet/warningSet/index.js";
export default {
  components: {
    breadcrumb,
    selectCommodity,
    pagination
  },
  data() {
    return {
      loadingbtn:false,
      tableData: [], //列表
      navList: [],
      choseArr: [], //勾选列表
      commodityList: [], //勾选弹框列表
      warehouseList: [], //仓库
      choseArr: [], //勾选
      ruleForm: {}, //信息
      dialogVisible: false, //弹框
      rules: {
        //验证
        storageId: [
          { required: true, message: "请选择所属仓库", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择上门类型", trigger: "change" }
        ],
        strategyName: [
          { required: true, message: "请输入策略名称", trigger: "blur" }
        ]
      },
      selectList: {
        selectedCommodities: [], // 选中的商品 可不传
        brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
        categoryList: [], // 品类数组 可不传（不传默认为全部品类）
        priceStrategyId: "", // 价格策略 不是必填
        height: "350px", // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true // 是否为弹出层（不传默认为页面）
      },
      i: 0 //状态
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getWarehouse();
  },
  methods: {
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.warehouseList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    },
    //删除
    deleteFun() {
      this.choseArr.forEach(item => {
        this.tableData = this.tableData.filter(attr => {
          return item.id !== attr.id;
        });
      });
    },
    //新增
    newladded() {
      this.dialogVisible = true;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    //弹框确定/新增一条数据
    SureFun() {
      this.commodityList.forEach(item => {
        this.tableData.push({
          ...item,
          warningUpperLimit: "", //库存预警值 上
          warningLowerLimit: "", //库存预警值 下
          seriousUpperLimit: "", //库存严重预警值 上
          seriousLowerLimit: "", //库存严重预警值下
          warningDays: "", //呆滞时间预警值
          seriousDays: "", //呆滞时间严重预警值
          status:this.ruleForm.status, //状态
          id: ++this.i
        });
      });
      this.handleClose();
    },
    //提交
    onSubmit() {
      if (this.tableData.length < 1) {
        this.$message.warning("只少新增一条!");
        return;
      }
      let arr = [];
      this.tableData.forEach(item => {
        arr.push({
          warningUpperLimit: item.warningUpperLimit,
          warningLowerLimit: item.warningLowerLimit,
          seriousUpperLimit: item.seriousUpperLimit,
          seriousLowerLimit: item.seriousLowerLimit,
          warningDays: item.warningDays,
          seriousDays: item.seriousDays,
          goodsNumber: item.commodityCode,
          status: item.status
        });
      });

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = {
            list: arr,
            ...this.ruleForm
          };
          console.log(data);
          this.loadingbtn = true;
          addStorageWarningStrategy(data)
            .then(res => {
              if (res.status == 200) {
                this.$router.push({ path: "warningSet" });
                this.loadingbtn = false;
                this.$message.success("提交成功!");
              }else{
                this.$message.error('提交失败!')
                this.loadingbtn = false;
              }
            })
            .catch(error => {
              this.loadingbtn = false;
              console.error("提交", error);
            });
        } else {
          this.$message.error("请检查填写信息是否遗漏");
          return false;
        }
      });
    },
    chooseDelete(val) {
      this.choseArr = val;
    },
    //勾选弹框列表
    selectionChange(val) {
      console.log(val);
      this.commodityList = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.addedlist {
  .limits {
    display: flex;
    margin-top: 2px;
    span {
      min-width: 40px;
    }
  }
  .form_class {
    width: 100%;
    margin: 0 auto;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        width: 50%;
      }
    }
  }
  .btn {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  .btn_list_1 {
    margin: 15px 0px;
    display: flex;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
  }
}
</style>
