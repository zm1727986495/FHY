<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :model="form" ref="form" label-width="90px">
        <el-form-item label="消息类型" style="float: left;">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="消息类型" v-model="listQuery.msgType"> </el-input>
        </el-form-item>
        <el-form-item label="业务类型" style="float: left;">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="业务类型" v-model="listQuery.bizType"> </el-input>
        </el-form-item>
        <el-form-item label="推送状态" style="float: left;">
          <el-select class="filter-item" v-model="listQuery.pushStatus" placeholder="请选择" style="width: 100px;">
                <el-option value="">全部</el-option>
                <el-option v-for="(item,index) in  pushStatus" :key="item.code" :label="item.title" :value="item.code"> </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="读取状态" style="float: left;">
          <el-select class="filter-item" v-model="listQuery.readStatus" placeholder="请选择" style="width: 100px;">
                <el-option value="">全部</el-option>
                <el-option v-for="(item,index) in  readStatus" :key="item.code" :label="item.title" :value="item.code"> </el-option>
              </el-select>
        </el-form-item>
      </el-form>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" style="margin-left: 20px;">搜索</el-button>
      <el-button class="filter-item" v-if="msgPushManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="消息类型">
      <template slot-scope="scope">
        <span>{{scope.row.msgType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="消息标题">
      <template slot-scope="scope">
        <span>{{scope.row.msgTitle}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="消息内容">
      <template slot-scope="scope">
        <span>{{scope.row.msgContent}}</span>
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
        <el-table-column width="200px" align="center" label="接受者账号">
      <template slot-scope="scope">
        <span>{{scope.row.receiveCode}}</span>
      </template>
    <!-- </el-table-column>
        <el-table-column width="200px" align="center" label="接受者用户编码">
      <template scope="scope">
        <span>{{scope.row.receiveUserCode}}</span>
      </template> -->
    </el-table-column>
        <el-table-column width="200px" align="center" label="接受者用户姓名">
      <template slot-scope="scope">
        <span>{{scope.row.receiveUserName}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="发送者用户编码">
      <template scope="scope">
        <span>{{scope.row.sendUserCode}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="发送者用户姓名">
      <template slot-scope="scope">
        <span>{{scope.row.sendUserName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="发送时间">
      <template slot-scope="scope">
        <span>{{scope.row.sendDate}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="是否合并推送">
      <template slot-scope="scope">
        <span>{{scope.row.isMergePush==1?'是':'否'}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="计划推送时间">
      <template scope="scope">
        <span>{{scope.row.planPushDate}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="推送次数">
      <template slot-scope="scope">
        <span>{{scope.row.pushNumber}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="推送返回结果码">
      <template scope="scope">
        <span>{{scope.row.pushReturnCode}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="推送返回消息编号">
      <template scope="scope">
        <span>{{scope.row.pushReturnMsgId}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="推送返回的内容信息">
      <template slot-scope="scope">
        <span>{{scope.row.pushReturnContent}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="推送状态">
      <template slot-scope="scope">
        <span>{{scope.row.pushStatus==1?'成功':'失败'}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="推送时间">
      <template slot-scope="scope">
        <span>{{scope.row.pushDate}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="读取状态">
      <template slot-scope="scope">
        <span>{{scope.row.readStatus==1?'已读':'未读'}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="读取时间">
      <template slot-scope="scope">
        <span>{{scope.row.readDate}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column fixed="right" align="center" label="操作" width="150"> <template scope="scope">
        <el-button v-if="msgPushManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="msgPushManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column> -->
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="消息类型" prop="msgType">
      <el-input v-model="form.msgType" placeholder="请输入消息类型"></el-input>
    </el-form-item>
        <el-form-item label="消息标题" prop="msgTitle">
      <el-input v-model="form.msgTitle" placeholder="请输入消息标题"></el-input>
    </el-form-item>
        <el-form-item label="消息内容" prop="msgContent">
      <el-input v-model="form.msgContent" placeholder="请输入消息内容"></el-input>
    </el-form-item>
        <el-form-item label="业务主键" prop="bizKey">
      <el-input v-model="form.bizKey" placeholder="请输入业务主键"></el-input>
    </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
      <el-input v-model="form.bizType" placeholder="请输入业务类型"></el-input>
    </el-form-item>
        <el-form-item label="接受者账号" prop="receiveCode">
      <el-input v-model="form.receiveCode" placeholder="请输入接受者账号"></el-input>
    </el-form-item>
        <el-form-item label="接受者用户编码" prop="receiveUserCode">
      <el-input v-model="form.receiveUserCode" placeholder="请输入接受者用户编码"></el-input>
    </el-form-item>
        <el-form-item label="接受者用户姓名" prop="receiveUserName">
      <el-input v-model="form.receiveUserName" placeholder="请输入接受者用户姓名"></el-input>
    </el-form-item>
        <el-form-item label="发送者用户编码" prop="sendUserCode">
      <el-input v-model="form.sendUserCode" placeholder="请输入发送者用户编码"></el-input>
    </el-form-item>
        <el-form-item label="发送者用户姓名" prop="sendUserName">
      <el-input v-model="form.sendUserName" placeholder="请输入发送者用户姓名"></el-input>
    </el-form-item>
        <el-form-item label="发送时间" prop="sendDate">
      <el-input v-model="form.sendDate" placeholder="请输入发送时间"></el-input>
    </el-form-item>
        <el-form-item label="是否合并推送" prop="isMergePush">
      <el-input v-model="form.isMergePush" placeholder="请输入是否合并推送"></el-input>
    </el-form-item>
        <el-form-item label="计划推送时间" prop="planPushDate">
      <el-input v-model="form.planPushDate" placeholder="请输入计划推送时间"></el-input>
    </el-form-item>
        <el-form-item label="推送尝试次数" prop="pushNumber">
      <el-input v-model="form.pushNumber" placeholder="请输入推送尝试次数"></el-input>
    </el-form-item>
        <el-form-item label="推送返回结果码" prop="pushReturnCode">
      <el-input v-model="form.pushReturnCode" placeholder="请输入推送返回结果码"></el-input>
    </el-form-item>
        <el-form-item label="推送返回消息编号" prop="pushReturnMsgId">
      <el-input v-model="form.pushReturnMsgId" placeholder="请输入推送返回消息编号"></el-input>
    </el-form-item>
        <el-form-item label="推送返回的内容信息" prop="pushReturnContent">
      <el-input v-model="form.pushReturnContent" placeholder="请输入推送返回的内容信息"></el-input>
    </el-form-item>
        <el-form-item label="推送状态" prop="pushStatus">
      <el-input v-model="form.pushStatus" placeholder="请输入推送状态"></el-input>
    </el-form-item>
        <el-form-item label="推送时间" prop="pushDate">
      <el-input v-model="form.pushDate" placeholder="请输入推送时间"></el-input>
    </el-form-item>
        <el-form-item label="读取状态" prop="readStatus">
      <el-input v-model="form.readStatus" placeholder="请输入读取状态"></el-input>
    </el-form-item>
        <el-form-item label="读取时间" prop="readDate">
      <el-input v-model="form.readDate" placeholder="请输入读取时间"></el-input>
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
  } from 'api/admin/msgPush/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'msgPush',
    data() {
      return {
        form: {
        msgType : undefined,        msgTitle : undefined,        msgContent : undefined,        bizKey : undefined,        bizType : undefined,        receiveCode : undefined,        receiveUserCode : undefined,        receiveUserName : undefined,        sendUserCode : undefined,        sendUserName : undefined,        sendDate : undefined,        isMergePush : undefined,        planPushDate : undefined,        pushNumber : undefined,        pushReturnCode : undefined,        pushReturnMsgId : undefined,        pushReturnContent : undefined,        pushStatus : undefined,        pushDate : undefined,        readStatus : undefined,        readDate : undefined          },
        rules: {
    msgType: [
  {
    required: true,
    message: '请输入消息类型（PC APP 短信 邮件 微信）',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   msgTitle: [
  {
    required: true,
    message: '请输入消息标题',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   msgContent: [
  {
    required: true,
    message: '请输入消息内容',
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
],   receiveCode: [
  {
    required: true,
    message: '请输入接受者账号',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   receiveUserCode: [
  {
    required: true,
    message: '请输入接受者用户编码',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   receiveUserName: [
  {
    required: true,
    message: '请输入接受者用户姓名',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   sendUserCode: [
  {
    required: true,
    message: '请输入发送者用户编码',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   sendUserName: [
  {
    required: true,
    message: '请输入发送者用户姓名',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   sendDate: [
  {
    required: true,
    message: '请输入发送时间',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   isMergePush: [
  {
    required: true,
    message: '请输入是否合并推送',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   planPushDate: [
  {
    required: true,
    message: '请输入计划推送时间',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   pushNumber: [
  {
    required: true,
    message: '请输入推送尝试次数',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   pushReturnCode: [
  {
    required: true,
    message: '请输入推送返回结果码',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   pushReturnMsgId: [
  {
    required: true,
    message: '请输入推送返回消息编号',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   pushReturnContent: [
  {
    required: true,
    message: '请输入推送返回的内容信息',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   pushStatus: [
  {
    required: true,
    message: '请输入推送状态（0未推送 1成功  2失败）',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   pushDate: [
  {
    required: true,
    message: '请输入推送时间',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   readStatus: [
  {
    required: true,
    message: '请输入读取状态（0未送达 1已读 2未读）',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   readDate: [
  {
    required: true,
    message: '请输入读取时间',
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
          msgType: undefined,
          bizType: undefined,
          pushStatus:1,
          readStatus:0
        },
        pushStatus: [{code: 1,title: '成功'}, {code: 0,title: '失败'}],
        readStatus: [{code: 1,title: '已读'}, {code: 0,title: '未读'}],
        dialogFormVisible: false,
        dialogStatus: '',
        msgPushManager_btn_edit: false,
        msgPushManager_btn_del: false,
        msgPushManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.msgPushManager_btn_edit = this.elements['msgPushManager:btn_edit'];
      this.msgPushManager_btn_del = this.elements['msgPushManager:btn_del'];
      this.msgPushManager_btn_add = this.elements['msgPushManager:btn_add'];
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
