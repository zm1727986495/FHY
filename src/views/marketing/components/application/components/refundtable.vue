<template>
<!-- 退款的Table -->
    <div class="refunddetail">
        <div class="iconBox m-bottom">
            <i class="Icon"></i>
            <span>订单详情</span>
        </div>

        <div class="refundtable">
            <!-- <div class="priPrice">
                <div class="title">
                    <span>价格策略：</span>
                    <span>2019年售价</span>
                </div>
                <div class="activity">
                    <span>参加活动：</span>
                    <span>欧派厨房嗨购节</span>
                    <span>活动详情</span>
                </div>
            </div> -->

            <!-- <div class="subtitle">
                <span>商品清单</span>
            </div> -->
            <!-- table表格 -->
            <!-- <div class="table_list lvs attribute">
                <el-table
                    border
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="tabList"
                    style="width: 100%;">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column
                        prop="name"
                        label="商品编号"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品名称"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品型号"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="优惠"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品原价"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="活动价"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="颜色"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="材质"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="系列"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品分类"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="供应商"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="计价方式"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="宽"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="高"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="深"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="数量"
                        sortable align="center">
                    </el-table-column>

                </el-table>   
            </div> -->

            <!-- 分页 -->
            <!-- <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div> -->

            <!-- 整单优惠 -->
            <!-- <div class="discount">
                <div class="subtitle">
                    <span>整单优惠</span>
                </div>
                <div class="content">
                    <div class="disdetail">
                        <span class="full">
                            <span>满:</span> 
                            <span>12,000</span>
                        </span>
                        <span class="minus">
                            <span>减:</span> 
                            <span>200</span>
                        </span>
                        <span class="add">
                            <span>加:</span> 
                            <span>800</span>
                        </span>
                    </div>
                    <div class="refunddetails">
                        <div class="refundbox">
                            <div class="list">
                                <div class="listleft">
                                    <ul class="refundlsit">
                                        <li>商品编号</li>
                                        <li>1010119000001</li>
                                        <li>商品型号</li>
                                        <li>xxxxddd</li>
                                        <li>供应商</li>
                                        <li>广州欧派</li>
                                    </ul>

                                    <ul class="refundlsit">
                                        <li>商品名称</li>
                                        <li>吊柜</li>
                                        <li>商品分类</li>
                                        <li>XXXX>XXXX>XXXX</li>
                                        <li></li>
                                        <li></li> -->
                                        <!-- <el-tooltip class="item" effect="dark" content="超期定责巴啦啦" placement="top">
                                            <li>超期定责巴啦啦</li>
                                        </el-tooltip> -->
                                    <!-- </ul>
                                </div>

                                <div class="listleft">
                                    <ul class="refundlsit goodssale">
                                        <li>商品售价</li>
                                        <li>320,000</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <ul class="refundlsit">
                                <li>颜色</li>
                                <li>红</li>
                                <li>材质</li>
                                <li>实木</li>
                                <li>系列</li>
                                <li>经典</li>
                                <li>系列</li>
                                <li>经典</li>
                                <li>数量</li>
                                <li>1</li> -->
                                <!-- <el-tooltip class="item" effect="dark" content="超期定责巴啦啦" placement="top">
                                    <li>超期定责巴啦啦</li>
                                </el-tooltip> -->
                            <!-- </ul>

                            <ul class="refundlsit">
                                <li>计价方式</li>
                                <li>宽*高</li>
                                <li>宽</li>
                                <li>1</li>
                                <li>高</li>
                                <li>1</li>
                                <li>深</li>
                                <li>1</li>
                                <li>非标系数</li>
                                <li>1.000</li>
                                <li>折扣率</li>
                                <li>1.00</li>
                            </ul>

                            <ul class="refundlsit">
                                <li>备注</li>
                                <el-tooltip class="item" effect="dark" content="hasakiodsafew4tgfeqhrsjmthnzdvaseffaeae3serfthrhtrhtr" placement="top-start">
                                    <li>hasakiodsafew4tgfeqhrsjmthnzdvaseffaeae3serfthrhtrhtr</li>
                                </el-tooltip>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- 订单金额 -->
            <div class="ordermoney">
                <div class="subtitle">
                    <span>订单金额</span>
                </div>
                <!-- <div class="content" >
                    <div class="disdetail">
                        <span class="contmoney">
                            <span>合同金额:</span> 
                            <span>12,389</span>
                        </span>
                        <span class="realmoney">
                            <span>实收金额:</span> 
                            <span>12，250</span>
                            <span>元</span>
                        </span>
                        <span class="repmoney">
                            <span>代金券金额:</span> 
                            <span>100</span>
                            <span>元</span>
                        </span>
                    </div>
                </div> -->
            </div>

            <!-- 折扣详情 -->
            <div class="discountrate">
                <el-form :model="formDiscount" :rules="rules" ref="ruleForm" label-width="120px" class="demo-discdetail">
                    <el-form-item label="原折扣率" prop="discountRate"> 
                        <!-- discountRate -->
                        <el-input-number class="width-100" placeholder="原折扣率/折" :disabled="true" :controls="false" v-model="formDiscount.discountRate" :precision="1" :min="0.1" size="medium"></el-input-number>
                    </el-form-item>
                    <el-form-item label="现折扣率" prop="discount">
                        <el-input-number class="width-100" placeholder="现折扣率/折"  :controls="false" v-model="formDiscount.discount" :precision="1" :min="0.1" :max="10" size="medium"></el-input-number>
                    </el-form-item>
                    <el-form-item label="退折扣金额" prop="refundMoney">
                        <el-input-number class="width-100" placeholder="退折扣金额/元"  :controls="false" v-model="formDiscount.refundMoney" :precision="2" :min="0" size="medium"></el-input-number>
                    </el-form-item>
                    <el-form-item label="退折扣原因" prop="refundReason">
                        <el-input type="textarea" v-model="formDiscount.refundReason" placeholder="退折扣原因"></el-input>
                    </el-form-item>
                </el-form>
            </div>

        </div>
         

        
        
        
    </div>
