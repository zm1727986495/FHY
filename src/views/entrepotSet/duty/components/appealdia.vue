<template>
<!-- 申诉弹出框 -->
  <div class="appeal_dia">
        <el-dialog title="填写申诉信息" custom-class="customDialogTitle" :visible.sync="visible"   width="35%" :before-close="handleClose" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">

			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			
				<!-- <el-form-item label="申诉对象" prop="obj">
					<el-select v-model="ruleForm.obj"  placeholder="申诉对象"  >
						<el-option
							v-for="item in objectList" :key="item.value"
							:label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->

				<el-form-item label="申诉内容" prop="appealCause">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入申诉内容" v-model="ruleForm.appealCause"> </el-input>
				</el-form-item>

				<el-form-item label="上传凭证" prop="pics">
					<el-upload
                        class="avatar-uploader"
                        :data="uptoken"
                        list-type="text"
						:limit="5"
                        :action="action"
                        :on-remove="handleRemove"
                        :on-error="handError"
                        :file-list="fileList"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
						<!-- <i class="el-icon-plus"></i> -->
                        <el-button  type="primary">点击上传</el-button>
                    </el-upload>
				</el-form-item>

			</el-form>


			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">发起申诉</el-button>
				<el-button  @click="selectclo">取 消</el-button>
			</div>

        </el-dialog>
    </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";

import {
  addAppeal, // 申诉
} from 'api/entrepotSet/duty/index';

export default {
  props:["rowAudit","page","limit"],

  components: {
  },
  // name: 'brandmanagement',
  data() {
    return {
		visible: true,
        ruleForm: {
			appealCause: '', // 申诉内容
		},
		objectList:[{
            value: "1", label: "发起人"
        },{ 
            value: "0" , label: "本部门"
        },],   // 处理情况数据
        rules: {
          appealCause: [
            { required: true, message: '请输入申诉内容', trigger: 'blur' },
          ],
        },
        // 上传
        imgShow: "http://file.xczhihui.com/", //文件上传域名
        action: "http://up-z2.qiniup.com",
        // accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
        uptoken: {
            //上传参数
            token: "",
            key: ""
        },
        fileList: [],

       

    };
  },
  
  mounted() {
    this.uptoken.token = getUpToken();
  },
  methods: {


      submitForm(formName) {


			this.$refs["ruleForm"].validate(valid => {
				if (valid) {
					let data = {
						dutyBaseUserId: this.rowAudit.dutyBaseUserId,
						appealCause: this.ruleForm.appealCause,
						appealPic:  this.fileList.map(item => {
							return { fileUrl: this.imgShow + item.response.key };
						}),
					};
					addAppeal(data).then(res => {
							if (res.status == "200") {
								let data = { // 详情页列表
                                    taskDutyId: this.$route.query.taskDutyId,
                                    page: this.page,
                                    limit: this.limit,
								} // 详情页列表
								this.$emit("get_appealDetails",data)

								this.$message({
									message: '申诉成功',
									type: 'success'
								});
								
								this.$refs["ruleForm"].resetFields();
								this.fileList = [];
							}
					}).catch(err => {
						cconsole.log("定责管理:定责列表 申诉 duty/dutylist/dutyDetails.vue",err);
						this.$emit("get_appealDetails");
					});
				} else {
					this.$message.error("检查填写信息");
					return false;
				}
			});

      },

		//文件删除
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },

        //文件成功操作
        handleAvatarSuccess(res, file, fileList) {
            this.fileList = fileList;
        },

        //文件上传失败
        handError(err) {
            this.$message.error("文件上传失败，可尝试退出登录重新操作");
        },

        //文件上传前操作
        beforeAvatarUpload(file) {
            this.uptoken.key = `${file.lastModified}.jpg`;
        },




      //关闭回调函数
      handleClose(){
        this.$emit("close_dialog")

      },
      //点击取消按钮
      selectclo(){
        this.$emit("close_dialog")
        
      },



      
  }
};
</script>
<style scoped lang='scss'>
.audit_radio{
    width: 80%;
    margin: 0 auto;
}


</style>

