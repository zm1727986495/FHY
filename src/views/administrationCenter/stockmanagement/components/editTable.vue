<template>
    <div class="addrecommender">

    
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20">
            <div class="textitle">
                <div class="titlecals">请购商品</div>
            </div>

            <div class="btn_list_1">
                <el-button size="small" class="button-96" @click="addGoods">添加到店 商品</el-button>   
                <el-button size="small" class="button-96" @click="deleteGoods">删除</el-button>
            </div>
            
            <!-- table表格 -->
            <div class="table_list lvs attribute m-top20">
                <el-table
                    border  :row-key="getRowKeys"
                    :row-class-name="tableRowClassName"
                    :row-style="tableBodycolor"
                    @selection-change="handleSelectionChange"
                    :data="tabList"
                    style="width: 100%;">

                    <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column prop="commodityCode" label="商品编码"  width="240"  align="center" sortable></el-table-column>                  
                    <el-table-column prop="commodityName" label="商品名称" width="240" show-overflow-tooltip  align="center" sortable></el-table-column>
                    <el-table-column prop="branchName" label="品牌" width="240" show-overflow-tooltip  align="center" sortable></el-table-column>
                    <el-table-column prop="status" label="品类" width="240" show-overflow-tooltip  align="center" sortable></el-table-column>
                    <el-table-column prop="name" label="型号" sortable align="center"></el-table-column>
                    <el-table-column prop="name" label="材质" sortable align="center"></el-table-column>
                    <el-table-column prop="name" label="颜色" sortable align="center"></el-table-column>

                        <el-table-column prop="validityTime" width="240"  label="宽" show-overflow-tooltip align="center" sortable>
                            <template slot-scope="scope">
                                <el-input-number class="width-100" :controls="false" placeholder="请填写宽" v-model="scope.row.punishMoney" :precision="2" :min="0" ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remarks" width="240"  label="高" show-overflow-tooltip  align="center" sortable>
                            <template slot-scope="scope">
                                <el-input-number class="width-100" :controls="false" placeholder="请填写高" v-model="scope.row.punishMoney" :precision="2" :min="0" ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remarks" width="240"  label="深" show-overflow-tooltip  align="center" sortable>
                            <template slot-scope="scope">
                                <el-input-number class="width-100" :controls="false" placeholder="请填写深" v-model="scope.row.punishMoney" :precision="2" :min="0" ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remarks" width="240"  label="厚" show-overflow-tooltip  align="center" sortable>
                            <template slot-scope="scope">
                                <el-input-number class="width-100" :controls="false" placeholder="请填写厚" v-model="scope.row.punishMoney" :precision="2" :min="0" ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remarks" width="240"  label="免申请天数" show-overflow-tooltip  align="center" sortable>
                            <template slot-scope="scope">
                                <el-input-number class="width-100" :controls="false" placeholder="请填写免申请天数" v-model="scope.row.punishMoney" :precision="2" :min="0" ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remarks" width="240"  label="备注" show-overflow-tooltip  align="center" sortable></el-table-column>
                        <el-table-column prop="name" label="产品分类" sortable align="center"> </el-table-column>
                        <el-table-column  prop="name" label="产品款型" sortable align="center"> </el-table-column>
                        <el-table-column prop="name" label="名称款式"  sortable align="center"> </el-table-column>
                        <el-table-column prop="num" label="数量"  width = "240" sortable align="center">
                            <template>
                            <!-- <template  slot-scope="scope"> -->
                                <!-- {{scope.row.stores}} -->
                                <el-input-number v-model="num" :step="1" step-strictly></el-input-number>
                            </template>
                        </el-table-column>
                </el-table>    
            </div>
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
import spot from "@/assets/images/spot.png";
import pagination from "@/views/components/pagination";

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
            num: '',
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
        getRowKeys(row) {
            return row.stockUpApplyId;
        },
        addGoods() {

        }, 
        deleteGoods() {
            
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

