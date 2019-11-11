<template>
  <!-- index -->
  <div class="disapply">
    <div class="iconBox m-bottom">
        <i class="Icon"></i>
        <span>审批权限</span>
    </div>

    <div class="dis_content">
        <span>特批折扣：</span>
        <el-input-number v-model="num" :min="0" :max="10" label="折扣值"></el-input-number>

        <span>折</span>
        <el-checkbox v-model="checked" class="m-left20">是否提交总经理</el-checkbox>
    </div>


    <!-- <div class="table_list lvs attribute m-top20" v-if="!checked">
        <el-table
            border
            :row-class-name="tableRowClassName"
            :row-style="tableBodycolor"
            :data="tabList"
            style="width: 100%;">
            <el-table-column
                prop="name1"
                label="审批职位"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name2"
                label="可审批折扣"
                sortable align="center">
            </el-table-column> 

            <el-table-column
                prop="name3"
                label="剩余次数"
                sortable align="center">
            </el-table-column>    
        </el-table>    
    </div> -->

    <div class="app_text" v-if="!checked">
      <span>申请原因：</span>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </div>

    <div class="app_text">
      <span>选择审核人：</span>
      <div>
            <el-select v-model="auditer" multiple placeholder="岗位" size="medium">
                <el-option
                    v-for="item in auditList" :key="item.value"
                    :label="item.dictName" :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="names" multiple placeholder="姓名" size="medium">
                <el-option
                    v-for="item in nameList" :key="item.value"
                    :label="item.dictName" :value="item.id">
                </el-option>
            </el-select>
      </div>
    </div>

    <div class="app_text">
        <span>上传附件：</span>
        <!-- <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload> -->
        <el-upload
            class="avatar-uploader"
            :data="uptoken"
            list-type="picture-card"
            :action="action"
            :accept="accept"
            :on-remove="handleRemove"
            :on-error="handError"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
    </div>
    <!-- 审批意见组件 -->
    <auditopinion v-if="isAudit"></auditopinion>

    <div class="btn_btn">
        <el-button type="primary" size="medium" class="m-left20" >申 请</el-button>
        <el-button size="medium" class="m-left20" >取 消</el-button>
    </div>

  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";

import { getUpToken } from "@/utils/auth";

export default {
    components: {
      breadcrumb,
      pagination,
      auditopinion,
  },
  // name: 'brandmanagement',
  data() {
    return {
      
      num: "", // 折扣值
      auditer: [], // 岗位
      names: [], // 姓名
      checked: false, // 是否提交总经理
      textarea:"", // 申请原因
      // 上传
      fileList:[], 
      imgShow: "http://file.xczhihui.com/", //文件上传域名
      action: "http://up-z2.qiniup.com",
      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
      uptoken: {
        //上传参数
        token: "",
        key: ""
      },
      // 条件
      auditList: [],  // 选择岗位条件
      nameList: [],  // 选择姓名条件
      // 表格数据
      tabList:[{
        name1:"销售经理",
        name2:"8折",
        name3:"20",
      },{
        name1:"销售经理",
        name2:"8折",
        name3:"20",
      },{
        name1:"销售经理",
        name2:"8折",
        name3:"20",
      }],
      currentPage: 1,// 当前页数
      pageSize: 20,// 总页数
      total: 100, // 总条数
      isAudit: false,
    };
  },
  created() {
      if(this.$route.path == "/minemanagement/audit") {
          this.isAudit = true;
      }
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.uptoken.token = getUpToken();
  },
  methods: {

    //文件上传前操作
    beforeAvatarUpload(file) {
      //console.log(this.imgShow+file.lastModified+".jpg");
      this.uptoken.key = `${file.lastModified}.jpg`;
    },
    //文件成功操作  //addAccessory编辑的新增接口
    handleAvatarSuccess(res, file, fileList) {
      if (this.referrerId) {
        let data = {
          dataSourceEnum: "IdCopiesImg",
          dataSourceId: this.referrerId,
          fileUrl: this.imgShow + res.key
        };
        addAccessory(data).then(res => {
          console.log(res);
          if (res.status == "200") {
            this.$message.success("图片上传成功");
          } else {
            this.$message.error("图片上传失败");
          }
        });
      } else {
        this.fileList = fileList;
      }
    },
     //文件上传失败
    handError(err) {
      this.$message.error("文件上传失败，可尝试退出登录重新操作");
    },
    //文件删除操作
    handleRemove(file, fileList) {
      if (this.referrerId) {
        let data = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        removeAccessoryImg(data).then(res => {
          if (res.status == "200") {
            this.$message.success("删除图片成功");
          } else {
            this.$message.error("删除图片失败");
          }
        });
      } else {
        this.fileList = fileList;
      }
    },

    //翻页方法
    sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
        this.currentPage = val;
    },

    
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>
.disapply{
  .dis_content{
    display: flex;
    flex-wrap: nowrap;
    // justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .app_text{
    margin-top: 10px;
    padding: 12px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    span{
      text-align:right;
      min-width: 120px;
      padding-right: 12px;
      white-space: nowrap;  
    }
    >div {
        vertical-align: middle;   
        display: inline-block;
    }
  }
  .btn_btn{
    width: 200px;
    margin: 10px auto;
  }

}

</style>

