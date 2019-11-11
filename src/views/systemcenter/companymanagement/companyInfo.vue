<template>
  <div class="wrapper lvs storeForm">
    <div class="apper">
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom">
        <el-form label-width="80px" :size="size" disabled class="viewForm">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.companyName" clearable placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司归属">
                <el-radio-group v-model="companyInfo.companyBelong">
                  <el-radio :label="item.code" v-for="item in companyBelongList" :key="item.code">{{item.value}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-tabs type="border-card" v-model="tabActive" v-loading="loading" @tab-click="tabClick">
        <el-tab-pane label="服务合同" name="1">
          <div class="m-bottom15 clearfix">
            <el-button class="button-96" :size="btnSize" @click="handleAddContract()" v-if="btn_addContract">新增</el-button>
          </div>
          <div class="table_list">
            <el-table border :data="contractList" :row-class-name="tableRowClassName" :max-height="maxHeight">
              <el-table-column align="center" label="合同编号" sortable show-overflow-tooltip width="180" fixed="left">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip placement="right" visible-arrow >
                      <div slot="content" class="tips tipFon">
                        <p @click="viewContract(scope.row)" class="operaItems" v-if="btn_viewContract">查看</p>
                        <p @click="editContract(scope.row)" class="operaItems" v-if="btn_editContract">编辑</p>
                      </div>
                      <img :src="spot" alt="" class="attributesTips">
                    </el-tooltip>
                    <p class="operation">{{scope.row.contractNumber}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="serverName" label="服务方名称" sortable width="220" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="servedName" label="被服务方名称" sortable width="220" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="serviceStartTime" label="服务开始日期" sortable width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="serviceEndTime" label="服务结束日期" sortable width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="signTime" label="服务签订日期" sortable width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="remark" label="说明" sortable width="200" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="账号信息" name="2">
          <div class="m-bottom15">
            <el-button class="button-96" :size="btnSize" @click="handleAddAccount(1)" v-if="btn_addAccount">新增</el-button>
          </div>
          <div class="table_list">
            <el-table border :data="tableData" :row-class-name="tableRowClassName" :max-height="maxHeight">
              <el-table-column align="center" label="开户行" sortable>
                <template slot-scope="scope">
                  <div>
                    <el-tooltip placement="right" visible-arrow >
                      <div slot="content" class="tips tipFon">
                        <p @click="handleEditBankAccount(scope.row)" class="operaItems" v-if="btn_editAccount">编辑</p>
                        <p @click="handleDeleteBankAccount(scope.row)" class="operaItems" v-if="btn_delAccount">删除</p>
                      </div>
                      <img :src="spot" alt="" class="attributesTips">
                    </el-tooltip>
                    <p class="operation">{{scope.row.openingBankName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="账户类型" sortable>
                <template slot-scope="scope">
                  <p>{{ scope.row.accountType == 1 ? '付款方' : '收款方' }}</p>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="accountName" label="开户名" sortable></el-table-column>
              <el-table-column align="center" prop="bankCardNumber" label="银行账号" sortable></el-table-column>
              <el-table-column align="center" label="是否默认" sortable>
                <template slot-scope="scope">
                  <p>{{ scope.row.isDefault == 1 ? '是' : '否' }}</p>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="remark" label="说明" sortable show-overflow-tooltip width="180"></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="isAdd ? '编辑账户' : '新增账户'" :visible.sync="dialogAccount" :close-on-click-modal="false" custom-class="customDialogTitle">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :size="size" :label-width="formLabelWidth" class="ruleForm">
        <el-form-item label="账户类型" prop="accountType">
          <el-radio-group v-model="ruleForm.accountType">
            <el-radio v-for="item in accountTypeList" :label="item.code" :key="item.code">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开户行" prop="openingBank">
          <el-select v-model="ruleForm.openingBank" placeholder="请选择开户行" clearable filterable>
            <el-option v-for="item in bankList" :label="item.dictName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户名" prop="accountName">
          <el-input v-model.trim="ruleForm.accountName" clearable placeholder="请输入开户名"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankCardNumber">
          <el-input v-model.trim="ruleForm.bankCardNumber" clearable placeholder="请输入银行账号"></el-input>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-checkbox v-model="ruleForm.isMain"></el-checkbox>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="ruleForm.remark" type="textarea" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="dialogAccount = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import spot from '@/assets/images/spot.png';
  import { mapGetters } from 'vuex';
  import { listBaseDict } from 'api/pulicJava';
  import { getCompany, listCompanyCooperationContractByAll, listCompanyBankAccountByPage, addCompanyBankAccount, editCompanyBankAccount, deleteCompanyBankAccount  } from 'src/api/systemcenter/companymanagement';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      const checkBankNumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入银行卡号'));
        } else {
          let pattern = /^([1-9]{1})(\d{14}|\d{18})$/;
          if (!pattern.test(value)) {
            callback(new Error('请输入正确的银行卡号!'));
          }
          callback();
        }
      };
      return {
        btn_addContract: false,
        btn_viewContract: false,
        btn_editContract: false,
        btn_addAccount: false,
        btn_delAccount: false,
        btn_editAccount: false,
        navList: [],
        loading: true,
        spot,
        formLabelWidth: '100px',
        dialogAccount: false,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        isAdd: 1,
        companyId: this.$route.query.companyId,
        companyInfo: {},
        contractList: [],
        tableData: [],
        tabActive: '1',
        companyBelongList: [
          { code: 0, value: '内部' },
          { code: 1, value: '外部' }
        ],
        accountTypeList: [
          { code: 0, value: '收款方' },
          { code: 1, value: '付款方' }
        ],
        bankList: [],
        ruleForm: {
          bankAccountId: '',
          accountType: 0,
          openingBank: '',
          accountName: '',
          bankCardNumber: '',
          isMain: false,
          remark: ''
        },
        rules: {
          accountType: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          openingBank: [
            { required: true, message: '请选择开户行', trigger: 'change' }
          ],
          accountName: [
            { required: true, message: '请输入开户名', trigger: 'blur' }
          ],
          bankCardNumber: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.getCompany();
      this.getCompanyContractAll();
      // this.getCompanyBankList();
      this.getBaseDict();
      this.initBtnElements();
    },
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_addContract = element['company:btn_addContract'];
        this.btn_viewContract = element['company:btn_viewContract'];
        this.btn_editContract = element['company:btn_editContract'];
        this.btn_addAccount = element['company:btn_addAccount'];
        this.btn_delAccount = element['company:btn_delAccount'];
        this.btn_editAccount = element['company:btn_editAccount'];
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      currentChange(val) {
        this.currentPage = val;
        this.getCompanyBankList();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getCompanyBankList();
      },
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 获取公司信息
      getCompany() {
        let params = {
          companyId: this.companyId
        }
        getCompany(params)
          .then(response => {
            this.companyInfo = response.data;
          })
          .catch(error => {
            console.log('company/getCompany' + error);
          })
      },
      // 新建合同
      handleAddContract() {
        this.$router.push({
          path: '/company/contractadd',
          query: {
            serverId: this.companyId,
            type: 1 // 新增
          }
        });
      },
      // 查看合同
      viewContract(row) {
        this.$router.push({
          path: '/company/contractview',
          query: {
            contractId: row.contractId,
            servedId: row.servedId,
            serverId: row.serverId
          }
        });
      },
      // 编辑合同
      editContract(row) {
        this.$router.push({
          path: '/company/contractadd',
          query: {
            contractId: row.contractId,
            servedId: row.servedId,
            serverId: row.serverId,
            type: 0 // 编辑
          }
        });
      },
      // 获取公司合同列表
      getCompanyContractAll() {
        this.loading = true;
        let params = {
          companyId: this.companyId
        }
        listCompanyCooperationContractByAll(params)
          .then(response => {
            this.contractList = response.data;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('common/listCompanyCooperationContractByAll:' + error);
          });
      },
      // 获取银行卡列表
      getBaseDict() {
        let params = {
          dataType: 'opening_bank'
        }
        listBaseDict(params)
          .then(response => {
            this.bankList = response.data;
          })
          .catch(error => {
            console.log('views/systemcenter/companymanagement/companyInfo.vue-getBaseDict:' + error);
          })
      },
      // 获取公司银行账户列表
      getCompanyBankList() {
        this.loading = true;
        let params = {
          companyId: this.companyId,
          page: this.currentPage,
          limit: this.pageSize
        }
        listCompanyBankAccountByPage(params)
          .then(response => {
            this.loading = false;
            this.tableData = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/systemcenter/companymanagement/companyInfo.vue-getCompanyBankList:' + error);
          })
      },
      // 点击新增账户
      handleAddAccount() {
        this.isAdd = 1;
        this.ruleForm = {
          bankAccountId: '',
          accountType: 0,
          openingBank: '',
          accountName: '',
          bankCardNumber: '',
          isMain: false,
          remark: ''
        }
        this.resetForm('ruleForm')
        this.dialogAccount = true;
      },
      // 点击编辑账户
      handleEditBankAccount(row) {
        this.isAdd = 0;
        this.ruleForm = {
          bankAccountId: row.bankAccountId,
          accountType: row.accountType,
          openingBank: row.openingBank,
          accountName: row.accountName,
          bankCardNumber: row.bankCardNumber,
          isMain: row.isDefault == 1,
          remark: row.remark
        }
        this.resetForm('ruleForm');
        this.dialogAccount = true;
      },
      // 新增编辑账户提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              companyId: this.companyId,
              ...this.ruleForm,
              isDefault : this.ruleForm.isMain ? 1 : 0
            }
            let fn = this.isAdd ? addCompanyBankAccount : editCompanyBankAccount;
            let statusText = this.isAdd ? '添加' : '编辑';
            fn(params)
              .then(response => {
                this.$message.success(statusText + '成功');
                this.dialogAccount = false;
                this.getCompanyBankList();
              })
              .catch(error => {
                console.log('views/systemcenter/companymanagement/companyInfo.vue-submitForm:' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 删除账户
      handleDeleteBankAccount(row) {
        this.$confirm('确定删除此账户？', '提示', {
          type: 'warning'
        }).then(() => {
          let params = {
            bankAccountId: row.bankAccountId
          }
          deleteCompanyBankAccount(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('删除成功');
                this.getCompanyBankList();
              } else {
                this.$message.warning(response.measure || '删除失败');
              }
            })
            .catch(error => {
              console.log('views/systemcenter/companymanagement/companyInfo.vue-submitForm:' + error);
            });
        }).catch(() => {});
      },
      // 点击选项卡
      tabClick() {
        if (this.tabActive == 1) {
          this.getCompanyContractAll();
        } else {
          this.getCompanyBankList();
        }
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
