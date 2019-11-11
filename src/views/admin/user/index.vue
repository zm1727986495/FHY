<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name"> </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="账户" v-model="listQuery.username"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  v-if="userManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" v-if="initAllPassword" style="margin-left: 10px;" type="primary" @click="initPassword">初始化密码</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65"> <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template> </el-table-column>
      <el-table-column width="200" align="center" label="姓名"> <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template> </el-table-column>
      <el-table-column width="110" align="center" label="账户"> <template slot-scope="scope">
        <span>{{scope.row.username}}</span>
      </template> </el-table-column>
      <el-table-column width="110" align="center" label="性别"> <template slot-scope="scope">
        <span>{{scope.row.sex}}</span>
      </template> </el-table-column>
      <el-table-column width="300" align="center" label="备注"> <template slot-scope="scope">
        <span>{{scope.row.description}}</span>
      </template> </el-table-column>
      <el-table-column width="180" align="center" label="最后时间"> <template slot-scope="scope">
        <span>{{scope.row.updTime}}</span>
      </template> </el-table-column>
      <el-table-column width="200" align="center" label="最后更新人"> <template slot-scope="scope">
        <span>{{scope.row.updName}}</span>
      </template> </el-table-column>
      <el-table-column align="center" label="操作"> 
        <template slot-scope="scope">
        <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <!-- <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button> -->
          <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <!-- <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
          <el-button v-if="userManager_btn_psd" size="small" @click="changePassword(scope.row)">更改密码</el-button>
          <el-button  size="small" @click="handleUser(scope.row)" v-if="userManager_btn_user">
              所属角色
          </el-button>
          <el-button  size="small" @click="handleData(scope.row)">
              数据权限
          </el-button>
        </template> 
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <div class="pagination_wrap">
            <pagination
                :current-page="listQuery.page"
                :pageSize="listQuery.limit"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入英文名"></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="username">
          <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
          <el-input v-else v-model="form.username" placeholder="请输入账户" readonly></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
          <el-input type="form.password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item  label="岗位"  prop="baseDictId">
          <el-select class="filter-item" v-model="form.baseDictId" placeholder="请选择">
            <el-option v-for="(item,idx) in  dict" :key="idx" :label="item.dictName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗等"  prop="basePostRankId">
          <el-select class="filter-item" v-model="form.basePostRankId" placeholder="请选择">
            <el-option v-for="(item,idx) in rank" :key="idx" :label="item.dictName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="岗级" >
          <el-select class="filter-item" v-model="form.basePostGradeId" placeholder="请选择">
            <el-option v-for="(item,idx) in level" :key="idx" :label="item.dictName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="性别">
          <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
            <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="telPhone">
          <el-input v-model="form.telPhone" placeholder="请输入手机"></el-input>
        </el-form-item>
        <el-form-item label="办公电话" prop="mobilePhone">
          <el-input v-model="form.mobilePhone" placeholder="请输入办公电话"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="userDialog">
      <div>
        <div class="titlecals">所属角色</div>
          <div>
            <div class="search_ipt" style="width:120px;display:inline-block">
              <el-input v-model="groupName"></el-input>
            </div>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="success" @click="associationRole">关联角色</el-button>
            <el-button @click="deleteRows">删除</el-button>
          </div>
          <div class="m-top20 lvs">
            <el-table
            border
            style="width:100%"
            @selection-change="chooseChange"
            :row-class-name="tableRowClassName"
            :data="tableData">
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column  prop="id" align="center" label="序号"></el-table-column>
              <el-table-column  prop="NAME" align="center" label="名称"></el-table-column>
              <el-table-column  prop="type" align="center" label="状态" :filters="statusList" :filter-method="filterHandler">
                <template slot-scope="scope">
                    {{scope.row.type==0?"非关联":"关联"}}
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination_wrap">
              <pagination
                  :current-page="listUserGroup.page"
                  :pageSize="listUserGroup.limit"
                  :total="listUserGroup.total"
                  @sizeChange="dialogSizeChange"
                  @currentChange="dialogCurrentChange">
              </pagination>
            </div>
          </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="diaLog" width="500px">
      <div class="titlecals">查看数据权限</div>
      <organization :userId="userId" :diaLog="diaLog" @closeDialog="closeDialog"></organization>
        <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
    </el-dialog>
    <el-dialog title="更改密码" :visible.sync="passwordDialog" width="500px" @close="clearPassword" class="customDialogTitle">
      <el-form label-width="130px" :model="password" :rules="passwrodRules" ref="password">
        <el-form-item label="新密码" prop="passwordValue">
          <el-input v-model="password.passwordValue" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="password.confirmPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="passwordConfirm">确定</el-button>
        <el-button size="medium"  @click="passwordDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj,
    deleteUserGroup,
    addUserInfo,
    getUser,
    updateUser,
    listUser,
    listUserGroup,
    listOrganization,
    editUserInfo,
    addUserGroup,
    initUserPassWork
  } from 'api/admin/user/index';
  import {
    listBaseDict
  } from 'api/pulicJava'
  import { mapGetters } from 'vuex';
  import { getNames, getTypes } from 'src/utils/pubilcFn.js';
  import pagination from '@/views/components/pagination';
  import organization from './tree'
  export default {
    components:{
      pagination,
      organization
    },
    name: 'user',
    data() {
      return {
        statusList:[
          {
            value: 0,
            text: "非关联"
          },
           {
            value: 1,
            text: "已关联"
          }
        ],
        imageUrl: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        userDialog:false,
        diaLog:false,
        Institutional:false,
        passwordDialog:false,
        groupName:'',
        tableData:[
        ],
        form: {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          description: undefined,
          baseDictId:'',
          basePostRankId:'',
          basePostGradeId:'',
          telPhone:'',
          mobilePhone:'',
          email:''
        },
        listUserGroup:{
          page:1,
          limit:10,
          total:10
        },
        password:{
          passwordValue:"",
          confirmPassword:'',
        },
        passwrodRules:{
          passwordValue:[{
            required:true,
            message: '请输入密码'
          },{
            min: 6, 
            max: 20, 
            message: '密码长度必须在6-20位之间', 
            trigger: 'blur' 
          }],
          confirmPassword:[{
            required:true,
            message: '请确认密码'
          },{
            min: 6, 
            max: 20, 
            message: '密码长度必须在6-20位之间', 
            trigger: 'blur' 
          }]
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入用户',
              trigger: 'blur'
            },
          ],
          username: [
            {
              required: true,
              message: '请输入账户',
              trigger: 'blur'
            },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
          ],
          baseDictId:[
            {
              required: true,
              message:'请选择岗位',
              trigger: "change"
            }
          ],
          basePostRankId:[
            {
              required: true,
              message:'请选择岗等',
              trigger: "change"
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page:1,
          limit:10,
          name: '',
          username:'',
        },
        sexOptions: ['男', '女'],
        dialogFormVisible: false,
        dialogStatus: '',
        userManager_btn_edit: false,
        userManager_btn_del: false,
        userManager_btn_add: false,
        userManager_btn_psd: false,
        userManager_btn_user: false,
        initAllPassword:false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        fullscreenLoading: false,
        dict:[], //岗位
        rank:[], //岗等
        level:[],//岗级
        id:'',
        rowsData:[],
        userId:''
      }
    },
    created() {
      this.getList();
      this.userManager_btn_edit = this.elements['userManager:btn_edit'];
      this.userManager_btn_del = this.elements['userManager:btn_del'];
      this.userManager_btn_add = this.elements['userManager:btn_add'];
      this.userManager_btn_psd = this.elements["userManager:btn_psd"];
      this.userManager_btn_user = this.elements["userManager:btn_user"];
      this.initAllPassword = this.elements["initAllPassword"];
      
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      initPassword(){
         this.$confirm('此操作将初始化所有用户密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          initUserPassWork().then(res=>{
            this.$message({
              type: 'success',
              message: '初始化成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      clearPassword(){
        for(let i in this.password){
          this.password[i]="";
        }
      },
      passwordConfirm(){
        this.$refs.password.validate((valid) => {
          if (valid) {
            if(this.password.passwordValue===this.password.confirmPassword){
              editUserInfo({
                 password:this.password.passwordValue,
                 id:this.userId
              }).then(res=>{
                this.passwordDialog=false;
              })
              
            }else{
               this.$message({
                message: '两次密码不同',
                type: 'error'
              });
            }
          } else {
            return false;
          }
        });
        
      },
      changePassword(val){
        this.userId=val.id;
        this.passwordDialog=true;
      },
      tableRowClassName({row, rowIndex}) {//表格斑马线设置
          return rowIndex%2 != 0 ? 'el-f0' : '';
      },
      filterHandler(value, row, column) { //筛选方法调用
          const property = column['property'];
          return row[property] === value;                
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleNodeClick(data) {
        console.log(data);
      },
      handleData(row){
        this.userId=row.id
        this.diaLog=true;
        // listOrganization({
        //   userId:row.id,
        //   groupType:2,
        // }).then(res=>{
        //   
        //   this.data=res.data;
        // })
      },
      closeDialog(){
        this.diaLog=false;
      },
      chooseChange(row){
        this.rowsData=row;
      },
      dialogSizeChange(val){
          this.listUserGroup.page = 1;
          this.listUserGroup.limit = val;
          this.listUserGroupQuery()
      },
      dialogCurrentChange(val){
        this.listUserGroup.page = val;
          this.listUserGroupQuery()
      },
      search(){
        this.listUserGroup.page=1;
        this.listUserGroupQuery()
      },
      listUserGroupQuery(){
        listUserGroup(
          {
            page:this.listUserGroup.page,
            limit:this.listUserGroup.limit,
            userId:this.userId,
            groupName:this.groupName
          }
        ).then(res=>{
          this.tableData=res.data.rows;
          this.listUserGroup.total=res.data.total;
        })
      },
      handleUser(row){
        this.userDialog=true;
        this.userId=row.id;
        this.listUserGroupQuery()
      },
      associationRole(){
        
        if(this.rowsData.length!=0){
          // console.log(this.rowsData)
          let arr=[];
          this.rowsData.map((item,idx)=>{
            arr.push(item.id)
          })
          addUserGroup(
            {
              userId:this.userId,
              groupIds:arr.join(",")
            }
          ).then(res=>{
            this.$message({
              message: '关联成功',
              type: 'success'
            });
            this.listUserGroupQuery()
          })
        }else{
          this.$message({
            message: '请选择后在进行关联',
            type: 'warning'
          });
        }
      },
      deleteRows(){
        if(this.rowsData.length!=0){
          // console.log(this.rowsData)
          let arr=[];
          this.rowsData.map((item,idx)=>{
            arr.push(item.id)
          })
          deleteUserGroup(
            {
              userId:this.userId,
              groupIds:arr.join(",")
            }
          ).then(res=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.listUserGroupQuery()
          })
        }else{
          this.$message({
            message: '请选择后在进行删除',
            type: 'warning'
          });
        }
      },
      getList() {
        this.listLoading = true;
        listUser(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      currentChange(val) {
          this.listQuery.page = val;
          this.getList();
      //   this.getListData();
      },
      sizeChange(val) {
          this.listQuery.page = 1;
          this.listQuery.limit = val;
          this.getList();
      //   this.getListData();
      },
      listBaseDictQuery(val){
        listBaseDict(
          {
            dataType:val
          }
        ).then(res=>{
          if(val === "POST_DICT"){  //岗位
            this.dict=res.data;
          }else if(val === "POST_RANK"){//岗等
            this.rank=res.data;
          }else if(val === "POST_LEVEL"){
            this.level=res.data;
          }
        })
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.listBaseDictQuery("POST_DICT")//岗位
        this.listBaseDictQuery("POST_RANK")//岗等
        this.listBaseDictQuery("POST_LEVEL")//岗级
      },
      handleUpdate(row) {
        this.resetForm("form");
        this.listBaseDictQuery("POST_DICT")//岗位
        this.listBaseDictQuery("POST_RANK")//岗等
        this.listBaseDictQuery("POST_LEVEL")//岗级;
        this.id=row.id
        getUser(
          {
            id:row.id
          }
        ).then(res=>{
            for(let i in this.form){
              this.form[i]=res[i]
            }
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
        })
        // getObj(row.id)
        //   .then(response => {
        //     this.form = response.data;
            
        //   });
      },
      handleDelete(row) {
        console.log(row)
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
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
              target: document.querySelector('.div1')
            });
            addUserInfo(this.form)
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
                this.resetForm(formName)
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
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            let obj={}
            for(let i in this.form){
              console.log(i)
              if(i!="password"){
                obj[i]=this.form[i]
              }
            }
            obj.id=this.id;
            updateUser(obj).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
              this.resetForm("form");
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          description: undefined
        };
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
