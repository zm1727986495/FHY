<template>
<el-row>
  <el-col :span="24">
    <el-button-group>
      <el-button type="primary" v-if="groupManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
      <el-button type="primary" v-if="groupManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
      <el-button type="primary" v-if="groupManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
        <icon-svg icon-class="quanxian1"></icon-svg>权限分配</el-button>
      <el-button type="primary" v-if="groupManager_btn_userManager" @click="handlerUser">
        <icon-svg icon-class="27"></icon-svg>关联用户
      </el-button>
      <el-button type="primary" v-if="groupManager_btn_userManager2" @click="handlerUser2">
        <icon-svg icon-class="27"></icon-svg>关联用户
      </el-button>
      <el-button type="primary" v-if="groupManager_btn_dataJurisdiction" @click="dataJurisdiction">
          数据权限
      </el-button>
      <el-button type="primary" v-if="groupManager_branch" @click="handleBranch">
          关联部门
      </el-button>
      <el-button type="primary" v-if="groupManager_user" @click="handleUsers">
          关联角色
      </el-button>
    </el-button-group>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all> </el-tree>
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" v-if="groupManager_btn_edit" @click="update">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" v-if="groupManager_btn_add" @click="create">保存</el-button>
        <el-button @click="onCancel   ">取消</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible">
    <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
  </el-dialog>
  <el-dialog :title="dialogAuthorityName" size="large" :visible.sync="dialogAuthorityVisible">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>
  <el-dialog  size="large" :visible.sync="dialogUser">
    <groupUsers></groupUsers>
  </el-dialog>
  <el-dialog  size="large" :visible.sync="dialogBranch">
    <groupBranch></groupBranch>
  </el-dialog>
  

  <el-dialog :visible.sync="selectedPersonnel" title="关联用户">
      <div class="queryForm">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input placeholder="人员编号/名称" v-model="formList.names"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button size="medium" class="button-fc" type="warning" @click="searchTable">查询</el-button>
            <el-button type="primary" @click="addNew" size="medium">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" border>
        <el-table-column align="center" show-overflow-tooltip label="人员编号" prop="userNumber"></el-table-column>
        <el-table-column align="center" label="人员名称" prop="userName"></el-table-column>
        <el-table-column align="center" label="权限类型" prop="groupType">
          <template slot-scope="scope">
            <div v-if="scope.row.groupType==0">本人</div>
            <div v-if="scope.row.groupType==1">本组织</div>
            <div v-if="scope.row.groupType==2">组织机构</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userPost" label="岗位"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteRows(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination_wrap">
          <pagination
              :current-page="formList.page"
              :pageSize="formList.limit"
              :total="total"
              @sizeChange="sizeChange"
              @currentChange="currentChange">
          </pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectedPersonnel = false">确 定</el-button>
        <el-button @click="selectedPersonnel = false">取 消</el-button>
      </span>
  </el-dialog>
  <el-dialog :visible.sync="dialog" title="新增">
    <div class="queryForm">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="人员编号/名称" v-model="formList2.names"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="medium" class="button-fc" type="warning" @click="searchTable2">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData2" border @selection-change="selectChange">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" show-overflow-tooltip label="人员编号" prop="userNumber"></el-table-column>
      <el-table-column align="center" label="人员名称" prop="userName"></el-table-column>
      <el-table-column align="center" prop="userPost" label="岗位"></el-table-column>
    </el-table>
    <div class="pagination_wrap">
        <pagination
            :current-page="formList2.page"
            :pageSize="formList2.limit"
            :total="total2"
            @sizeChange="sizeChange2"
            @currentChange="currentChange2">
        </pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="dialog = false">取 消</el-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="dataJurisdictionTree" title="数据权限" width="500px">
    <groupDataJurisdiction :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupDataJurisdiction"></groupDataJurisdiction>
  </el-dialog>


