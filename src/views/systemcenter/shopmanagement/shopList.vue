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
            <el-col :span="6">
              <el-input v-model.trim="queryForm.storeNumber" clearable placeholder="门店编号" :size="size" @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model.trim="queryForm.storeName" clearable placeholder="门店名称" :size="size"  @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model.trim="queryForm.address" clearable placeholder="地址" :size="size"  @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="warning" class="button-fc" @click="searchFun" :size="size">查询</el-button>
              <el-button type="primary" @click="resetQueryForm" :size="size">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="m-bottom10">
          <el-button v-for="(item,index) in actionBtnList" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" :size="btnSize" v-if="item.isHasAuthority">{{item.name}}</el-button>
        </div>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableList" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight">
            <el-table-column align="center" type="selection" width="40" :selectable="selectable"></el-table-column>
            <el-table-column align="center" prop="storeNumber" label="门店编号" width="180" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow >
                    <div slot="content" class="tips tipFon">
                      <p @click="handleEdit(scope.row)" class="operaItems" v-if="btn_edit">编辑</p>
                      <p @click="handleClose(scope.row)" class="operaItems" v-if="scope.row.isClose != 1 && btn_close">关闭</p>
                    </div>
                    <img :src="spot" alt="" class="attributesTips">
                  </el-tooltip>
                  <p class="operation">{{scope.row.storeNumber}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="storeName" label="门店名称" width="250" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="storeLeader" label="店长" sortable></el-table-column>
            <el-table-column align="center" prop="employeeNum"  label="店内人员数" sortable></el-table-column>
            <el-table-column align="center" prop="organizationName" label="对应组织结构" sortable width="180"></el-table-column>
            <el-table-column align="center" prop="status" label="门店状态" sortable :filters="statusList" :filter-method="filterStatus">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 359">营业中</span>
                <span v-else-if="scope.row.status == 360">停止营业</span>
                <span v-else-if="scope.row.status == 361">筹备中</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createName" label="创建人" sortable></el-table-column>
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
    <!--关闭门店-->
    <el-dialog title="关闭门店" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth" :size="size">
        <el-form-item label="关闭日期" prop="overTime">
          <el-date-picker
            v-model="ruleForm.overTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关闭原因" prop="closeReason">
          <el-input v-model="ruleForm.closeReason" placeholder="请输入关闭原因" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import { mapGetters } from 'vuex';
  import { getNames, getTypes } from 'src/utils/pubilcFn';
  import { listBaseDict } from 'api/pulicJava';
  import { listStore, closeStore } from 'src/api/systemcenter/storemanagement';
  import spot from '@/assets/images/spot.png';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        btn_add: false,
        btn_edit: false,
        btn_close: false,
        spot,
        formLabelWidth: '100px',
        loading: true,
        navList: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
          }
        },
        statusList: [
          { value: 1, text: '营业中' },
          { value: 2, text: '停止营业' },
          { value: 3, text: '筹备中' }
        ],
        tableList: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        mutipleSelectionStore: [],
        actionBtnList: [
          { name: '新增门店',style: 'default',url: '/store/shopadd',type: 2, isHasAuthority: false },
          { name: '关闭门店',style: 'default',url: '/closeShop',type: 1, isHasAuthority: false }
        ],
        dialogFormVisible: false,
        queryForm: {
          storeNumber: '',
          storeName: '',
          address: ''
        },
        ruleForm: {
          storeId: '',
          overTime: '',
          closeReason: '',
          isClose: 1
        },
        rules: {
          overTime: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          closeReason: [
            { required: true, message: '请输入关闭原因', trigger: 'blur' }
          ]
        }
      }
    },
    // created() {
    //   this.getBaseDict();
    //   this.getData();
    //   this.initBtnElements();
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    activated(){
      this.getBaseDict();
      this.getData();
      this.initBtnElements();
      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_add = element['shop:btn_add'];
        this.btn_edit = element['shop:btn_edit'];
        this.btn_close = element['shop:btn_close'];
        this.actionBtnList[0].isHasAuthority = element['shop:btn_add'];
        this.actionBtnList[1].isHasAuthority = element['shop:btn_close'];
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
      // 获取门店状态
      getBaseDict() {
        let params = {
          dataType: 'WORK_STATUS'
        }
        listBaseDict(params)
          .then(response => {
            response.data.forEach(item => {
              item.value = item.id;
              item.text = item.dictName;
            })
            this.statusList = response.data;
          })
          .catch(error => {
            console.log('views/systemcenter/shopmanagement/shopList.vue-getBaseDict:' + error)
          })
      },
      filterStatus(value, row, column){
        const property = column['property'];
        return row[property] === value;
      },
      // 获取列表信息
      getData() {
        this.loading = true;
        let params = {
          storeNumber: this.queryForm.storeNumber,
          storeName: this.queryForm.storeName,
          address: this.queryForm.address,
          page: this.currentPage,
          limit: this.pageSize
        }
        listStore(params)
          .then(response => {
            this.loading = false;
            const result = response.data;
            this.tableList = result.rows;
            this.total = result.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('store/listStore:' + error);
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
        for (let keys in this.queryForm) {
          this.queryForm[keys] = '';
        }
        this.getData();
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type === 1) { // 终止门店
          this.handleCloseStore();
        }
        if (type == 2) {
          this.$router.push({
            path: url
          });
        }
      },
      // 点击编辑
      handleEdit(row) {
        this.$router.push({
          path: '/store/shopadd',
          query: {
            storeId: row.storeId
          }
        });
      },
      // 列表内点击关闭按钮
      handleClose(row){
        this.resetForm('ruleForm');
        this.ruleForm.storeId = row.storeId;
        this.dialogFormVisible = true;
      },
      // 是否可选
      selectable(row, index) {
        return row.isClose != 1
      },
      // 勾选函数回调
      handleSelectionChange(val) {
        this.mutipleSelectionStore = val;
      },
      // 点击关闭门店按钮
      handleCloseStore() {
        if (!this.mutipleSelectionStore.length) {
          this.$message.warning('请选择门店');
        } else if (this.mutipleSelectionStore.length > 1) {
          this.$message.warning('只能选择一个门店');
        } else {
          this.resetForm('ruleForm');
          this.ruleForm = {
            storeId: '',
            overTime: '',
            closeReason: '',
            isClose: 1
          }
          this.dialogFormVisible = true;
        }
      },
      // 关闭门店 提交表单
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            closeStore(this.ruleForm)
              .then(response => {
                this.$message.success('操作成功');
                this.dialogFormVisible = false;
                this.getData();
              })
              .catch(error => {
                console.log('store/updateStore(closeStore):' + error);
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

