<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <stockform></stockform>

            <div class="auditTable">
                <div class="textitle">
                    <div class="titlecals">备货清单</div>
                    <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>

                <!-- table表格 -->
                <div class="table_list lvs attribute m-top20">

                    <el-table
                        border
                        :row-class-name="tableRowClassName"
                        :row-style="tableBodycolor"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;">

                        <el-table-column type="index" width="55"></el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请状态"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="备货采购单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请机构"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请人"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请理由"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请时间"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="要求完成时间"
                            width="240" sortable align="center">
                        </el-table-column>

                    
                    </el-table>    

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

            <!-- 审核意见 -->
            <div class="auditContent">
                <div class="textitle">
                    <div class="titlecals">审核意见</div>
                    <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>

                <!--  -->
                <div class="">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="desc">
                    </el-input>
                </div>
                
            </div>
            
			<!-- 附件管理 -->
            <div class="auditAssey">
                <div class="textitle">
                    <div class="titlecals">附件管理</div>
                    <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>

                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange"
                    :file-list="fileList">

                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>


            </div>

            <!-- 审核记录 -->
            <div class="auditAssey">
                 <div class="textitle">
                    <div class="titlecals">审核记录</div>
                    <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>

                <el-tabs type="border-card" v-model="activeTab"  @tab-click="handleClick">
                    <el-tab-pane label="记录"  name=0>
                        <div class="table_list lvs attribute m-top20">
                            <el-table
                                border
                                :row-class-name="tableRowClassName"
                                :row-style="tableBodycolor"
                                :data="tabList"
                                style="width: 100%;">

                                <el-table-column
                                    prop="name"
                                    label="操作人"
                                    sortable align="center">
                                </el-table-column>

                                <el-table-column
                                    prop="name"
                                    label="操作"
                                    sortable align="center">
                                </el-table-column> 

                                <el-table-column
                                    prop="name"
                                    label="操作时间"
                                    sortable align="center">
                                </el-table-column>
                                
                                <el-table-column
                                    prop="name"
                                    label="操作结果"
                                    sortable align="center">
                                </el-table-column> 

                                <el-table-column
                                    prop="name"
                                    label="备注"
                                    sortable align="center">
                                </el-table-column>
                            </el-table>    

                        </div>
                        </el-tab-pane>
                    <el-tab-pane label="工作流" name=1>
                        工作流
                    </el-tab-pane>
                </el-tabs>

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

            <div class="bottom_btnlist">
                <el-button type="primary" @click = "submit">转交下一步</el-button>
                <el-button type="primary" @click = "submit">驳 回</el-button>
                <el-button @click = "submit">返 回</el-button>
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

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

export default {
	components: {
		breadcrumb,
        querycompon,
        accessory,
        stockform,
        pagination
	},
  // name: 'procurement',
	data() {
		return {
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 10,

            navList: [],//头部面包屑
            // 附件
            accessoryTypes: 1,
            orderId: 1,
            seeannexval: false,

            desc: '',
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
            tabList:[{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            },], // 表格数据
			
		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {

        
    },
	methods: {
        submit() {
            
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        currentChange(val) {
            this.currentPage = val;
            this.searchfun()
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.searchfun()
        },
       
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
		

        
        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tabList = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
	

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
		},
        

        // 附件管理
        attachManagement() {
             // if(this.checkfun()){
                this.seeannexval = true;
            // }
        },
        
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
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

