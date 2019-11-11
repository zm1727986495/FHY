<template>
    <div class="addresselection">
        <div class="table_list">
            <el-table border :row-key="getRowKeys"
                ref="multipleTable"
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="addressData" style="width: 100%;" >
                <el-table-column type="selection" width="40" align="center" :reserve-selection="true"></el-table-column>
                <el-table-column prop="contactsName" align="center" label="地址记录" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.adddetails}} {{scope.row.addressArr[0]}}  楼号/区  {{scope.row.addressArr[1]}}  单元/号楼 {{scope.row.addressArr[2]}}  室
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" align="center" label="操作时间" v-if="isOrder"></el-table-column> 
                <el-table-column prop="createAt" align="center" label="操作人" sortable v-if="isOrder"></el-table-column> 
                <el-table-column prop="contactsName" width="100"  align="center" label="操作" v-if="isOrder" ></el-table-column>
            </el-table>
            <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @currentChange="currentChange">
                </pagination>
            </div>
        </div>
    </div>

</template>

<script>
import pagination from './pagination';
import { listCustomerAddress } from 'api/order/measuremanage/measuremanage';


  export default {
    components: {
        pagination,
    },
    data() {
        return {
            customerIds: this.customerId,
            currentPage: 1,//当前页数
            pageSize: 10,//每页个数
            total: 0,//总条数
            addressData: [],//列表数据
            selections:[],
            isOrder: false,
        };
    },
    props:['customerId'],
    mounted() {
        
    },
    created() {      
        console.log("客户ID"+this.customerIds)
        this.getListData();


        if(this.$route.path == "/ordermm/order") {
            this.isOrder = true;
        }

    },
    methods: {
        getRowKeys(row) {
            return row.customerAddressId;
        },
        getListData(){
            let data={
                customerId:this.customerIds,
                page: this.currentPage,
                limit: this.pageSize,
            }
            listCustomerAddress(data).then(res =>{
                this.addressData=res.data.rows;
                this.total = res.data.total;
                for(let i = 0;i<this.addressData.length;i++){
                    let start ;
                    start = this.addressData[i].address.indexOf("#");
                    this.addressData[i]["adddetails"] = this.addressData[i].address.substring(0,start);
                    this.addressData[i]["addressArr"] = this.addressData[i].address.substring(start+1).split("#");  
                }
                if(res.status === 200){
                    console.log("客户地址_获取列表")
                }
            }).catch(error =>{
                console.log('客户地址_获取列表 views/components/addresselection.vue', error);          
            })
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            this.getListData();
        },
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .addresselection{
        .addresbox{
            display: flex;
            .explaintxttwo{
                width: 140px;
                display: block;
            }
        }
        .addresslist{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .input-with-select{
                max-width: 150px;
                margin: 5px;
            }
            .addresele{
                max-width: 150px;
                margin: 5px;
            }
        }
        .btnclas{
            text-align: center;
        }
    }
</style>

