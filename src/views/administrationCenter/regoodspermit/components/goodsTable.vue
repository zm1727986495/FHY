<template>
    <div class="goodsTable">
        <!-- 选择商品 -->
        <!-- <div class="btn_list_1" v-if="isAdd || isEdit">
            <el-button size="small" class="button-96" @click="addProduct">添加商品</el-button>
            <el-button size="small" class="button-96" @click="dismantle">拆套</el-button>
        </div> -->
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20 goods_table">
            <el-table border :row-key="getRowKeys" :row-class-name="tableRowClassName" @select="selectfun"
                @select-all="selectall" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;" ref="stockTable">
                <el-table-column type="selection" :reserve-selection="true" fixed="left" v-if="isAdd"></el-table-column>
                <el-table-column type="index" width="55" label="序号" fixed="left" align="center"></el-table-column>
                <el-table-column width="120" prop="roomName" label="房间" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="120" prop="goodsStatus" label="排产状态" align="center" v-if="orderaudit">
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.productionStatus">
                            <el-radio :label="1">排产</el-radio>
                            <el-radio :label="0">未排产</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="chargeBackNum" label="退货数量" align="center"  v-if="!orderaudit">
                    <template slot-scope="scope">
                        <!-- <el-input-number size="mini" v-if="readonly" v-model="scope.row.chargeBackNum" :min="0" disabled :step="1" :controls="false" :precision="0"></el-input-number> -->
                        <div v-if="readonly">{{scope.row.chargeBackNum}}</div>
                        <el-input-number size="mini" v-else v-model="scope.row.chargeBackNum" :precision="2" :step="0.1" :min="0" :max="Number(scope.row.amount)" :controls="false"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="120" prop="amount" label="购买数量" align="center" v-if="!readonly"></el-table-column>
                <el-table-column width="180" prop="commodityCode" label="商品编码" sortable align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="180" prop="commodityName" label="名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="120" prop="brandName" label="品牌" align="center"></el-table-column>
                <el-table-column width="120" prop="categoryName" label="品类" align="center"></el-table-column>
                <el-table-column width="150" prop="commodityModel" label="型号" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="150" prop="series" label="系列" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="150" prop="material" label="材质" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="150" prop="colour" label="颜色" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="180" prop="commodityUnit" label="单位" align="center"></el-table-column>
                <el-table-column width="120" prop="width" label="宽" align="center"></el-table-column>
                <el-table-column width="120" prop="high" label="高" align="center"></el-table-column>
                <el-table-column width="120" prop="deep" label="深" align="center"></el-table-column>
                <el-table-column width="120" prop="thick" label="厚" align="center"></el-table-column>
                <el-table-column width="150" prop="valuationMethod" label="计价方式" align="center"></el-table-column>
                <el-table-column width="150" prop="commodityUnit" label="单价" align="center"></el-table-column>
                <el-table-column width="150" prop="nonStandardParameter" label="非标系数" align="center"></el-table-column>
                <el-table-column width="150" prop="originalPrice" label="原价" align="center"></el-table-column>
                <el-table-column width="150" prop="discountRate" label="折扣率" align="center"></el-table-column>
                <el-table-column width="150" prop="discountPrice" label="活动价" align="center"></el-table-column>
                <el-table-column width="180" prop="remarks" label="备注" align="center" show-overflow-tooltip></el-table-column>
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

        <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="1024px" top="2vh" class="lvs">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectProductConfirm">确定</el-button>
                <el-button  @click="productDialog = false">取消</el-button>
            </div>
        </el-dialog>

         <!--拆套-->
        <dismantle :visible="dismantleVisible" :selection="selection" @close="dismantleSubmit" v-if="dismantleVisible"></dismantle>
    </div>
</template>

<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import selectCommodity from "@/views/components/selectCommodity";
import dismantle from '@/views/components/dismantle'; // 拆套
import { detachable } from "@/api/marketing/shopStock/shopStock";

import { 
    listOrderCommodity, // 获取订单商品列表接口
    getOrderChargeBack, // 查询退货详情接口(回显)
} from '@/api/administrationCenter/regoodspermit/index';

