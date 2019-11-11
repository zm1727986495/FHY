<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-form :model="form" ref="form" label-width="90px">
      <el-form-item label="字典名称" style="float: left;">
        <el-input @keyup.enter.native="handleFilter" style="width: 180px;" class="filter-item" placeholder="字典名称" v-model="listQuery.dictName"> </el-input>
      </el-form-item>
      <el-form-item label="字典类型" style="float: left;">
        <el-input @keyup.enter.native="handleFilter" style="width: 180px;" class="filter-item" placeholder="字典类型" v-model="listQuery.dataType"> </el-input>
      </el-form-item>
      <el-form-item label="是否系统" style="float: left;">
        <el-select class="filter-item" v-model="listQuery.isSys" placeholder="请选择" style="width: 80px;">
            <el-option value="">全部</el-option>
            <el-option v-for="item  in  isSysList" :key="item.code" :label="item.title" :value="item.code"> </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="状态" style="float: left;">
        <el-select class="filter-item" v-model="listQuery.dictStatus" placeholder="请选择" style="width: 80px;">
          <el-option value="">全部</el-option>
            <el-option v-for="item in  dictStatus" :key="item.code" :label="item.title" :value="item.code"> </el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" style="margin-left: 20px;">搜索</el-button>
    <el-button class="filter-item"  v-if="dictManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="序号" width="64"> <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template> </el-table-column>
    <el-table-column width="200" align="center" label="字典名称"> <template slot-scope="scope">
        <span>{{scope.row.dictName}}</span>
      </template> </el-table-column>
    <el-table-column width="200" align="center" label="字典类型"> <template slot-scope="scope">
            <span>{{scope.row.dataType}}</span>
          </template> </el-table-column>
    <el-table-column width="110" align="center" label="系统字典"> <template slot-scope="scope">
            <span>{{changeValue(scope.row.isSys)}}</span>
          </template> </el-table-column>
    <el-table-column width="80" align="center" label="状态"> <template slot-scope="scope">
            <span>{{changeDictStatus(scope.row.dictStatus)}}</span>
          </template> </el-table-column>
    <el-table-column width="180" align="center" label="更新时间"> <template slot-scope="scope">
      <span>{{scope.row.updateTime}}</span>
    </template> </el-table-column>
    <!-- <el-table-column width="300" align="center" label="备注信息"> <template slot-scope="scope">
        <span>{{scope.row.description}}</span>
      </template> </el-table-column> -->
    <el-table-column align="center" label="操作" width="280"> <template slot-scope="scope">
        <el-button v-if="dictManager_btn_add" v-show="scope.row.isSys=='0'" size="small" type="success" @click="handleAdd(scope.row)">新增
        </el-button>
        <el-button v-if="dictManager_btn_view" size="small" type="success" @click="handleSearch(scope.row)">查看
        </el-button>
        <el-button v-if="dictManager_btn_edit" v-show="scope.row.isSys=='0'" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="dictManager_btn_del" v-show="scope.row.isSys=='0'" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form1" label-width="100px">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="form.dictName" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="dataType">
        <el-input v-model="form.dataType" placeholder="请输入字典类型"></el-input>
      </el-form-item>
      <el-form-item label="是否系统" prop="isSys">
        <el-select class="filter-item" v-model="isSys" placeholder="请选择" style="width: 80px;" disabled>
            <el-option v-for="item in  isSysList" :key="item.code" :label="item.title" :value="item.code"> </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.dataDesc"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form1')">取 消</el-button>
      <el-button v-loading.fullscreen.lock="fullscreenLoading" v-if="dialogStatus=='create'" type="primary" @click="create('form1')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form1')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
    <el-form :model="form2" :rules="rules" ref="form2" label-width="100px">
      <!-- <el-form-item label="字典名称" prop="dictName" v-show="false">
        <el-input v-model="form2.dictName"  placeholder="请输入字典名称"></el-input>
      </el-form-item> -->
      <el-form-item label="字典类型" prop="dataType" v-show="false">
        <el-input v-model="form2.dataType" placeholder="请输入字典类型"></el-input>
      </el-form-item>
      <el-form-item label="是否系统" prop="isSys" v-show="false">
        <el-select class="filter-item" v-model="form2.isSys" placeholder="请选择" style="width: 80px;">
            <el-option v-for="item in  isSysList" :key="item.code" :label="item.title" :value="item.code"> </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="form2.dictName" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典编码" prop="dataCode">
        <el-input v-model="form2.dataCode" placeholder="请输入字典编码"></el-input>
      </el-form-item>
      <el-form-item label="字典键值" prop="dataValue">
        <el-input v-model="form2.dataValue" placeholder="请输入字典键值"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortNo">
        <el-input v-model="form2.sortNo" placeholder="请输入字典顺序"></el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form2.dataDesc"> </el-input>
      </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="childrenCancel('form2')">取 消</el-button>
      <el-button v-loading.fullscreen.lock="fullscreenLoading" v-if="dialogStatus=='create'" type="primary" @click="childrenCreate('form2')">确 定</el-button>
      <el-button v-else type="primary" @click="childrenUpdate('form2')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDictDate">
    <el-table :key='tableKey' :data="tableData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"> 
      <el-table-column width="200" align="center" label="字典名称" prop="dictName"> </el-table-column>
      <el-table-column width="200" align="center" label="字典编码" prop="dataCode"> </el-table-column>
      <el-table-column width="180" align="center" label="字典键值" prop="dataValue"> </el-table-column>
      <el-table-column width="90" align="center" label="排序" prop="sortNo"> </el-table-column>
      <el-table-column align="center" label="操作"> 
        <template slot-scope="scope">
          <div v-if="scope.row.isSys=='0'">
            <el-button v-if="dictManager_btn_edit" size="small" type="success" @click="handleChildrenUpdate(scope.row)">编辑</el-button>
            <el-button v-if="dictManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template> 
      </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="dialogHandleSizeChange" @current-change="handleCurrentChange2" :current-page.sync="list2.page" :page-sizes="[10,20,30, 50]" :page-size="list2.limit" layout="total, sizes, prev, pager, next, jumper" :total="list2Total"> </el-pagination>
  </div>
  </el-dialog>
