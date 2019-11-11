<template>
    <div class="aftermarketdetails">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-tabs type="border-card">
            <el-tab-pane label="问题描述">
                <!-- 订单详情 -->
                <orderdetail></orderdetail>
                <!-- 合同详情 -->
                <contractdetails></contractdetails>
                <div class="table_list lvs unsortable" v-loading="loading">
                  <el-table border ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column prop="orderGoodsType" align="center" label="问题单号"></el-table-column>
                    <el-table-column prop="feedbackTime" align="center" label="反馈时间"></el-table-column>
                    <el-table-column prop="expectedVisitTime" align="center" label="希望上门时间"></el-table-column>
                    <el-table-column prop="customerProblemDescription" align="center" label="客户问题描述"></el-table-column>
                    <el-table-column prop="recordOfCommunication" align="center" label="沟通记录"></el-table-column>
                    <el-table-column prop="timeNodes" align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="detailscli(scope.row.afterSalesProblemRecordId)">查看详情及照片</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="handlebox">
                  <el-table border :data="tablelist" :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column prop="conductorName" align="center" label="处理人"></el-table-column>
                    <el-table-column prop="conductorTime" align="center" label="处理时间"></el-table-column>
                    <el-table-column prop="disposeKind" align="center" label="完成类型"></el-table-column>
                    <el-table-column prop="reportContent" align="center" label="汇报内容"></el-table-column>
                    <el-table-column prop="reportName" align="center" label="汇报人"></el-table-column>
                    <el-table-column prop="installCompleteTime" align="center" label="完成时间"></el-table-column>
                  </el-table>
                </div>
                <div class="center m-top10">
                  <!-- <el-button type="primary" @click="handle">处理</el-button> -->
                  <el-button @click="goBack">返回</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="查看详情及照片" custom-class="customDialogTitle" :visible.sync="detailsVisible">
          <div class="dialogBody" v-loading="loadingDetails">
            <el-form label-width="130px" :model="fromdata" class="demo_form_inline">
              <el-form-item label="客户问题描述：" class="widmax">{{fromdata.customerProblemDescription}}</el-form-item>
              <el-form-item label="反馈时间：">{{fromdata.feedbackTime}}</el-form-item>
              <el-form-item label="希望上门时间：">{{fromdata.expectedVisitTime}}</el-form-item>
              <el-form-item label="问题照片：" class="widmax">
                <el-image v-for="(item,index) in fromdata.afterSalesProblemRecordPic" :src="item.fileUrl" fit="cover" :key="index" style="width: 100px; height: 100px; margin: 5px"></el-image>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="detailsVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
        <el-dialog title="指派责任部门" custom-class="customDialogTitle" :visible.sync="dialogVisible" width="400">
            <ul class="changeselect">
              <li>
                <el-radio v-model="disposeKind " :label="1">电话指导完成</el-radio></li>
              <li>
                <el-radio v-model="disposeKind " :label="2">指派安装</el-radio>
              </li>
              <li>
                <el-radio v-model="disposeKind " :label="3">指派维修</el-radio>
                <el-select v-model="afterDutyGroupId" v-show="disposeKind ==3" size="medium" placeholder="请选择售后责任部门">
                  <el-option v-for="item in serveGroupList" :label="item.serveGroupName" :value="item.serveGroupId" :key="item.serveGroupId"></el-option>
                </el-select>
              </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editProblemHandling">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "@/views/order/components/orderdetail";
