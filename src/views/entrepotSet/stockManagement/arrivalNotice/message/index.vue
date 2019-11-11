<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <editInformation :bindInfo='bindInfo' :arrivalId="arrivalNoticeId" ref="editIn" :totalquantity="totalquantity"></editInformation>
      <!-- <div v-if="message!=''">错误信息:</div>
      <div v-if="message!=''" style="color:red;border:1px solid #000;">
        <span>{{message}}</span>
      </div> -->
      <div class="page_head_div"></div>
      <editprocurement
        ref="procument"
        @editFun="editFun"
        :choseArr="choseArr"
        @thesumFun="thesumFun"
        :arrivalNoticeCode='bindInfo.arrivalNoticeCode'
      ></editprocurement>

      <div class="page_head_div"></div> 
      <!-- 失败列表 -->
      <faillist></faillist>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="submission" :loading="loadingBtn">提 交</el-button>
      <el-button type="warning" @click="preservation">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

   
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import editInformation from "./editInformation";
import editprocurement from "./editprocurement";
import faillist from "./faillist";//失败列表
import {
  editArrivalNotice,
  submitArrivalNotice,
  submitArrivalNoticeGj,
  editArrivalNoticeGj,
  getById
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";

export default {
  components: {
    breadcrumb,
    editInformation,
    editprocurement,
    faillist
  },
  data() {
    return {
      navList: [],
      dataList: [], //列表
      arrivalNoticeId: "", //到货单ID
      totalquantity: 0,
      aogTemplateIds: "",
      choseArr: {},
      purchase: "",
      message: "", //报错信息
      bindInfo:{},
      loadingBtn:false
    };
  },
  created() {
    this.arrivalNoticeId = String(this.$route.query.arrivalNoticeId);
    this.choseArr.brandId = String(this.$route.query.brandId);
    this.choseArr.categoryId = String(this.$route.query.categoryId);
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getQuery();
  },
  methods: {
    getQuery() {
      //到货单信息
      let data = {
        arrivalNoticeId: this.arrivalNoticeId
      };
      getById(data).then(res => {
        if(res.status == 200){
          this.bindInfo = res.data;
          this.bindInfo.type = String(res.data.type);
        }
      }).catch(error => {
        console.error("到货单信息", error);
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    editFun(data, purchase) {
      this.dataList = data;
      this.purchase = purchase;
    },
    //总和
    thesumFun(num) {
      this.totalquantity = num;
    },
    //提交
    submission() {
      if (this.$route.query.brandId == 2) {
        this.submissionGJ();
      } else {
        this.arrivalFun(0);
      }
    },

    //保存
    preservation() {
      if (this.$route.query.brandId == 2) {
        this.editGJ();
      } else {
        this.arrivalFun(1);
      }
    },
    //顾家保存
    editGJ() {
      let {
        arrivalNoticeCode,
        deliveryMotorman,
        cardNum,
        deliveryDate,
        stevedoreName,
        expectedArrivalDate,
        storageId
      } = this.$refs.editIn.bindInfo;

      let data = {
        type: this.$refs.editIn.bindInfo.type, //到货方式
        arrivalNoticeId: this.arrivalNoticeId, //到货单id
        storageId, //仓库ID
        expectedArrivalDate, //预计到货时间
        arrivalNoticeCode, //到货单编号
        deliveryMotorman, //司机名称
        cardNum, //车牌号
        deliveryDate, //发货日期
        gjGoodsList: this.$refs.procument.tableData
      };
      editArrivalNoticeGj(data)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.$message.success("保存成功!");
          } else {
            // this.$message.error(res.message);
            this.message = res.message;
          }
        })
        .catch(error => {
          console.error("顾家保存", error);
        });
    },
    //顾家提交接口
    submissionGJ() {
      let {
        arrivalNoticeCode,
        deliveryMotorman,
        cardNum,
        deliveryDate,
        stevedoreName,
        expectedArrivalDate,
        storageId
      } = this.$refs.editIn.bindInfo;

      let data = {
        type: this.$refs.editIn.bindInfo.type, //到货方式
        arrivalNoticeId: this.arrivalNoticeId, //到货单id
        storageId, //仓库ID
        expectedArrivalDate, //预计到货时间
        arrivalNoticeCode, //到货单编号
        deliveryMotorman, //司机名称
        cardNum, //车牌号
        deliveryDate, //发货日期
        gjGoodsList: this.$refs.procument.tableData,
        sourceDocuments: "3"
      };
      this.loadingBtn = true;
      submitArrivalNoticeGj(data)
        .then(res => {
          if (res.status == 200) {
            this.$message.success("提交成功!");
            this.loadingBtn = false;
            this.$router.push({ path: "arrivalNotice" });
          } else {
            this.$message.error(res.message);
            this.loadingBtn = false;
            this.message = res.message;
          }
        })
        .catch(error => {
          this.loadingBtn = false;
          console.error("顾家提交", error);
        });
    },
    arrivalFun(type) {
      let arr = [];
      let ary = [];
      let sum = 0;

      //处理数据
      this.dataList.forEach(item => {
        let purchaseNumber = "";
        item.list.forEach(attr => {
          if (this.purchase == attr.aogTemplateId) {
            purchaseNumber = attr.dataValue;
          }
          if (attr.arrivalNoticeDetailId !== null) {
            //采购单明细项集合
            ary.push({
              arrivalNoticeDetailId: attr.arrivalNoticeDetailId,
              receivableCount: attr.dataValue,
              paidInCount: attr.dataValue
            });
          }
        });

        arr.push({
          //到货单汇总集合
          sum: item.sum,
          summaryId: item.summaryId,
          purchaseNumber: purchaseNumber
        });
      });
      let {
        arrivalNoticeCode,
        deliveryMotorman,
        cardNum,
        deliveryDate,
        stevedoreName,
        expectedArrivalDate,
        storageId
      } = this.$refs.editIn.bindInfo;

      let data = {
        type: this.$refs.editIn.bindInfo.type, //到货方式
        arrivalNoticeId: this.arrivalNoticeId, //到货单id
        storageId, //仓库ID
        expectedArrivalDate, //预计到货时间
        arrivalNoticeCode, //到货单编号
        deliveryMotorman, //司机名称
        cardNum, //车牌号
        deliveryDate, //发货日期
        stevedoreList: [
          {
            stevedoreName
          }
        ],
        summaryList: arr, //到货单汇总集合
        detailList: ary //采购单明细项集合
      };

      if (type == 1) {
        //保存
        this.loadingBtn = true;
        editArrivalNotice(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("保存成功!");
              this.loadingBtn = false;
            } else {
              this.$message.error(res.message);
              this.loadingBtn = false;
              this.message = res.message;
            }
          })
          .catch(error => {
            this.loadingBtn = false;
            console.error("保存编辑 editArrivalNotice", error);
          });
      } else {
        //提交
        data.status = 1;
        data.putInStorageDTO = {
          sourceDocuments: "3",
          receivableConut: this.$refs.editIn.totalquantity,
          paidInCount: this.$refs.editIn.totalquantity,
          // supplierId: this.$route.query.supplierId,
          status: 0
        };
        console.log(data);
        this.loadingBtn = true;
        submitArrivalNotice(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("提交成功!");
              this.loadingBtn = false;
              this.$router.push({ path: "arrivalNotice" });
            } else {
              this.$message.error(res.message);
              this.loadingBtn = false;
              this.message = res.message;
            }
          })
          .catch(error => {
            this.loadingBtn = false;
            console.error("提交 submitArrivalNotice", error);
          });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 20px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>