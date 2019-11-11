<template>
    <div class="orderdetail">
        <!-- <el-card class="m-bottom"> -->
            <!-- 查询条件组 -->
            <div class="orderdetails">
                <div class="orderbox">
                    <ul class="orderlsit">
                        <li>合同金额</li>
                        <li>3000</li>
                        <li>少收金额</li>
                        <li>8</li>
                        <li>正确折后金额</li>
                        <li>8</li>
                    </ul>
                    <ul class="orderlsit">
                        <li>店长</li>
                        <li style="width:auto;">
                            <el-select v-model="info.manager" placeholder="请选择" size="medium" style="min-width:222px;padding:2px 10px;">
                                <el-option
                                    v-for="item in managerList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        
                        <li>扣减业绩额</li>
                        <li>500</li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul class="orderlsit">
                        <li>销售员</li>
                        <li style="width:auto;">
                            <el-select v-model="info.manager" placeholder="请选择" size="medium" style="min-width:222px;padding:2px 10px;">
                                <el-option
                                    v-for="item in managerList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>扣减业绩额</li>
                        <li>500</li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul class="orderlsit">
                        <li>设计员</li>
                        <li style="width:auto;">
                            <el-select v-model="info.manager" placeholder="请选择" size="medium" style="min-width:222px;padding:2px 10px;">
                                <el-option
                                    v-for="item in managerList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        
                        <li>扣减业绩额</li>
                        <li>500</li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul class="orderlsit">
                        <li>店面业绩</li>
                        <li>8</li>
                        <li>应收折扣明细公式</li>
                        <li>计算公式</li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul class="orderlsit">
                        <li>违规描述</li>
                        <li>请输入提示文字</li>
                    </ul>
                </div>
            </div>
        <!-- </el-card> -->
    </div>
</template>

<script>
  export default {
    data() {
        return {
       
           
            managerList: [
                {label: "张海霞",value:"1"},
                {label: "王就就",value:"2"},
            ],
            manager: '',
            info: {},
            ischecked: false,
        };
    },
    props: [],
    mounted() {
        
    },
    methods: {
        
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .orderdetail{
        .disflex{
            display: flex;
            justify-content: space-between;
            .xiala{
                font-size: 14px;
                color: #999;
                cursor: pointer;
            }
        }
        .orderdetails{
            width: 100%;
            border-radius: 2px;
        }
        .texli{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .orderdetails .ordertet{
            font-weight: 650;
            color: #006CC3;
            font-size: 20px;
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
                text-align:center;
                vertical-align: middle;
                border-right: 1px solid #e4e4e4;
                border-bottom: 1px solid #e4e4e4;
                line-height: 2.2;
                &:nth-child(odd){
                    min-width: 134px;
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

