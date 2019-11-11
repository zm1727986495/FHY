<template>
    <!-- 邀约到店弹框页面 -->
    <div style="width:100%;">
        <div class='Dialog_input_cell'>
            <orderdetail :orderId="orderId"></orderdetail>
            <div class='Dialog_content'>
                <el-form :label-position="labelPosition" label-width="170px" :model="fromdatas" class="demo-form-inline-two">
                        <el-form-item label="邀约到店时间" v-if="timeswatch">
                            <div class="block">
                                <el-date-picker 
                                    v-model="fromdatas.handoverDate" 
                                    value-format='yyyy-M-dd HH:mm:ss'
                                    format='yyyy-M-dd HH:mm:ss'
                                    size="medium" type="datetime" 
                                    placeholder="选择日期" class="selewi">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="邀请方式" v-if="timeswatch">
                            <el-radio-group v-model="fromdatas.sendWay">
                                <el-radio :label="1">短信</el-radio>
                                <el-radio :label="2">公众号</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- <el-form-item label="邀约到店微信公众号邀请">
                        </el-form-item>
                        <el-form-item label="内容" class="addressclas">
                            <el-input type="textarea" v-model="fromdatas.remarks"></el-input>
                        </el-form-item> -->
                        <el-form-item label="" v-if="fromdatas.sendWay == 2 || !timeswatch">
                            <el-checkbox v-model="fromdatas.isBudget">是否发送预算清单</el-checkbox>
							<el-select v-model="fromdatas.budgetId"  v-if="fromdatas.isBudget"   placeholder="预算清单" size="medium" style="margin-left: 20px;" @change="bugetFun" collapse-tags>
								<el-option
									v-for="item in bugetList" :key="item.budgetId"
									:label="item.versionName ? item.versionName : item.budgetNumber" :value="item.budgetId">
								</el-option>
							</el-select> 
                            <el-form-item label="是否显示价格信息" v-if="fromdatas.isBudget && fromdatas.budgetId">
                                <el-radio-group v-model="fromdatas.isShowPrice">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!-- <div class="budgetContent" v-if="bugetView && bugetView.length != 0">
                                <ul class="el-upload-list el-upload-list--text budgetlists">
                                    <li tabindex="0" class="el-upload-list__item is-success" v-for="item in bugetView" :key="item.budgetId">
                                        <a class="el-upload-list__item-name">
                                            {{item.versionName ? item.versionName : item.budgetNumber}}
                                        </a>
                                        <el-radio-group v-model="item.isSend">
                                            <el-radio :label="1">是</el-radio>
                                            <el-radio :label="0">否</el-radio>
                                        </el-radio-group>
                                    </li>
                                </ul>
                            </div> -->
                        </el-form-item>
                        <el-form-item label="" v-if="fromdatas.sendWay == 2 || !timeswatch">
                            <el-checkbox v-model="fromdatas.isDesign">是否发送设计图</el-checkbox>
                            <el-popover v-if="fromdatas.isDesign"
                                placement="bottom"
                                width="40%"
                                trigger="click"
                                v-model="visible">
                                <div class="table_list lvs attribute designList">
                                    <el-table
                                        border
										ref="multipleTable"
                                        :row-class-name="tableRowClassName"
                                        @selection-change="handleSelectionChange"
                                        :data="tabList"
                                        style="width: 100%;">
                                        <el-table-column type="selection" width="40"></el-table-column>
                                        <el-table-column  property="fileType" label="附件类型"></el-table-column>
                                        <el-table-column  property="sourceName" label="附件名称" show-overflow-tooltip></el-table-column>
                                        <el-table-column  property="createTime" label="上传时间"  show-overflow-tooltip></el-table-column>
                                        <el-table-column  property="createName" label="上传人"></el-table-column>
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
                                <div style="text-align: right; margin-top: 20px">
                                    <el-button type="primary"  @click="sendJava">确定</el-button>
                                    <el-button  @click="cancel">取消</el-button>
                                </div>
                                 <!-- <div slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="sendJava">确 定</el-button>
                                    <el-button @click="cancel">取 消</el-button>
                                </div> -->
                                 <!-- @click="popDesign" -->
                                <el-button  slot="reference" type="text">选择设计图</el-button>
                            </el-popover>   

							<ul class="el-upload-list el-upload-list--text">
								<li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in elsectFile" :key="index">
									<a class="el-upload-list__item-name">
										<i class="el-icon-document"></i>  {{item.sourceName}}
									</a>
									<label class="el-upload-list__item-status-label">
										<i class="el-icon-upload-success el-icon-circle-check"></i>
									</label>
									<i class="el-icon-close" @click="removeItem(item.accessoryId)"></i>
									<i class="el-icon-close-tip">按 delete 键可删除</i>
								</li>
							</ul>

                        </el-form-item>
                    </el-form>
                

            </div>
        </div>
        <!-- <div class='Dialog_input_cell'>
            <div class='Dialog_content'>
            <el-checkbox v-model="whether">当前订单有收款信息，无法作废，是否走退单流程</el-checkbox>
            <div class='reasons'>
                <span class='fontWidth'>退单原因：</span>
                <el-input
                   type="textarea"
                   :rows="2"
                   placeholder="请输入内容"
                   v-model="textarea">
                </el-input>
            </div>
            </div>
        </div> -->
    </div>
</template>
<script>

import orderdetail from "../../components/orderdetail";
import pagination from "@/views/components/pagination";
import {
  designList,
  listOrderBudget, // 预算清单
} from 'api/order/order/order';

