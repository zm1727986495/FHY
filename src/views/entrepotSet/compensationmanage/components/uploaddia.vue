<template>
<!-- 上传赔偿单弹出框 -->
  <div class="appeal_dia">
        <el-dialog title="上传赔偿单" :visible.sync="visible" custom-class="customDialogTitle"  width="35%" :before-close="handleClose" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">

			<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			
				<el-form-item label="上传凭证" prop="stryppedPic">
					<el-upload
						list-type="text"
						class="upload-demo"
						action="string"
						:limit="5"
						:http-request="uploadSectionFile"
						:file-list="fileList"
						:on-remove="handleRemove">
							<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>

			</el-form>


			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确定上传</el-button>
				<el-button  @click="selectclo">取 消</el-button>
			</div>

        </el-dialog>
    </div>
</template>
<script>

import { put } from "@/utils/pubilcFn";

import {
  uploadASingle, // 添加赔偿单
} from "api/entrepotSet/compensationmanage/index";

export default {
	props: ["dutyCompensationId"],
	components: {
	},
  // name: 'brandmanagement',
  data() {
    return {
        ruleForm: {
			stryppedPic: [],
		},
        // rules: {
		//   pics : [
		// 	  { required: true, message: '请上传图片', trigger: 'change' }
		//   ],
        // },
        // 上传
        fileList: [],
      	imgArr: [],
		visible: true,
    };
  },
  
  methods: {
	   //文件成功操作
		uploadSectionFile(res) {
			put(res).then(data => {
				// this.imgArr.push(data);
				this.fileList.push(data);
			});
		},

		//刪除图片
		handleRemove(file) {
			console.log(file);
			let lengs = String(file.raw.uid).length;
			this.fileList = this.fileList.filter(item => {
				let str = item.name.substring(0, lengs);
				return str !== String(file.raw.uid);
			});
		},


      submitForm() {

		this.ruleForm.stryppedPic = this.fileList.map(item => {
			return {
				fileUrl: item.url,
				sourceName:item.name,
			};
		});


		console.log(this.ruleForm.stryppedPic.length,"this.ruleForm.stryppedPic.length");
		
		if(this.ruleForm.stryppedPic.length == 0) {
			this.$message({
				message: '请上传凭证或稍等上传成功',
				type: 'warning'
			});
			return;
		}

		let data = {
			dutyCompensationId: this.dutyCompensationId,
			singlePic: this.ruleForm.stryppedPic,
		}

		uploadASingle(data).then(res => {
			if(res.status == 200) {
				this.$emit("get_list");
				this.$emit("confirm_dialog");  // 不能放在uploadASingle这个函数外面

				this.$message({
					message: '上传赔偿单成功',
					type: 'success'
				});
				return;
			}
		}).catch(err => {
			console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/components/uploaddia.vue', err);
		})
        
		
        
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