</div>
</template>

<script>
// import { Loading } from 'element-ui';
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from 'api/admin/dictionary/index';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      form: {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined,
      },
      form2: {
       
      },
      rules: {
        dictName: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }
        ],
        dataType: [
          {
            required: true,
            message: '请输入字典类型',
            trigger: 'blur'
          }
        ]
      },
      dictStatus:'',
      dataDesc:'',
      dictName:'',
      dataType:'',
      sortNo:'',
      dataValue:'',
      dataCode:'',
      list: null,
      list2: {
        page: 1,
        limit: 10,
        pid:''
      },
      list2Total:10,
      tableData:[],
      list3: null,
      total: null,
      listLoading: true,
      isSys: 0,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        isSys: 0,
        dictStatus:1,
      },
      sexOptions: ['男', '女'],
      isSysList:[{code: 1,title: '是'}, {code: 0,title: '否'}],
      dictStatus:[{code: 1,title:'正常'},{code: 0,title: '停用'}],
      dialogFormVisible: false,
      dialogDictDate:false,
      dialogVisible: false,
      isSys: '0',
      dialogStatus: '',
      // userManager_btn_edit: false,
      // userManager_btn_del: false,
      // userManager_btn_add: false,
      dictManager_btn_add: false,
      dictManager_btn_view: false,
      dictManager_btn_edit: false,
      dictManager_btn_del: false,
      textMap: {
        update: '编辑',
        create: '创建',
        search: '查看'
      },
      tableKey: 0,fullscreenLoading: false,
      id:''
    }
  },
  created() {
    this.getList();
    this.dictManager_btn_add = this.elements['dictManager:btn_add'];
    this.dictManager_btn_view = this.elements['dictManager:btn_view'];
    this.dictManager_btn_edit = this.elements['dictManager:btn_edit'];
    this.dictManager_btn_del = this.elements['dictManager:btn_del'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.page = 1;
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    dialogHandleSizeChange(val){
      this.list2.page = 1;
      this.list2.limit=val;
      getObj(this.list2)
      .then(response => {
        this.tableData = response.data.rows;
        this.list2Total = response.data.total;
        this.dialogStatus = 'search';
        this.dialogDictDate = true;
      });
    },
    handleCurrentChange2(val) {
      this.list2.page = val;
      getObj(this.list2)
      .then(response => {
        this.tableData = response.data.rows;
        this.list2Total = response.data.total;
        this.dialogStatus = 'search';
        this.dialogDictDate = true;
      });
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleAdd(row){
      this.list2.pid=row.id;
      getObj(this.list2)
      .then(response => {
      this.form2 =  Object.assign({},row);;
      this.form2.sortNo = undefined;
      this.form2.dataDesc = undefined;
      this.form2.dictName = undefined;
      this.dialogStatus = 'create';
      this.dialogVisible = true;
      });
    },handleChildrenUpdate(row){
      this.id=row.id;
      var param = {"id":row.id};
      getObj(param)
      .then(response => {
        this.form2 = response.data.rows[0];
        this.dialogStatus = 'update';
        this.dialogVisible = true;
      });
    },
    handleSearch(row){
      console.log(row)
      this.list2.pid=row.id;
      // this.isSys = '';
      this.isSys = row.isSys;
      getObj(this.list2)
      .then(response => {
      this.tableData = response.data.rows;
      this.list2Total = response.data.total;
      this.dialogStatus = 'search';
      this.dialogDictDate = true;
      });
    },
    handleUpdate(row) {
      this.id=row.id;
      var param = {"id":row.id};
      getObj(param)
        .then(response => {
          this.form = response.data.rows[0];
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              getObj(this.list2)
                .then(response => {
                this.tableData = response.data.rows;
                this.list2Total = response.data.total;
                this.dialogStatus = 'search';
                this.dialogDictDate = true;
              });
            });
        });
    },
    create(formName) {
      // this.fullscreenLoading = true;
      // Loading.service('zrd');
      const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('.div1')
    });
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.form.isSys = this.isSys;
          addObj(this.form)
            .then(() => {
              loading.close()
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    childrenCancel(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    childrenCreate(formName) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.div1')
      });
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.form2.pid = this.list2.pid;
          this.form2.id = null;
          addObj(this.form2)
            .then(() => {
              loading.close()
              this.dialogVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
        } else {
          return false;
        }
      });
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.form.isSys = this.isSys;
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    childrenUpdate(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          var pid ={"id":this.list2.pid};
          this.dialogVisible = false;
          putObj(this.form2.id, this.form2).then(() => {
            this.dialogVisible = false;
            this.handleSearch(pid);
            this.getList();
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    changeValue(value){
      if(value==1){
        return '是'
      }else{
        return '否'
      }
    },
    changeDictStatus(value){
      if(value==1){
        return '正常'
      }else{
        return '停用'
      }
    },
    resetTemp() {
      this.form = {
      };
    }
  }
}
</script>
