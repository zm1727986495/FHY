<template>
<!-- 编辑弹出框 -->
  <div class="edit_dia">
        <el-dialog :title="title"  custom-class="customDialogTitle" :visible.sync="visible"  width="50%" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
			<div class="orderbox">
				<ul class="orderlsit">
					<li>赔偿单号</li>
					<li>{{compenData.compensationNumber}}</li>
					<li>定责单号</li>
					<li>{{compenData.taskDutyNumber}}</li>
				</ul>
				<ul class="orderlsit">
					<li>关联单号</li>
					<li>{{compenData.orderNumber}}</li>
				</ul>
				<ul class="orderlsit">
					<li>发起部门</li>
					<li>{{compenData.groupName}}</li>
					<li>发起人</li>
					<li>{{compenData.initiateName}} {{compenData.username}}</li>
				</ul>
				<ul class="orderlsit">
					<li>发起时间</li>
					<li>{{compenData.initiateCompensationTime}}</li>
				</ul>
				<ul class="orderlsit">
					<li>客户姓名</li>
					<li>{{compenData.customerName}}</li>
					<li>客户电话</li>
					<li>{{compenData.customerPhone}}</li>
				</ul>
				<ul class="orderlsit">
					<li>赔偿方式</li>
					<li>
						<el-select v-model="compenData.compensationWay"  placeholder="请选择赔偿方式" size="medium" :disabled="disabled">
							<el-option
								v-for="item in compenList" :key="item.value"
								:label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</li>
					<li   v-if="compenData.compensationWay == '2'">户名</li>
					<li   v-if="compenData.compensationWay == '2'">
						<el-input class="width-100" placeholder="请输入户名" v-model="compenData.username" maxlength="50" :readonly="disabled"></el-input>
					</li>
					<li   v-if="compenData.compensationWay == '3'">备注</li>
					<li   v-if="compenData.compensationWay == '3'">
						<el-input class="width-100" placeholder="请输入备注" v-model="compenData.remake" maxlength="50" :readonly="disabled"></el-input>
					</li>

					<li   v-if="(!disabled) && compenData.compensationWay == '1'">银行信息</li>
					<li   v-if="(!disabled) && compenData.compensationWay == '1'">
						<!-- <el-tooltip class="item" effect="dark" :content="detaildata.address" placement="top">
                            <li>{{detaildata.address}}</li>
                        </el-tooltip> -->

						<el-select v-model="compenData.customerBankCardId" placeholder="银行信息" @change="chancus">
							<!-- :label="item.customerBankCard" -->
							<el-option
								v-for="item in bankInfo"
								:key="item.customerBankCardId"
								:label="item.customerBankCard"
								:value="item.customerBankCardId"
								class="optionSelf"
							>
								<span>用户名: {{ item.accountName }}</span>
								<span>开户行:{{ item.affiliatedBank }}</span>
								<span>卡号:{{ item.bankCardNumber }}</span>
							</el-option>
							<!-- 用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber} -->
						</el-select>
					</li>

					<!-- <li>开户行</li>
					<li>
						<el-input class="width-100" placeholder="请输入开户行" v-model="compenData.affiliatedBank" maxlength="50" :readonly="disabled"></el-input>
					</li> -->
				</ul>
				<ul class="orderlsit"  v-if="disabled && compenData.compensationWay == '1'">
					<li>用户名</li>
					<li>
						<el-input class="width-100" placeholder="请输入用户名" v-model="compenData.accountName" maxlength="50" :readonly="disabled"></el-input>
					</li>
					<li>开户行</li>
					<li>
						<el-input class="width-100" placeholder="请输入开户行" v-model="compenData.openingBank" maxlength="50" :readonly="disabled"></el-input>
					</li>
					<li>银行卡号</li>
					<li>
						<el-input class="width-100" placeholder="请输入银行卡号" v-model="compenData.creditCardNumbers" maxlength="50" :readonly="disabled"></el-input>
					</li>
				</ul>
				<ul class="orderlsit">

					<li>赔偿金额</li>
					<li>
						<el-input-number :controls="false" placeholder="请输入赔偿金额/元" v-model="compenData.compensationMoney" :precision="2" :min="0" :disabled="disabled"></el-input-number>
						<!-- <el-input class="width-100" placeholder="请输入赔偿金额/元" v-model="compenData.compensationmoney" maxlength="50" :readonly="disabled"></el-input> -->
					</li>
					<li>减收金额</li>
					<li>
						<el-input-number :controls="false" placeholder="请输入减收金额/元" v-model="compenData.reduceMoney" :precision="2" :min="0"  :disabled="disabled"></el-input-number>
						<!-- <el-input class="width-100" placeholder="请输入减收金额/元" v-model="compenData.compensationmoney" maxlength="50" :readonly="disabled"></el-input> -->
					</li>
				</ul>
				<ul class="orderlsit">
					<li>赔偿原因</li>
					<li>
						<el-input class="width-100" placeholder="请输入赔偿原因" v-model="compenData.compensationCause" maxlength="50" :readonly="disabled" ></el-input>
					</li>
				</ul>
			</div>
			<div class="upimg" v-if="fileList && fileList.length != 0">
				<span>上传附件</span>
				

				<ul class="el-upload-list el-upload-list--text" v-if="disabled">
					<li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
						<a class="el-upload-list__item-name">
							<i class="el-icon-document"></i>  {{item.name}}
						</a>
						<label class="el-upload-list__item-status-label">
							<i class="el-icon-upload-success el-icon-circle-check"></i>
						</label>
						<!-- <i class="el-icon-close" @click="removeItem(item.accessoryId)"></i>
						<i class="el-icon-close-tip">按 delete 键可删除</i> -->
					</li>
				</ul>

				<el-upload v-else
					list-type="text"
					class="upload-demo"
					action="string"
					:limit="5"
					:http-request="uploadSectionFile"
					:file-list="fileList"
					:on-remove="handleRemove">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>

			</div>
			<!-- 编辑 -->
			<div slot="footer" class="dialog-footer"  v-if="!disabled">
				<el-button type="primary" @click="submitForm('2')">提 交</el-button>
				<el-button  @click="selectclo">取 消</el-button>
			</div>

			<!-- 查看 -->
			<div slot="footer" class="dialog-footer" v-if="disabled"> 
				<el-button type="primary" @click="submitForm('1')">确 定</el-button>
				<el-button type="success" @click="throughFun('1')">通 过</el-button>
				<el-button  @click="throughFun('3')">驳 回</el-button>
			</div>

        </el-dialog>
    </div>
