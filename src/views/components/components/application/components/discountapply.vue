<template>
  <!-- index -->
  <div class="disapply">
    <div class="iconBox m-bottom">
      <i class="Icon"></i>
      <span>审批权限</span>
    </div>

    <div class="dis_content">
      <span>特批折扣：</span>
      <el-input-number v-model="form.discountRate" :min="0" :max="10" label="折扣值" :disabled="readonly"></el-input-number>
      <span style="paddingLeft: 8px;">折</span>
      <el-checkbox v-model="checked" class="m-left20"  :disabled="readonly">是否提交总经理</el-checkbox>
    </div>

    <div class="app_text" v-if="checked">
      <span>申请原因：</span>
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.applyCause"  :readonly="readonly"></el-input>
    </div>

    <div class="app_text">
      <span>选择审核人：</span>
      <div>
        <el-select v-model="form.auditorPostId" placeholder="岗位" size="medium" @change="auditorPostIdChange(form.auditorPostId)"  :disabled="readonly">
          <el-option v-for="item in auditList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="form.auditorId" placeholder="姓名" size="medium" @change="auditorIdChange(form.auditorId)"  :disabled="readonly">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 附件管理 -->
    <!-- <div class="app_text">
      <span>上传附件：</span>
      <el-upload action="string" list-type="text" :http-request="uploadSectionFile" :file-list="fileList" :on-remove="handleRemove">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div> -->

    <div  v-if="isAudit || isView">
		<div class="iconBox m-bottom" v-if="fileList && fileList.length != 0">
			<i class="Icon"></i>
			<span>附件管理</span>
		</div>
        <ul class="el-upload-list el-upload-list--text downlists" v-if="fileList && fileList.length != 0" >
            <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
                <a class="el-upload-list__item-name">
                    <i class="el-icon-document"></i> {{item.name}}
                </a>
                <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
            </li>
        </ul>
    </div>

    <div  v-else>
        <div class="iconBox m-bottom">
			<i class="Icon"></i>
			<span>附件管理</span>
		</div>
        <el-upload
            list-type="text"
            class="upload-demo"
            action="string"
            :http-request="uploadSectionFile"
            :file-list="fileList"
            :on-remove="handleRemove" 
            >
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>


    <!-- 审批意见组件 -->
    <auditopinion v-if="isAudit" ref="auditopinion" :orderId="orderId"></auditopinion>

	<div class="btn_btn" v-if="isAudit">
		<el-button type="primary" size="medium" class="reset_btn m-left20" @click="examineFun" :loading="btnLoading">确 定</el-button>
		<!-- <el-button type="primary" size="medium" class="reset_btn m-left20" @click="rebackFun" :loading="btnLoading">退 回</el-button> -->
		<el-button  size="medium" class="reset_btn m-left20"  @click="backFun(2)">取 消</el-button>
	</div>


	<div class="btn_btn" v-else>
		<!-- <el-button type="primary" v-if="isAudit" size="medium" class="m-left20" @click="examineFun">提交</el-button> -->
		<el-button type="primary" size="medium" class="m-left20" @click="addApplyFun" :loading="btnLoading" v-if="!isView">申 请</el-button>
		<el-button size="medium" class="m-left20" @click="backFun(1)">取 消</el-button>
	</div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";

import { removeBudget, put, getBuffer } from "@/utils/pubilcFn";
import { getUUID } from "api/pulicJava"; //生成编码
import { getPostUser } from "api/common/common";//根据选中的岗位id获取岗位人员信息
import { 
  addDiscountApply,//添加申请
  discountApplyDetails,//信息回显
  editDiscountApply,//修改编辑信息
  editAuditStatus,//审核接口
 } from "api/marketing/discountpermit/discountpermit"
 import {
  removeAccessoryImg, //删除图片
  addAccessory, //新增图片
} from "@/api/order/recommender/recommender";

