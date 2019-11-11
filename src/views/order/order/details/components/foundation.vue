<template>
    <div class="foundation">
        <!-- <ul class="ul_btn_list">
            <li :class="{'chanclas': activeval === index}"
            v-for="(item,index) in tablistone"
            :key="index"
            @click="butGroupActions(index)">{{item}}</li>
            <div class="clearfix"></div>
        </ul> -->
        <div class="titlecals">需求信息</div>
        <div>
            <!-- 客户信息 -->
            <div v-if="activeval === 0">
                <el-form :label-position="labelPosition"
                    label-width="130px" 
                    :model="khtabdata" 
                    class="demo-form-inline">
                    <el-form-item label="客户姓名" required class="posirkeh">
                        <el-input v-model="khtabdata.customerName" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="客户编号" required>
                        <el-input v-model="khtabdata.customerId" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客户电话" required>
                        <el-input v-model="khtabdata.customerPhone" size="medium" disabled></el-input>
                        <el-input v-model="khtabdata.otherPhone" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="khtabdata.customerSex" disabled>
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="客户地址" class="addressclas" required>
                        <div class="addresslist">
                            <div class="input_box">
                                <el-input placeholder='省/市/区' v-model="khtabdata.maps" disabled maxlength="50" readonly></el-input>
                            </div>
                            <div class="input_box">
                                <el-input placeholder="楼号/区" v-model.number="khtabdata.buildingNumber" disabled maxlength="10"></el-input>
                            </div>
                            <div class="input_box">
                                <el-input placeholder="单元/号楼" v-model.number="khtabdata.unitNumber" disabled maxlength="10"></el-input>
                            </div>
                            <div class="input_box">
                                <el-input placeholder="室" v-model.number="khtabdata.roomNumber" disabled maxlength="10"></el-input>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="客户年龄段">
                        <el-input v-model="khtabdata.ageGroupId" size="medium" disabled></el-input>
                        <!-- <el-select v-model="khtabdata.ageGroupId" disabled placeholder="请选择客户年龄段" size="medium">
                            <el-option 
                                v-for="item in eagelistdata" 
                                :label="item.dictName" :value="item.id" :key="item.value">
                            </el-option>
                        </el-select> -->
                    </el-form-item>
                    <el-form-item label="所属门店" required>
                        <el-input v-model="khtabdata.storeName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="所属销售员">
                        <el-input v-model="khtabdata.salesmanName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="业务员">
                        <el-input v-model="khtabdata.businessName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客户备注" class="addressclas">
                        <el-input type="textarea" v-model="khtabdata.customerDesc" disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 需求信息组件 -->
            <div v-if="activeval === 1">
                <demandassembly :customerDemand="customerDemand" :contractState="true"></demandassembly>
            </div>
            <!-- 订单信息 -->
            <div v-if="activeval === 2">
                <el-form :label-position="labelPosition"
                    label-width="110px" 
                    :model="khtabdata" 
                    class="demo-form-inline">
                    <el-form-item label="订单渠道" required>
                        <el-input v-model="khtabdata.orderChannelName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="订单来源" required>
                        <el-input v-model="khtabdata.orderSourceName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="C类报备" prop="resource">
                        <el-input v-model="khtabdata.cReported" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌" required>
                        <el-input v-model="khtabdata.brandName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="订单货品类型" required>
                        <el-radio-group v-model="khtabdata.orderGoodsType" disabled>
                            <el-radio :label="1">成品</el-radio>
                            <el-radio :label="2">定制</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="产品类别" required>
                        <el-input v-model="khtabdata.categoryName" size="medium" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="预算金额" required>
                        <el-input v-model="khtabdata.orderExpectMoney" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="订单地址" class="addressclas" required>
                        <div class="addresslist">
                            <div class="input_box">
                                <el-input placeholder='省/市/区' v-model="formInline.ordermaps" maxlength="50" disabled readonly></el-input>
                            </div>
                            <div class="input_box">
                                <el-input placeholder="楼号/区" v-model.number="formInline.orderbuildingNumber" disabled maxlength="10"></el-input>
                            </div>
                            <div class="input_box">
                                <el-input placeholder="单元/号楼" v-model.number="formInline.orderunitNumber" disabled maxlength="10"></el-input>
                            </div>
                            <div class="input_box">
                                <el-input placeholder="室" v-model.number="formInline.orderroomNumber" disabled maxlength="10"></el-input>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="合同扣款" required v-if="isretailers">
                        <el-input v-model="formInline.contractDeductions" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="扣款原因" required v-if="isretailers">
                        <el-input v-model="formInline.deductionsReasons" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="订单备注" class="addressclas">
                        <el-input type="textarea" v-model="formInline.orderRemark" disabled></el-input>
                    </el-form-item>
                
                </el-form>
            </div>                
        </div>
    </div>