</template>
<script>

import { put } from "@/utils/pubilcFn";

import {
  addAccessory, // 添加附件
  
} from 'api/pulicJava.js';


import  {
	editDutyCompensation, // 编辑
	orderCollectMoneyDetails, // 客户银行信息表
	editDutyCompensationStatus, // 修改状态（提交审批，作废,驳回,通过）
	dutyCompensationDeatil,  // 查看回显
	removeAccessoryImgById, // 删除附件
} from "api/entrepotSet/compensationmanage/index";

export default {
  components: {
  },
  props: {
	disabled: {
		type: Boolean,
		default () {
			return true;
		}
	},
	title: {
		type: String,
		default() {
			return '查看'
		}
	},
	rowData: {
		type: Object,
		default() {
			return {}
		}
	},
  },
  watch: {
        "compenData.compensationWay"(val) {
            if (this.compenData.compensationWay == "2") {// 现金
              
                this.compenData.customerBankCardId = ""; // 转账方式的销毁
                this.compenData.accountName = ""; // 用户名
                this.compenData.affiliatedBank = ""; // 开户行
                this.compenData.bankCardNumber = ""; // 卡号

                this.compenData.remake = "";
            } else if (this.compenData.compensationWay == "1") {// 转账

                this.compenData.username = "";
                this.compenData.remake = "";
            } else if (this.compenData.compensationWay == "3") {// 其他

                this.compenData.username = "";
                this.compenData.customerBankCardId = ""; // 转账方式的销毁
                this.compenData.accountName = ""; // 用户名
                this.compenData.affiliatedBank = ""; // 开户行
                this.compenData.bankCardNumber = ""; // 卡号
            }
		},
		'compenData.customerBankCardId'(val) {
			this.compenData.customerBankCardIdWatch = val;
		}
    },
  // name: 'editdia',
  data() {
    return {
		visible: true,
		bankInfo: [], // 银行信息
		 // 上传
        imgShow: "http://file.xczhihui.com/", //文件上传域名
        action: "http://up-z2.qiniup.com",
        accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
        uptoken: {
            //上传参数
            token: "",
            key: ""
		},
		compenData: {
			compensationNumber: '', // 赔偿单号
			customerBankCardId: '',
			customerBankCardIdWatch: '',
		},
		fileList: [],
		imgArr: [],
		delImgArr: [],
		// 条件
		compenList: [{
			label: '现金', value: '2'
		},{
			label: '转账', value: '1'
		},{
			label: '其他', value: '3'
		}],
    };
  },
  created() {
	  console.log(this.disabled,"this.disabled");

	  this.getViewData(); // 查看回显

  },
  mounted() {
    
  },
	methods: {
		chancus(val) {
			this.compenData.customerBankCardId = val;
			console.log(val,typeof(val),"val /////");
			
		},
		// 获取银行信息
 		getorderCollectMoneyDetails(customerId) {
            let data = {
                customerId
            };
            console.log(data, "datasss 5555896623");

            orderCollectMoneyDetails(data)
                .then(res => {
                    if (res.status == 200) {
                        this.bankInfo = res.data.rows;

                        this.bankInfo = this.bankInfo.map(item => {
							item.customerBankCard = `用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
							item.customerBankCardId = String(item.customerBankCardId);
                            return item;
                        });

                        console.log(
                            this.bankInfo,
                            this.bankInfo.customerBankCard,
                            "this.bankInfo 95574"
                        );
                    }
                })
                .catch(err => {
                    console.log(
                        "仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",
                        err
                    );
                });
        },
		//文件成功操作
		uploadSectionFile(res) {
			put(res).then(data => {
				this.imgArr.push(data);
			});
		},

		//刪除图片
		handleRemove(file, fileList) {
			if(this.disabled) {
				this.$message({
					message: '不可删除',
					type: 'warning'
				});
				
				return;
			}

			if (file.dataSourceId) {
				//console.log("旧图片删除");
				let delobj = {
					accessoryId: file.accessoryId,
					dataSourceId: file.dataSourceId,
					dataSourceEnum: file.dataSourceEnum
				};
				this.delImgArr.push(delobj);
			} else {
				//console.log("新增图片删除");
				let lengs = String(file.raw.uid).length;
				this.imgArr1 = this.imgArr1.filter(item => {
					let str = item.name.substring(0, lengs);
					return str !== String(file.raw.uid);
				});
			}
		},
		// 查看编辑回显信息
		getViewData() {
			let data = {
				dutyCompensationId: this.rowData.dutyCompensationId
			};

			dutyCompensationDeatil(data).then(res => {
				if(res.status == 200) {
					if(res.data) {
						this.compenData = res.data;
						
						this.compenData.compensationWay = String(this.compenData.compensationWay);
						// this.compenData.customerBankCardId = "";
						this.compenData.accountName = this.compenData.username; // 转账的 用户名
						this.compenData.customerBankCardId = String(this.compenData.customerBankCardId);
						this.bankInfo = res.data.customerBankCards;
                        this.bankInfo = this.bankInfo.map(item => {
							item.customerBankCard = `用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
							item.customerBankCardId = String(item.customerBankCardId);
                            return item;
						});
						// this.getorderCollectMoneyDetails(this.compenData.customerId);

						this.fileList = res.data.compensationAccessory;
						this.fileList = this.fileList.map(item => {
							return {
								url: item.fileUrl,
								name:  item.sourceName,
							}
						})
					}else {
						this.compenData = {
							compensationNumber: '', // 赔偿单号
							customerBankCardId: '',
						};
					}
 					
				}
			}).catch(err =>{
				console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/components/editdia.vue', err);
			})
		},

		submitForm(type) {
			if(type == 1) { // 查看弹框
				this.$emit("confirm_dialog")
			}else if(type == 2) { // 编辑弹框

				this.bankInfo.map(item => {
					if (item.customerBankCardId == this.compenData.customerBankCardIdWatch ) {
						this.compenData.accountName = item.accountName; // 用户名
						this.compenData.affiliatedBank = item.affiliatedBank; // 开户行
						this.compenData.bankCardNumber = item.bankCardNumber; // 卡号

					}
				});

				// 新增附件
				this.addAccess();

				let data = {
					dutyCompensationId: this.rowData.dutyCompensationId, //
					compensationNumber: this.compenData.compensationNumber, // 赔偿单号 
					taskDutyNumber: this.compenData.taskDutyNumber, //  定责单号
					orderNumber: this.compenData.orderNumber, //  关联单号
					groupName: this.compenData.groupName, //  发起部门
					initiateName: this.compenData.initiateName, //  发起人
					initiateCompensationTime: this.compenData.initiateCompensationTime, //   发起时间
					customerName: this.compenData.customerName, //  客户姓名
					customerPhone: this.compenData.customerPhone, //  客户电话


					customerId: this.compenData.customerId, // 客户id

					compensationWay: this.compenData.compensationWay, // 赔偿方式
					compensationCause: this.compenData.compensationCause, // 赔偿原因
					compensationMoney: this.compenData.compensationMoney, // 赔偿金额
					reduceMoney: this.compenData.reduceMoney, // 减收金额
					remake: this.compenData.remake, // 备注
					username: this.compenData.username, // 户名
					customerBankCard: {
						// remake: this.compensa.remake, // 备注

						customerBankCardId: this.compenData.customerBankCardIdWatch, // 所选的客户银行id or 银行信息
						accountName: this.compenData.accountName, // 用户名
						affiliatedBank: this.compenData.affiliatedBank, // 开户行
						bankCardNumber: this.compenData.bankCardNumber // 卡号
					}
				}

				editDutyCompensation(data).then(res => {
					if(res.status == 200) {

						this.$emit("confirm_dialog")
					}
				}).catch(err =>{
					console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/components/editdia.vue',err);
				})

				
				

			}

			
		},
		// 添加附件
		addAccess() {
			if (this.imgArr.length > 0) {
				this.imgArr.map(item => {
					return {
						fileUrl: item.url,
						sourceName: item.name
					};
				}).forEach(item => {
					let query = {
						dataSourceEnum: "CompensationAccessory",
						dataSourceId: this.rowData.dutyCompensationId,
						...item
					};
					addAccessory(query).then(res => {});
				});
			}
			if (this.delImgArr.length > 0) {
				//有删除旧图片
				console.log("有删除旧图片");
				this.delImgArr.forEach(item => {
					removeAccessoryImg(item).then(res => {});
				});
			}
		},

		// 删除附件
    //   handleDelete(val) {
    //     let data = {
    //       dataSourceId: this.rowData.dutyCompensationId,
    //       accessoryId: val
    //     }
    //     removeAccessoryImgById(data).then(res =>{
    //       console.log(res);
    //       if(res.status == 200){
    //         this.$message({
    //           message: '成功删除附件',
    //           type: 'success'
    //         }); 
    //         // 附件列表
    //         this.accessorfun();
    //       }
    //     }).catch(error =>{
    //       console.log('附件管理列表 administrationCenter/contractmanagement/components/accessory.vue', error);
    //     })
    //   },

		// 点击取消按钮
		selectclo(){
			this.$emit("close_dialog")
		},
		// 通 过
		throughFun(status ) {
			

			let data = {
				status,
				dutyCompensationId: this.rowData.dutyCompensationId
			};

			editDutyCompensationStatus(data).then(res =>{
				if(res.status  == 200) {
					if(status == '1') {
						this.$message({
							message: '通过成功',
							type: 'success'
						});
					}else if(status == '3') {
						this.$message({
							message: '驳回成功',
							type: 'success'
						});
					}

					this.$emit("get_list"); // 刷新列表

					this.$emit("confirm_dialog");
				}
			}).catch(err => {
				console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/components/editdia.vue',err);
			})
		},
	
		
	}
};
</script>
<style scoped lang='scss'>
.edit_dia{
	.orderbox{
			width: 100%;
			font-size: 14px;
			border-top: 1px solid #e4e4e4;
			border-left: 1px solid #e4e4e4;
			.orderlsit{
				display: flex;
				li{
					padding: 0px 10px;
					display: flex;
					align-items: center;
					border-right: 1px solid #e4e4e4;
					border-bottom: 1px solid #e4e4e4;
					line-height: 2.2;
					&:nth-child(odd){
						width: 120px;
						text-align: center;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						overflow: hidden;
					}
					&:nth-child(even){
						flex: 1;
						color: #999;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						display: block;
					}
					// 关联附属订单样式
					&.orderclas{
						display: flex;
						align-items: center;
						span{
							&:nth-child(odd){
								color: #5F71E7;
							}
							&:nth-child(even){
								color: #E50E0F;
								margin-right: 10px;
							}
						}
					}
				}
			}
		}
		.editinput{
			margin-top: 20px;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: space-around;
			.list {
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				>span {
					padding-left: 12px;
				}
			}
		}
		.upimg {
			margin-top: 20px;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			span {
				width: 120px;
				display: inline-block;
				white-space: nowrap;
				text-align: right;
				padding-right :12px;
				box-sizing: border-box;
			}
		}
		
}
		

</style>

<style lang="scss">
    .orderbox{
        .orderlsit{
            li{
                .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                    border: 0px;
                    appearance: none;
                    background: transparent;
					padding-right: 0px;
                }
                .el-input__suffix{
                    display: none;
                }
            }
            
        }
    }
	.optionSelf {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		padding: 6px;
		span {
			text-align: left;
			display: inline-block;
			&:nth-of-type(1) {
				padding: 0 8px 0 0;
			}
			&:nth-of-type(2) {
				padding: 0 8px 0 0;
			}
			&:nth-of-type(3) {
				flex: 1;
			}
		}
	}
</style>

