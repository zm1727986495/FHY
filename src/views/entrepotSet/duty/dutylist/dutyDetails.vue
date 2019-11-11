<template>
  <div class="wrapper">
  
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card style="marginBottom: 54px;">
			<div class="iconBox m-bottom">
				<i class="Icon"></i>
				<span>详情信息</span>
			</div>
			<div class="add_head_list">
				<!-- 定责详情table -->
				<listdetail :taskduty = "taskduty"></listdetail>
				
				<div class="dutyPhoto" v-if="taskduty.taskDutyPic && taskduty.taskDutyPic.length != 0">
					<span>定责附件</span>
					<div class='contentBox'>
                                    
						<div class="upImgBox">
							<ul>
								<li  v-for="(itm,idx) in taskduty.taskDutyPic" :key="idx">
									<img :src="itm.fileUrl" alt="">
								</li>
							</ul>
						</div>
					</div>
				</div>
			
				<div class="dutyList">

					<div  class="table_list lvs attribute m-top20">
						<el-table
							border
							:row-class-name="tableRowClassName"
							:row-style="tableBodycolor"
							:data="dutyData"
							style="width: 100%;">
						<!-- :cell-style="cellStyle" :header-cell-style = "cellStyle" -->

							<el-table-column
								label="被定责人"
								prop="dutyName" sortable align="center">
								<template slot-scope="scope" >
									<div>
										<el-tooltip placement="right" visible-arrow v-if="scope.row.isSelf">
											<div slot="content" class="tips tipFon">
												<p @click="auditHandle(scope.row)" class="operaItems">申诉</p>
												<p @click="acceptHandle(scope.row)" class="operaItems">接受</p>
											</div>
											<img :src="spot" alt="" class="attributesTips">
										</el-tooltip>

										<p class="text">{{scope.row.dutyName}}</p>
									</div>       
								</template>
							</el-table-column>

							<el-table-column
								label="电话"
								prop="mobilePhone" sortable  align="center">
							</el-table-column>

							<el-table-column
								label="所属部门"
								prop="groupName" sortable  align="center">
								
							</el-table-column>

							<el-table-column
								label="是否申诉"
								prop="isAppeal" sortable  align="center" :formatter="auditformatter">
								
							</el-table-column>

							<el-table-column
								label="申诉状态"
								prop="status" sortable  align="center" :formatter="statusformatter">
								
							</el-table-column>

							<el-table-column
								label="处罚方式"
								prop="punishType" sortable  align="center" :formatter="typeformatter">
							</el-table-column>

							<el-table-column
								label="处罚金额计算公式"
								prop="punishMoneyCountType" sortable  align="center" >
								
							</el-table-column>

							<el-table-column
								label="处罚金额"
								prop="punishMoney" sortable  align="center" >
								
							</el-table-column>

							<el-table-column
								label="说明"
								prop="remake" sortable  align="center" >
							</el-table-column>

						
						</el-table>
					</div>

					<!-- 分页 -->
					<div class="pagination_wrap">
						<pagination
							:current-page="currentPage"
							:pageSize="pageSize"
							:total="total"
							@sizeChange="sizeChange"
							@currentChange="currentChange">
						</pagination>
					</div>
				</div>

			</div>

			<div slot="footer" class="dialog-footer backButton">
				<!-- <el-button type="primary" @click="submission">提交审核</el-button> -->
				<el-button  @click="colseBtn">返回</el-button>
			</div>
        
		</el-card>
		<!-- 申诉弹框 -->
        <appealdia v-if ="diaVisible" :rowAudit="rowAudit" :page="currentPage" :limit="pageSize" @close_dialog="closedialog" @get_appealDetails="getappealDetails"></appealdia>

		<!-- 商品 -->
        <div v-if="show == 1">
          <prolist></prolist>
        </div>


        <!-- 订单 -->
        <div v-if="show == 2">
          <!-- <orderlist></orderlist> -->
			<choseord></choseord>
        </div>

  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import listdetail from "../components/listdetail";
import appealdia from "../components/appealdia";


import {
  taskDutyMessage, // 详情回显
  appealDetails, // 详情页列表
  editDutyBaseUser, // 接受

} from 'api/entrepotSet/duty/index';
import spot from '@/assets/images/spot.png';
import {
  getNames,
} from 'src/utils/pubilcFn.js';

