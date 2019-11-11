<template>
  <div class="wrapper lvs contractAdd">
    <div class="apper">
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom">
        <el-form :model="ruleForm" ref="ruleForm" :label-width="formLabelWidth" class="viewForm" :size="size" disabled>
          <el-collapse v-model="activeNames" class="customCollapse">
            <el-collapse-item title="基本信息" name="1" class="contractInfo">
              <el-row :gutter="30">
                <el-col :span="span">
                  <el-form-item label="合同号" prop="contractNumber">
                    <el-input v-model.trim="ruleForm.contractNumber" clearable placeholder="请输入合同号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="30">
                <el-col :span="span">
                  <el-form-item label="服务方" prop="serverId">
                    <el-select v-model="ruleForm.serverId" filterable placeholder="请选择服务方" clearable :disabled="serverId != ''">
                      <el-option v-for="item in companyList" :label="item.companyName" :value="item.companyId" :key="item.companyId" :disabled="item.companyId === ruleForm.servedId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="被服务方" prop="servedId">
                    <el-select v-model="ruleForm.servedId" filterable placeholder="请选择被服务方" clearable :disabled="servedId != ''">
                      <el-option v-for="item in companyList" :label="item.companyName" :value="item.companyId" :key="item.companyId" :disabled="item.companyId === ruleForm.serverId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="30">
                <el-col :span="span">
                  <el-form-item label="服务有效期" prop="serviceTime" class="serveDate">
                    <el-date-picker
                      v-model="ruleForm.serviceTime"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="合同签订时间" prop="signTime" class="signDate">
                    <el-date-picker
                      v-model="ruleForm.signTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请选择合同签订时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="服务内容" name="2" class="serveContent">
              <div class="pl-20">
                <el-checkbox v-model="ruleForm.isContract" :disabled="ruleForm.isSupplier || ruleForm.isChannel">合同金额代收</el-checkbox>
                <el-checkbox v-model="ruleForm.isSupplier" :disabled="ruleForm.isContract || ruleForm.isChannel">供货商</el-checkbox>
                <el-checkbox v-model="ruleForm.isChannel" :disabled="ruleForm.isSupplier || ruleForm.isContract">渠道</el-checkbox>
                <el-checkbox v-model="ruleForm.isStorage" :disabled="ruleForm.isContract || ruleForm.isSupplier">仓储</el-checkbox>
                <el-checkbox v-model="ruleForm.isDelivery" :disabled="ruleForm.isContract || ruleForm.isSupplier">物流</el-checkbox>
                <el-checkbox v-model="ruleForm.isInstall" :disabled="ruleForm.isContract || ruleForm.isSupplier">安装</el-checkbox>
                <el-checkbox v-model="ruleForm.isMaintain" :disabled="ruleForm.isContract || ruleForm.isSupplier">维修</el-checkbox>
                <el-checkbox v-model="ruleForm.isSaleAfter" :disabled="ruleForm.isContract || ruleForm.isSupplier">售后</el-checkbox>
                <el-checkbox v-model="ruleForm.isLoad" :disabled="ruleForm.isContract || ruleForm.isSupplier">装卸</el-checkbox>
                <el-checkbox v-model="ruleForm.isProcess" :disabled="ruleForm.isContract || ruleForm.isSupplier">加工</el-checkbox>
              </div>
              <div class="pl-20 m-top10" v-if='ruleForm.isSupplier'>
                <el-checkbox v-model="ruleForm.supplierInstall">是否安装</el-checkbox>
                <el-checkbox v-model="ruleForm.supplierWarehousing">是否入库</el-checkbox>
                <el-checkbox v-model="ruleForm.supplierOutsourcing">是否外购</el-checkbox>
              </div>
            </el-collapse-item>
            <el-collapse-item title="合同附件" name="4" class="appendix">
              <el-form-item label="下载附件">
                <div class="btn button-120 button-small" @click="downloadAppendix" :size="btnSize">选择下载文件</div>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="补充说明" name="5" class="supplement">
              <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入补充说明"></el-input>
            </el-collapse-item>
            <el-collapse-item title="结算模板" name="6" class="calTemplate" v-if="contractId && ruleForm.isSupplier">
              <div class="table_list">
                <el-table border :data="templateList" :row-class-name="tableRowClassName" >
                  <el-table-column align="center" prop="moduleType" label="模板类型" sortable min-width="110"></el-table-column>
                  <el-table-column align="center" prop="remark" label="描述" sortable min-width="110"></el-table-column>
                  <el-table-column align="center" prop="phone"  label="数据项" sortable min-width="110"></el-table-column>
                  <el-table-column align="center" prop="isEnable" label="是否默认" sortable min-width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.isEnable == 0 ? '否' : '是' }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-card>
    </div>
    <el-dialog title="下载文件" :visible.sync="dialogAppendix" width="600px" custom-class="customDialogTitle">
      <div class="table_list">
        <el-table border :data="fileList" :row-class-name="tableRowClassName">
          <el-table-column align="center" type="index"></el-table-column>
          <el-table-column align="center" prop="sourceName" label="文件名称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="download(scope.row)">下载</el-button>
