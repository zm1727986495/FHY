<template>
    <div>
        <div class="head_nav">
        <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="m-bottom15">
            <div class="querybox">
                <div>
                    <el-input
                        placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址"
                        v-model="searchtext"
                        size="medium"
                        class="orderinp">
                        <el-button slot="append" icon="el-icon-search" size="medium"></el-button>
                    </el-input>
                    
                </div>
                <el-select v-model="sel"></el-select>
                <el-button size="medium" class="button-fc fc">查询</el-button>
            </div>
        </el-card>
        <el-tabs type="border-card" >
        <el-tab-pane label="待审核" name="0">
          <div class="m-top20">
            <div class="clientcontent">
              <div class="btns m-bottom10">
                <el-button size="small" class="button-96" @click="visible=true">退回</el-button>
                <el-button size="small" class="button-96" >通过</el-button>
              </div>
            </div>
            <div  class="table_list">
              <waitAudit @listen="lisDialog"></waitAudit>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="1">
          <auditEnd @listen="lisDialog"></auditEnd>
        </el-tab-pane>
      </el-tabs>
        <el-dialog :visible.sync="visible"
            width="500px">
            <div class="titlecals">退回原因</div>
            <div>
                <el-input type="textarea"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visible = false">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button> 
            </span>
        </el-dialog>
        <el-dialog width="50%" :visible.sync="dialog">
            <div class="iconBox"><i class='Icon'></i><span>发票信息</span></div>
            <div>
                <ul class="invoiceList">
                    <li><span>发票抬头：</span><div style="display:inline-block">公司</div></li>
                    <li><span>纳税人识别号：</span><div style="display:inline-block">123156151</div></li>
                    <li><span>发票金额：</span><div style="display:inline-block">415132元</div></li>
                    <li><span>订单编号：</span><div style="display:inline-block">2132103</div></li>
                    <li><span>提交方式：</span><div style="display:inline-block">客户提交</div></li>
                    <li>
                        <span>品牌：</span>
                        <div style="display:inline-block">
                            <el-input></el-input>
                        </div>
                    </li>
                    <li>
                        <span>品类：</span>
                        <div style="display:inline-block">
                            <el-input></el-input>
                        </div>
                    </li>
                    <li><span>开票项目：</span><div style="display:inline-block">柜子</div></li>
                    <li><span>申请人：</span><div style="display:inline-block">张三</div></li>
                    <li><span>申请时间：</span><div style="display:inline-block">2019-02-02 11:34:32</div></li>
                    <li><span>发票号：</span>
                        <div style="display:inline-block">
                            <el-input></el-input>
                        </div>
                    </li>
                    <li><span>领取方式：</span><div style="display:inline-block">店面领取</div></li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog=false" type="primary">完成开票</el-button>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitAudit from './waitAudit';
import auditEnd from './auditEnd'
export default {
    components:{
        breadcrumb,
        waitAudit,
        auditEnd
    },
    data(){
        return{
            visible:false,
            dialog:false,
            searchtext:'',
            sel:'',
            navList:[]
        }
    },
    mounted() {
        this.navList = this.$route.meta
    },
    methods: {
        lisDialog(data){
            this.dialog=data
        }
    },
}
</script>
<style scoped>
    .querybox>div{
        display: inline-block;
        /* display: flex; */
        /* justify-content: space-between; */
        /* align-items: center; */
    }
    .orderinp{
        width: 420px;;
    }
    .button-fc{
        float: right;
    }
    .invoiceList{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top:20px;
        flex-wrap: wrap;
    }
    .invoiceList>li{
        width: 33%;
        height: 50px;;
        line-height: 50px;
    }
    .invoiceList>li>span{
        display: inline-block;
        width: 40%;
        text-align: right;
    }
    .invoiceList>li>div{
        width: 50%;
    }
</style>

