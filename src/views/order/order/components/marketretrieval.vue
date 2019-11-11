<template>
    <div class="marketretrieval">
        <!-- 查询条件组 -->
        <el-dialog :title="marketredata.processMode==1?'销售入库':'销售出库'" class="customDialogTitle" :visible.sync="marketvisible" 
            width="700px" :before-close="closefun">
            <el-form :label-position="labelPosition" label-width="100px" class="demo_form_inline">
                <el-form-item label="出库单号">
                    <div>ck1234567</div>
                </el-form-item>
                <el-form-item label="出库类型">
                    <div>样品销售出库单</div>
                </el-form-item>
                <el-form-item label="订单号">
                    <div>SO1234567</div>
                </el-form-item>
                <el-form-item label="所属门店">
                    <div>{{storeName}}</div>
                </el-form-item>
                <el-form-item label="创建人">
                    <div>{{name}}</div>
                </el-form-item>
                <el-form-item label="创建时间">
                    <div>{{datatime}}</div>
                </el-form-item>
                <el-form-item label="入库仓库" v-if="marketredata.processMode == 1" required>
                    <el-select v-model="storageId" size="medium">
                        <el-option :label="itm.storageName" :value="itm.storageId" 
                            v-for="itm in backStorageList" :key="itm.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安装部" v-if="marketredata.processMode == 2">
                    <div>大兴安装一部</div>
                </el-form-item>
            </el-form>
            <div class="tableclass">
                <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" :data="tablelist" style="width: 100%;" >
                    <el-table-column prop="commodityName" align="center" label="商品名称" sortable></el-table-column>
                    <el-table-column prop="storageName" align="center" label="出库仓库"></el-table-column>
                    <el-table-column prop="salesNumber" align="center" label="数量"></el-table-column>
                    <el-table-column prop="contactsName" align="center" label="同商品列表"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtn">确 定</el-button>
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { 
    listOrderLibrarySample,
    insertInstallOutStorage,
    insertInstallInStorage,
} from 'api/order/order/order';
import { getUUID } from "api/pulicJava";
import { mapGetters } from "vuex"
  export default {
    data() {
        return {
            labelPosition: 'right',
            datatime: "",//创建时间
            storeName: "",//所属门店
            storageId: "",//仓库id
            backStorageList: [],//仓库列表
            tablelist: [],//列表
        };
    },
    props: {
        marketvisible: {
            type: Boolean,
        },
        marketredata: {
            type: Object,
        }
    },
    computed: {
        ...mapGetters(['name'])
    },
    watch: {
        marketvisible(val){
            if(val){
                let curDate = new Date();
                this.storeName = JSON.parse(this.$loca.getItem('activeStoreId')).storeName;
                this.datatime = new Date(curDate.getTime() + 8*60*60*1000).toJSON().substr(0, 19).replace('T', ' ')

                let data = this.marketredata
                delete data.storeId
                this.initialize(data)
            }
        }
    },
    methods: {
        initialize(data){
            listOrderLibrarySample(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    if(res.data.backStorageList){
                        this.backStorageList = res.data.backStorageList;
                        this.storageId = res.data.backStorageList[0].storageId*1;
                    }
                    this.tablelist = res.data.sampleList;
                }
            }).catch(error =>{
                console.log('销售出库/回库接口 order/order/order.vue', error);
            })
        },
        subminbtn(){
            let data = {
                storeId: this.marketredata.storeId,//门店ID
                orderId: this.marketredata.orderId,//订单
                salesSampleSingleCode: 123123,//销售单号
                outboundNumber: "",//出库单号
                salesSampleSingleList: [
                    {//仓库集合
                        storageId: 32,//仓库ID
                        salesSampleDetailList: [
                            {//样品集合
                                salesNumber: 231,//样品数量
                                inventoryGoodsId: 123123//库存ID
                            }
                        ]
                    }
                ]
            }
            return;
            // this.marketredata.processMode 1:入库 2:出库
            if(this.marketredata.processMode == 1){
                getUUID({serialNumber: "BW"}).then(dastas =>{
                    if(dastas.status == 200){
                        data.outboundNumber = dastas.data;
                        data.backStorageId = this.storageId;//入库仓库
                        insertInstallInStorage(data).then(res =>{
                            if(res.status == 200){
                                this.$emit('marketclosefun');
                            }
                        }).catch(error =>{
                            console.log('销售出库/回库接口 order/order/order.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                })
            }else{
                getUUID({serialNumber: "SR"}).then(dastas =>{
                    if(dastas.status == 200){
                        data.outboundNumber = dastas.data;
                        insertInstallOutStorage(data).then(res =>{
                            if(res.status == 200){
                                this.$emit('marketclosefun');
                            }
                        }).catch(error =>{
                            console.log('销售出库/回库接口 order/order/order.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                })
            }
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 关闭弹窗
        closefun(){
            this.$emit("marketclosefun");
        },
    },
  }
</script>
<style lang="scss" scoped>
.marketretrieval{
    .demo_form_inline{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        >div{
            width: 45%;
        }
        .selewi{
            width: 100%;
        }
        .disflex{
            display: flex;
            align-items: center;
            >div{
                max-width: 250px;
            }
            >div+div{
                margin-left: 10px;
            }
        }
        .el-form-item{
            margin-bottom: 0px;
        }
    }
    .tableclass{
        margin-top: 10px;
    }
}
</style>

