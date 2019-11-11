<template>
  <div class="editprocurement">
    <div class="purchase">
      <!-- <div class="iconBox">
        <i class="Icon"></i>
        <span>采购合同列表</span>
      </div> -->
      <div class="titlecals">采购合同列表</div>
      <el-button v-if="!isShow" size="mini" class="button-96 m-left10" type="default" @click="reimport">重导入</el-button>
      <!-- <el-button v-if="!isShow" size="mini" class="button-96 m-left10" type="default" @click="mergeFn">合并</el-button> -->
      <!-- <el-button v-if="!isShow" size="mini" class="button-96 m-left10" type="default" @click="deleteFn">删除</el-button> -->
    </div>
    <div class="table-width lvs attribute" v-loading="loading">
      <!-- 顾家 -->
      <el-table v-if="brandId==2" border @selection-change="pendingDelete" :row-class-name="tableRowClassName" :data="tableData">
        <!-- <el-table-column fixed type="selection" width="40"></el-table-column> -->
        <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="200"></el-table-column>
        <el-table-column align="center" prop="receivableCover" label="应收数量/套" width="200"></el-table-column>
        <el-table-column align="center" prop="receivablePiece" label="应收数量/件" width="200"></el-table-column>
        <el-table-column align="center" prop="rowCode" label="行号" width="200"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="型号" width="200"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="规格" width="200"></el-table-column>
        <el-table-column align="center" prop="amount" label="采购数量" width="200"></el-table-column>
      </el-table>

      <!-- 其它品牌 -->
      <el-table :max-height="maxHeight" @selection-change="pendingDelete" v-else border :data="tabList" :row-class-name="tableRowClassName">
        <el-table-column fixed='left' type="selection" width="40"></el-table-column>
        <el-table-column
          prop="name"
          width="220"
          :label="item.aogTemplateName"
          align="center"
          v-for="(item,index) in titleList"
          :key="index"
        >
          <template slot-scope="scope">
            <div>
              <el-input
                :disabled="isShow"
                v-model="scope.row.list[index].dataValue"
                v-if="item.isColumn==1"
                @input="totalFn"
                size="small"
              ></el-input>
              <el-input size="small" :disabled="isShow" v-model="scope.row.list[index].dataValue" v-else></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="重导入" :visible.sync="dialogModel" width="40%">
      <div class="pl-20">
        <heavytoLead ref="heavy"></heavytoLead>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendJava">确 定</el-button>
        <el-button @click="dialogModel = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import heavytoLead from "./heavytoLead";
