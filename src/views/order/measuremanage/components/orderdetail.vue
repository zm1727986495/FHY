<template>
    <div class="orderdetail">
        <div :class="'order_title '  +  (isShow ? '' : 'hide')">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="orderdetails">
                    <div class="texli">
                        <span class="ordertet">订单编号：SO201806140007</span>
                        <span><el-tag type="success" size="small">正单</el-tag></span>
                        <span class="measurecla">当前状态：<i>带测量</i></span>
                    </div>
                    <ul class="customerlist">
                        <!-- <li>客户姓名：张三</li>
                        <li>客户电话：13809096526</li>
                        <li>备用电话：--</li>
                        <li>订单地址：</li>
                        <li>客户姓名：张三</li>
                        <li>所属网点：京北橱柜店</li>
                        <li>客户姓名：张三</li>
                        <li>所属网点：京北橱柜店</li>
                        <li>客户姓名：张三</li>
                        <li>所属网点：京北橱柜店</li>
                        <li>客户姓名：张三</li>
                        <li>所属网点：京北橱柜店</li>
                        <li>客户姓名：张三</li>
                        <li>所属网点：京北橱柜店</li>
                        <li>客户姓名：张三</li>
                        <li>所属网点：京北橱柜店</li> -->
                    </ul>
                </div>
            </div>
            <div class="m-right" >
                <button :class="'hide_btn ' + (isShow ? '' : 'hide') " @click="hideSearch">{{isShow ? '收起' : '展开'}}</button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
        return {
            isShow: true,
            
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
        .order_title::after{
            content: '';
            clear: both;
            width: 0;
            height: 0;
            margin: 0;
            padding: 0;
            display: block;
        }
        .order_title{
            border: 1px solid #d9d9d9;
            padding-bottom: 20px;
            height: 200px;
        }
        .order_title.hide{
            height: 130px;
            overflow: hidden;
        }
        .m-right{
            width: 10%;
            float: right;
            height: 100%;
            position: relative;
        }
        .hide_btn{
            border: none;
            outline: none;
            position: absolute;
            right: 0;
            bottom: 0;
            padding-right: 25px;
            background: none;
            color: #d0cfcf;
        }
        .hide_btn::after{
            content: '';
            display: block;
            width: 15px;
            height: 15px;
            position: absolute;
            right: 0;
            bottom: 0;
            background-repeat: no-repeat;
            background-image: url(../../../../assets/images/jiantou.png);
        }
        .hide_btn.hide::after{
            content: '';
            display: block;
            width: 15px;
            height: 15px;
            position: absolute;
            right: 0;
            bottom: 0;
            background-repeat: no-repeat;
            background-image: url(../../../../assets/images/jiantou.png);
            background-position: center center;
            transform: rotate(180deg);
        }
        .warp_head_list{
            flex-wrap: wrap;
            width: 87%;
            float: left;
        }
        .orderdetails{
            margin-top: 20px;
            padding-left: 25px;
            /* border: 1px solid rgba(228, 228, 228, 1); */
            border-radius: 2px;
        }
        .texli{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .orderdetails .ordertet{
            font-weight: 650;
            color: #666666;
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
            justify-content: space-between;
            flex-wrap: wrap;
            font-size: 13px;
            color: #333333;
        }
        .customerlist li {
            width: 25%;
            line-height: 30px;
        }
        
    }
</style>

