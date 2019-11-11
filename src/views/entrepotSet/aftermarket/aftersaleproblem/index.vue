<template>
    <div class="aftersaleproblem">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
          <el-row :gutter="10" class="queryForm">
            <el-col :span="5">
              <el-input placeholder="订单编号 客户合同号 客户姓名 客户电话 订单地址" v-model="questionnaireGroup" :size="size" maxlength="50" clearable @keyup.enter.native="searchFn"></el-input>
            </el-col>
            <el-col :span="5">
              <el-date-picker :size="size" v-model="timedata" type="daterange"
                value-format='yyyy-M-dd' format='yyyy-M-dd'
                start-placeholder="年/月/日" end-placeholder="年/月/日">
              </el-date-picker>
            </el-col>
            <el-col :span="3">
              <el-select v-model="questionnaireSource" placeholder="问题来源" :size="size" clearable>
                <el-option v-for="item in questionnaireSourceList" :key="item.id" :label="item.dictName" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="status" placeholder="全部状态" :size="size" clearable>
                <el-option v-for="item in statusList" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="timeNodes" placeholder="时间节点" :size="size" clearable>
                <el-option v-for="item in timeNodesList" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-button class="button-fc" type="warning" size="medium" @click="searchFn">查询</el-button>
              <el-button type='primary' size="medium" @click="resetForm">重置</el-button>
            </el-col>
          </el-row>
          <div class="m-bottom10">
              <el-button :size="btnSize" class="button-96" v-if="btnJurisdiction.aftersaleproblem_export" @click="exportQuestionnaire">导出</el-button>
              <el-button :size="btnSize" class="button-96" v-if="btnJurisdiction.aftersaleproblem_newlyincreased" @click="newproblemsfun">新增问题单</el-button>
              <el-button :size="btnSize" class="button-96" v-if="btnJurisdiction.aftersaleproblem_compensate" @click="compensatfun">赔偿</el-button>
              <el-button :size="btnSize" class="button-96" @click="photofun(1)">电话指导完成</el-button>
              <el-button :size="btnSize" class="button-96" @click="photofun(2)">转售后派单</el-button>
          </div>
          <div class="table_list" v-loading="loading">
            <el-table border ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight">
                  <el-table-column type="selection" align="center" width="55" fixed='left'></el-table-column>
                  <el-table-column prop="orderGoodsType" align="center" label="客户合同号" width="150" fixed='left'>
                      <template slot-scope="scope">
                          <el-button type="text" @click="detailscli(scope.row)">{{scope.row.customerContractNumber}}</el-button>
                      </template>
                  </el-table-column>
                  <el-table-column prop="questionnaireSourceName" align="center" label="问题来源" width="120"></el-table-column>
                  <el-table-column prop="status" align="center" label="问题单状态" width="120">
                      <template slot-scope="scope">
                          <div>
                              <span v-if="scope.row.status == 1">待处理</span>
                              <span v-if="scope.row.status == 2">进行中</span>
                              <span v-if="scope.row.status == 3">已完成</span>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="categoryName" align="center" label="订单完成时长" width="120"></el-table-column>
                  <el-table-column prop="customerName" align="center" label="客户姓名" width="120"></el-table-column>
                  <el-table-column prop="customerPhone" align="center" label="客户电话" width="120"></el-table-column>
                  <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="remake" align="center" label="问题描述" width="200" show-tooltip-when-overflow></el-table-column>
                  <el-table-column prop="createName" align="center" label="创建人" width="120"></el-table-column>
                  <el-table-column prop="estimatedTimeOfVisit" align="center" label="预计上门时间" width="160"></el-table-column>
                  <el-table-column prop="conductorGroupName" align="center" label="处理部门" width="120" sortable show-overflow-tooltip></el-table-column>
                  <el-table-column prop="conductor" align="center" label="处理人" width="120" sortable show-overflow-tooltip></el-table-column>
                  <!-- <el-table-column prop="brandName" align="center" label="商品品牌" width="120"></el-table-column>
                  <el-table-column prop="categoryName" align="center" label="商品品类" width="120"></el-table-column>
                  <el-table-column prop="questionnaireNumber" align="center" label="问题编号" width="120"></el-table-column>
                  <el-table-column prop="createTime" align="center" label="创建时间" width="160"></el-table-column>
                  <el-table-column prop="isVisit" align="center" label="是否上门" width="200">
                    <template slot-scope="scope">
                      <p v-if="scope.row.isVisit == 1">是</p>
                      <p v-else-if="scope.row.isVisit == 0">否</p>
                      <p v-else></p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="otherPhone" align="center" label="备用电话" width="120"></el-table-column>
                  <el-table-column prop="installationDeptName" align="center" label="原服务安装部" width="120"></el-table-column>
                  <el-table-column prop="maintainStaffGrade" align="center" label="维修人员评分" width="120"></el-table-column>
                  <el-table-column prop="orderTypeName" align="center" label="订单类型" width="100"></el-table-column>
                  <el-table-column prop="afterDutyGroupName" align="center" label="售后责任部门" width="120"></el-table-column>
                  <el-table-column prop="chargeMonney" align="center" label="预计收费/元" width="120"></el-table-column>
                  <el-table-column prop="chargeRemake" align="center" label="预计收费备注" width="200" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="orderNumber" align="center" label="订单号" width="150" sortable show-overflow-tooltip></el-table-column> -->
              </el-table>
            <div class="pagination_wrap">
              <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
              </pagination>
            </div>
          </div>
        </el-card>
        <!-- 赔偿 -->
        <compensate 
            v-if="visiblecompensat" 
            @submitcompensate="submitcompensate"
            :visibleDialog="visiblecompensat">
        </compensate>

        <el-dialog :title='titletex == 1 ? "电话指导完成" : "转售后派单"' custom-class="customDialogTitle" :visible.sync="dialogVisible" width="300">
            <el-form v-if="titletex == 1" label-width="80px" :model="fromdata" class="demo_form_inline">
                <el-form-item label="沟通记录" class="widmax">
                    <el-input type="textarea" v-model="recordOfCommunication"></el-input>
                </el-form-item>
            </el-form>
            <ul class="changeselect" v-else>
                <li><el-radio v-model="disposeKind" :label="1">电话指导完成</el-radio></li>
                <li><el-radio v-model="disposeKind" :label="2">指派安装</el-radio></li>
                <li>
                    <el-radio v-model="disposeKind" :label="3">指派维修</el-radio>
                    <el-select v-model="afterDutyGroupId" v-show="disposeKind ==3" :size="size" placeholder="请选择售后责任部门">
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
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import compensate from './components/compensate';
import { listQuestionnaire, editProblemHandling } from 'api/entrepotSet/aftermarket/aftermarket/aftersaleproblem';
import { listBaseDict, listLoginServeGroup } from 'api/pulicJava';
import module from '../../../../../config/index';
import { mapGetters } from 'vuex';
export default {
    components: {
        breadcrumb,
        pagination,
        compensate
    },
    data() {
        return {
            loading: true,
            titletex: "",
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
            visiblecompensat: false,
            recordOfCommunication : '',
            disposeKind : '',
            afterDutyGroupId : '',
            serveGroupList: [], // 售后部门
            dialogVisible: false,
            currentPage: 1,
            pageSize: 20,
            total: 2,
            navList: [],
            questionnaireGroup: "",//订单号
            questionnaireSource: "",//问题来源
            status: "",//状态
            timedata: [],//时间
            timeNodes: "",
            tableSelectList: [],
            tableData: [],
            fromdata: {},
            orderq: [],
            questionnaireSourceList: [],
            timeNodesList: [
              { code: 0, value: '未满三个月' },
              { code: 1, value: '已满三个月' }
            ],
            statusList: [
              { code: 1, value: '待处理' },
              { code: 2, value: '进行中' },
              { code: 3, value: '已完成' }
            ]
        }
    },
    activated(){
      // 头部面包屑
      this.navList = this.$route.meta;

      this.listQuestionnairefun();
      this.getBaseDict();
    },
    // deactivated () {
    //   this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList = this.$route.meta;
    // },
    // created() {
    //     this.listQuestionnairefun();
    //     this.getBaseDict();
    // },
    methods: {
        searchFn() {
          this.currentPage = 1;
          this.listQuestionnairefun();
        },
        resetForm() {
          this.currentPage = 1;
          this.questionnaireGroup = '';
          this.questionnaireSource = '';
          this.status = '';
          this.timedata = [];
          this.listQuestionnairefun();
        },
        listQuestionnairefun(){
            this.loading = true;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
                questionnaireGroup: this.questionnaireGroup,
                questionnaireSource: this.questionnaireSource,
                status: this.status,
                timeNodes: this.timeNodes,
                createStartTime: this.timedata[0],
                createEndTime: this.timedata[1]
            }
            listQuestionnaire(data).then(res =>{
                this.loading = false;
                if(res.status == 200){
                    this.tableData = res.data.rows;
                    this.total = res.data.total;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('工厂查货:提交备注信息 order/order/order.vue', error);
            })
        },
        detailscli(data){
            this.$router.push({
              path: "/aftermarket/aftermarketdetails",
              query: {
                questionnaireId: data.questionnaireId,
                orderId: data.orderId,
                orderNumber: data.orderNumber,
                customerContractNumber: data.customerContractNumber
              }
            })
        },
        submitcompensate(val){
            this.visiblecompensat = false;
        },
        newproblemsfun(){
            this.$router.push({path: "/aftermarket/newproblems"})
        },

        photofun(val){
            if(!this.warnMessage()){
                return false;
            }
            this.titletex = val
            this.dialogVisible = true;
            if(val == 2){
                this.disposeKind = '';
                this.afterDutyGroupId = '';
                let params = {
                dataCode: 'MAINTENANCE_DEPARTMENT'
                };
                listLoginServeGroup(params).then(response => {
                    this.serveGroupList = response.data;
                }).catch(error => {
                    console.log('views/entrepotSet/aftermarket/aftersaleproblem/aftermarketdetails.vue-handle:' + error);
                })
            }
        },
        // 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.tableSelectList.length > 1){
                this.$message.warning("只能选择一个订单");
                return false;
            } else if (this.tableSelectList.length < 1){
                this.$message.warning("请选择订单");
                return false;
            }
            return true;
        },
        // 提交电话和转售后
        editProblemHandling() {
            let selectdata = this.tableSelectList[0]
            if(this.titletex == 1){
                if(this.recordOfCommunication == ""){
                    this.$message.warning("请输入沟通记录");
                    return false
                }
                let data = {
                    disposeKind: 1,
                    recordOfCommunication: this.recordOfCommunication,
                    questionnaireId: selectdata.questionnaireId,
                }
                editProblemHandling(data).then(res =>{
                    if(res.status == 200){
                        this.$message.success('操作成功');
                        this.dialogVisible = false;
                        this.recordOfCommunication = ""
                        this.listQuestionnairefun();
                    } else {
                        this.$message.error(res.message || '操作失败');
                    }
                }).catch(error =>{
                    console.log('售后问题:查看详情 src/views/entrepotSet/aftermarket/aftersaleproblem/components/aftermarketdetails.vue', error);
                })
            }else{
                if (this.disposeKind  == '') {
                    this.$message.warning("请选择处理方式！");
                } else if (this.disposeKind  == 3 && this.afterDutyGroupId ==''){
                    this.$message.warning("请选择售后责任部门！");
                } else {
                    let data = {
                        disposeKind: 3,
                        disposeKind: this.disposeKind,
                        customerContractNumber: selectdata.customerContractNumber || '',
                        orderId: selectdata.orderId || '',
                        questionnaireId: selectdata.questionnaireId,
                        afterDutyGroupId: this.afterDutyGroupId,
                        orderNumber: selectdata.orderNumber || ''
                    }
                    editProblemHandling(data).then(res =>{
                        if(res.status == 200){
                            this.$message.success('操作成功');
                            this.dialogVisible = false;
                            this.listQuestionnairefun();
                        } else {
                            this.$message.error(res.message || '操作失败');
                        }
                    }).catch(error =>{
                        console.log('售后问题:查看详情 src/views/entrepotSet/aftermarket/aftersaleproblem/components/aftermarketdetails.vue', error);
                    })
                }
            }
        },
        compensatfun(){
            // this.visiblecompensat = true;
            this.$router.push({path: '/compensationmanage/index'})
        },
        currentChange(val) {
            this.currentPage = val;
            this.listQuestionnairefun();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.listQuestionnairefun();
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        // 导出
        exportQuestionnaire() {
          if (this.tableSelectList.length) {
            let ids = this.tableSelectList.map(item => {
              return item.questionnaireId;
            }).join(',');
            let URLS = module.dev.proxyTable['/api'].target + '/api/pc/questionnaire/exportQuestionnaire?questionnaireIds=' + ids;
            window.location.href = URLS;
          } else {
            this.$message.error('请选择要勾选的数据');
          }
        },
        // 获取来源
        getBaseDict() {
          let params = {
            dataType: 'PROBLEM_SOURCES'
          }
          listBaseDict(params)
            .then(response => {
              this.questionnaireSourceList = response.data;
            })
            .catch(error => {
              console.log('选择商品组件：getBaseDict:' + error)
            })
        }
    },
    computed: {
      ...mapGetters([
        'maxHeight',
        'size',
        'btnSize',
        'span'
      ])
    }
}
</script>
