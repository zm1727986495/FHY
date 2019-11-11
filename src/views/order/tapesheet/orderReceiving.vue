<template>
  <div class="seemeasure">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="tapbox">
        <div></div>
        <div>
          <el-button type="primary" :size="size" @click="addAssistAndOrder('ruleForm')" :loading="loadingBtn">接单并创建订单</el-button>
          <el-button type="primary" :size="size" @click="refusedAssistOrder" :loading="loadingBtn">拒绝</el-button>
          <el-button :size="size" @click="goBack">取消</el-button>
        </div>
      </div>
      <!-- 带单信息 -->
      <div class="titlecals">带单信息</div>
      <ul class="moduleContent">
        <li>带单号：{{ assistOrderInfo.assistNo }}</li>
        <li>推介门店：{{ assistOrderInfo.assistStoreName }}</li>
        <li>推介人：{{ assistOrderInfo.assistName }}</li>
        <li>带单时间：{{ assistOrderInfo.assistTime }}</li>
        <li>原订单号：{{ assistOrderInfo.assistOrderNo }}</li>
        <li>带单品牌：{{ assistOrderInfo.assistBrandName }}</li>
        <li>带单品类：{{ assistOrderInfo.assistCommodityCategoryName }}</li>
        <li>被推介门店：{{ assistOrderInfo.acceptStoreName }}</li>
        <li>被推介品牌：{{ assistOrderInfo.acceptBrankName }}</li>
        <li>被推介品类：{{ assistOrderInfo.acceptCategoryName }}</li>
        <li>带单备注：{{ assistOrderInfo.assistRemarks }}</li>
      </ul>
<!--      <div class="moduleContent remarks">-->
<!--        <span class="labelText">备注：</span>-->
<!--        <p class="content">客户未到店</p>-->
<!--      </div>-->
      <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm" class="ruleForm">
        <el-form-item label="备注">
          <el-input v-model="ruleForm.acceptRemarks" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="指派销售" prop="salesmanId">
          <el-select v-model="ruleForm.salesmanId" filterable size="medium" clearable>
            <el-option v-for="item in salesmanList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import breadcrumb from "../../components/breadcrumb";
  import { getDesignerList, listStoreUser, getUUID } from 'api/pulicJava';
  import { addAssistAndOrder, refusedAssistOrder, assistOrderInfo } from 'api/order/tapesheet/tapesheet';
  export default {
    components: {
      breadcrumb
    },
    data() {
      return {
        size: 'medium',
        navList: [],
        loadingBtn: false,
        salesmanList: [],
        assistOrderInfo: {},
        ruleForm: {
          acceptRemarks: '',
          salesmanId: '',
          orderNumber: '',
          acceptNo: ''
        },
        rules: {
          salesmanId: [
            { required: true, message: '请选择销售', trigger: 'change' }
          ]
        }
      };
    },
    created() {
      this.getSalesmanList();
      let params = {
        assistOrderId: this.$route.query.assistOrderId
      }
      this.getAssistOrderInfo(params);
      this.getUUID();
      this.getUUIDAccept();
    },
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {
      getUUID() {
        let uuidParams = {
          serialNumber: 'SO'
        }
        getUUID(uuidParams)
          .then(response => {
            this.ruleForm.orderNumber = response.data;
          })
          .catch(error => {
            console.log('views/order/tapesheet/orderReceiving.vue-getUUID:' + error);
          })
      },
      getUUIDAccept() {
        let uuidParams = {
          serialNumber: 'OT'
        }
        getUUID(uuidParams)
          .then(response => {
            this.ruleForm.acceptNo = response.data;
          })
          .catch(error => {
            console.log('views/order/tapesheet/getUUIDAccept.vue-getUUID:' + error);
          })
      },
      // 获取门店下所有的销售人员
      getSalesmanList() {
        // let params = {
        //   dataCode: 'G070'
        // }
        // getDesignerList(params)
        //   .then(response => {
        //     this.salesmanList = response.data.rows;
        //   })
        //   .catch(error => {
        //     console.log('接单views/order/tapesheet/orderReceiving:getSalesmanList' + error);
        //   });
        let params = {
          storeId: this.$route.query.storeId
        }
        listStoreUser(params)
          .then(response => {
            this.salesmanList = response.data;
          })
          .catch(error => {
            console.log('接单views/order/tapesheet/orderReceiving:getSalesmanList' + error);
          });
      },
      // 获取带单详情
      getAssistOrderInfo(params) {
        assistOrderInfo(params)
          .then(response => {
            this.assistOrderInfo = response.data;
          })
          .catch(error => {
            console.log('获取带单详情views/order/tapesheet/tapesheetDetails:getAssistOrderInfo' + error);
          });
      },
      // 接单并创建订单
      addAssistAndOrder(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loadingBtn = true;
            let params = {
              assistOrderId: this.$route.query.assistOrderId,
              acceptStoreId: this.$route.query.acceptStoreId,
              acceptBrank: this.$route.query.acceptBrank,
              acceptCategory: this.$route.query.acceptCategory,
              salesmanId: this.ruleForm.salesmanId,
              acceptRemarks: this.ruleForm.acceptRemarks,
              orderNumber: this.ruleForm.orderNumber,
              acceptNo: this.ruleForm.acceptNo,
              orderId: this.assistOrderInfo.orderId
            }
            addAssistAndOrder(params)
              .then(response => {
                this.loadingBtn = false;
                if (response.status != 200) {
                  this.$message.error('接单失败');
                } else {
                  this.$message({
                    type: 'success',
                    message: '接单成功'
                  });
                  this.goBack();
                }
              })
              .catch(error => {
                this.loadingBtn = false;
                  console.log('接单views/order/tapesheet/orderReceiving-addAssistAndOrder:' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 拒绝
      refusedAssistOrder() {
        this.loadingBtn = true;
        let params = {
          assistOrderId: this.$route.query.assistOrderId
        }
        refusedAssistOrder(params)
          .then(response => {
            this.loadingBtn = false;
            if (response.status != 200) {
              this.$message.error(response.message);
            } else {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.goBack();
            }
          })
          .catch(error => {
            this.loadingBtn = false;
              console.log('接单views/order/tapesheet/orderReceiving-refusedAssistOrder:' + error);
          });
      },
      // 取消 返回上一页
      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .tapbox {
    padding: 10px;
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .moduleContent{
    padding: 20px;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    display: flex;
    flex-wrap: wrap;
    font-size: 13px;
    color: #333333;
  }
  .moduleContent li {
    width: 33.3%;
    line-height: 30px;
  }
  .titlecals{
    top: 0;
    margin: 15px 20px;
  }
  .remarks{
    padding-right: 0;
    display: flex;
    border: none;
    .labelText{
      width: 60px;
    }
    .content{
      flex:1;
      border: 1px solid #d9d9d9;
      min-height: 120px;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      padding: 10px;
    }
  }
  .ruleForm{
    margin-top: 20px
  }
</style>