export default {
  components: {
    breadcrumb,
    pagination,
    auditopinion
  },
  props:["orderId"],
  data() {
    return {
		btnLoading: false, // 按钮的loading Flag

      num: "", // 折扣值
      auditer: [], // 岗位
      names: [], // 姓名
      checked: false, // 是否提交总经理
	  textarea: "", // 申请原因
	  urls: '',
	  readonly: false,
      // 上传
      fileList: [],
      fileArr: [],
      delArr: [],
      // 条件
      auditList: [
        { name: "区域经理审批", id: "613" },
        { name: "战区/运营总监审批", id: "653" },
        { name: "事业部总监审批", id: "654" }
      ], // 选择岗位条件
      nameList: [], // 选择姓名条件
      form: {
        auditorName:"",
        auditorId:"",
        auditorPostId:"",
        auditorPostName:"",
      }, //发送的form数据
      orderApplyId:"",//id  回显信息使用
      currentPage: 1, // 当前页数
      pageSize: 20, // 总页数
	  total: 0, // 总条数
	  
	  isView: false,
      isAudit: false,
    };
  },
	created() {
		if (this.$route.path == "/discountpermit/auditmanagement") { // 折扣审核页面
			this.readonly = true;
			this.isAudit = true;
		}

		if (this.$route.path == "/discountpermit/viewapplication") { // 折扣审核页面
			this.readonly = true;
			this.isView = true;
		}

	},
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.orderApplyId = this.$route.query.orderApplyId;
    if (this.orderApplyId) {   //有id为编辑页面  回显 信息
      this.backDetailsFun();
    }
  },
  methods: {

    //回显信息
    backDetailsFun(){
      let data = {
        orderApplyId: this.$route.query.orderApplyId,
        orderId: this.$route.query.orderId
      }
      discountApplyDetails(data)
        .then(res=>{
          this.form = res.data;
          this.form.auditorPostId = String(this.form.auditorPostId);
          //根据岗位id获取 人员
          let data = {
            postId: this.form.auditorPostId
          }
          getPostUser(data).then(res=>{
            this.nameList =  res.data;
            this.form.auditorId = String(this.form.auditorId);
          })

          this.fileList = this.form.discountApplyAcc.map(item=>{
            return{
              ...item,
              name: item.sourceName,
              url: item.fileUrl,
            }
          });
        })
        .catch(error=>{
          console.log(error+"views/marketing/components/application/components/discountapply");
        })

    },


    //点击申请按钮 添加申请
    addApplyFun() {
      if(this.form.discountRate == "" || this.form.auditorPostId == "" || 
        this.form.auditorPostName == "" || this.form.auditorName == "" || this.form.auditorName == ""){
          this.$message.warning("请检查填写信息");
          return;
	  }

      //如果有id 为编辑页面  调编辑接口
      if(this.orderApplyId){
		  this.btnLoading = true;
		  
        this.editfile();
		delete this.form.discountApplyAcc;
		
		

        editDiscountApply(this.form)
          .then(res=>{
            if(res.status == "200"){
			  this.$message.success("修改申请成功");
			  this.btnLoading = false;
              this.$router.push({
                path: "/discountpermit/discountapply"
              });
            }
          })
          .catch(error=>{
			  this.btnLoading = false;
            console.log(error+"views/marketing/components/application/components/discountapply");
          })
      }else{
        //新增页面
        if(!this.orderId){
          this.$message.warning("您没有选择订单号");
          return;
		}
		
		this.btnLoading = true;

        this.form.orderId = this.orderId;
        
        if(this.fileArr.length>=1){
          this.form.discountApplyAcc = this.fileArr.map(item => {
            return {
              fileUrl : item.url,
              sourceName: item.name
            }
          })
        }

        new Promise((resolve, reject) => {
          getUUID({ serialNumber: "DI" }).then(res => {
            resolve(res);
          });
        }).then(res => {
          this.form.applyCode = res.data;
          addDiscountApply(this.form)
            .then(res=>{
              if(res.status == "200"){
                this.$message.success("新增申请成功");
			  	this.btnLoading = false;
                this.$router.push({
                  path: "/discountpermit/discountapply"
                });
              }
            })
            .catch(error=>{
			  this.btnLoading = false;
              console.log(error+"views/marketing/components/application/components/discountapply");
            })
        });
      }
    },

    //审核方法
    examineFun(){
      if(this.$refs['auditopinion'].audit.operationStatus == ""){
        this.$message.warning("您没有选择审核结果");
        return;
      }
      if(this.$refs['auditopinion'].audit.operationStatus == 2 && !this.$refs['auditopinion'].audit.rejectionReasons) { // 如果是驳回
          this.$message.warning("请填写审批意见");
          return;
      }
		this.btnLoading = true;

    //   if(!this.$refs['auditopinion'].audit.operationStatus) {
    //       this.$message.warning("请选择审核状态");
    //       return;
    //   }

      let data = {
        status : this.$refs['auditopinion'].audit.operationStatus,      //状态
        auditCause : this.$refs['auditopinion'].audit.rejectionReasons, //意见备注
        orderApplyId : this.$route.query.orderApplyId,                  //id
        workFlowBusinessId : this.$route.query.workFlowBusinessId       //节点id
      }
      editAuditStatus(data)
        .then(res=>{
          if(res.status == "200"){
			this.$message.success("操作成功");
			this.btnLoading = false;
            this.$router.push({
              path: "/discountpermit/discountaudit"
            });
          }
        })
        .catch(error=>{
			this.btnLoading = false;
          console.log(error+"views/marketing/components/application/components/discountapply");
        })
	},
	// 退回
	rebackFun(){
    //   if(this.$refs['auditopinion'].audit.operationStatus == ""){
    //     this.$message.warning("您没有选择审核结果");
    //     return;
	//   }
	
		this.btnLoading = true;

      let data = {
        status : 3,      //状态
        auditCause : this.$refs['auditopinion'].audit.rejectionReasons, //意见备注
        orderApplyId : this.$route.query.orderApplyId,                  //id
        workFlowBusinessId : this.$route.query.workFlowBusinessId       //节点id
      }
      editAuditStatus(data)
        .then(res=>{
          if(res.status == "200"){
            this.$message.success("操作成功");
			this.btnLoading = false;

            this.$router.push({
              path: "/discountpermit/discountaudit"
            });
          }
        })
        .catch(error=>{
			this.btnLoading = false;
          console.log(error+"views/marketing/components/application/components/discountapply");
        })
	},

    //退回方法
    backFun(){
        this.$router.go(-1);
    },
    //处理上传文件
    editfile(){
      if (this.fileArr.length > 0) {
        this.fileArr
          .map(item => {
            return {
              fileUrl: item.url,
              sourceName: item.name
            };
          })
          .forEach(item => {
            let query = {
              dataSourceEnum: "DiscountApplyAcc",
              dataSourceId: this.orderApplyId,
              ...item
            };
            addAccessory(query).then(res => {});
          });
      }

      if (this.delArr.length > 0) {
        //有删除旧图片
        console.log("有删除旧图片");
        this.delArr.forEach(item => {
          removeAccessoryImg(item).then(res => {});
        });
      }

    },

    //岗位下拉内容改变  根据选中的岗位
    auditorPostIdChange(id) {
      this.form.auditorPostName = this.auditList.filter(item=>{ return item.id == id })[0].name;  //获取岗位的名字
      this.nameList = []; //清空人员列表  和之前选中信息
      this.form.auditorName = '';
      this.form.auditorId = '';
      let data = {
        postId: id
      };
      getPostUser(data)
        .then(res => {
          this.nameList =  res.data;
        }).catch(error=>{
          console.log(error+"views/marketing/components/application/components/discountapply");
        });
    },


    //人员下拉改变  获取选中人的名字
    auditorIdChange(id){
      this.form.auditorName = this.nameList.filter(item=>{ return item.id == id })[0].name;  //获取审核人的名字
    },

    //文件上传
    uploadSectionFile(res) {
      put(res).then(data => {
        this.fileArr.push(data)
      });
    },

   // 文件删除操作
    handleRemove(file, fileList) {
      console.log(file,"file 52252");
            
		if (file.accessoryId) {
			//console.log("旧图片删除");
			let delobj = {
				accessoryId: file.accessoryId,
				dataSourceId: file.dataSourceId,
				dataSourceEnum: file.dataSourceEnum
			};
			this.delArr.push(delobj);
		} else {
			//console.log("新增图片删除");
			let lengs = String(file.raw.uid).length;
			this.fileArr = this.fileArr.filter(item => {
			let str = item.name.substring(0, lengs);
				return str !== String(file.raw.uid);
			});
		}
      
	},
	downPic(item) {
		getBuffer(item.sourceName).then(res => {
			this.urls = res;
		});
	},

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.disapply {
  .dis_content {
    display: flex;
    flex-wrap: nowrap;
    // justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .app_text {
    margin-top: 10px;
    padding: 12px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    span {
      text-align: right;
      min-width: 120px;
      padding-right: 12px;
      white-space: nowrap;
    }
    > div {
      vertical-align: middle;
      display: inline-block;
    }
  }
  .btn_btn {
    display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
  }
.downlists {
    >li {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }
}
}
</style>

