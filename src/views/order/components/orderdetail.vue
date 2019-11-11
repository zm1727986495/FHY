<template>
    <div class="orderdetail">
        <el-card>
            <!-- 查询条件组 -->
            <div class="orderdetails">
                <div class="disflex">
                    <div class="texli">
                        <span class="ordertet" @click="clickNumber">订单编号：<i>{{detaildata.orderNumber}}</i></span>
                        <span>
                            <el-tag type="success" size="small">{{detaildata.orderTypeName}}</el-tag>
                        </span>
                        <span class="measurecla">当前状态：<i>{{detaildata.orderStatusName}}</i></span>
                    </div>
                    <div class="xiala">
                        <span 
                            :class="[show ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" 
                            @click="show = !show">
                            {{show ? "收缩" : "展开"}}
                        </span>
                    </div>
                </div>
                <el-collapse-transition>
                    <div class="orderbox" v-show="show">
                        <ul class="orderlsit">
                            <li>客户姓名</li>
                            <li>{{detaildata.customerName}}</li>
                            <li>客户电话</li>
                            <li>{{detaildata.customerPhone}}</li>
                            <li>备用电话</li>
                            <li>{{detaildata.otherPhone}}</li>
                        </ul>
                        <ul class="orderlsit">
                            <li>订单地址</li>
                            <el-tooltip class="item" effect="dark" :content="detaildata.address" placement="top">
                                <li>{{detaildata.address}}</li>
                            </el-tooltip>
                            <li>所属网点</li>
                            <li>{{detaildata.storeName}}</li>
                            <li>销售员</li>
                            <li>{{detaildata.salesmanName}}</li>
                        </ul>
                        <ul class="orderlsit">
                            <li>设计师</li>
                            <li>{{detaildata.designerName}}</li>
                            <li>订单创建时间</li>
                            <li>{{detaildata.createTime}}</li>
                            <li>订单报备类型</li>
                            <li>{{detaildata.reportedTypeName}}</li>
                        </ul>
                        <ul class="orderlsit">
                            <li>订单货品类型</li>
                            <li>
                                <span v-if="detaildata.orderGoodsType == 1">成品</span>
                                <span  v-else-if="detaildata.orderGoodsType == 2">定制品</span>
                                <span v-else></span>
                            </li>
                            <li>品牌</li>
                            <li>{{detaildata.brandName}}</li>
                            <li>品类</li>
                            <li>{{detaildata.categoryName}}</li>
                        </ul>
                        <ul class="orderlsit">
                            <li>订单来源</li>
                            <li v-if="detaildata && detaildata.orderSourceName">{{detaildata.orderSourceName}}</li>
                            <li v-else>--</li>
                            <li>价格策略</li>
                            <li>{{detaildata.priceStrategyName}}</li>
                            <li>活动</li>
                            <li>{{detaildata.activityName}}</li>
                        </ul>
                        <ul class="orderlsit">
                            <li>推荐人姓名</li>
                            <li>{{detaildata.referrerName}}</li>
                            <li>推荐人电话</li>
                            <li>{{detaildata.phone}}</li>
                            <li>推荐人公司</li>
                            <li>{{detaildata.companyName}}</li>
                        </ul>
                        <ul class="orderlsit">
                            <li>款清状态</li>
                            <li>
                                <span v-if="detaildata.settlementStatus == 1">款未清</span>
                                <span v-else-if="detaildata.settlementStatus == 2">收费款清</span>
                                <span v-else-if="detaildata.settlementStatus == 3">财务款清</span>
                                <span v-else-if="detaildata.settlementStatus == 4">家装款清</span>
                                <span v-else>--</span>
                            </li>
                            <li>订单备注</li>
                            <li>{{detaildata.orderRemark}}</li>
                            <li></li>
                            <li></li>
                        </ul>
                        <ul class="orderlsit" v-if="isInstall">
                            <li>首次安装日期</li>
                            <li>{{installdata.firstInstallationTime}}</li>
                            <li>汇报完成日期</li>
                            <li>{{installdata.repostCompleteTime}}</li>
                            <li>回访完成日期</li>
                            <li>{{installdata.customerCompleteTime}}</li>
                            <li>安装完成用时</li>
                            <li>{{installdata.elapsedTime}}</li>
                            <li>距今完成时间</li>
                            <li>{{installdata.time}}</li>
                        </ul>
                        <!-- <ul class="orderlsit">
                            <li>关联附属订单</li>
                            <li class="orderclas">
                                <div v-for="(item,idx) in detaildata.orderSubsidiaryList" :key="idx">
                                    <span v-if="item.subsidiaryType == 1">{{item.subsidiaryNumber}}-增单</span>
                                    <span v-if="item.subsidiaryType == 2">{{item.subsidiaryNumber}}-补单</span>
                                    <span v-if="item.subsidiaryType == 3">{{item.subsidiaryNumber}}-遗留单</span>
                                    <span v-if="item.subsidiaryType == 11">{{item.subsidiaryNumber}}-换货</span>
                                    <span v-if="item.subsidiaryType == 6">{{item.subsidiaryNumber}}-退货</span>
                                    <span>（待付款）</span>
                                </div>
                            </li>
                        </ul> -->
                    </div>
                </el-collapse-transition>
            </div>
        </el-card>
    </div>