import {
  getArrivalNoticeDetailById,
  againImportArrivalNotice,
  getGjGoodsDetailList,
  againImportArrivalNoticeGj,
  deleteArrivalNoticeSummary, //删除
  mergeArrivalNoticeSummary//合并
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import { mapGetters } from "vuex";
export default {
  components: {
    heavytoLead
  },
  props: ["choseArr",'arrivalNoticeCode'],
  created() {
    this.isShow = this.$route.query.isShow == 0;
    if (this.$route.query.brandId == 2) {
      this.brandId = this.$route.query.brandId;
    }
  },
  data() {
    return {
      purchase: "", //采购
      checks: [], //勾选
      loading: true,
      titleList: [],
      tabList: [], //列表
      tableData: [], //顾家列表
      num: 0,
      dialogModel: false,
      totalquantity: 0,
      successStr: "",
      brandId: "",
      isShow: false,
      pendingList:[]
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  mounted() {
    if (this.brandId == 2) {
      this.getLookfamily();
    } else {
      this.getData();
    }
  },
  methods: {
    //计算总数
    totalFn() {
      let num = 0;
      if (this.$route.query.brandId == 2) {
        this.tableData.forEach(item => {
          num += item.receivablePiece * 1;
        });
      } else {
        this.tabList.forEach((attr, idx) => {
          let sum = 0;
          this.titleList.forEach((item, index) => {
            if (item.isColumn == 1) {
              num += attr.list[index].dataValue * 1;
              sum += attr.list[index].dataValue * 1;
            }
          });
          attr.sum = sum;
        });
      }
      // this.totalquantity = num;
      this.$emit("thesumFun", num);
    },
    //获取列表
    getData() {
      let data = {
        arrivalNoticeId: this.$route.query.arrivalNoticeId
      };
      this.loading = true;
      getArrivalNoticeDetailById(data).then(res => {
          if (res.status == 200) {
            this.loading = false;
            this.titleList = res.data.aogTemplateList.sort((a, b) => {
              return a.aogTemplateId - b.aogTemplateId;
            });

            res.data.summaryList.map((item, index) => {
              let arr = item.list.sort((a, b) => {
                return a.aogTemplateId - b.aogTemplateId;
              });
              this.tabList.push({ ...item, list: arr, sum: 0 });
            });

            this.titleList.forEach((itm, idx) => {
              if (itm.aogTemplateName == "采购单号") {
                this.purchase = itm.aogTemplateId;
              }
            });
            this.totalFn();
            this.$emit("editFun", this.tabList, this.purchase);
          }else{
            this.loading = false;
          }
        }).catch(error => {
          this.loading = false;
          console.error("采购合同列表", error);
        });
    },
    //获取顾家
    getLookfamily() {
      let data = {
        arrivalNoticeId: this.$route.query.arrivalNoticeId
      };
      this.loading = true;
      getGjGoodsDetailList(data).then(res => {
          if (res.status == 200) {
            this.tableData = res.data;
            this.loading = false;
          }else{
            this.loading = false;
          }
        }).catch(error => {
          this.loading = false;
          console.error("获取顾家列表", error);
        });
    },
    //table列表勾选方法
    handleSelectionChange(val) {
      this.checks = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    pendingDelete(val) {
      this.pendingList = val;
    },
    //重导入
    reimport() {
      this.dialogModel = true;
      this.$nextTick(() => {
        this.$refs.heavy.eliminate();
      });
    },
    //合并
    mergeFn(){
      mergeArrivalNoticeSummary({arrivalNoticeId:this.$route.query.arrivalNoticeId}).then(res=>{
        if(res.status == 200){
          if (this.brandId == 2) {
            this.tableData = []
            this.getLookfamily();
          } else {
            this.tabList = []
            this.getData();
          }
        }
      })
    },
    //删除
    deleteFn(){
      if(this.pendingList.length == 0){
        this.$message.error('你未勾选!')
        return
      }
      if(this.pendingList.length > 0){
        let summaryIdStr = this.pendingList.map(item=>{
          return item.summaryId
        }).join(',')
        deleteArrivalNoticeSummary({summaryIdStr}).then(res=>{
          if(res.status == 200){
            if (this.brandId == 2) {
              this.tableData = []
              this.getLookfamily();
            } else {
              this.tabList = []
              this.getData();
            }
          }
        })
      }
    },
    sendJava() {
      let data = {
        arrivalNoticeId: this.$route.query.arrivalNoticeId,
        arrivalNoticeCode:this.arrivalNoticeCode,
        brandId: this.choseArr.brandId,
        categoryId: this.choseArr.categoryId,
        fileUrl: this.$refs.heavy.upLoadList,
        aogId: this.$route.query.aogId
      };
      //导入顾家
      if (this.$route.query.brandId == 2) {
        againImportArrivalNoticeGj(data)
          .then(res => {
            if (res.status == 200) {
              this.tabList = [];
              this.getLookfamily();
              this.dialogModel = false;
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            console.error("顾家重导入", error);
          });
      } else {
        againImportArrivalNotice(data)
          .then(res => {
            if(res.status == 200){
              this.tabList = [];
              this.getData();
              this.dialogModel = false;
            }else{
              this.$message.error(res.message)
            }
          })
          .catch(error => {
            console.error("重导入", error);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.editprocurement{
  padding:0 10px; 
  .titlecals{
    top:0;
    padding-top: 2px;
  }
}
.purchase {
  display: flex;
}
.table-width {
  margin-top: 10px;
}
.addition {
  font-size: 24px;
  margin-left: 10px;
  cursor: pointer;
  color: #409eff;
}
</style>