import contractdetails from "@/views/order/components/contractdetails";
import { 
  listAfterSalesProblemRecord, 
  afterSalesProblemRecordDetails, 
  editProblemHandling,
  listProcessloggning,
} from "api/entrepotSet/aftermarket/aftermarket/aftersaleproblem";
import { listServeGroup } from 'src/api/pulicJava';
export default {
    components: {
        breadcrumb,
        orderdetail,
        contractdetails,
    },
    data() {
        return {
            detilsfore: false,
            tableSelectList: [],
            tableData: [],
            tablelist: [],
            navList: [],
            fromdata: {},
            labelPosition: "right",
            loading: false,
            dialogVisible: false,
            disposeKind : '',
            serveGroupList: [], // 售后部门
            afterDutyGroupId: '', // 售后责任部
            detailsVisible: false,
            loadingDetails: false
        }
    },
    created() {
        this.loading = true;
        let data = {
          questionnaireId: this.$route.query.questionnaireId
        }
        listAfterSalesProblemRecord(data).then(res =>{
          this.loading = false;
          if(res.status == 200){
            this.tableData = res.data.rows;
          }
        }).catch(error =>{
          this.loading = false;
          console.log('工厂查货:提交备注信息 order/order/order.vue', error);
        })
        listProcessloggning(data).then(res =>{
          this.loading = false;
          if(res.status == 200){
            this.tableRowClassName = res.data;
          }
        }).catch(error =>{
          this.loading = false;
          console.log('工厂查货:提交备注信息 order/order/order.vue', error);
        })


    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    methods: {
        detailscli(val){
          this.loadingDetails = true;
          this.detailsVisible = true;
          afterSalesProblemRecordDetails({afterSalesProblemRecordId: val}).then(res =>{
                this.loadingDetails = false;
                if(res.status == 200){
                    this.detilsfore = true;
                    this.fromdata = res.data;
                }
            }).catch(error =>{
                this.loadingDetails = false;
                console.log('工厂查货:提交备注信息 order/order/order.vue', error);
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList,"tableSelectList1234");
        },
        handle(){
            this.disposeKind = '';
            this.afterDutyGroupId = '';
            this.dialogVisible = true;
            let params = {
              dataCode: 'MAINTENANCE_DEPARTMENT'
            };
            listServeGroup(params)
              .then(response => {
                this.serveGroupList = response.data.rows;
              })
              .catch(error => {
                console.log('views/entrepotSet/aftermarket/aftersaleproblem/aftermarketdetails.vue-handle:' + error);
              })
        },
        editProblemHandling() {
          if (this.disposeKind  == '') {
            this.$message.warning("请选择处理方式！");
          } else if (this.disposeKind  == 3 && this.afterDutyGroupId ==''){
            this.$message.warning("请选择售后责任部门！");
          } else {
            let data = {
              disposeKind: this.disposeKind,
              customerContractNumber: this.$route.query.customerContractNumber || '',
              orderId: this.$route.query.orderId || '',
              questionnaireId: this.$route.query.questionnaireId,
              afterDutyGroupId: this.afterDutyGroupId,
              orderNumber: this.$route.query.orderNumber || ''
            }
            editProblemHandling(data).then(res =>{
              if(res.status == 200){
                this.$message.success('处理成功');
                this.goBack();
              } else {
                this.$message.error(res.message || '处理失败');
              }
            }).catch(error =>{
              console.log('售后问题:查看详情 src/views/entrepotSet/aftermarket/aftersaleproblem/components/aftermarketdetails.vue', error);
            })
          }
        },
        goBack() {
          this.$router.history.go(-1);
        }
    }
}
</script>
<style lang="scss">
.aftermarketdetails{
    .handlebox{
      margin-top: 10px;
    }
    .demo_form_inline{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .widmax{
            width: 100%;
        }
        >div{
            width: 45%;

        }
    }
    .imgbox{
        display: flex;
        li{
            margin: 10px;
            width: 150px;
            height: 150px;
        }
    }
    .btnclas{
        text-align: center;
    }
    .followupbox{
        padding: 20px 40px;
        .titlelist{
            font-weight: 600;
            display: flex;
            text-align: center;
            li{
                flex: 1;
                &:nth-of-type(1){
                    text-align: left;
                }
                &:nth-of-type(3){
                    text-align: right;
                }
            }
        }
        .followuprecord{
            li{
                padding: 20px 0px;
                border-bottom: 1px solid #999999;
                .folowlist{
                    display: flex;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #666666;
                    >span{
                        flex: 1;
                        &:nth-of-type(1){
                            text-align: left;
                        }
                        &:nth-of-type(3){
                            text-align: right;
                        }
                    }
                    
                }
            }
        }
    }
}
</style>