</template>

<script>
import { orderDetails, installMessage } from 'api/order/order/order';
  export default {
    data() {
        return {
            isShow: true,
            show: false,
            detaildata: {},
            installdata: {
                firstInstallationTime: '',
                repostCompleteTime: '',
                customerCompleteTime: '',
                elapsedTime: '',
                time: '',
            },
        };
    },
    props: {
        // 后道的安装
        isInstall: {
            type: Boolean,
            default () {
                return false;
            }
        },
        orderId: {
            type: null,
            // default () {
            //     return 0;
            // }
        }
    },
    // props: ["orderId","isInstall"],
    created() {
        this.orderDetails();
        if( this.isInstall ) {
            this.installMessage(); 
        }
    },
    watch: {
        orderId(val) {
            this.orderDetails();

            if( this.isInstall ) {
                this.installMessage(); 
            }
        },
        '$route':function(val){
            this.orderDetails();

            if( this.isInstall ) {
                this.installMessage(); 
            } 
        }
    },
    methods: {
        clickNumber() {
            if(this.$route.path != "/ordermm/details" ) {
                let orderId = this.$route.query.orderId ? this.$route.query.orderId : this.orderId;
                this.$router.push({path: "/ordermm/details", query:{orderId, orderNumber: this.detaildata.orderNumber}})
            }
        },
        installMessage() {
            let data = {
                // orderId: this.orderId ? this.orderId : this.$route.query.orderId
                orderId: this.$route.query.orderId ? this.$route.query.orderId : this.orderId
            }
            installMessage(data).then(res => {
                if(res.status == 200) {
                    if(res.data) {
                        this.installdata = res.data;
                    }else {
                        this.installdata.firstInstallationTime = '';
                        this.installdata.repostCompleteTime = '';
                        this.installdata.customerCompleteTime = '';
                        this.installdata.elapsedTime = '';
                        this.installdata.time = '';
                    }
                }
            })
        },
        hideSearch(){
            this.isShow = !this.isShow;
            // console.error('111', this.isShow);
        },
        
        orderDetails() {
            this.$store.dispatch('SET_ORDER_DETAILS', {});
            let data = {
                // orderId: this.orderId ? this.orderId : this.$route.query.orderId
                orderId: this.$route.query.orderId ? this.$route.query.orderId : this.orderId
            }
            if(data.orderId){
                orderDetails(data).then(res =>{
                    if(res.status == 200){
                        this.detaildata = res.data;
                        this.$emit("orderGoodsTypefun", res.data.orderGoodsType)
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
                    this.$store.dispatch('SET_ORDER_DETAILS', {});
                    console.log('订单管理:订单相关信息获取 order/order/order.vue', error);
                })
            }else{
                // this.$message({
                //     message: '没有订单id',
                //     type: 'warning'
                // });
            }
        },

    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .orderdetail{
        margin-bottom: 5px;
        .disflex{
            display: flex;
            justify-content: space-between;
            .xiala{
                font-size: 14px;
                color: rgb(83, 168, 255);
                cursor: pointer;
            }
        }
        .orderdetails{
            width: 100%;
            /*border-radius: 2px;*/
        }
        .texli{
            display: flex;
            align-items: center;
            // margin-bottom: 20px;
        }
        .orderdetails .ordertet{
            font-weight: 650;
            color: #006CC3;
            font-size: 20px;
            cursor: pointer;
            i:hover {
              text-decoration: underline;
            }
        }
        .orderdetails .measurecla{
            font-size: 12px;
            color: #999;
        }
        .orderdetails .measurecla i{
            color: #FF9900;
            font-size: 14px;
            font-style: normal;
        }
        .orderdetails .texli>span{
            padding-right: 20px;
        }

        .customerlist{
            display: flex;
            // justify-content: space-between;
            flex-wrap: wrap;
            font-size: 13px;
            color: #333333;
        }
        .customerlist li {
            width: 25%;
            line-height: 30px;
        }
        .orderbox{
            width: 100%;
            margin-top: 10px;
            font-size: 14px;
            border-top: 1px solid #e4e4e4;
            border-left: 1px solid #e4e4e4;
        }
        .orderlsit{
            display: flex;
            li{
                padding: 0px 10px;
                display: flex;
                align-items: center;
                border-right: 1px solid #e4e4e4;
                border-bottom: 1px solid #e4e4e4;
                line-height: 2.2;
                &:nth-child(odd){
                    width: 120px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(even){
                    flex: 1;
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                }
                // 关联附属订单样式
                &.orderclas{
                    display: flex;
                    align-items: center;
                    span{
                        &:nth-child(odd){
                            color: #5F71E7;
                        }
                        &:nth-child(even){
                            color: #E50E0F;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
        
    }
</style>

