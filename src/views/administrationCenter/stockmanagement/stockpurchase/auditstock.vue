<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">

            <!-- 输入框集合 -->
            <stockform></stockform>

            <div class="auditTable">
                <div class="iconBox m-bottom">
                    <i class="Icon"></i>
                    <span>备货清单</span>
                </div>
                <div class="addgoods">
                    <stockTable  ref="stockTable"></stockTable>
                </div>
            </div>

            <!-- 审核意见 -->
            <div class="auditContent">
                <div class="iconBox m-bottom">
                    <i class="Icon"></i>
                    <span>审核意见</span>
                </div>

                <!--  -->
                <div class="">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="approveOpinion">
                    </el-input>
                </div>
                
            </div>
            
			<!-- 附件管理 -->
            <!-- <div class="auditAssey">
                <div class="textitle">
                    <div class="titlecals">附件管理</div>
                </div>
                <el-upload
                    list-type="text"
                    class="upload-demo"
                    action="string"
                    :http-request="uploadSectionFile"
                    :file-list="fileList"
                    :on-remove="handleRemove"  v-if="!isView"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </div> -->

            <!-- 审核记录 -->
            <div class="auditAssey">
                <div class="iconBox m-bottom">
                    <i class="Icon"></i>
                    <span>审核记录</span>
                </div>

                <!-- <el-tabs type="border-card" v-model="activeTab"  @tab-click="handleClick">
                    <el-tab-pane label="记录"  name=0> -->
                        <div class="table_list lvs attribute m-top20">
                            <el-table
                                border
                                :row-class-name="tableRowClassName"
                                :data="tabList"
                                style="width: 100%;">
                                <el-table-column prop="createName" label="操作人" sortable align="center"></el-table-column>
                                <el-table-column prop="createTime"  label="操作时间" sortable align="center"></el-table-column>
                                <el-table-column prop="approveResult"  align="center" sortable show-overflow-tooltip label="操作结果" :formatter="statusFormatter"></el-table-column>
                                <el-table-column prop="approveOpinion"  align="center" sortable show-overflow-tooltip label="备注"></el-table-column>
                            </el-table>    

                        </div>
                        <!-- </el-tab-pane>
                    <el-tab-pane label="工作流" name=1>
                        工作流
                    </el-tab-pane>
                </el-tabs> -->

               

            </div>

            <div class="bottom_btnlist">
                <el-button type="primary" @click = "submit(1)">通 过</el-button>
                <el-button type="primary" @click = "submit(2)">驳 回</el-button>
                <el-button @click = "cancle">返 回</el-button>
            </div>
        
      	</el-card>

        <!-- 
            附件管理组件
            orderId：订单id 不传默认为空
            accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1 
        -->
        <el-dialog :visible.sync="seeannexval" width="960px">
            <accessory 
                v-if="seeannexval" 
                :orderId="orderId" 
                :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog>

    </div>
  
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import querycompon from '../components/querycompon';
import stockform from '../components/stockform';
import stockTable from "../components/stockTable";
import spot from '@/assets/images/spot.png';

import {
    auditStockUpApply, // 通过和驳回按钮
    getStockUpApply , // 回显备货申请信息
} from 'api/administrationCenter/stockmanagement/index';

import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

export default {
	components: {
		breadcrumb,
        querycompon,
        accessory,
        stockform,
        pagination,
        stockTable, // tbale
	},
  // name: 'procurement',
	data() {
		return {
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,

            // 上传
            fileList: [],
            imgArr: [],
            delImgArr: [],

            navList: [],//头部面包屑
            // 附件
            accessoryTypes: 1,
            orderId: 1,
            seeannexval: false,

            approveOpinion: '',
            activeTab: '',
            fileList: [{
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
            }, {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
            }],
            
			// 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
            isView: false,
			
		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {
        this.getStockUpApply();
        
    },
	methods: {
        statusFormatter(row) {
            let status = "";

            if(row.approveResult == 1) {
                status = "通过";
            }else if(row.approveResult == 2) {
                status = "驳回"
            }
            return status;
        },
        // 通过和驳回操作按钮
        submit(applyStatus) {
            if(!this.approveOpinion && applyStatus == 2) {
                this.$message.warning("请填写审核意见");
                return;
            }

            let data = {
                status: applyStatus,
                stockUpApplyId: this.$route.query.stockUpApplyId,
                approveOpinion: this.approveOpinion,
            }
            auditStockUpApply(data).then(res => {
                if(res.status == 200) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });

                    this.$router.push("/stockmanagement/stockpurchase"); // 跳转到采购申请页面
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理  审核页面 administrationCenter/puniManagement/violations/index.vue', error);
            })
        },
        // 取消
        cancle() {
            this.$router.push("/stockmanagement/stockpurchase"); // 跳转到采购申请页面
        },


        handleClick(tab, event) {
            console.log(tab, event);
        },
       
       
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        //文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile(res) {
            put(res).then(data => {
                this.imgArr.push(data);
                console.log(this.imgArr,"this.imgArr 52366");
                
            });
        },

        //文件删除操作
        handleRemove(file, fileList) {
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
                console.log(file,"file 2223344");
                
                let lengs = String(file.raw.uid).length;
                this.imgArr = this.imgArr.filter(item => {
                let str = item.name.substring(0, lengs);
                    return str !== String(file.raw.uid);
                });
            }
        },
         // 回显备货申请信息
        getStockUpApply() {
            let data = {
                stockUpApplyId: this.$route.query.stockUpApplyId,
            }
            getStockUpApply(data).then(res => {
                if (res.status == 200) {
                    
                    this.tabList = res.data.stockUpApproveLogVOList;
                    // this.tabList = this.viewstockObj.stockUpGoodsVOList;

                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/stockpurchase/components/stockTable",error);
            });
        },

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},


	}
};
</script>
<style scoped lang='scss'>

    .auditTable{
        margin-top: 40px;
    }
    .auditContent {
        margin-top: 40px;
    }
    .auditAssey{
        margin-top: 40px;
    }

    .bottom_btnlist {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        // border: 1px solid red;
    }

</style>

