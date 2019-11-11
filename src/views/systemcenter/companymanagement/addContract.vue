<template>
  <div class="wrapper lvs contractAdd">
    <div class="apper">
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="box-card" shadow="always">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth" :size="size" class="ruleForm">
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
<!--            <el-collapse-item title="结算周期" name="3" class="peroid">-->
<!--              <el-form-item label="结算方式" prop="balanceTypeId">-->
<!--                <el-radio-group v-model="ruleForm.balanceTypeId" @change="balanceTypeChange">-->
<!--                  <el-radio v-for="item in balanceType" :label="item.code" :key="item.code">{{ item.value }}</el-radio>-->
<!--                </el-radio-group>-->
<!--              </el-form-item>-->
<!--              <div class="payTypeContent">-->
<!--                <div class="year" v-if="ruleForm.balanceTypeId == 0">-->
<!--                  <el-form-item label="结算周期" class="calPeroid">-->
<!--                    <div class="clearfix">-->
<!--                      <div class="fl">-->
<!--                        <div class="fl peroid_peroid m-right10">-->
<!--                          <el-select v-model="ruleForm.startPeriod" placeholder="请选择">-->
<!--                            <el-option v-for="item in yearType" :label="item.value" :value="item.code" :key="item.code"></el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                        <div class="fl peroid_month">-->
<!--                          <el-select v-model="ruleForm.startMouth" placeholder="请选择" @change="monthChange(1)">-->
<!--                            <el-option v-for="n in 12" :label="n" :value="n" :key="n"></el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                        <span class="fl line">月</span>-->
<!--                        <div class="fl peroid_date">-->
<!--                          <el-select v-model="ruleForm.startDay" placeholder="请选择">-->
<!--                            <el-option v-for="n in days1" :label="n" :value="n" :key="n"></el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                        <span class="fl line">日</span>-->
<!--                      </div>-->
<!--                      <div class="fl line">至</div>-->
<!--                      <div class="fl">-->
<!--                        <div class="fl peroid_peroid m-right10">-->
<!--                          <el-select v-model="ruleForm.endPeriod" placeholder="请选择">-->
<!--                            <el-option v-for="item in yearType" :label="item.value" :value="item.code" :key="item.code"></el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                        <div class="fl peroid_month">-->
<!--                          <el-select v-model="ruleForm.endMouth" placeholder="请选择" @change="monthChange(2)">-->
<!--                            <el-option v-for="n in 12" :label="n" :value="n" :key="n"></el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                        <span class="fl line">月</span>-->
<!--                        <div class="fl peroid_date">-->
<!--                          <el-select v-model="ruleForm.endDay" placeholder="请选择">-->
<!--                            <el-option v-for="n in days2" :label="n" :value="n" :key="n"></el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                        <span class="fl line">日</span>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="结算日期" class="calDate">-->
<!--                    <div class="clearfix">-->
<!--                      <div class="fl peroid_peroid m-right10">-->
<!--                        <el-select v-model="ruleForm.balanceTime" placeholder="请选择">-->
<!--                          <el-option v-for="item in yearType" :label="item.value" :value="item.code" :key="item.code"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl peroid_month">-->
<!--                        <el-select v-model="ruleForm.mouth" placeholder="请选择" @change="monthChange(3)">-->
<!--                          <el-option v-for="n in 12" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">月</div>-->
<!--                      <div class="fl peroid_date">-->
<!--                        <el-select v-model="ruleForm.day" placeholder="请选择">-->
<!--                          <el-option v-for="n in days3" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">日</div>-->
<!--                    </div>-->
<!--                  </el-form-item>-->
<!--                </div>-->
<!--                <div class="quarter"  v-if="ruleForm.balanceTypeId == 1">-->
<!--                  <div class="clearfix">-->
<!--                    <el-form-item label="季度开始时间" class="calMonth fl">-->
<!--                      <div class="fl peroid_month">-->
<!--                        <el-select v-model="ruleForm.quarterStartMouth" placeholder="请选择" @change="monthChange(4)">-->
<!--                          <el-option v-for="n in 12" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">月</div>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="结算周期" class="calPeroid fl">-->
<!--                      <div class="fl peroid_peroid">-->
<!--                        <el-select v-model="ruleForm.startPeriod" placeholder="请选择">-->
<!--                          <el-option label="上季度" value="0"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="结算日期" class="calDate fl">-->
<!--                      <div class="fl peroid_date">-->
<!--                        <el-select v-model="ruleForm.day" placeholder="请选择">-->
<!--                          <el-option v-for="n in days4" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">日</div>-->
<!--                    </el-form-item>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="month" v-if="ruleForm.balanceTypeId == 2">-->
<!--                  <el-form-item label="结算周期" class="calPeroid">-->
<!--                    <div class="fl">-->
<!--                      <div class="fl peroid_peroid m-right10">-->
<!--                        <el-select v-model="ruleForm.startPeriod" placeholder="请选择">-->
<!--                          <el-option v-for="item in monthType" :label="item.value" :value="item.code" :key="item.code"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl peroid_date">-->
<!--                        <el-select v-model="ruleForm.startDay" placeholder="请选择">-->
<!--                          <el-option v-for="n in 31" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">日</div>-->
<!--                    </div>-->
<!--                    <div class="fl line">至</div>-->
<!--                    <div class="fl">-->
<!--                      <div class="fl peroid_peroid m-right10">-->
<!--                        <el-select v-model="ruleForm.endPeriod" placeholder="请选择">-->
<!--                          <el-option v-for="item in monthType" :label="item.value" :value="item.code" :key="item.code"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl peroid_date">-->
<!--                        <el-select v-model="ruleForm.endDay" placeholder="请选择">-->
<!--                          <el-option v-for="n in 31" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">日</div>-->
<!--                    </div>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="结算日期" class="calDate clearfix">-->
<!--                    <div class="fl">-->
<!--                      <div class="fl peroid_peroid m-right10">-->
<!--                        <el-select v-model="ruleForm.balanceTime" placeholder="请选择">-->
<!--                          <el-option v-for="item in monthType" :label="item.value" :value="item.code" :key="item.code"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl peroid_date">-->
<!--                        <el-select v-model="ruleForm.day" placeholder="请选择">-->
<!--                          <el-option v-for="n in 31" :label="n" :value="n" :key="n"></el-option>-->
<!--                        </el-select>-->
<!--                      </div>-->
<!--                      <div class="fl line">日</div>-->
<!--                    </div>-->
<!--                  </el-form-item>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-collapse-item>-->
            <el-collapse-item title="合同附件" name="4" class="appendix">
              <el-form-item label="选择附件">
                <el-button class="button-120" @click="uploadAppendix" :size="btnSize">选择上传文件</el-button>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="补充说明" name="5" class="supplement">
              <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入补充说明"></el-input>
            </el-collapse-item>
            <el-collapse-item title="结算模板" name="6" class="calTemplate" v-if="contractId && ruleForm.isSupplier">
              <div class="m-bottom clearfix">
                <el-button class="button-96" :size="btnSize" @click="addTemplate">新增</el-button>
                <el-button class="button-96" :size="btnSize" @click="deleteTemplate(1)">删除</el-button>
              </div>
              <div class="table_list">
                <el-table border :data="templateList" @selection-change="moduleSelectionChange" :row-class-name="tableRowClassName" >
                  <el-table-column type="selection" align="center"></el-table-column>
                  <el-table-column align="center" prop="moduleName" label="模板名称" sortable min-width="90">
                    <template slot-scope="scope">
                      <div>
                        <el-tooltip placement="right" visible-arrow >
                          <div slot="content" class="tips tipFon">
                            <p @click="editTemplate(scope.row)" class="operaItems">编辑</p>
                            <p @click="deleteTemplate(0,scope.row)" class="operaItems">删除</p>
                          </div>
                          <img :src="spot" alt="" class="attributesTips">
                        </el-tooltip>
                        <p class="operation">{{scope.row.moduleName}}</p>
                      </div>
                    </template>
                  </el-table-column>
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
          <div class="btnList center m-top10" v-if="(isAdd && !contractId) || (!isAdd && contractId)">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
    <el-dialog title="结算模板" :visible.sync="dialogTemplate" width="70%" custom-class="customDialogTitle dialogTemplate">
      <el-form :model="moduleForm" :rules="rules" :size="size" ref="moduleForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="模板名称" prop="moduleName" :label-width="templateFormLabelWidth">
              <el-input v-model="moduleForm.moduleName" clearable placeholder="请输入模板名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模板类型" prop="moduleType" :label-width="templateFormLabelWidth">
              <el-select v-model="moduleForm.moduleType">
                <el-option v-for="item in moduleTypeList" :label="item.value" :value="item.code" :key="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否默认" :label-width="templateFormLabelWidth">
              <el-checkbox v-model="moduleForm.isEnable"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="opeList">
          <span class="ope plus" @click="addRow"></span>
          <span class="ope minus" @click="removeRow"></span>
        </div>
        <div class="table_list">
          <el-table :data="moduleForm.list" border @selection-change="fieldSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="excelFieldName" label="Excel字段名">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.excelFieldName" clearable placeholder="Excel字段名"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="sysFieldName" label="系统字段名">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.sysFieldName" clearable placeholder="系统字段名"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="fieldType" label="字段类型">
              <template slot-scope="scope">
                <el-form-item>
                  <el-select v-model="scope.row.fieldType" placeholder="请选择">
                    <el-option v-for="item in fieldTypeList" :label="item.value" :value="item.code" :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="isMust" label="是否必填" placeholder="请选择">
              <template slot-scope="scope">
                <el-form-item>
                  <el-select v-model="scope.row.isMust">
                    <el-option v-for="item in isRequiredList" :label="item.value" :value="item.code" :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="描述">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.remark" placeholder="请输入描述"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="描述" prop="remark" class="description" :label-width="templateFormLabelWidth">
          <el-input v-model="moduleForm.remark" type="textarea" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCompanyTemplate('moduleForm')">确定</el-button>
        <el-button @click="dialogTemplate = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传文件" :visible.sync="dialogAppendix" width="600px" custom-class="customDialogTitle">
      <el-upload
        class="avatar-uploader"
        multiple
        ref="uploadAppendix"
        action="http://localhost:9527/api/auth/service/uploadFile"
        :data= uploadtype
        :headers="headers"
        accept=".doc,.docx,.pdf,.xls,.xlsx"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="true"
        :auto-upload="false"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-change="fileChange">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadAppendixSubmit">提交</el-button>
        <el-button @click="dialogAppendix = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '../../components/breadcrumb';
  import pagination from '../../components/pagination';
  import { mapGetters } from 'vuex';
  import { listCompanyByAll } from 'src/api/pulicJava';
  import { listCompanyTemplate, addCompanyCooperationContract, getCompanyCooperationContract, addCompanyTemplate, delCompanyTemplate, getCompanyTemplate, editCompanyTemplate, listCommoditySelected, delCompanyCommodity, editCompanyCooperationContract } from 'src/api/systemcenter/companymanagement';
  import { getCountDays } from 'src/utils/index';
  import { getToken } from '@/utils/auth';
  import spot from '@/assets/images/spot.png';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        activeNames: ['1', '2', '3', '4', '5', '6'],
        span: 8,
        fullSpan: 24,
        headers: {
          Authorization: getToken()
        },
        uploadtype: {
          type: 'pc'
        },
        navList: [],
        formLabelWidth: '110px',
        templateFormLabelWidth: '80px',
        spot,
        isAdd: 1,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tabActive: 'otherInfo',
        isDisabled: true,
        contractId: '', // '5'
        serverId: '', // 6
        servedId: '', // 7
        companyList: [],
        organizationId: '', // 17
        commodityList: [],
        fileList: [],
        dialogAppendix: false,
        templateList: [],
        templateData: [],
        fieldMutipleSelection: [],
        moduleMutipleSelection: [],
        commodityMutipleSelection: [],
        searchtext: '',
        dialogTemplate: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
          }
        },
        balanceType: [
          { code: 0, value: '按年' },
          { code: 1, value: '按季' },
          { code: 2, value: '按月' },
          { code: 3, value: '按单' }
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
        queryForm: {
          userNo: ''
        },
        moduleTypeList: [
          { code: 1, value: '成本' },
          { code: 2, value: '物料' }
        ],
        fieldTypeList: [
          { code: 1, value: '文本' },
          { code: 2, value: '金额' },
          { code: 3, value: '日期' },
          { code: 4, value: '数字' }
        ],
        isRequiredList: [
          { code: 0, value: '否' },
          { code: 1, value: '是' }
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
        },
        editRuleForm: {},
        isAddTemplate: 1,
        moduleForm: {
          moduleId: '',
          moduleName: '',
          moduleType: '',
          remark: '',
          isEnable: false,
          list: [
            {
              moduleDetailId: '',
              excelFieldName: '',
              sysFieldName: '',
              fieldType: '',
              isMust: '',
              remark: ''
            }
          ]
        },
        rules: {
          contractNumber: [
            { required: true, message: '请输入合同号', trigger: 'blur' }
          ],
          serverId: [
            { required: true, message: '请选择服务方', trigger: 'change' }
          ],
          servedId: [
            { required: true, message: '请选择被服务方', trigger: 'change' }
          ],
          serviceTime: [
            { required: true, message: '请选择服务有效期', trigger: 'blur' }
          ],
          signTime: [
            { required: true, message: '请选择合同签订时间', trigger: 'blur' }
          ],
          moduleName: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          moduleType: [
            { required: true, message: '请选择模板类型', trigger: 'change' }
          ]
        }
      };
    },
    created() {
      this.getListCompanyByAll();
      this.getParams();
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      // 获取参数信息,确定是编辑还是添加(详情页或者列表页跳过来的添加)
      // 1 详情页跳过来的添加； 0 详情页跳过来的编辑；没有 列表页跳过来的添加
      getParams() {
        const opeType = this.$route.query.type;
        if (opeType == 1) {
          this.isAdd = 1;
          this.serverId = parseInt(this.$route.query.serverId);
          this.ruleForm.serverId = parseInt(this.$route.query.serverId);
          // this.servedId = this.$route.query.servedId;
        } else if (opeType == 0) {
          this.isAdd = 0;
          this.serverId = parseInt(this.$route.query.serverId);
          this.servedId = parseInt(this.$route.query.servedId);
          this.ruleForm.serverId = parseInt(this.$route.query.serverId);
          this.ruleForm.servedId = parseInt(this.$route.query.servedId);
          // 获取合同详情
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
        } else {
          this.isAdd = 1;
        }
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      addRow() {
        this.moduleForm.list.push({
          excelFieldName: '',
          sysFieldName: '',
          fieldType: '',
          isMust: '',
          remark: ''
        });
      },
      removeRow() {
        const _this = this;
        if (!this.fieldMutipleSelection.length) {
          this.$message.warning('请选择要删除的字段');
          return;
        }
        // for(var i=0;i<this.fieldMutipleSelection.length;i++){
        //   for(var j=0;j<this.moduleForm.list.length;j++){
        //     if(this.moduleForm.list[j].id==this.fieldMutipleSelection[i].id){
        //       let arr=this.tableDataMark.splice(j,1);
        //       j=j-1;
        //       if(arr[0].status==1){
        //         let obj={
        //           aogTemplateId:arr[0].aogTemplateId
        //         };
        //         this.delList.push(obj)
        //       }
        //     }
        //   }
        // }
        // const newList = this.moduleForm.list;
        // this.fieldMutipleSelection.forEach(item => {
        // })
      },
      getListCompanyByAll() {
        let data={
            companyType:'0'
        }
        listCompanyByAll(data)
          .then(response => {
            this.companyList = response.data;
          })
          .catch(error => {
            console.log('common/listCompanyByAll:' + error);
          });
      },
      // 点击上传文件按钮
      uploadAppendix() {
        this.dialogAppendix = true;
        this.ruleForm.files = [];
        this.fileList = [];
      },
      uploadSuccess(response, file, fileList) {
        this.$message.success('上传成功');
        this.ruleForm.files.push(response.data);
        this.dialogAppendix = false;
      },
      uploadError(err, file, fileList) {
        console.log(err, file, fileList)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      fileChange(file, fileList) {
        this.fileList = fileList;
      },
      // 提交上传的附件
      uploadAppendixSubmit() {
        if (!this.fileList.length) {
          this.$message.warning('请选择上传文件');
          return;
        }
        this.$refs.uploadAppendix.submit();
      },
      // 结算周期切换
      balanceTypeChange() {
        this.ruleForm.quarterStartMouth = '';
        this.ruleForm.startMouth = '';
        this.ruleForm.startDay = '';
        this.ruleForm.endPeriod = '';
        this.ruleForm.endMouth = '';
        this.ruleForm.endDay = '';
        this.ruleForm.balanceTime = '';
        this.ruleForm.mouth = '';
        this.ruleForm.day = '';
        if (this.ruleForm.balanceTypeId == 1) {
          this.ruleForm.startPeriod = '0';
        } else {
          this.ruleForm.startPeriod = '';
        }
        if (this.ruleForm.balanceTypeId == this.editRuleForm.balanceTypeId) {
          this.ruleForm.startPeriod = this.editRuleForm.startPeriod;
          this.ruleForm.quarterStartMouth = this.editRuleForm.quarterStartMouth;
          this.ruleForm.startMouth = this.editRuleForm.startMouth;
          this.ruleForm.startDay = this.editRuleForm.startDay;
          this.ruleForm.endPeriod = this.editRuleForm.endPeriod;
          this.ruleForm.endMouth = this.editRuleForm.endMouth;
          this.ruleForm.endDay = this.editRuleForm.endDay;
          this.ruleForm.balanceTime = this.editRuleForm.balanceTime;
          this.ruleForm.mouth = this.editRuleForm.mouth;
          this.ruleForm.day = this.editRuleForm.day;
        }
      },
      // 月份切换
      monthChange(index) {
        let month = 1;
        if (index == 1) {
          month = this.ruleForm.startMouth;
        }
        if (index == 2) {
          month = this.ruleForm.endMouth;
        }
        if (index == 3) {
          month = this.ruleForm.mouth;
        }
        if (index == 4) {
          month = this.ruleForm.quarterStartMouth;
        }
        this['days' + index] = getCountDays(month);
      },
      //取消
      cancel(){
        this.$router.go(-1)
      },
      // 提交 合同 基本信息
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.organizationId = this.companyList.filter(item => item.companyId == this.ruleForm.serverId)[0].organizationId;
            const params = {
              contractId: this.contractId,
              contracBalanceId: this.ruleForm.balanceTypeId,
              serverId: this.ruleForm.serverId,
              servedId: this.ruleForm.servedId,
              contractNumber: this.ruleForm.contractNumber,
              serviceStartTime: this.ruleForm.serviceTime[0],
              serviceEndTime: this.ruleForm.serviceTime[1],
              isContract: this.ruleForm.isContract ? 1 : 0,
              isSupplier: this.ruleForm.isSupplier ? 1 : 0,
              isStorage: this.ruleForm.isStorage ? 1 : 0,
              isDelivery: this.ruleForm.isDelivery ? 1 : 0,
              isInstall: this.ruleForm.isInstall ? 1 : 0,
              isMaintain: this.ruleForm.isMaintain ? 1 : 0,
              isLoad: this.ruleForm.isLoad ? 1 : 0,
              isProcess: this.ruleForm.isProcess ? 1 : 0,
              isChannel: this.ruleForm.isChannel ? 1 : 0,
              isSaleAfter: this.ruleForm.isSaleAfter ? 1 : 0,
              supplierInstall: this.ruleForm.supplierInstall ? 1 : 0,
              supplierWarehousing: this.ruleForm.supplierWarehousing ? 1 : 0,
              supplierOutsourcing: this.ruleForm.supplierOutsourcing ? 1 : 0,
              remark: this.ruleForm.remark,
              balanceTypeId: this.ruleForm.balanceTypeId, // 结算方式
              startPeriod: this.ruleForm.startPeriod, // 结算周期-开始
              quarterStartMouth: this.ruleForm.quarterStartMouth,
              startMouth: this.ruleForm.startMouth,
              startDay: this.ruleForm.startDay,
              endPeriod: this.ruleForm.endPeriod,
              endMouth: this.ruleForm.endMouth,
              endDay: this.ruleForm.endDay,
              balanceTime: this.ruleForm.balanceTime,
              mouth: this.ruleForm.mouth,
              day: this.ruleForm.day,
              signTime:this.ruleForm.signTime
            };
            const urls = [];
            const sourceNames = [];
            const targetNames = [];
            this.ruleForm.files.forEach(item => {
              urls.push(item.url);
              sourceNames.push(item.source_name);
              targetNames.push(item.target_name);
            })
            params.urls = urls.join(',');
            params.sourceNames = sourceNames.join(',');
            params.targetNames = targetNames.join(',');
            let fn = this.isAdd ? addCompanyCooperationContract : editCompanyCooperationContract;
            fn(params)
              .then(response => {
                if(response.status==200){
                  this.$message.success('保存成功');
                  this.contractId = response.data.contractId;
                  this.serverId = response.data.serverId;
                  this.servedId = response.data.servedId;
                  this.isDisabled = false;
                  if (this.isAdd) {
                    if (this.ruleForm.isSupplier) {
                      this.getCompanyTemplateList();
                    }
                    if (this.ruleForm.isChannel) {
                      this.getCommoditySelectedList();
                    }
                  } else {
                    this.$router.go(-1);
                  }
                }else{
                  this.$message.error(response.message);
                }
                
              })
              .catch(error => {
                console.log('company/addCompanyCooperationContract(editCompanyCooperationContract):' + error);
              })
          } else {
            return false;
          }
        });
      },
      // 模板多选
      moduleSelectionChange(val) {
        this.moduleMutipleSelection = val;
      },
      // 模板弹出层字段多选
      fieldSelectionChange(val) {
        this.fieldMutipleSelection = val;
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
      // 点击添加模板
      addTemplate() {
        this.isAddTemplate = 1;
        this.moduleForm = {
          moduleId: '',
          moduleName: '',
          moduleType: '',
          remark: '',
          isEnable: '',
          list: [
            {
              excelFieldName: '',
              sysFieldName: '',
              fieldType: '',
              isMust: '',
              remark: ''
            }
          ]
        };
        this.resetForm('moduleForm');
        this.dialogTemplate = true;
      },
      // 点击编辑模板
      editTemplate(row) {
        this.resetForm('moduleForm');
        this.isAddTemplate = 0;
        // 查看模板信息
        getCompanyTemplate({ moduleId: row.moduleId })
          .then(response => {
            this.contractId = response.data.contractId;
            Object.assign(this.moduleForm, response.data);
            this.moduleForm.isEnable = response.data.isEnable == 1;
          })
          .catch(error => {
            console.log('company/getCompanyTemplate:' + error);
          })
        this.dialogTemplate = true;
      },
      // 新增模板-编辑模板
      addCompanyTemplate(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const params = {
              moduleId: this.moduleForm.moduleId,
              contractId: this.contractId,
              moduleName: this.moduleForm.moduleName,
              moduleType: this.moduleForm.moduleType,
              remark: this.moduleForm.remark,
              isEnable: this.moduleForm.isEnable ? 1 : 0
            }
            const excelFieldNameList = [];
            const sysFieldNameList = [];
            const fieldTypeList = [];
            const isMustList = [];
            const remarkList = [];
            const moduleDetailIdList = [];
            this.moduleForm.list.forEach(item => {
              excelFieldNameList.push(item.excelFieldName);
              sysFieldNameList.push(item.sysFieldName);
              fieldTypeList.push(item.fieldType);
              isMustList.push(item.isMust);
              remarkList.push(item.remark);
              if (!this.isAddTemplate) {
                moduleDetailIdList.push(item.moduleDetailId);
              }
            })
            params.excelFieldNames = excelFieldNameList.join(',');
            params.sysFieldNames = sysFieldNameList.join(',');
            params.fieldTypes = fieldTypeList.join(',');
            params.isMusts = isMustList.join(',');
            params.remarks = remarkList.join(',');
            if (!this.isAddTemplate) {
              params.moduleDetailIds = moduleDetailIdList.join(',');
            }
            const fn = this.isAddTemplate ? addCompanyTemplate : editCompanyTemplate;
            const statusText = this.isAddTemplate ? '添加' : '编辑';
            fn(params)
              .then(response => {
                this.dialogTemplate = false;
                this.$message.success(statusText + '成功');
                if (this.isAddTemplate) {
                  this.currentPage = 1;
                }
                this.getCompanyTemplateList();
              })
              .catch(error => {
                console.log('addCompanyTemplate/editCompanyTemplate' + error);
              })
          } else {
            return false;
          }
        });
      },
      // 删除模板
      deleteTemplate(deleteType, row) {
        let moduleIds = '';
        // deleteType 1 按钮点击 0，表格内点击
        if (deleteType) {
          if (!this.moduleMutipleSelection.length) {
            this.$message.warning('请选择要删除的模板');
            return;
          } else {
            const ids = [];
            this.moduleMutipleSelection.forEach(item => {
              ids.push(item.moduleId);
            });
            moduleIds = ids.join(',');
          }
        } else {
          moduleIds = row.moduleId;
        }
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          delCompanyTemplate({ moduleIds })
            .then(response => {
              this.$message.success('删除成功')
            })
            .catch(error => {
              console.log('company/delCompanyTemplate:' + error);
            })
        }).catch(() => {});
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
      // 查询按钮点击
      searchFun() {
        this.getCommoditySelectedList();
      },
      // 选择商品
      addCommodity() {

      },
      // 选择商品
      channelSelectionChange(val) {
        this.commodityMutipleSelection = val;
      },
      deleteCommodity(deleteType, row) {
        let commodityIds = '';
        if (deleteType) {
          if (!this.commodityMutipleSelection.length) {
            this.$message.warning('请选择要删除的商品');
            return;
          } else {
            const ids = [];
            this.commodityMutipleSelection.forEach(item => {
              ids.push(item.commodityId);
            });
            commodityIds = ids.join(',');
          }
        } else {
          commodityIds = row.commodityId;
        }
        const params = {
          contractId: this.contractId,
          commodityIds,
          commodityPriceIds: ''
        }
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          // delCompanyCommodity({ moduleIds })
          //   .then(response => {
          //     this.$message.success('删除成功')
          //   })
          //   .catch(error => {
          //     console.log('company/delCompanyCommodity:' + error);
          //   })
        }).catch(() => {});
      },
      // 取消 返回上一页
      goBack() {
        this.$router.go(-1);
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
  .dialogTemplate .table_list{
    margin: 22px 0;
  }
</style>
