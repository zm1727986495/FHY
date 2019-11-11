<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom10">
        <div class="queryForm">
          <el-row :gutter="10">
            <el-col :span="span">
              <el-input v-model.trim="queryForm.searchtext" clearable placeholder="公司名称 公司编号" :size="size" @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="span">
              <el-button type="warning" class="button-fc" @click="searchFun" :size="size">查询</el-button>
              <el-button type="primary" @click="resetQueryForm" :size="size">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 按钮-表格-分页-->
      <el-card class="attribute">
        <div class="m-bottom10">
          <el-button v-for="(item,index) in actionBtnList" :type="item.style" :size="btnSize" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" v-if="item.isHasAuthority">{{item.name}}</el-button>
        </div>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableList" :row-class-name="tableRowClassName" :max-height="maxHeight">
            <el-table-column align="center" prop="companyNumber" label="公司编号" sortable width="210" show-overflow-tooltip fixed="left">
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow >
                    <div slot="content" class="tips tipFon">
                      <p @click="handleEdit(scope.row)" class="operaItems" v-if="btn_editCompany">编辑</p>
                      <p @click="handleDelete(scope.row)" class="operaItems" v-if="btn_delCompany">删除</p>
                    </div>
                    <img :src="spot" alt="" class="attributesTips">
                  </el-tooltip>
                  <p class="operation">{{scope.row.companyNumber}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="companyName" label="公司名称" min-width="200" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="handleView(scope.row)">{{scope.row.companyName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="联系人" min-width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="phone" label="联系电话" min-width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="organizationName" label="对应组织结构" min-width="130" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="companyBelong" label="公司归属" min-width="120" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <p v-if="scope.row.companyBelong == 0">内部</p>
                <p v-if="scope.row.companyBelong == 1">外部</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="是否有服务合同" min-width="150" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.isContract ? '是' : '否' }}</span>
              </template>
            </el-table-column>
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
    </div>
    <!-- 新建公司 -->
     <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px" custom-class="customDialogTitle" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth" :status-icon="true" :size="size">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="ruleForm.companyName" clearable placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="公司归属" prop="companyBelong">
          <el-radio-group v-model="ruleForm.companyBelong">
            <el-radio :label="0">内部</el-radio>
            <el-radio :label="1">外部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对应组织结构" prop="organizationName">
          <el-input v-model="ruleForm.organizationName" placeholder="请选择组织结构" readonly @focus="selectOrganization"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--组织机构-->
    <organizationdia
      :visible="organizationDialogVisible"
      v-if="organizationDialogVisible"
      :defaultOpenArr="defaultOpenArr"
      @close_org="closetree"
    ></organizationdia>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import { mapGetters } from 'vuex';
  import { listCompanyByPage, addCompany, editCompany, delCompany } from 'src/api/systemcenter/companymanagement';
  import organizationdia from '@/views/systemcenter/department/components/organizationdia';
  import { listParentOrganizedId, getUUID } from 'api/pulicJava';
  import spot from '@/assets/images/spot.png';
  export default {
    components: {
      breadcrumb,
      pagination,
      organizationdia
    },
    data() {
      return {
        spot,
        formLabelWidth: '120px',
        navList: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableList: [],
        loading: true,
        actionBtnList: [
          { name: '新建公司', style: 'default', url: '/add', type: 1, isHasAuthority: false },
          { name: '新建合同', style: 'default', url: '/company/contractadd', type: 2, isHasAuthority: false }
        ],
        btn_editCompany: false,
        btn_delCompany: false,
        btn_viewCompany: false,
        queryForm: {
          searchtext: ''
        },
        isAdd: 1, // 1、添加 0、编辑
        dialogTitle: '',
        dialogFormVisible: false,
        innerDialog: false,
        multipleSelection: [],
        organizationId: '',
        organizationName: '',
        defaultOpenArr: [], // 组织机构回显
        organizationDialogVisible: false, // 组织机构弹出层
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        ruleForm: {
          companyId: '',
          companyName: '',
          companyBelong: '',
          organizationName: '',
          organizationId: '',
          companyNuber: ''
        },
        rules: {
          companyName: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          companyBelong: [
            { required: true, message: '请选择公司归属', trigger: 'change' }
          ],
          organizationName: [
            { required: true, message: '请选择组织结构', trigger: 'change' }
          ]
        }
      }
    },
    // created() {
    //   this.initBtnElements();
    //   this.getData();
    // },
    // mounted() {
    //   // 头部面包屑
    //   this.navList = this.$route.meta;
    // },
    activated(){
      this.initBtnElements();
      this.getData();
      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.actionBtnList[0].isHasAuthority = element['company:btn_addCompany'];
        this.actionBtnList[1].isHasAuthority = element['company:btn_addContract'];
        this.btn_editCompany = element['company:btn_editCompany'];
        this.btn_delCompany = element['company:btn_delCompany'];
        this.btn_viewCompany = element['company:btn_viewCompany'];
      },
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
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type == 1) { // 弹框
          this.handleAdd();
        } else if (type == 2) { // 页面跳转
          this.$router.push({
            path: url
          });
        }
      },
      // 获取公司编号
      getUUID() {
        let uuidParams = {
          serialNumber: 'T'
        }
        getUUID(uuidParams)
          .then(response => {
            this.ruleForm.companyNumber = response.data;
          })
          .catch(error => {
            console.log('views/systemcenter/shopmanagement/addshop.vue-getUUID:' + error);
          })
      },
      // 获取列表信息
      getData() {
        this.loading = true;
        const params = {
          names: this.queryForm.searchtext,
          page: this.currentPage,
          limit: this.pageSize
        }
        listCompanyByPage(params)
          .then(response => {
            this.loading = false;
            const result = response.data;
            this.tableList = result.rows;
            this.total = result.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('company/listCompanyByPage:' + error);
          });
      },
      // 查询按钮点击
      searchFun() {
        this.currentPage = 1;
        this.getData();
      },
      // 重置
      resetQueryForm() {
        this.currentPage = 1;
        this.queryForm.searchtext = '';
        this.getData();
      },
      // 新建公司按钮点击
      handleAdd() {
        this.organizationName = '';
        this.organizationId = '';
        this.ruleForm = {
          companyId: '',
          companyName: '',
          companyBelong: '',
          organizationName: '',
          organizationId: '',
          companyNumber: ''
        }
        this.resetForm('ruleForm');
        this.isAdd = 1;
        this.dialogTitle = '新建公司';
        this.getUUID();
        this.dialogFormVisible = true;
      },
      // 编辑 弹出层
      handleEdit(row) {
        this.resetForm('ruleForm');
        this.isAdd = 0;
        this.dialogTitle = '编辑公司';
        this.dialogFormVisible = true;
        row.companyBelong = row.companyBelong;
        if (row.organizationId) {
          this.getOrganizationParentList(row.organizationId);
        }
        Object.assign(this.ruleForm, row);
      },
      // 选择组织结构
      selectOrganization() {
        this.organizationDialogVisible = true;
      },
      // 组织机构获取当前节点所有父节点
      getOrganizationParentList(organizedId) {
        let params = {
          organizedId
        }
        listParentOrganizedId(params)
          .then(response => {
            this.defaultOpenArr = response.data.split(',').map(Number).reverse();
          })
          .catch(error => {
            console.log('addShop-公共接口获取当前组织机构所有父节点')
          })
      },
      // 选择组织结构确认
      closetree(obj, arr) {
        if (obj) {
          this.ruleForm.organizationName = obj.label;
          this.ruleForm.organizationId = obj.id;
          this.defaultOpenArr = arr;
        }
        this.organizationDialogVisible = false;
      },
      // 点击删除按钮
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          let params = {
            companyId: row.companyId
          }
          delCompany(params)
            .then(response => {
              this.$message.success('删除成功');
              this.getData();
            })
            .catch(error => {
              console.log('/store/listStore:' + error);
            });
        }).catch(() => {});
      },
      // 点击查看按钮
      handleView(row) {
        this.$router.push({
          path: '/company/companyinfo',
          query: { companyId: row.companyId }
        });
      },
      //  选择组织结构
      confirm() {
        if (this.organizationId) {
          this.ruleForm.organizationName = this.organizationName;
          this.ruleForm.organizationId = this.organizationId;
          this.innerDialog = false;
          return;
        }
        this.$message.warning('请选择组织机构');
      },
      //  提交表单
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let fn = this.isAdd ? addCompany : editCompany;
            let statusText = this.isAdd ? '添加' : '编辑';
            fn(this.ruleForm)
              .then(response => {
                this.$message.success(statusText + '成功');
                this.dialogFormVisible = false;
                if (this.isAdd) {
                  this.currentPage = 1;
                }
                this.getData();
              })
              .catch(error => {
                console.log('views/systemcenter/companymanagement/companyList-submitForm:' + error);
              });
          } else {
            return false;
          }
        });
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

