<template>
  <div class="wrapper">
  
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card style="marginBottom: 54px;">
			<div class="iconBox m-bottom" v-if="appealData.length !=0">
				<i class="Icon"></i>
				<span>申诉详情</span>
			</div>
			<div class="add_head_list">
                <div v-if="appealData.length !=0">
                    <div class="topDuty"   v-for="(item,index) in appealData" :key="index" style="marginBottom: 20px;">
                        <div class="addduty" >
                            <div class="orderbox">
                                <ul class="orderlsit">
                                    <li>定责单号</li>
                                    <li>{{item.taskDutyNumber}}</li>
                                    <li>来源</li>
                                    <li>{{item.source}}</li>
                                    <li>来源单号</li>  
                                    <li>{{item.orderNumber}}</li>
                                </ul>

                                <ul class="orderlsit">
                                    <li>被定责人</li>
                                    <li>{{item.dutyName}}</li>
                                    <li>定责时间</li>
                                    <li>{{item.sponsorTime}}</li>
                                    <li>定责理由</li>
                                    <li>{{item.dutyCause}}</li>
                                </ul>
                            </div>
                        
                            <div class="dutyPhoto">
                                <span>定责附件</span>
                                <!-- <div class="photos"> -->
                                <div class='contentBox'>
                                    
                                    <div class="upImgBox">
                                        <ul>
                                            <li  v-for="(itm,idx) in item.taskDutyPic" :key="idx">
                                                <img :src="itm.fileUrl" alt="">
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                    
                                
                            </div>
                        
                        </div>

                        <div class="complaint">
                           

                            <div class="complcontent">
                                <div class="comtop">
                                    <div class="comapart">
                                        <span>申诉人：</span>
                                        <span>{{item.dutyName}}</span>
                                    </div>
                                    <div class="comapart">
                                        <span>申诉理由：</span>
                                        <span>{{item.appealCause}}</span>
                                    </div>
                                    <div class="comapart">
                                        <span>发起时间：</span>
                                        <span>{{item.appealTime}}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="dutyPhoto" v-if="item.appealPic.length != 0">
                                <span>申诉附件</span>

                                <div class='contentBox'>
                                    
                                    <div class="upImgBox">
                                        <ul>
                                            <li  v-for="(iem,inex) in item.appealPic" :key="inex">
                                                <img :src="iem.fileUrl" alt="">
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                             <div class="h-width"></div>
                        </div>
                    </div>
				
                </div>
                

                <div class="tableContent">
                    <div class="iconBox m-bottom">
                        <i class="Icon"></i>
                        <span>申诉管理</span>
                    </div>

                    <div class="table_list lvs attribute m-top20">
                        <el-table
                            border
                            :row-class-name="tableRowClassName"
                            :row-style="tableBodycolor"
                            :data="dutyData"
                            style="width: 100%;">

                            <el-table-column
                                label="定责单号"
                                prop="taskDutyNumber" sortable align="center">
                                <template slot-scope="scope">
                                    <div>
                                        <el-tooltip placement="right" visible-arrow v-if="scope.row.status == 3">
                                            <div slot="content" class="tips tipFon">
                                                <p @click="auditHandle(scope.row)" class="operaItems">申诉同意</p>
                                                <p @click="edittHandle(scope.row)" class="operaItems">编辑</p>
                                            </div>
                                            <img :src="spot" alt="" class="attributesTips">
                                        </el-tooltip>

                                        <p class="text">{{scope.row.taskDutyNumber}}</p>
                                    </div>       
                                </template>
                            </el-table-column>

                            <el-table-column
                                label="被定责人"
                                prop="dutyName" sortable  align="center">
                            </el-table-column>

                            <el-table-column
                                label="被定责人电话"
                                prop="mobilePhone" sortable  align="center" >
                            </el-table-column>

                            <el-table-column
                                label="定责时间"
                                prop="sponsorTime" sortable  align="center" >
                            </el-table-column>

                            <el-table-column
                                label="生效时间"
                                prop="effectiveTime" sortable  align="center" >
                            </el-table-column>

                            <el-table-column
                                label="定责状态"
                                prop="status" sortable  align="center" :formatter="statusformatter">
                            </el-table-column>

                            <el-table-column
                                label="处罚方式"
                                prop="punishType" sortable  align="center" :formatter="typeformatter">
                            </el-table-column>

                            <el-table-column
                                label="处罚金额"
                                prop="punishMoney" sortable  align="center" >
                            </el-table-column>

                            <el-table-column
                                label="备注"
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
				
				<!-- 申诉弹框 -->
                <!-- <appealdia :visible="diaVisible" @close_app="closeapp" @send_app="sendapp"></appealdia> -->


                <!-- 编辑弹出框 -->
                <editdia v-if="diaVisible" :rowdata = "rowdata" @close_app="closeapp" @send_app="sendapp"></editdia>

			</div>

			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="submission">确认发起</el-button>
				<el-button  @click="colseBtn">取消</el-button>
			</div>
        
		</el-card>

		 <!-- 订单 -->
        <div v-if="visible">
          <!-- <orderlist></orderlist> -->
		  	<el-dialog title="" :visible.sync="visible" >
				<orderlist></orderlist>
		  	</el-dialog>
        </div>

  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import orderlist from "../components/orderlist";
