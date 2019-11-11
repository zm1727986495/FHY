<template>
    <div class="addresselection">
        <div class="table_list">
            <el-table border
                ref="multipleTable"
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                :row-key="getRowKeys"
                @selection-change="handleSelectionChange" 
                :data="addressData" style="width: 100%;" >
                <el-table-column  type="selection" width="40" align="center" :reserve-selection="true"></el-table-column>
                <el-table-column prop="contactsName" align="center" label="地址记录" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class = "addresCell">    
                            <span  show-overflow-tooltip>{{scope.row.adddetails}} {{scope.row.addressArr[0]}}  楼号/区  {{scope.row.addressArr[1]}}  单元/号楼 {{scope.row.addressArr[2]}}  室</span>
                            <el-button type="warning" plain v-if="scope.row.isDefault == 1" style="padding:6px;">默认</el-button>
                        </div>
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
import pagination from "@/views/components/pagination";
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
            flag: false,
        };
    },
    props: ["customerId","storeId"],
    
    created() {
        console.log(this.storeId.storeId,11111111111111)
        console.log("客户ID"+this.customerIds);
        this.flag = true;
        this.getListData();
        console.log(this.addressData,"this.addressData");
        // console.log(this.$refs.multipleTable,"multipleTable created"); // undefined

        if(this.$route.path == "/ordermm/order") {
            this.isOrder = true;
        }

    },
    mounted() {
        console.log("mounted");
          
    },
    beforeUpdate() {
        console.log(this.selections,"this.selections updated");
        
        
    },
    methods: {
        getListData(){
            console.log(11188);
            
            let data={
                customerId:this.customerIds,

                // customerId: this.customerId,				//客户id
                // storeCustomerId: this.tableSelectList[0].storeCustomerId,     //门店客户id
                storeId:  this.storeId.storeId, 
                
                page: this.currentPage,
                limit: this.pageSize,
            }
            listCustomerAddress(data).then(res =>{
                if(res.status == 200){
                    this.addressData = res.data.rows;
                    this.total = res.data.total;
                    console.log(this.addressData,"this.addressData223");
                    
                    if(this.addressData.length != 0 && this.flag){
                        console.log(this.flag,"flag");
                        this.addressData.map(item => {
                            console.log(item,"item");
                            if(item.isDefault == 1) {
                                this.selections.push(item) ;
                                let that = this;
                                setTimeout(function(){
                                    that.$refs.multipleTable.toggleRowSelection(that.selections[0]);
                                    console.log(that.selections[0],"that.selections[0]");
                                },0);
                                console.log(this.selections,"yesoksuccess");     
                            }
                        })
                        this.flag = false;
                    }
                }

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
        getRowKeys(row) {
            return row.customerAddressId;
        },
        //勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
            if(this.selections.length > 1){ // 多选变单选
                this.$refs.multipleTable.toggleRowSelection(this.selections[0]);
            }
            // if(this.selections.length == 0){
            //     this.$refs.multipleTable.toggleRowSelection(this.selections[0]);
            // }
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
        .addresCell {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            >span {
                width: 80%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow:ellipsis;
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