export default {
    components: {
        breadcrumb,
        pagination,
        selectCommodity,
        
    },
    data() {
        return {
            check: true,
            dismantleVisible: false, // 拆套弹窗
            selection: [], // 选择的拆套商品
            dismantleInfo: [], // 存在的拆套信息

            isAdd: false, // 是否是增加页面
            isAudit: false, // 是否是审核页面
            isDetail: false,// 是否是详情页
            isEdit: false, // 是否是编辑页 

            isLeadAudit: false, // 是否是行政部领导审核
            isFirAudit: false, // 是否是行政部一审核
            isSecAudit: false,// 是否是行政部二审核
            orderaudit: false, // 下单员标注是否排产
            size: "medium",
            currentPage: 1, // 当前页数
            pageSize: 20, // 总页数
            total: 0,  // 总条数
            readonly: false,
            // 选择商品
            productDialog: false,
            productList: {
                selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
                height: "350px", // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true // 是否为弹出层（不传默认为页面）
            },
            selectedProducts: [], // 选择商品
            elsectVal: [], // table表单 勾选属性
            tabList: [], // 表格数据
            payMoney: 0, // 退款金额
        }
    },
    props: ["orderId"],
    computed: {
        commodityIds() {
            let arr = [];
            this.tabList.forEach(item => {
                arr.push(item.commodityId);
            });
            return arr;
        }
    },
    filters: {
        // 千分号过滤方法
        // fenge(val){
        //     return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
        // }
        fenge(amount) {
            const validateNumber = n =>
                !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount)
                .toFixed(2)
                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        },
    },
    created() {
        if(this.$route.path == "/regoodspermit/addapplication") { // 是否是添加页面
            this.isAdd = true;
        }

        if(this.$route.path == "/regoodspermit/editapplication") { // 是否是编辑页面
            this.isEdit = true;

            this.getOrderChargeBack(); // 回显
        }

        if(this.$route.path == "/regoodspermit/viewapplication") { // 是否是查看详情页面
            this.isDetail = true;
            this.readonly = true;
            this.getOrderChargeBack(); // 回显
        }
        
        if(this.$route.path == "/regoodspermit/adminfiraudit") { // 行政部一审核
            this.isAudit = true;
            this.readonly = true;
            this.isFirAudit = true;
            this.getOrderChargeBack(); // 回显
        }

        if(this.$route.path == "/regoodspermit/adminsecaudit") { // 行政部二审核
            this.isAudit = true;
            this.readonly = true;
            this.isSecAudit = true;
            this.getOrderChargeBack(); // 回显
        }

        if(this.$route.path == "/regoodspermit/adminsleadeaudit") { // 行政部领导审核
            this.isAudit = true;
            this.readonly = true;
            this.isLeadAudit = true;
            this.getOrderChargeBack(); // 回显
        }

        if(this.$route.path == "/regoodspermit/orderaudit") { // 下单员标注是否排产
            this.orderaudit = true;
            this.readonly = true;
            this.getOrderChargeBack(); // 回显
        }


    },
    watch: {
        orderId(val) {
            if(this.$route.path == "/regoodspermit/addapplication") { // 是否是添加页面
                this.getList();
            }
        },
        //引用类型变量、采用深度监听
        elsectVal: {
            // 表格数据刷新后需清空之前查看的订单详情内容
            handler: function (newVal, oldVal) {
                this.payMoney = 0;
                newVal.forEach(item => { 
                    let amount
                    if(this.isAdd){
                        amount = item.amount
                    }else{
                        amount = item.chargeBackNum
                    }
                    // let onePrice = Math.floor((Number(item.discountPrice / amount)) * 100) / 100; // 每一个商品的单价 不四舍五入
                    // let chargeBackNum = item.chargeBackNum;
                    if(!item.chargeBackNum){
                        item.chargeBackNum = 0;
                    }
                    this.payMoney+=item.discountPrice*1
                });
                if(this.check){
                    this.$emit("change_payMoney",this.payMoney);
                }
                //   this.purchaseCost = this.purchaseCost + item.purchaseNumber * item.costPrice
           },
           deep: true
        },
    },
    methods: {
        // 回显 （编辑）
        getOrderChargeBack() {
            let data = {
                chargeBackId: this.$route.query.chargeBackId,
            }
            getOrderChargeBack(data).then(res => {
                if(res.status == 200) {
                    this.tabList = res.data.orderCommodities;
                    // if(!this.isAdd){
                    //     this.elsectVal = res.data.orderCommodities
                    // }
                }
            }).then(err => {
                console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);
            })
        },
        getRowKeys(row) {
            return row.commodityId;
        },

        // 点击拆套
        dismantle() {
            if (this.selection.length) {
                this.dismantleVisible = true;
            }else {
                this.$message.warning("抱歉,请进行选择");
            }
        },
        // 确定拆套
        dismantleSubmit(val) {
            if (val) {
            detachable(val)
                .then(response => {
                if (response.status == 200) {
                    this.dismantleVisible = false;
                    this.$message.success('操作成功');
                    this.currentPage = 1;
                    this.getData();
                } else {
                    this.$message.error(response.message || '操作失败');
                }
                })
                .catch(error => {
                    console.log('views/marketing/shopstock/index.vue-dismantleSubmit:' + error);
                })
            } else {
            this.dismantleVisible = false;
            }
        },
        selectfun(selection, row) {
            let amount = row.amount ? Number(row.amount) : 0
            let chargeBackNum = row.chargeBackNum ? Number(row.chargeBackNum) : 0
            // let num = amount - chargeBackNum
            if(amount == 0 || chargeBackNum == 0){
                this.$message.warning("退货数量或商品数量有误！！不可勾选");
                this.$refs.stockTable.toggleRowSelection(row);
                // this.elsectVal = this.elsectVal.filter(item =>{
                //     return item.commodityId != row.commodityId
                // })
                this.check = false
            }else{
                this.check = true
            }
        },
        selectall(selection){
            let seleswatch = selection.some(item =>{
                let amount = item.amount ? Number(item.amount) : 0
                let chargeBackNum = item.chargeBackNum ? Number(item.chargeBackNum) : 0
                let num = amount - chargeBackNum
                return chargeBackNum == 0 || amount == 0
            })
            if(seleswatch){
                this.$message.warning("退货数量或商品数量有误！！不可全选");
                this.$refs.stockTable.clearSelection();
                this.check = false
            }else{
                this.check = true
            }
        },
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
        },
        // 单页条数改变
        sizeChange(val) {
            this.currentPage = 1;

            this.pageSize = val;
            this.getList()
        },
        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            
            // let data = this.searchdatas();
            this.getList();
        },
        
        getList() {
            this.tabList = []
            let data = {
                showType: 1,
                orderId: this.orderId,
            }

            listOrderCommodity(data).then(res => {
                if(res.status == 200) {
                    res.data.forEach((item, idx) =>{
                        item.orderCommodity.forEach(itm =>{
                            let indexs = idx+1
                            this.tabList.push({
                                ...itm, 
                                roomName: indexs < 10 ? "0" + indexs + itm.roomName : indexs + itm.roomName
                            })
                        })
                    })
                }
            }).catch(err => {
                console.log('退货管理:新增退货 关闭订单弹框 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
            })
        },

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
        // 点击添加商品
        addProduct() {
            if (this.elsectVal.length > 0) {
                this.$message({
                    message: "请勿选择商品",
                    type: "warning"
                });
                return;
            }
            this.productDialog = true;
            this.productList.selectedCommodities = this.commodityIds;
        },
        // 选择商品 -- 弹出框的确定操作按钮
        selectProductConfirm() {
            if (this.selectedProducts.length) {
                let arr = [];
                this.selectedProducts.forEach(item => {
                    this.tabList.push(item)
                });
                this.productDialog = false;
            } else {
                this.$message.warning("请选择商品");
            }
        },
        // 选择商品 复选框
        selectionChange(val) {
            this.selectedProducts = val;
        },
    },
}
</script>

<style lang="scss">
// .goods_table {
//     // .el-input__inner {
//     //     height: 23px;
//     //     line-height: 23px;
//     //     border: 0px;
//     //     appearance: none;
//     //     background: transparent;
//     // }
//     // .el-input__suffix {
//     //     display: none;
//     // }
// }
</style>

