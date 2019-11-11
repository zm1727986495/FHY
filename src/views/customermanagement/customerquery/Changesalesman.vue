<template>
    <div class="transfer">
        <div class="transfer_c">
            <div class="crumbs">
                <span>当前位置：</span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>销售中心</el-breadcrumb-item>
                    <el-breadcrumb-item>客户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>客户迁移</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="transfer_tit">
                <h3>客户迁移</h3>
                <div class="transfer_tit_c">
                    <span class="lable_t">
                        原导购：
                        <span>张三</span>
                    </span>
                    <span class="lable_t">
                        所属门店：
                        <span>居然之家XXX店</span>
                    </span>
                    <span class="lable_t">
                       共
                        <span>5</span>
                        个客户
                    </span>
                </div>
            </div>
            <div class="transfer_tit_i">
                <h3>移交信息</h3>
                <el-form ref="form" :model="form" label-width="110px" size="mini">
                    <el-form-item label="所属门店" class="Choice">
                        <el-input v-model="form.store"></el-input>
                        <span @click="handleChoiceStore">选择</span>
                    </el-form-item>
                    <el-form-item label="导购" class="Choice">
                        <el-input v-model="form.guide"></el-input>
                        <span @click="handleChoiceShop">选择</span>
                    </el-form-item>
                    <el-form-item label="移交开始时间" class="from_data">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 120px"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="核算开始时间" class="from_data">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 120px"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
            <div class="transfer_order">
                <div class="query">
                    <input type="text" placeholder="客户名称/客户电话/订单号/产品品牌/订单状态/订单类型">
                    <el-button type="primary">查询</el-button>
                </div>
                <div class="transfer_tab">
                    <el-table   border  ref="multipleTable"   :data="tableData" tooltip-effect="dark"  
                                style="width: 100%"  @selection-change="handleSelectionChange"                       
                                >
                        <el-table-column type="selection" ></el-table-column>                       
                        <el-table-column prop="state" label="订单状态" ></el-table-column>
                        <el-table-column prop="orderNumber" label="订单号"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ordertype" label="订单类型"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="GoodsType" label="订单货品类型"   show-overflow-tooltip></el-table-column>
                        <el-table-column prop="brand" label="产品品牌"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="productType" label="产品品类"   show-overflow-tooltip></el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <el-pagination  background  @current-change="handleCurrentChange" :current-page.sync="currentPage"  :page-sizes="[10,20,30,40]" :page-size="10" prev-text="上一页" next-text="下一页"
                            layout="total,prev, pager, next ,sizes,  jumper" :total="total" :page-count="totalPage">
                        </el-pagination>
                    </div>         
                </div>
            </div>
            <div>

            </div>
            <div>
                <el-button type="primary" @click="Preservation">保存</el-button>
                <el-button type="primary" @click="handleTransfer">提交</el-button>
                <el-button type="primary" @click="handleCancel">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                form:{
                    store:"",
                    guide:"",
                    data1:"",
                    data2:""
                },
                tableData:[
                    {"state":"未指派","orderNumber":"201801120001","ordertype":"正单","GoodsType":"定制","brand":"欧派","productType":"橱柜",}
                ],
                  //分页当前页
                currentPage: 1,
                //总页数
                total: 100,
                //
                totalPage: 10,

            }
        },
        methods:{
            handleChoiceStore(){
                alert()
            },
            handleChoiceShop(){
                alert()
            },
            handleSelectionChange(){
                 this.multipleSelection = val;
            },
             //分页插件
            handleCurrentChange(page) {
                console.log(page);
                this.currentPage = page;
            
            },
            // 保存按钮
            Preservation(){
                this.$router.push({path:'/customerquery'});                
            },
            // 提交按钮
            handleTransfer(){
                this.$router.push({path:'/transferApproval'});
            },
            // 取消按钮
            handleCancel(){
                this.$router.push({path: '/customerquery'});
            }
        }
    }
</script>

<style scoped>
button{
    border:none;
    width:70px;
    height:40px;
    color:#fff;
    background: rgba(22, 155, 213, 1);
    border-radius:5px;
    text-align:center;
    line-height:40px;
}
.transfer{
    height:100%;
    background:#fff;
    overflow: hidden;
}
.transfer_c{
    margin:30px 60px 0;
}
.crumbs {
  overflow: hidden;
}
.crumbs > span {
  color: #ddd;
  font-size: 15px;
  float: left;
}
.transfer_tit{
    height:100px;
    border:1px solid #ddd;
}
.transfer_tit>h3{
    width: 229px;
    height: 30px;
    border-bottom: 1px solid #000;
    line-height: 30px;
    color: #222;
    margin-bottom: 20px;
    margin-top: 10px;
}
.transfer_tit_i{
    overflow:hidden;
    border:1px solid #ddd;
    margin-top:30px;
}
.transfer_tit_i>.lable_t{
    float:left;
    margin-right:60px;
}
.el-form-item__content{
    width:200px;
}
.Choice{
    overflow:hidden;
}

.el-input>button{
    position:absolute;
}
.transfer_order{
    border:1px solid #ddd;

}
.query>input{
    width:25%;
    font-size:12px;
}


.operation {
  margin-top: 20px;
}
.operation > button {
  border: none;
  border: 1px solid #555;
  border-radius: 5px;
  width: 60px;
  height: 29px;
  background: #fff;
  font-size: 15px;
  margin-right: 20px;
  color:#000;
  line-height:29px;
}

.table{
    margin-top:20px;
}
.operate{
    color:#169BD5;
    margin-right:10px;
}

.pagination_wrap {
    margin-top: 30px;
    text-align: center;
    padding-bottom: 30px;
}

/* 分页 */
.btn-prev {
    width: 67px;
    background: #f4f4f4;
    padding-right: 0;

}

.el-pagination button:disabled {
    background: #f4f4f4 !important;
}

.el-pagination .btn-prev {
    width: 67px;
    background: #f4f4f4 !important;
}

.el-pager li {
    border: 1px solid #dddddd;
    margin: 0 5px;
    width:40px;
    height:30px;
}

.el-pager li.active+li {
    border-left: 1px solid #dddddd;
}

.el-pagination .btn-next {
    padding-left: 0;
}

.el-pager li.active {
    border-color: #169BD5;
    color: #ffffff;
    background: #169BD5;
}

.btn-next {
    width: 67px;
    background: #f4f4f4 !important;
    padding-left: 0;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #169BD5;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
    border-radius: 3px;
}

.el-pagination__editor.el-input .el-input__inner {
    width: 100%;
}
</style>