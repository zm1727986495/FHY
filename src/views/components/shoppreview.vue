<template>
    <div class="shoppreview">
        <!-- 查询条件组 -->
        <el-dialog  title="清单预览" custom-class="customDialogTitle" :visible.sync="shoppreVisible" width="80%" :before-close="closefun" top="5vh">
            <el-button type="primary" size="small" class="m-bottom10" v-print="'#printContentRoom'">打印</el-button>
            <div class="maxhei60">
                <MultipleTableRoom :orderId="orderId" id="printContentRoom" :group="group" v-if="group"></MultipleTableRoom>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import MultipleTableRoom from '@/views/administrationCenter/contractmanagement/components/MultipleTableRoom';
import { orderDetails } from 'api/order/order/order';
//查询合同基本信息
import { getCustomerContract } from 'api/order/contract/contract';
export default {
    components: {
        MultipleTableRoom,
    },
    data() {
        return {
            group: ''
        };
    },
    props:["shoppreVisible", "orderId"],
    created() {
        this.activecli()
        this.orderDetails()
    },
    methods: {
        orderDetails() {
            this.$store.dispatch('SET_ORDER_DETAILS', {});
            let data = {
                orderId: this.orderId
            }
            orderDetails(data).then(res =>{
                if(res.status == 200){
                    this.group = res.data.commodityCategoryId === 1000026 ? 2 : 1;
                    let orderDetails = {
                        address: res.data.address || '',
                        designer: res.data.designer || '',
                        customerName: res.data.customerName || '',
                        customerPhone: res.data.customerPhone || '',
                        designerName: res.data.designerName || '',
                        designerPhone: res.data.designerPhone || '',
                        orderGoodsType: res.data.orderGoodsType || '',
                        storeId: res.data.storeId || '',
                        storeName: res.data.storeName || '',
                        abbreviate: res.data.abbreviate || '',
                        salesmanId: res.data.salesmanId || '',
                        salesmanName: res.data.salesmanName || '',
                        brand: {
                            brandId: res.data.brandId || '',
                            brandName: res.data.brandName || ''
                        },
                        category: {
                            commodityCategoryId: res.data.commodityCategoryId || '',
                            categoryName: res.data.categoryName || ''
                        },
                        priceStrategyId: res.data.priceStrategyId || '',
                        priceStrategyName: res.data.priceStrategyName || ''
                    };
                    this.$store.dispatch('SET_ORDER_DETAILS', orderDetails);
                }
            }).catch(error =>{
                console.log('订单管理:订单相关信息获取 order/order/order.vue', error);
            })
        },
        activecli(){
          let orderId = this.orderId;
          getCustomerContract({orderId: orderId}).then(res =>{
            if(res.status == 200){
              // 合同id有的时候回显
              if(res.data.customerContractId){
                this.$store.dispatch('SET_CONTRACT_DETAILS', res.data);
              }else{
                this.$store.dispatch('SET_CONTRACT_DETAILS', {});
                this.$message.warning("该订单没有签订合同");
              }
            }
          }).catch(error =>{
            console.log('合同详情:获取合同信息 order/order/order.vue', error);
          })
        },
        // 关闭弹窗
        closefun(){
            this.$emit("previewclosefun");
        },
    },
  };
</script>
<style lang="scss">
.shoppreview{
    .maxhei60{
        max-height: 60vh;
        overflow-y: auto;
    }
    .el-dialog__body{
        padding: 10px 20px;
    }
}
</style>