export default {
	components: {
		breadcrumb,
		listdetail,
		pagination,
		appealdia
	},

	name: 'dutyDetails',

	data() {
		return {
			taskduty: {
				taskDutyPic: [],
			}, // 详情回显
			spot,
			//头部面包屑导航
			navList: [],
			// 上传
			fileList:[], 
			imgShow: "http://file.xczhihui.com/", //文件上传域名
			action: "http://up-z2.qiniup.com",
			accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
			

			TechnologyList:[{
				
			},{
				
			},{
				
			},{
				
			},], // 图片
			
			dutyData: [], // 表格数据

			// 分页
			currentPage: 1,//当前页数
			pageSize: 20,//总页数
			total: 100,//总条数
			
			show: 0,
			diaVisible: false,
			rowAudit: {},
		};
	
	},
	
	activated(){
		let data = { // 详情页回显
			taskDutyId: this.$route.query.taskDutyId
		} // 详情页回显
		this.gettaskDutyMessage(data);

		data = { // 详情页列表
			taskDutyId: this.$route.query.taskDutyId,
			page: 1,
			limit: this.pageSize,
		} // 详情页列表
		this.getappealDetails(data);

		// 头部面包屑
		this.navList = this.$route.meta;
	},
	// deactivated () {
	// 	this.$destroy(true)
	// },
	// mounted() {
	// 	// 头部面包屑
	// 	this.navList = this.$route.meta;
	// },

	// created() {
		
	// 	let data = { // 详情页回显
	// 		taskDutyId: this.$route.query.taskDutyId
	// 	} // 详情页回显
	// 	this.gettaskDutyMessage(data);

	// 	data = { // 详情页列表
	// 		taskDutyId: this.$route.query.taskDutyId,
	// 		page: 1,
	// 		limit: this.pageSize,
	// 	} // 详情页列表
	// 	this.getappealDetails(data);
	// },

    methods: {
		// 申诉状态 0否
        auditformatter(row, column) {
            // return row.source;
            let isAppeal = '';
            switch (row.isAppeal) {
                case "0":
                    isAppeal = "否"
                    break;
                case "1":
                    isAppeal = "是"
                    break;
                default: 
                    isAppeal = ""
            }
            return  isAppeal;
        },
		// 处罚方式 1罚款 2暂扣 3其他 4不处罚 ,
        typeformatter(row, column) {
            // return row.source;
            let punishType = '';
            switch (row.punishType) {
                case 1:
                    punishType = "罚款"
                    break;
                case 2:
                    punishType = "暂扣"
                    break;
                case 3:
                    punishType = "其他"
                                        
                    break;
                case 4:
                    punishType = "不处罚"
                    break;
                default: 
                    punishType = ""
            }
            return  punishType;
        },
		//  1未接受 2 已接受 3 申诉中 4申诉通过 5有条件接受
		statusformatter(row, column) {
			let status = '';
			console.log(row.status,"status 56556558");
			
			switch (row.status) {
				case 1:
					status = "未接受"
					break;
				case 2:
					status = "已接受"
					break;
				case 3:
					status = "申诉中"
										
					break;
				case 4:
					status = "申诉通过"
					break;
				case 5:
					status = "有条件接受"
					break;  
				default: 
					status = ""
			}
			return  status;
		},
		// 详情页回显
		gettaskDutyMessage(data) {
			taskDutyMessage(data).then(res => {
				if(res.status == 200) {
					if(res.data) {
						this.taskduty = res.data;
					}else {
						this.taskduty = {
							taskDutyPic: [],
						}; // 详情回显
					}
					
				}
			}).catch(err => {
				console.log("定责管理:定责列表 定责详情页 duty/dutylist/dutyDetails.vue",err);
			})
		},
		// 详情页列表
		getappealDetails(data) {
			if(data){
				appealDetails(data).then(res => {
					if(res.status == 200) {
						this.total = res.data.total;
						this.dutyData = res.data.rows;
					}
				}).catch(err => {
					console.log("定责管理:定责列表 详情页列表 duty/dutylist/dutyDetails.vue",err);
				})
			}
			this.diaVisible = false;
		},
		// 关闭申诉弹框 -- 子组件触发
		closedialog() {
			this.diaVisible = false;
		},
		// 确认按钮-- 申诉弹框 -- 子组件触发
		senddialog() {
			this.diaVisible = false;
		},
		// 申诉
		auditHandle(rowData) {
			this.rowAudit = rowData;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
			this.diaVisible = true;
		},
		// 接受
		acceptHandle(rowData) {
			console.log(rowData.dutyBaseUserId,"dutyBaseUserId 999544");
			
			let data = { 
				dutyBaseUserId: rowData.dutyBaseUserId,
				// taskDutyId: rowData.taskDutyId,
				status: 2,
			};

			editDutyBaseUser(data).then(res => {
				if(res.status == 200) {
				
					let data = { // 详情页列表
						taskDutyId: this.$route.query.taskDutyId
					} // 详情页列表
					this.getappealDetails(data);

					this.$message({
						message: '接受成功',
						type: 'success'
					});
				}
			}).catch(err => {
				console.log("定责管理:定责列表 接受 duty/dutylist/dutyDetails.vue",err);
			})
		},
		//提交
		submission(){
		
		},

		colseBtn(){
           
		},
		

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

        // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0], 
                // goodsSource: this.goodsSource[0],
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        
        
		
		// 分页函数回调
        currentChange(val) {
			this.currentPage = val;
			

			let data = { // 详情页列表
				taskDutyId: this.$route.query.taskDutyId,
				page: this.currentPage,
				limit: this.pageSize,
			} // 详情页列表
			this.getappealDetails(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.pageSize = val;
            let data = { // 详情页列表
				taskDutyId: this.$route.query.taskDutyId,
				page: this.currentPage,
				limit: this.pageSize,
			} // 详情页列表
			this.getappealDetails(data);
		},




		filterHandler(value, row, column) { //筛选方法调用
			const property = column['property'];
			return row[property] === value;                
		},

		getInfos(val){
			this.names = getNames('customerName',val);//调用筛选数据处理
		},
	
		tableRowClassName({row, rowIndex}) {//表格斑马线设置
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
		
		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
		//   return "height: 80px";
		},
		
	
        
  }
};
</script>
<style scoped lang='scss'>

	.add_head_list {
			
		.dutyPhoto {
			display: flex;
			align-items: center;
			margin-top: 20px;
			span {
				width: 104px;
				display: inline-block;
				white-space: nowrap;
				text-align: right;
				padding-right :12px;
				box-sizing: border-box;
			}
			.contentBox{
                // display: flex;
    
                .upImgBox {
                    li{
                        width: 120px;
                        height: 120px;
                        overflow: hidden;
                        display: inline-block;
                        margin-right:20px;
                        margin-bottom: 20px;
                        img {
                            width: 100%;
                            height: 100%;
                            display: block;
                            background-size: 100%;
                            background-repeat: no-repeat;
                        }
                    }
                    
                }
            }
		}
	}

	


</style>