export default {
    data() {
        return {
            visible: false, // pop的显示flag
            fromdatas: {
                handoverDate: '',
                isShowPrice: '',
                remarks: '',
                isBudget: false,
                isDesign: false,
                budgetId: '', // 预算清单id
                sendWay: 1, // 邀请方式
            },
            labelPosition: 'right',
			elsectVal: [], // 选中组成的数组
			elsectFile: [], // 选中文件名组成的数组
            tabList: [], //table数据
			bugetList:[{  // 来源条件
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
            // 分页
            currentPage: 1, //当前页数
            pageSize: 20, //总页数
            total: 100, //总条数
            bugetView: [],
        }
    },
    props:{
        orderId: {
            type: Number
        },
        timeswatch: {
            type: Boolean,
            default: true,
        }
    },
    components: {
        orderdetail,
        pagination,
    },
    mounted() {
	},
	created() {
		let data = {
			orderId: this.orderId,
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);

        // 预算清单
        this.listOrderBudget();
    },
    watch:{
        'fromdatas.isBudget'(val) {
            if(val) {

            }else {
                this.fromdatas.budgetId = '';
                this.fromdatas.isShowPrice = ''; // 价格信息
            }
        },
        'fromdatas.isDesign'(val) {
            if(!val) {
                this.$refs.multipleTable.clearSelection();
                this.elsectFile = [];
            }
        },
        'fromdatas.sendWay'(val){
            if(val == 1) {
                this.fromdatas.isBudget =  false,
                this.fromdatas.isDesign =  false,
                this.fromdatas.budgetId = '', // 预算清单id
                this.fromdatas.isShowPrice = '';  // 价格信息
                this.elsectFile = [];

                // this.accessoryId = [];
            }
        }

        // 'fromdatas.budgetId'(val) {
        //     this.bugetView = this.fromdatas.budgetId.map(item => {
        //         for(let i = 0; i < this.bugetList.length; i++) {
        //              if(item == this.bugetList[i].budgetId) {
        //                 console.log(this.bugetList[i],"this.bugetList[i] 333");
        //                 return this.bugetList[i];
        //              }
        //         }
        //         // this.bugetList.forEach(itm => {
        //         //     if(item == itm.budgetId) {
        //         //         this.bugetView.push({
        //         //             budgetId: itm.budgetId,
        //         //             versionName: itm.versionName
        //         //         })
        //         //     }
        //         // })
        //     })
        // },
    },

    methods:　{
        bugetFun() {
            // console.log(this.fromdatas.budgetId,"this.fromdatas.budgetId 111");
            
            // this.fromdatas.budgetId.forEach(item => {
            //     this.bugetList.forEach(itm => {
            //         if(item == itm.budgetId) {
            //             this.bugetView.push({
            //                 budgetId: itm.budgetId,
            //                 versionName: itm.versionName
            //             })
            //         }
            //     })
            // })

            // console.log( this.bugetView," this.bugetView 111");
            
        },
         // 获取预算清单
        listOrderBudget() {
            let data = {
                orderId: this.orderId,
            }
            listOrderBudget(data).then(res => {
                if(res.status == 200) {
                    this.bugetList = res.data.rows;
                    this.bugetList.map(item => {
                        return {
                            ...item,
                            isSend: "",
                        }
                    }) 
                }
            }).catch(err => {
                console.log('订单管理:订单列表 order/order/components/invitation.vue', err);
            })
        },

        // 设计图弹框的确定操作按钮 -- pop
        sendJava() {
            if(this.elsectVal.length > 1) {
                this.$message.warning("选择请勿大于一个");
                return;
            }else if(this.elsectVal.length < 1) {
                this.$message.warning("请进行选择");
                return;
            }
            this.elsectFile = [];
            
			this.elsectVal.map(item => {
				this.elsectFile.push(item);
			});
            this.visible = false
        },
        // 取消操作按钮 -- pop
        cancel() {
			this.visible = false;
			// this.elsectVal = this.elsectFile;
			let filterItem = this.elsectVal.filter(item => { // table选中 
				let flag = this.elsectFile.every(itm => { // 显示
					return item != itm;
				})
				if(flag) {
					return item
				}
			})


			filterItem.map(item => {
				this.$refs.multipleTable.toggleRowSelection(item);
			})
			
		},
		
        //勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
			console.log(this.elsectVal);
		},

        //表格斑马线设置
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? "el-f0" : "";
        },
        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
        },
         // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0], 
                // goodsSource: this.goodsSource[0],
                orderId: this.orderId,
                
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
            // 获取表格数据 -- 设计图
		getList(data){
            designList(data).then(res => {
				if(res.status == 200) {
					this.total = res.data.total;
					this.tabList = res.data.rows;
				}
			}).catch(error => {
				console.log('订单管理:订单列表 order/order/components/invitation.vue', error);

			})
		},
		removeItem(id) {
			let filterItem = this.elsectFile.filter(item => {
				return item.accessoryId == id;
			});

			this.elsectFile = this.elsectFile.filter(item => {
				return item.accessoryId != id;
			})
			
			this.$refs.multipleTable.toggleRowSelection(filterItem[0]);
		},
		
    },
        
}
</script>
<style scoped  lang="scss">
    
    .reasons{
        display: flex;
        flex-direction:row;
        margin-top:15px;
    }
    .reasons .fontWidth{
        width: 6em;
        position: relative;
    }
    .budgetContent{
        .budgetlists{
            li {
                display: flex;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
                a {
                    min-width: 100px;
                }
            }
        }
    }
    .designList{
        max-height: 200px;
        overflow-y: auto; 
    }
</style>
<style lang="scss">
.el-popover {
	width: 40%;
}
.el-select .el-select__tags>span{
    display: flex;
}
</style>