</template>
<script>
import demandassembly from '@/views/order/components/demandassembly';
import { 
    getOrderInfo, //编辑订单回显
    } from 'api/order/order/orderdetails';
export default {
    components: {
        demandassembly
    },
    created(){
        
    },
    data() {
        return {
            tablistone: ["客户信息", "需求信息", "订单信息"],
            isretailers: false,
            labelPosition: 'right',
            activeval: 1,
            customerDemand: {
                customerDemandId: "",//客户需求id
                housingTypeId: "",//房屋类型
                housingBuildTypeId: "",//房屋户型
                handoverDate: "",//交房日期,
                estimatedDecorationTime: "",//预计装修时间
                totalAreaOfHousingId: "",//房屋总面积
                decoratedHousingAreaId: "",//装修房屋面积
                decorationProgressId: "",//装修进度
                finishingTimeOfDecoration: "",//装修完成时间
                productId: [],//意向产品
                styletId: [],//意向风格
                remarks: "",//备注
            },
            khtabdata: {},
            formInline: {},
        }
    },
    watch: {
        
    },
    created() {
        let data = {
            orderId: this.$route.query.orderId 
        }
        getOrderInfo(data).then(res =>{
            console.log(res);
            if(res.status == 200){
                this.referrerId = res.data.referrerId || ""//推荐人id
                this.countOrderBudget = res.data.countOrderBudget;//是否生成预算清单
                this.contractState = res.data.contractState;//是否签订电子合同

                this.khtabdata = res.data;
                this.khtabdata.customerName = res.data.customer.customerName;
                this.khtabdata.customerPhone = res.data.customer.customerPhone;
                this.khtabdata.otherPhone = res.data.customer.otherPhone;
                

                this.customerAddressId = res.data.customerAddressId;
                
                let adddata = res.data.address;
                //地址输入框信息转化展示
                this.khtabdata.maps = adddata.substring(0,adddata.indexOf("#"));
                this.khtabdata.buildingNumber = this.addsplicfun(adddata)[0];
                this.khtabdata.unitNumber = this.addsplicfun(adddata)[1];
                this.khtabdata.roomNumber = this.addsplicfun(adddata)[2];

                if(res.data.customerDemandVO){
                    this.customerDemand = res.data.customerDemandVO;
                    this.customerDemandId = res.data.customerDemandId;
                }
                if(this.customerDemand.styletId){
                    this.customerDemand.styletId = this.customerDemand.styletId.split(',').map(Number);//意向风格转化格式
                }else{
                    this.customerDemand.styletId = []
                }
                if(this.customerDemand.productId){
                    this.customerDemand.productId = this.customerDemand.productId.split(',').map(Number);//意向产品转化格式
                }else{
                    this.customerDemand.productId = []
                }
            }
        }).catch(error =>{
            console.log('订单管理:修改订单 order/order/getorder.vue', error);
        })
    },
    methods: {
        butGroupActions(index) {
            this.activeval = index;
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
    },
}
</script>
<style lang="scss">
    .foundation{
        .titlecals{
            top: 0;
        }
        .demo-form-inline{
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .demo-form-inline>div{
            width: 40%;
        }
        .demo-form-inline .addressclas{
            width: 100%;
        }
        .addresslist{
            display: flex;
            position: relative;
            >div{
                margin: 5px;
            }
            .input_box{
                display: flex;
                align-items: center;
                >div{
                    min-width: 100px;
                }
            }
        }
    }
</style>