</el-row>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj,
  listGroupUser,
  editGroupUser
} from 'api/admin/group/index';
import { mapGetters } from 'vuex';
import groupBranch from './groupBranch'
import groupUsers from './groupUsers'
import pagination from '@/views/components/pagination';
import groupDataJurisdiction from "./groupDataJurisdiction.vue"
export default {
  name: 'groupDetail',
  components: {
    'group-user': () => import('./groupUser'),
    'group-authority': () => import('./groupAuthority'),
    groupBranch,
    groupUsers,
    pagination,
    groupDataJurisdiction
  },
  props: {
    type: {
      default: '1'
    }
  },
  data() {
    return {
      tableData:[
      ],
      tableData2:[],
      total:10,
      total2:10,
      dialog:false,
      formList:{
        page:1,
        limit:10,
        names:'',
        groupId:'',
        groupType:0,
      },
      formList2:{
        page:1,
        limit:10,
        names:'',
        groupId:'',
        groupType:1,
      },
      types:false,
      radios:0,
      rowsData:[],
      dataJurisdictionTree:false,
      selectedPersonnel:false,

      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogUser:false,
      dialogBranch:false,
      dialogUserName: '关联用户',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      listQuery: {
        groupType: this.type,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: true,
      groupManager_btn_del: true,
      groupManager_btn_add: true,
      groupManager_btn_userManager: true,
      groupManager_btn_userManager2:false,
      groupManager_btn_resourceManager: true,
      groupManager_branch:true,
      groupManager_user:false,
      groupManager_btn_dataJurisdiction:false,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      },
      currentId: "",
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    },
  },
  created() {
    // console.log(this.elements)
    this.getList();
    this.changeButton
    // this.groupManager_btn_edit = this.elements['groupManager:btn_edit'];
    // this.groupManager_btn_del = this.elements['groupManager:btn_del'];
    // this.groupManager_btn_add = this.elements['groupManager:btn_add'];
    // this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
    // this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
    changeButton(){
     if(this.type==1){
       this.groupManager_btn_resourceManager=true;
       this.groupManager_branch=false;
       this.groupManager_btn_dataJurisdiction=true;
       this.groupManager_btn_userManager=true;
       this.groupManager_btn_userManager2=false;
     }else if(this.type==2){
        this.groupManager_btn_resourceManager=false;
        this.groupManager_branch=false;
        this.groupManager_btn_dataJurisdiction=false;
     }else if(this.type==4){
       this.groupManager_btn_userManager=false;
       this.groupManager_btn_userManager2=true;
       this.groupManager_btn_resourceManager=false;
       this.groupManager_branch=false;
       this.groupManager_btn_dataJurisdiction=false;
       this.groupManager_user=false;
     }
     return this.type;
    }
  },
  methods: {
    confirm(){
      let arr=[];
      this.rowsData.map((item,idx)=>{
        arr.push(Number(item.userId))
      })
      editGroupUser({
        editType:0,
        groupId:[this.currentId],
        groupType:this.radios,
        userId:arr,
      }).then(res=>{
        if(res.status==500){
          this.$message({
            message: '添加失败',
            type: 'error'
          });
        }else if(res.status==200){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.dialog = false;
        }
        this.existingStaff()
        this.types=false;
        this.dialog=false;
      })
    },
    dataJurisdiction(){
      if(this.currentId){
        this.dataJurisdictionTree = true;
        if (this.$refs.groupDataJurisdiction !== undefined) {
          this.$refs.groupDataJurisdiction.groupId = this.currentId;
          this.$refs.groupDataJurisdiction.initAuthoritys();
        }
      }else{
        this.$message({
          message: '请选择角色后再配置数据权限',
          type: 'warning'
        });
      }
      
    },
    notSelectedUserPage(){
      this.formList2.groupId=this.currentId;
      listGroupUser(this.formList2).then(res=>{
        this.tableData2=res.data.rows;
        this.total2=res.data.total;
      })
    },
    sizeChange2(val){
      this.formList2.page=1;
      this.formList2.limit=val;
      this.notSelectedUserPage()
    },
    currentChange2(val){
      this.formList2.page=val;
      this.notSelectedUserPage()
    },
    searchTable2(){
      this.formList2.page=1;
      this.notSelectedUserPage()
    },
    selectChange(val){
      this.rowsData=val;
    },
    deleteRows(val){
      editGroupUser({
        editType:1,
        groupId:[this.currentId],
        userId:[val.userId]
      }).then(res=>{
        if(res.status==500){
          this.$message({
            message: '删除失败',
            type: 'error'
          });
        }else if(res.status==200){
          this.existingStaff()
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      })
    },
    existingStaff(){
      listGroupUser(this.formList).then(res=>{
        this.tableData=res.data.rows;
        this.total=res.data.total;
      })
    },
    searchTable(){
      this.formList.page=1;
      this.existingStaff()
    },
    sizeChange(val){
      this.formList.page=1;
      this.formList.limit=val;
      this.existingStaff()
    },
    currentChange(val){
      this.formList.page=val;
      this.existingStaff()
    },
    addNew(){
      this.dialog=true;
      this.notSelectedUserPage()
    },
    handlerUser2(){
      console.log(111)
      if(this.currentId){
        this.formList.groupId=this.currentId;
        this.existingStaff();
        this.selectedPersonnel=true;
      }else{
        this.$message({
          message: '请选择组织机构后再配置关联用户',
          type: 'warning'
        });
      }
      
    },
    handlerUser() {
      if(this.currentId){
        this.dialogUserVisible = true;
        if (this.$refs.groupUser !== undefined) {
          this.$refs.groupUser.groupId = this.currentId;
          this.$refs.groupUser.initUsers();
        }
      }else{
        this.$message({
          message: '请选择角色后再配置关联用户',
          type: 'warning'
        });
      }
      
    },
    handleUsers(){
      this.dialogUser=true
    },
    handleBranch(){
      this.dialogBranch=true;
    },
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      console.log(data)
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    update() {
      putObj(this.form.id, this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    create() {
      addObj(this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = '';
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      };
    },
    handlerAuthority() {
      this.dialogAuthorityVisible = true;
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId;
        this.$refs.groupAuthority.initAuthoritys();
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeAuthorityDialog() {
      this.dataJurisdictionTree = false;
    }
  }
}
</script>
