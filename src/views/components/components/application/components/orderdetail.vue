<template>
    <div class="orderdetail">
        <!-- <el-card class="m-bottom"> -->
            <!-- 查询条件组 -->
            <div class="orderdetails">
                <div class="disflex">
                    <div class="texli">
                        <span class="ordertet">订单编号：SO201806140007</span>
                        <span><el-tag type="success" size="small">正单</el-tag></span>
                        <!-- <span class="measurecla">当前状态：<i>带测量</i></span> -->
                    </div>
                    <div class="xiala">
                        <span 
                            :class="[show ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" 
                            @click="show = !show">
                            {{show ? "收缩" : "展开"}}
                        </span>
                    </div>
                </div>
                <div class="orderbox">
                    <ul class="orderlsit">
                        <li>客户姓名</li>
                        <li>张三</li>
                        <li>客户电话</li>
                        <li>17676768989</li>
                        <li>备用电话</li>
                        <li>--</li>
                    </ul>
                    <ul class="orderlsit">
                        <li>订单地址</li>
                        <el-tooltip class="item" effect="dark" content="北京市丰台区怡海花园小区1号楼1单元102" placement="top">
                            <li>北京市丰台区怡海花园小区1号楼1单元102</li>
                        </el-tooltip>
                        <li>所属网点</li>
                        <li>京北橱柜店</li>
                        <li>销售员</li>
                        <li>李丽</li>
                    </ul>
                    <el-collapse-transition>
                        <div v-show="show">
                            <ul class="orderlsit">
                                <li>设计师</li>
                                <li>张三</li>
                                <li>订单创建时间</li>
                                <li>2018-06-20 12:41</li>
                                <li>订单报备类型</li>
                                <li>D类</li>
                            </ul>
                            <ul class="orderlsit">
                                <li>货品类型</li>
                                <li>定制</li>
                                <li>品牌</li>
                                <li>欧派</li>
                                <li>品类</li>
                                <li>衣柜</li>
                            </ul>
                        </div>
                    </el-collapse-transition>
                    <ul class="orderlsit">
                        <li>订单渠道</li>
                        <li>门店</li>
                        <li>订单来源</li>
                        <li>自然客流</li>
                        <li>订单备注</li>
                        <li>备注内容~</li>
                        <!-- <li class="orderclas">
                            <span>so202131223123-增1</span>
                            <span>（待付款）</span>
                            <span>so202131223123-补1</span>
                            <span>（待安装）</span>
                        </li> -->
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
            isShow: true,
            show: false
        };
    },
    props: [],
    mounted() {
        
    },
    methods: {
        hideSearch(){
            this.isShow = !this.isShow;
            // console.error('111', this.isShow);
        },
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

