<template>
    <div class="seeannex">
        <div>
            <div class="tabbox">
                <div class="titlecals martop">查看附件</div>
                <div class="order-btn-list">
                    <el-button size="small" class="button-96" @click="addFun">订单跟进附件</el-button>
                    <el-button size="small" class="button-96" @click="downFun">收费附件</el-button>
                    <el-button size="small" class="button-96" @click="importhFun">测量附件</el-button>
                    <el-button size="small" class="button-96" @click="salesmanFun">设计附件</el-button>
                    <el-button size="small" class="button-96" @click="mechanismFun">合同</el-button>
                    <el-button size="small" class="button-96" @click="saleFun">下单图</el-button>
                    <el-button size="small" class="button-96" @click="newbudget">送货附件</el-button>
                    <el-button size="small" class="button-96" @click="orderCancellation">安装附件</el-button>
                    <el-button size="small" class="button-96" @click="newProblems">定责附件</el-button>
                    <el-button size="small" class="button-96" @click="uploadOrder">外部推荐人附件</el-button>
                </div>
                <div class="seeannexlist">
                    <ul class="tabtop">
                        <li>操作</li>
                        <li>附件类型</li>
                        <li>附件名称</li>
                        <li>上传时间</li>
                        <li>上传人</li>
                    </ul>
                    <ul class="disflbox">
                        <li class="colorblue">上传 | 下载 | 删除</li>
                        <li>量尺单</li>
                        <li class="colorgren">测量草图</li>
                        <li>2018.08.18 18:20</li>
                        <li>张三</li>
                    </ul>
                    <ul class="disflbox">
                        <li class="colorblue">上传 | 下载 | 删除</li>
                        <li>量尺单</li>
                        <li class="colorgren">测量草图</li>
                        <li>2018.08.18 18:20</li>
                        <li>张三</li>
                    </ul>
                </div>
                <p class="titlecals martop">历史上传</p>
                <div class="seeannexlist">
                    <ul class="tabtop">
                        <li>操作</li>
                        <li>附件类型</li>
                        <li>附件名称</li>
                        <li>上传时间</li>
                        <li>上传人</li>
                    </ul>
                    <ul class="disflbox">
                        <li class="colorblue">下载 | 删除</li>
                        <li>量尺单</li>
                        <li class="colorgren">测量草图</li>
                        <li>2018.08.18 18:20</li>
                        <li>张三</li>
                    </ul>
                    <ul class="disflbox">
                        <li class="colorblue"> 下载 | 删除</li>
                        <li>量尺单</li>
                        <li class="colorgren">测量草图</li>
                        <li>2018.08.18 18:20</li>
                        <li>张三</li>
                    </ul>
                </div>
                <p class='titlecals martop'>下载记录</p>
                <el-table border ref="multipleTable" :data="tableData" 
                    tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange">
                    <el-table-column prop="appointmentDoorTime" align="center" label="附件类型" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="appointmentId" label="附件名称" align="center" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="appointmentTime" label="上传时间" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="remark" label="下载时间" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="appointmentId" label="下载人" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    data() {
        return {
            remark: '',
            tableData:[
                {
                    state: '已完成',
                    appointmentDoorTime: 123456789,
                    sourceNumber: 987654321,
                    type: '正单',
                    isTovoid: '-',
                    appointmentId: '张三',
                    remark: '2019-05-06',
                    appointmentTime: '2019-05-01',
                    isDiscount: false,
                    emergency: false,
                    status: 1
                }
            ],
        };
    },
    // props: [],
    props: {
        // 该组件是否显示button
        isButton: {
            type: Boolean,
            default () {
                return false;
            }
        }
    },
    mounted() {

    },
    created() {
        
    },
    methods: {

        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChange(){
            
        }
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .seeannex{
        width: 100%;
        .tabbox{
            margin-top: 20px;
            .martop{
                margin-top: 20px;
            }
        }
        .seeannexlist{
            margin-bottom: 40px;
        }
        .tabtop{
            text-align: center;
            padding: 10px 0px;
            background: #F2F2F2;
            display: flex;
            li{
                flex: 1;
            }
        }
        .disflbox{
            padding: 10px 0px;
            display: flex;
            text-align: center;
            li{
                flex: 1;
            }
            .colorblue{
                color: #0099FF;
            }
            .colorgren{
                color: #1ABC9C;
            }
        }
    }
    .order-btn-list{
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        >button{
            margin: 5px;
        }
    }
    .order-btn-list .blue{
        background: #96bdde;
        color: #fff;
        width: 100px;
        padding-left: 0;
        padding-right: 0;
    }
</style>

