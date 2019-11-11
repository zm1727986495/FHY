<template>
    <div class="newaddcustomer">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <div class="tapbox">
                <div></div>
                <div>
                    <el-button class="button-fc" size="medium">保存</el-button>
                    <el-button class="button-fc" size="medium">取消</el-button>
                    <el-button class="button-fc" size="medium">下一步</el-button>
                </div>
            </div>

            <!-- 订单信息部分 -->
            <div class="orderdetails">
                <div class="texli">
                    <span class="ordertet">订单编号：SO201806140007</span>
                    <span><el-tag type="success" size="small">正单</el-tag></span>
                    <span class="measurecla">当前状态：<i>带测量</i></span>
                </div>
                <ul class="customerlist">
                    <li>客户姓名：张三</li>
                    <li>所属网点：京北橱柜店</li>
                    <li>客户姓名：张三</li>
                    <li>所属网点：京北橱柜店</li>
                    <li>客户姓名：张三</li>
                    <li>所属网点：京北橱柜店</li>
                    <li>客户姓名：张三</li>
                    <li>所属网点：京北橱柜店</li>
                </ul>
            </div>

            <!-- 订单详情信息 -->
            <div class="orderbox">
                <div class="ordertap">订单信息</div>
                <div class="orderfrom">
                    <el-form :label-position="labelPosition" 
                    label-width="100px" 
                    :model="formInline" 
                    class="demo-form-inline">
                        <el-form-item label="客增单编号">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001-增1"></el-input>
                        </el-form-item>
                        <el-form-item label="来源单号">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001"></el-input>
                        </el-form-item>
                        <el-form-item label="客户姓名">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001-增1">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="订单日期">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001"></el-input>
                        </el-form-item>
                        <el-form-item label="客户地址">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001-增1"></el-input>
                        </el-form-item>
                        <el-form-item label="客户电话">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001"></el-input>
                        </el-form-item>
                        <el-form-item label="所属门店">
                            <el-input v-model="formInline.user" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="推荐人">
                            <el-input v-model="formInline.user" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="所属营销员">
                            <el-input v-model="formInline.user" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="所属业务员">
                            <el-input v-model="formInline.user" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="订单渠道" required>
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="订单来源" required>
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="产品品类" prop="resource" required>
                            <el-radio-group v-model="formInline.resource">
                                <el-radio label="顾家"></el-radio>
                                <el-radio label="欧派"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="品牌" required>
                            <el-input v-model="formInline.user" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="产品类别" required>
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="带单门店">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="订单金额" required>
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>

                    </el-form>

                    <div class="froms alercenter">
                        <span class="explaintxt">订单地址</span>
                        <div class="addresslist">
                            <el-select v-model="value" size="medium" placeholder="请选择" class="addresele">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="value" size="medium" placeholder="请选择" class="addresele">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="value" size="medium" placeholder="请选择" class="addresele">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-input placeholder="请输入小区名称" size="medium" v-model="value" class="input-with-select"></el-input>
                            <el-input placeholder="请输入小区名称" size="medium" v-model="value" class="input-with-select"></el-input>
                            <el-input placeholder="请输入小区名称" size="medium" v-model="value" class="input-with-select"></el-input>
                            <el-input placeholder="请输入小区名称" size="medium" v-model="value" class="input-with-select"></el-input>
                        </div>
                        <span class="explaintxttwo" @click="addressaler">地址管理</span>
                    </div>
                    
                    <!-- 订单备注 -->
                    <div class="froms alercenter">
                        <span class="explaintxt">订单备注</span>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="textarea2">
                        </el-input>
                    </div>

                    <!-- 需求信息 -->
                    <div class="froms">
                        <span class="explaintxt">需求信息</span>
                        <div class="borclas">
                            <demandassembly></demandassembly>
                        </div>
                        <span class="explaintxttwo">需求管理</span>
                    </div>

                </div>
            </div>

            <!-- 弹框 -->
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%">
                <div>
                    <div class="table_list">
                        <!--  -->
                        <el-table  border
                            :row-style="tableBodycolor" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;" >
                            
                            <el-table-column type="selection" width="40" align="center"></el-table-column>
                            <el-table-column prop="brandName" align="center" label="地质记录" sortable :filters= names :filter-method="filterSandler">
                                <template slot-scope="scope">
                                    <div>
                                        <el-tooltip placement="right" visible-arrow >
                                            <div slot="content" class="tips tipFon">
                                                <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                                            </div>
                                            <img :src="spot" alt="" class=" attributesTips">
                                        </el-tooltip>
                                        <p class="operation">{{scope.row.brandName}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isEnable" label="操作人"  align="center"  sortable :filters= typess :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <span>{{scope.row.isEnable == 1 ? '启用' : '禁用'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="brandType" align="center"  label="操作时间" sortable>
                                 <template slot-scope="scope">
                                    <span>{{scope.row.brandType == 1 ? '合作商' : '自营'}}</span>
                                </template>                               
                            </el-table-column>
                            <el-table-column prop="contactsName" align="center"  label="操作" sortable></el-table-column>         
                        </el-table>
                            <div class="pagination_wrap">
                                <pagination
                                :current-page="currentPage"
                                :pageSize="pageSize"
                                :total="total"
                                @sizeChange="sizeChange"
                                @currentChange="currentChange">
                                </pagination>
                            </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
    
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "../../components/breadcrumb";
import pagination from '../../components/pagination';
import demandassembly from '../components/demandassembly';

export default {
    components: {
        breadcrumb,
        pagination,
        demandassembly
    },
    data(){
        return {
            tabList: [],//列表数据
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数
            names:[],//筛选数据
            typess:[],//筛选数据

            navList: [],
            dialogVisible: false,
            labelPosition: 'right',
            formInline: {
                user: '',
                region: '',
                type: [],
                resource: ""
            },
            value1: '',
            options: [
                {value: '选项1',label: '黄金糕'}, 
                {value: '选项2',label: '双皮奶'}, 
                {value: '选项3',label: '蚵仔煎'}, 
                {value: '选项4',label: '龙须面'}, 
                {value: '选项5',label: '北京烤鸭'}
            ],
            value: '',
            textarea2: ''
        }
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        addressaler(){
            this.dialogVisible = true;
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
        },
        filterSandler(value, row, column) { //筛选方法调用
            const property = column['property'];
            return row[property] === value;                
        },
        // 编辑
        editHandle(){

        },
        filterHandler(value, row, column) { //筛选方法调用
            value == '启用' ? value = 1 : value = 0;
            const property = column['property'];
            return row[property] === value;
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
            this.getListData();
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            this.getListData();
        },
    }
}
</script>
<style scoped lang="scss">
    .newaddcustomer {
        .tapbox{
            padding: 10px;
            border: 1px solid rgba(228, 228, 228, 1);
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
        }
        .orderdetails{
            margin-top: 10px;
            padding: 15px 25px;
            border: 1px solid rgba(228, 228, 228, 1);
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

        .orderbox{
            margin-top: 10px;
        }
        .ordertap{
            padding: 18px 24px;
            font-weight: 700;
            font-size: 18px;
            color: #006ec6;
        }
        .orderfrom{
            margin-top: 10px;
            padding: 0px 70px;
        }
        .orderfrom .el-form-item__label{
            font-weight: 400;
        }

        .orderfrom .demo-form-inline{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .orderfrom .demo-form-inline>div{
            width: 40%;
        }
        .froms{
            position: relative;
            display: flex;
            margin-bottom: 20px;
        }
        .alercenter{
            align-items: center;
        }
        .addresslist{
            display: flex;
            align-items: center;
        }
        .addresslist .addresele{
            min-width: 120px;
        }
        .addresslist .input-with-select{
            max-width: 200px;
        }
        .explaintxt{
            font-size: 14px;
            width: 100px;
            min-width: 100px;
            padding-right: 10px;
            text-align: right;
        }
        .borclas{
            border: 1px solid #dcdfe6;
        }
        .explaintxttwo{
            font-size: 14px;
            margin-left: 20px;
            color: #1ABC9C;
            position: absolute;
            right: -65px;
        }
        .orderfrom .demo-form-inline-two{
            flex: 1;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            border: 1px solid #dcdfe6;
            padding: 20px 20px 0 0;
        }
        .orderfrom .demo-form-inline-two>div{
            width: 40%;
        }
    }
    
</style>