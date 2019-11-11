<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="日志类型" v-model="listQuery.logType"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="baseLogManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="日志类型">
      <template slot-scope="scope">
        <span>{{scope.row.logType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="日志标题">
      <template slot-scope="scope">
        <span>{{scope.row.logTitle}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建者">
      <template slot-scope="scope">
        <span>{{scope.row.createBy}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="用户名称">
      <template slot-scope="scope">
        <span>{{scope.row.createByName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建时间">
      <template slot-scope="scope">
        <span>{{scope.row.createDate}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="请求URI">
      <template slot-scope="scope">
        <span>{{scope.row.requestUri}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="操作方式">
      <template slot-scope="scope">
        <span>{{scope.row.requestMethod}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="操作提交的数据">
      <template slot-scope="scope">
        <span>{{scope.row.requestParams}}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px" align="center" label="变更前数据">
      <template slot-scope="scope">
        <span>{{scope.row.preChangeData}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="新旧数据比较结果">
      <template slot-scope="scope">
        <span>{{scope.row.diffModifyData}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="业务主键">
      <template slot-scope="scope">
        <span>{{scope.row.bizKey}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="业务类型">
      <template slot-scope="scope">
        <span>{{scope.row.bizType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="操作IP地址">
      <template slot-scope="scope">
        <span>{{scope.row.remoteAddr}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="请求服务器地址">
      <template scope="scope">
        <span>{{scope.row.serverAddr}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="是否异常">
      <template slot-scope="scope">
        <span>{{scope.row.isException}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="异常信息">
      <template slot-scope="scope">
        <span>{{scope.row.exceptionInfo}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="用户代理">
      <template scope="scope">
        <span>{{scope.row.userAgent}}</span>
      </template>
    </el-table-column> -->
        <!-- <el-table-column width="200px" align="center" label="设备名称/操作系统">
      <template scope="scope">
        <span>{{scope.row.deviceName}}</span>
      </template>
    </el-table-column> -->
        <!-- <el-table-column width="200px" align="center" label="浏览器名称">
      <template scope="scope">
        <span>{{scope.row.browserName}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="执行时间">
      <template slot-scope="scope">
        <span>{{scope.row.executeTime}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="租户代码">
      <template scope="scope">
        <span>{{scope.row.corpCode}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="租户名称">
      <template scope="scope">
        <span>{{scope.row.corpName}}</span>
      </template>
    </el-table-column> -->
        <!-- <el-table-column fixed="right" align="center" label="操作" width="150"> <template scope="scope">
        <el-button v-if="baseLogManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="baseLogManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column> -->
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="日志类型" prop="logType">
      <el-input v-model="form.logType" placeholder="请输入日志类型"></el-input>
    </el-form-item>
        <el-form-item label="日志标题" prop="logTitle">
      <el-input v-model="form.logTitle" placeholder="请输入日志标题"></el-input>
    </el-form-item>
        <el-form-item label="创建者" prop="createBy">
      <el-input v-model="form.createBy" placeholder="请输入创建者"></el-input>
    </el-form-item>
        <el-form-item label="用户名称" prop="createByName">
      <el-input v-model="form.createByName" placeholder="请输入用户名称"></el-input>
    </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
      <el-input v-model="form.createDate" placeholder="请输入创建时间"></el-input>
    </el-form-item>
        <el-form-item label="请求URI" prop="requestUri">
      <el-input v-model="form.requestUri" placeholder="请输入请求URI"></el-input>
    </el-form-item>
        <el-form-item label="操作方式" prop="requestMethod">
      <el-input v-model="form.requestMethod" placeholder="请输入操作方式"></el-input>
    </el-form-item>
        <el-form-item label="操作提交的数据" prop="requestParams">
      <el-input v-model="form.requestParams" placeholder="请输入操作提交的数据"></el-input>
    </el-form-item>
        <el-form-item label="新旧数据比较结果" prop="diffModifyData">
      <el-input v-model="form.diffModifyData" placeholder="请输入新旧数据比较结果"></el-input>
    </el-form-item>
        <el-form-item label="业务主键" prop="bizKey">
      <el-input v-model="form.bizKey" placeholder="请输入业务主键"></el-input>
    </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
      <el-input v-model="form.bizType" placeholder="请输入业务类型"></el-input>
    </el-form-item>
        <el-form-item label="操作IP地址" prop="remoteAddr">
      <el-input v-model="form.remoteAddr" placeholder="请输入操作IP地址"></el-input>
    </el-form-item>
        <el-form-item label="请求服务器地址" prop="serverAddr">
      <el-input v-model="form.serverAddr" placeholder="请输入请求服务器地址"></el-input>
    </el-form-item>
        <el-form-item label="是否异常" prop="isException">
      <el-input v-model="form.isException" placeholder="请输入是否异常"></el-input>
    </el-form-item>
        <el-form-item label="异常信息" prop="exceptionInfo">
      <el-input v-model="form.exceptionInfo" placeholder="请输入异常信息"></el-input>
    </el-form-item>
        <el-form-item label="用户代理" prop="userAgent">
      <el-input v-model="form.userAgent" placeholder="请输入用户代理"></el-input>
    </el-form-item>
        <el-form-item label="设备名称/操作系统" prop="deviceName">
      <el-input v-model="form.deviceName" placeholder="请输入设备名称/操作系统"></el-input>
    </el-form-item>
        <el-form-item label="浏览器名称" prop="browserName">
      <el-input v-model="form.browserName" placeholder="请输入浏览器名称"></el-input>
    </el-form-item>
        <el-form-item label="执行时间" prop="executeTime">
      <el-input v-model="form.executeTime" placeholder="请输入执行时间"></el-input>
    </el-form-item>
        <el-form-item label="租户代码" prop="corpCode">
      <el-input v-model="form.corpCode" placeholder="请输入租户代码"></el-input>
    </el-form-item>
        <el-form-item label="租户名称" prop="corpName">
      <el-input v-model="form.corpName" placeholder="请输入租户名称"></el-input>
    </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
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
      putObj
  } from 'api/admin/log/sysLog/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'baseSysLog',
    data() {
      return {
        form: {
        logType : undefined,        logTitle : undefined,        createBy : undefined,        createByName : undefined,        createDate : undefined,        requestUri : undefined,        requestMethod : undefined,        requestParams : undefined,        diffModifyData : undefined,        bizKey : undefined,        bizType : undefined,        remoteAddr : undefined,        serverAddr : undefined,        isException : undefined,        exceptionInfo : undefined,        userAgent : undefined,        deviceName : undefined,        browserName : undefined,        executeTime : undefined,        corpCode : undefined,        corpName : undefined          },
        rules: {
    logType: [
  {
    required: true,
    message: '请输入日志类型',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   logTitle: [
  {
    required: true,
    message: '请输入日志标题',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   createBy: [
  {
    required: true,
    message: '请输入创建者',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   createByName: [
  {
    required: true,
    message: '请输入用户名称',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   createDate: [
  {
    required: true,
    message: '请输入创建时间',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   requestUri: [
  {
    required: true,
    message: '请输入请求URI',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   requestMethod: [
  {
    required: true,
    message: '请输入操作方式',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   requestParams: [
  {
    required: true,
    message: '请输入操作提交的数据',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   diffModifyData: [
  {
    required: true,
    message: '请输入新旧数据比较结果',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   bizKey: [
  {
    required: true,
    message: '请输入业务主键',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   bizType: [
  {
    required: true,
    message: '请输入业务类型',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   remoteAddr: [
  {
    required: true,
    message: '请输入操作IP地址',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   serverAddr: [
  {
    required: true,
    message: '请输入请求服务器地址',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   isException: [
  {
    required: true,
    message: '请输入是否异常',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   exceptionInfo: [
  {
    required: true,
    message: '请输入异常信息',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   userAgent: [
  {
    required: true,
    message: '请输入用户代理',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   deviceName: [
  {
    required: true,
    message: '请输入设备名称/操作系统',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   browserName: [
  {
    required: true,
    message: '请输入浏览器名称',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   executeTime: [
  {
    required: true,
    message: '请输入执行时间',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   corpCode: [
  {
    required: true,
    message: '请输入租户代码',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   corpName: [
  {
    required: true,
    message: '请输入租户名称',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
]        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          logType: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        baseLogManager_btn_edit: false,
        baseLogManager_btn_del: false,
        baseLogManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.baseLogManager_btn_edit = this.elements['baseLogManager:btn_edit'];
      this.baseLogManager_btn_del = this.elements['baseLogManager:btn_del'];
      this.baseLogManager_btn_add = this.elements['baseLogManager:btn_add'];
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
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
            .then(response => {
          this.form = response.data;
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
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
      });
      });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
        if (valid) {
        addObj(this.form)
        .then(() => {
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
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
        if (valid) {
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
<style scoped>

</style>
