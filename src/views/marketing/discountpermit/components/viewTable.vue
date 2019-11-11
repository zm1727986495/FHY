<template>
    <div class="addrecommender">

    
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20">
            <div class="textitle">
                <div class="titlecals">请购商品</div>
                <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
            </div>
            <el-table
                border
                :row-class-name="tableRowClassName"
                :row-style="tableBodycolor"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;">

                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column
                    prop="name"
                    label="产品分类"
                    width="240" sortable align="center">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="产品款型"
                    width="240" sortable align="center">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="名称款式"
                    width="240" sortable align="center">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="型号"
                    width="240" sortable align="center">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="单价"
                    width="240" sortable align="center">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="颜色"
                    width="240" sortable align="center">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="数量"
                    width="240" sortable align="center">
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
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import spot from "@/assets/images/spot.png";



export default {
    components: {
       pagination
    },
    // name: 'brandmanagement',
    data() {
        return {
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

            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 10,

        };
    },

    mounted() {
       
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
    },
    methods: {
       
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
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

    }
};
</script>
<style scoped lang='scss'>
        .textitle {
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            font-size: 14px;
            // 标题
            .titlecals {
                font-size: 18px;
                position: relative;
                font-weight: 500;
                color: #006ec7;
                margin: 0px 35px;
                top: 0px;
                &::after {
                    content: "";
                    display: block;
                    width: 4px;
                    height: 15px;
                    background: #006ec7;
                    position: absolute;
                    left: -16px;
                    top: 50%;
                    border-radius: 5px;
                    transform: translateY(-50%);
                }
            }
        }

        .bottom_btnlist {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            // border: 1px solid red;
        }


</style>