<!--              <a class="download" :href="scope.row.path + '?targetName='+ scope.row.sourceName +'&sourceName=' + scope.row.targetName">下载</a>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAppendix = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '../../components/breadcrumb';
  import pagination from '../../components/pagination';
  import { mapGetters } from 'vuex';
  // import { listCompanyByAll, fileDownload } from 'src/api/pulicJava';
  import { listCompanyTemplate, getCompanyCooperationContract, listCommoditySelected, listCompanyAttachment } from 'src/api/systemcenter/companymanagement';
  import { getCountDays } from 'src/utils/index';
  import spot from '@/assets/images/spot.png';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        navList: [],
        activeNames: ['1', '2', '3', '4', '5', '6'],
        fullSpan: 24,
        span: 8,
        formLabelWidth: '110px',
        spot,
        fileList: [],
        contractId: '', // '5'
        serverId: '', // 6
        servedId: '', // 7
        companyList: [],
        organizationId: '', // 17
        commodityList: [],
        templateList: [],
        dialogAppendix: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
          }
        },
        balanceType: [
          { code: 0, value: '按年' },
          { code: 1, value: '按季' },
          { code: 2, value: '按月' }
        ],
        yearType: [
          { code: 0, value: '上年度' },
          { code: 1, value: '本年度' },
          { code: 2, value: '下年度' }
        ],
        monthType: [
          { code: 0, value: '上月' },
          { code: 1, value: '本月' }
        ],
        days1: 31,
        days2: 31,
        days3: 31,
        days4: 31,
        ruleForm: {
          serverId: '',
          servedId: '',
          contractNumber: '',
          serviceTime: '',
          isContract: false,
          isSupplier: false,
          isChannel: false,
          isStorage: false,
          isDelivery: false,
          isInstall: false,
          isMaintain: false,
          isLoad: false,
          isProcess: false,
          isSaleAfter: false,
          supplierInstall: false,
          supplierWarehousing: false,
          supplierOutsourcing: false,
          remark: '',
          balanceTypeId: 0, // 结算方式
          startPeriod: '', // 结算周期-开始
          quarterStartMouth: '',
          startMouth: '',
          startDay: '',
          endPeriod: '',
          endMouth: '',
          endDay: '',
          balanceTime: '',
          mouth: '',
          day: '',
          files: [],
          signTime: ''
        }
      };
    },
    created() {
      this.getListCompanyByAll();
      this.getContractInfo();
      this.getCompanyAttachmentList();
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 获取合同详情
      getContractInfo() {
        this.serverId = parseInt(this.$route.query.serverId);
        this.servedId = parseInt(this.$route.query.servedId);
        this.ruleForm.serverId = parseInt(this.$route.query.serverId);
        this.ruleForm.servedId = parseInt(this.$route.query.servedId);
        const params = {
          serverId: this.$route.query.serverId,
          servedId: this.$route.query.servedId
        }
        getCompanyCooperationContract(params)
          .then(response => {
            const newForm = response.data;
            newForm.serviceTime = [newForm.serviceStartTime ? newForm.serviceStartTime : '', newForm.serviceEndTime ? newForm.serviceEndTime: ''];
            newForm.isChannel = newForm.isChannel == 1;
            newForm.isContract = newForm.isContract == 1;
            newForm.isDelivery = newForm.isDelivery == 1;
            newForm.isInstall = newForm.isInstall == 1;
            newForm.isLoad = newForm.isLoad == 1;
            newForm.isMaintain = newForm.isMaintain == 1;
            newForm.isProcess = newForm.isProcess == 1;
            newForm.isStorage = newForm.isStorage == 1;
            newForm.isSupplier = newForm.isSupplier == 1;
            newForm.supplierInstall = newForm.supplierInstall == 1;
            newForm.supplierWarehousing = newForm.supplierWarehousing == 1;
            newForm.supplierOutsourcing = newForm.supplierOutsourcing == 1;
            this.editRuleForm = newForm;
            this.contractId = response.data.contractId;
            if (newForm.isSupplier) {
              this.getCompanyTemplateList();
            }
            if (newForm.isChannel) {
              this.getCommoditySelectedList();
            }
            Object.assign(this.ruleForm, newForm);
          })
          .catch(error => {
            console.log('common/getCompanyCooperationContract:' + error);
          });
      },
      getListCompanyByAll() {
        let params = {
          companyType: 0
        }
        listCompanyByAll(params)
          .then(response => {
            this.companyList = response.data;
          })
          .catch(error => {
            console.log('common/listCompanyByAll:' + error);
          });
      },
      // 获取模板列表
      getCompanyTemplateList() {
        const params = {
          contractId: this.contractId
        }
        listCompanyTemplate(params)
          .then(response => {
            this.templateList = response.data;
          })
          .catch(error => {
            console.log('' + error);
          });
      },
      // 获取列表信息
      getCommoditySelectedList() {
        const params = {
          organizationId: this.organizationId,
          contractId: this.contractId
        };
        listCommoditySelected(params)
          .then(response => {
            this.commodityList = response.data.rows;
          })
          .catch(error => {
            console.log('company/listCommoditySelected:' + error);
          })
      },
      // 取消 返回上一页
      goBack() {
        this.$router.go(-1);
      },
      // 获取附件列表
      getCompanyAttachmentList() {
        let params = {
          contractId: this.$route.query.contractId
        }
        listCompanyAttachment(params)
          .then(response => {
            this.fileList = response.data;
          })
          .catch(error => {
            console.log('company/listCompanyAttachment:' + error);
          })
      },
      // 点击下载文件按钮
      downloadAppendix() {
        this.dialogAppendix = true;
      },
      // 点击列表下载按钮
      download(row){
        let params = {
          path: row.fileUrl,
          targetName: row.targetName,
          sourceName: row.sourceName
        };
        fileDownload(params)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log('common/fileDownload' + error);
          });
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight',
        'size',
        'btnSize'
      ])
    }
  };
</script>
<style scoped>
  .line{
    margin-right: 10px;
  }
</style>
