<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- 订单编号 -->
            <orderdetail></orderdetail>

            <!-- 合同信息 -->
            <!-- <contractdetails></contractdetails> -->

            <!-- 申请信息 -->
            <!-- <discountform></discountform> -->

             <!-- 审核意见 -->
            <div class="auditContent">
                <div class="textitle">
                    <div class="titlecals">审核意见</div>
                    <!-- <div class="table_action_span" @click="retract">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>

                <div class=""  v-show="retractbox1">
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
                    <div class="table_action_span" @click="retract('retractbox1')">{{retractbox.retractbox1 ? "收起" : "展开"}}</div>
                </div>

                <div  v-show="retractbox.retractbox1">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="handleChange"
                        :file-list="fileList">

                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </div>
                
            </div>

            <!-- 流程图 -->
            <div class="auditTable">
                <div class="textitle">
                    <div class="titlecals">流程图</div>
                    <div class="table_action_span" @click="retract('retractbox2')">{{retractbox.retractbox2 ? "收起" : "展开"}}</div>
                </div>

                <!-- table表格 -->
                <div class="flowchart"  v-show="retractbox.retractbox2">

                </div>
                
            </div>

            <!-- 审核记录 -->
            <div class="auditAssey">
                 <div class="textitle">
                    <div class="titlecals">审核记录</div>
                    <div class="table_action_span" @click="retract('retractbox3')">{{retractbox.retractbox3 ? "收起" : "展开"}}</div>
                </div>
                
                <div class="table_list lvs attribute m-top20" v-show="retractbox.retractbox3">
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
                <el-button type="primary" @click = "transferFun">转交下一步</el-button>
                <el-button type="primary" @click = "submit">驳 回</el-button>
                <el-button @click = "submit">返 回</el-button>
            </div>
        
      	</el-card>

        <!-- 转交下一步 -->
        <transferdia :visible="visible"  @close_examin="examineclose" @examin_ok="examinok"></transferdia>

    </div>
  
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

// import discountform from '../components/discountform';
// import contractdetails from '../../../order/components/contractdetails'; // 合同信息
import orderdetail from '@/views/order/components/orderdetail'; // 订单编号
// import transferdia from '../components/transferdia'; // 转交下一步的弹框

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';


export default {
	components: {
		breadcrumb,
        // discountform,
        pagination,
        // contractdetails,
        orderdetail,
        // transferdia // 转交下一步的弹框

	},
  // name: 'procurement',
	data() {
		return {
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 10,
            retractbox1: true,
            retractbox: {
                retractbox1: true,
                retractbox2: true,
                retractbox3: true,
            },

            navList: [],//头部面包屑
            visible: false, // 转交下一步弹出框
          

            desc: '',
          
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
        // 手风琴效果 --- 展开收起
        retract(type) {
            this.retractbox[type] = !this.retractbox[type];
        },
        // 分页
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
        // 表格选中
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        },
        // 转交下一步操作按钮
        transferFun() {
            console.log("transfei");
            this.visible = true;
        },
        // 关闭弹框   转交下一步
        examineclose() {
            this.visible = false;
        },

        //确认关闭弹框   转交下一步
        examinok() {
            this.visible = false;
            this.$message("审核信息成功");
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
    .textitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // background: red;
        .titlecals {
            top: 0px;
        }
    }

</style>