</template>

<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

  export default {
    components: {
        pagination
    },
    data() {
        return {
            //  表格
            elsectVal:[],//选中框
            tabList:[{
				name:'胖虎',
			},{
				name:'胖虎',
			},{
				name:'胖虎',
			},{
				name:'胖虎',
			},{
				name:'胖虎',
            },],//table数据
            formDiscount: {
                discountRate: this.discountRate, // 原折扣率
                discount: '', //  现折扣率
                refundMoney: '', //  退折扣金额
                refundReason: '', //  退折扣原因
            },
            rules: {
                discountRate: [
                    { message: '请输入原折扣率', trigger: 'blur' },
                ],
                discount: [
                    { required: true, message: '请输入现折扣率', trigger: 'blur' },
                ],
                refundMoney: [
                    { required: true, message: '请输入退折扣金额', trigger: 'blur' },
                ],
                refundReason: [
                    { required: true, message: '请输入退折扣原因',trigger: 'blur'}, 
                ]
            },
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数
        };
    },
    props: ["discountRate"],
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
       // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0], 
                // goodsSource: this.goodsSource[0],
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        
        
		
		// 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.pageSize = val;
            let data = this.searchdatas();
            this.getList(data);
		},

        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
		},

        // 表格勾选函数回调
		handleSelectionChange(val) {
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },

    },
  };
</script>

<style lang="scss" scoped>
    .refunddetail {
        .refundtable {
            .subtitle{
                margin: 20px;
                position: relative;
                span{
                    font-size: 20px;
                }
                &::before{
                    display: block;
                    content: "";
                    position: absolute;
                    bottom: -6px;
                    left: 0px;
                    width: 120px;
                    height: 2px;
                    background: red;
                }
            }
            .disdetail{
                display: flex;
                flex-wrap: nowrap;
                align-items: center;    
                >span {
                    font-size: 16px;
                    padding-left: 24px;
                    span:nth-of-type(2) {
                        color: #006ec6;
                        font-weight: bold;
                    }
                    &.minus{
                        span:nth-of-type(2) {
                            color: red;
                            font-weight: bold;
                        }
                    }
                    &:nth-of-type(n+2) {
                        padding-left: 12px;
                    }
                    &.realmoney{
                        span:nth-of-type(2) {
                            color: #006ec6;
                            font-weight: bold;
                        }
                    }
                    &.repmoney{
                        span:nth-of-type(2) {
                            color: red;
                            font-weight: bold;
                        }
                    }
                }
                
            }
            .priPrice {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-around;
                align-items: center;
                font-size: 16px;
                .title {
                    span:nth-of-type(even){
                        color: #006ec6;
                        font-weight: bold;
                    }
                }
                .activity {
                    span:nth-of-type(2){
                        color: red;
                        font-weight: bold;
                    }
                    span:nth-of-type(3){
                        padding-left: 12px;
                        color: #006ec6;
                        font-weight: bold;
                    }
                }
            }
            .discount{
                .content{
                    .disdetail{
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;    
                        >span {
                            font-size: 16px;
                            padding-left: 24px;
                            span:nth-of-type(2) {
                                color: #006ec6;
                                font-weight: bold;
                            }
                            &.minus{
                                span:nth-of-type(2) {
                                    color: red;
                                    font-weight: bold;
                                }
                            }
                            &:nth-of-type(n+2) {
                                padding-left: 12px;
                            }
                        }
                        
                    }
                }
            }
            .discountrate{
                margin-top: 20px;
                .demo-discdetail {
                    >div {
                        >div{
                            width: 32%;
                        }
                    }
                }
            }
            .refunddetails{
                margin-top: 20px;
                width: 100%;
                border-radius: 2px;
                .refundbox{
                    width: 100%;
                    font-size: 14px;
                    border-top: 1px solid #e4e4e4;
                    border-left: 1px solid #e4e4e4;
                    .list {
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;
                        justify-content: center;
                        .listleft:nth-of-type(1) {
                            flex:1;
                        }
                        .listleft:nth-of-type(2) {
                            width: 240px;
                            height: 62px;
                            ul.refundlsit.goodssale{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                li{
                                    height: 100%;
                                    align-items: center;
                                    display: flex;
                                    &:nth-of-type(1) {
                                        width: 80px;
                                    }
                                }
                                
                            }
                        }
                    }
                    .refundlsit{
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
                        }
                    }
                }
            } 
        }
            
    }
</style>


<style lang="scss">
    .discountrate{
        margin-top: 20px;
        .demo-discdetail {
            margin: 20px;
            >div {
                >div{
                    width: 32%;
                }
            }
        }
        .el-input-number .el-input__inner{
            text-align: left;
        }
    }
</style>