import appealdia from "../components/appealdia";
import editdia from "../components/editdia";

import {
  appealDetails, // 申诉详情
  dutyBaseUserDetails,  // 申诉管理中编辑时回显接口
  editDutyBaseUser,  // 申诉同意接口 status传4 处罚方式为4 处罚金额为0
} from 'api/entrepotSet/duty/index';

import spot from '@/assets/images/spot.png';
import {
  getNames,
} from 'src/utils/pubilcFn.js';

import { getUpToken } from "@/utils/auth";
import { log } from 'util';
export default {
	components: {
		breadcrumb,
		pagination,
		orderlist,
        appealdia,
        editdia,
	},

	name: 'addduty',

	data() {
		return {
            taskDutyId: this.$route.query.taskDutyId,
            appealData: [], // 申诉详情数据
            spot,
            ordernum: '',
            rowdata: '', // 编辑的那一行的row数据
			//头部面包屑导航
			navList: [],
		
			duty: {
				reason: '',
				remarks: '',
			},
			dutyData: [], // 表格数据
			// 条件
			sourceList:[{  // 来源条件
				label: '安装',value: '0'
			},{
				label: '维修',value: '1'
			},{
				label: '入库',value: '2'
			},{
				label: '出库',value: '3'
			},{
				label: '物流',value: '4'
			},],   
			responList: [], // 被定责人条件
            typeList: [{
				label: '罚款',value: '0'
			},{
				label: '暂扣',value: '1'
			},{
				label: '不处罚',value: '2'
			},{
				label: '其他',value: '3'
			},],
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
			TechnologyList:[{
				
			},{
				
			},{
				
			},{
				
            },], // 图片
            
			// 分页
			currentPage: 1,//当前页数
			pageSize: 20,//总页数
			total: 100,//总条数
			
			visible: false,
			elsectVal: [],
			dutyType: '',
            desc: '',
            diaVisible: false
            
		};
	
	},
  
	mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;
		this.uptoken.token = getUpToken();
	},

	created() {
		let data = {
			page: this.currentPage,
			limit: this.pageSize,
		};
		this.getList(data);

        // 申诉详情  上面的
        data = {
			status: 3,
			taskDutyId: this.taskDutyId,
		};
        this.getappealDetails(data);

        // 申诉管理 
        data = {
            taskDutyId: this.taskDutyId,
        }
        this.getappealDetails(data);
	},

    methods: {
        // 状态 1未接受 2 已接受 3 申诉中 4申诉通过 5有条件接受
        statusformatter(row, column) {
            let status = '';
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
        // 获取地址栏传过来的参数
        // if (this.$route.query.type) {
        //     this.accidentQueryParams['where'][2]['v'] = this.$route.query.type
        //     console.log(this.$route.query.type) 
        // }
        // 申诉详情列表 and 申诉管理
        getappealDetails(data) {
            appealDetails(data).then(res => {
                if(res.status == 200) {
                    if (data.status) { // 如果传status  就是 申诉详情
                        this.appealData = res.data.rows;
                    }else { // 不传status  就是 申诉管理
                        this.dutyData = res.data.rows;
                    }
                    
                }
            }).catch(err =>{
                console.log("定责管理:定责列表 申诉详情 duty/dutylist/dutydeal.vue",error);
            })
        },
        // 编辑弹出框 -- 取消按钮 以及 关闭弹出框的功能
        closeapp() {
            
            // 申诉管理 
            let data = {
                taskDutyId: this.taskDutyId,
            }
            this.getappealDetails(data);
            this.diaVisible = false;
        },
        // 编辑弹出框 -- 子组件触发
        sendapp() {
            // 申诉管理 
            let data = {
                taskDutyId: this.taskDutyId,
            }
            this.getappealDetails(data);
            this.diaVisible = false;
        },
        // 申诉同意
        auditHandle(rowdata){
            // status传4 处罚方式为4 处罚金额为0
            let data = {
                status: 4,
                punishType: 4,
                punishMoney: 0,
                dutyBaseUserId: rowdata.dutyBaseUserId,
            };
            editDutyBaseUser(data).then(res => {
                if(res.status == 200) {
                    this.$message({
                        message: '该申诉已同意',
                        type: 'success'
                    });
                }
            }).catch(err =>{
                console.log("定责管理:定责列表 申诉详情 申诉同意 duty/dutylist/dutydeal.vue",error);
            });

            data = {
                taskDutyId: this.taskDutyId,
            }
            this.getappealDetails(data);
        },  
        // 编辑
        edittHandle(row){
            this.rowdata = row;
            console.log(this.rowdata,"this.rowdata 2222222");
            
			this.diaVisible = true;
		},
		// 选择订单
		orderdialog(){
			this.visible= true;
		},
		// 添加
		addHandle (){
			
		}, 
	
		// 删除
		deleteHandle(){
			
		},

		colseBtn(){
           
		},
		//提交
		submission(){
		
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
		//文件删除操作
		handleRemove(file, fileList) {
			// if (this.referrerId) {
			// let data = {
			// 	accessoryId: file.accessoryId,
			// 	dataSourceId: file.dataSourceId,
			// 	dataSourceEnum: file.dataSourceEnum
			// };
			// removeAccessoryImg(data).then(res => {
			// 	if (res.status == "200") {
			// 	this.$message.success("删除图片成功");
			// 	} else {
			// 	this.$message.error("删除图片失败");
			// 	}
			// });
			// } else {
			// this.fileList = fileList;
			// }
		},


        // 搜索条件获取
        searchdatas(){
            return {
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        
        
		
		// 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.pageSize = val;
            let data = this.searchdatas();
            this.getList(data);
		},

        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
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
		.addduty {
			.addlist {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-wrap: wrap;
				li {
					width: 28%;
					margin: 20px 0px;
					display: flex;
					flex-wrap: nowrap;
					justify-content: center;
					align-items: center;
					div	{
						display: flex;
						flex-wrap: nowrap;
						justify-content: center;
						align-items: center;
						span {
							width: 120px;
							display: inline-block;
							white-space: nowrap;
							text-align: right;
							padding-right :12px;
							box-sizing: border-box;
							&:nth-of-type(even) {
								text-align: left;
							}
						}

					}
					&:nth-of-type(n + 4) {
						width: 42%;
						justify-content: flex-start;
					}
					&:nth-of-type(n + 6) {
						width: 100%;
						justify-content: flex-start;
					}
	
				}
				.remarks {
					width: 100%;
					.duty_item {
						display: flex;
						flex-wrap: nowrap;
						justify-content: center;
						align-items: center;
						width: 100%;
						.el-textarea {
							width: 80%;
						}
					}		
				}
            }
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
            
		}
		.complaint{
            .complcontent {
                margin: 20px 0px;
                .comtop {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: space-between;
                    .comapart{
                        width: 32%;
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;
                        span {
                            white-space: nowrap;
                            overflow: ellipsis;
                            &:nth-of-type(1) {
                                width: 120px;
                                padding-right: 12px;
                                white-space: nowrap;
                                text-align: right;
                            }
                            &:nth-of-type(2) {
                                flex: 1;
                            }
                        }

                    }
                }
            }
        }
        .tableContent {
            margin-top: 20px;
        }
        .dutyPhoto {
            display: flex;
            align-items: center;
            margin-top: 20px;
            flex-wrap: nowrap;
            align-items: center;
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

<style lang="scss">
    .table_list{     
		.el-input__inner {
			height: 23px;
			line-height: 23px;
			border: 0px;
			appearance: none;
			background: transparent;
		}
		.el-input__suffix{
			display: none;
		} 
       
    }
</style>