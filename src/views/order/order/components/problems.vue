<template>
  <!-- 新增问题弹框页面 -->
  <div style="width:100%;">
    <div class="Dialog_input_cell">
      <div class="Dialog_content dialog_input">
        <div class="reasons questionType">
          	<span class="fontWidth">问题类型：</span>
			<el-select v-model="questiontype" placeholder="请选择">
				<el-option
					v-for="item in options"
					:key="item.id"
					:label="item.dictName"
					:value="item.id">
				</el-option>
			</el-select>
        </div>
        <div class="reasons">
			<span class="fontWidth">问题描述：</span>
			<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="desc"></el-input>
        </div>
        <div class="reasons">
            <span class="fontWidth">附件上传：</span>
			<el-upload
              list-type="text"
              class="upload-demo"
              action="string"
              :http-request="uploadSectionFile1"
              :file-list="fileList1"
              :on-remove="handleRemove"
            >
                  <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";
import { put } from "@/utils/pubilcFn";
import {
  listBaseDict, // 加载问题类型
} from '@/api/order/order/order';
import { log } from 'util';

export default {
	data() {
		return {
			questiontype: "", //问题类型
			desc: "", //问题描述
			// 条件
			options: [],  //问题类型
			
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
			newProblemsFile: [],
			// 上传
			fileList1: [],
			imgArr1: [],
			delImgArr: [],
		};
	},
	created() {
		this.getProblems();
	},
	mounted() {
		this.uptoken.token = getUpToken();
	},
	methods: {
		//文件成功操作  //addAccessory编辑的新增接口
		uploadSectionFile1(res) {
			put(res).then(data => {
				this.imgArr1.push(data);
			});
		},
		 //文件删除操作
		handleRemove(file, fileList) {
			// if (file.dataSourceId) {
			// 	//console.log("旧图片删除");
			// 	let delobj = {
			// 		accessoryId: file.accessoryId,
			// 		dataSourceId: file.dataSourceId,
			// 		dataSourceEnum: file.dataSourceEnum
			// 	};
			// 	this.delImgArr.push(delobj);
			// } else {
				//console.log("新增图片删除");
				let lengs = String(file.uid).length;
				this.imgArr1 = this.imgArr1.filter(item => {
					let str = item.name.substring(0, lengs);
					return str !== String(file.uid);
				});
			// }
		},
		
		// 加载问题
        getProblems() {
			let data = {
				dataType: "PROBLEM_TYPE",
			}
            listBaseDict(data).then(res =>{
                if(res.status == 200){
                    this.options = res.data;
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/components/problems.vue', error);
            })
		},

		// //文件删除
        // handleRemove(file, fileList) {
		// 	console.log(file, fileList,"handleRemove");
			
        //     this.fileList = fileList;
		// },
		
		 //文件上传前操作
        beforeAvatarUpload(file) {
			// lastModified: 1558065537015
			// name: "b4e2f5091cb68afa323f0368bee6e820.jpg"

			console.log(file,"beforeAvatarUpload");
			

			let name = file.name.substring(file.name.lastIndexOf("."));
			this.uptoken.key = `${file.lastModified}${name}`;
			
			
            // this.uptoken.key = `${file.lastModified}.jpg------`; // 必须在这儿拼
        },

        //文件成功操作
        handleAvatarSuccess(res, file, fileList) {
			

			console.log(res,file,fileList,"handleAvatarSuccess");
			

			this.fileList = fileList;
			let sourceName = '',targetName = '', fileUrl = '';

			sourceName = res.key;
			targetName = file.name;
			fileUrl = this.imgShow + res.key;
			
			this.newProblemsFile.push({
				fileUrl: fileUrl, // 地址
			 	sourceName: sourceName,// 上传源文件名称
				targetName: targetName, // 服务器名称
			});
			
        },

        //文件上传失败
        handError(err) {
            this.$message.error("文件上传失败，可尝试退出登录重新操作");
        },

       
	}
};
</script>
<style scoped lang="scss">
	.upImgBox {
		width: 94px;
		height: 94px;
		line-height: 102px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.contentBox {
		display: flex;
		flex-direction: row;
		margin-top: 10px;
		.collapse_cell_div {
			background: #ecedf0;
			overflow: hidden;
			padding: 10px 0;
			display: block;
			margin-right: 20px;
			border: 1px solid #b7b9bb;
			padding: 10px;
			.setPicture {
			display: flex;
			justify-content: center;

			p {
				cursor: pointer;
				color: #006ec6;
			}
			}
		}
	}

		.Dialog_input_cell {
			display: flex;
			justify-content: center;
			align-items: center;
			.dialog_input {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				>div {
					width:80%;
					display: flex;
					flex-wrap : nowrap;
					justify-content: flex-start;
					align-items: center;
				}
			}
		}
	.Dialog_content {
		width: 30vw;
	}
	.reasons {
		display: flex;
		flex-direction: row;
		margin-top: 15px;
	}
	.reasons .fontWidth {
		width: 78px;
		position: relative;
		white-space: nowrap;
	}
	.questionType {
		width: 14vw;
	}

		// .Dialog_content{
		// 	width: 80%;
		// 	display: flex;
		// 	justify-content: center;
		// }

</style>
<style>
</style>

