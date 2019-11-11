<template>
  <div class="clientcollection">
    <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
        <div style="margin-top:20px;padding-bottom:30px;border-bottom:1px solid #cccccc" v-show="!$route.query.source" v-if="!$route.query.noOrder">
            <div class="titles">未结订单</div>
            <div style="padding-left:15px" class="m-top20">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input size="medium" placeholder="订单编号" v-model="formList.orderNumber"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="客户姓名" v-model="formList.customerName"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="客户电话" v-model="formList.customerPhone"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button size="medium" class="button-fc searchButton" @click="search">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
            <editTable :isMoneyWayId="isMoneyWayId" :tableData="tableData" @selection-change="onSelect" :selects="choose"></editTable>
            <div class="pagination_wrap">
                <pagination
                    :current-page="formList.page"
                    :pageSize="formList.limit"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div>
        </div>
        <collectionInformation :storeStatus="storeStatus" @moneyWayId="moneyWayId" :childTable="obj" @Tables="changeTable"></collectionInformation>
    </el-card>
    <el-dialog title="" :visible.sync="dialogFormVisible">
        <div class="titlecals">上传文件</div>
        <el-upload
            class="upload-demo"
            action="http://localhost:9527/api/auth/service/uploadFile"
            :data= upLoadtype
            :headers = "headers"
            accept="image/jpg,image/jpeg,image/png,image/bmp"
            :before-upload="beforUpload"
            :on-success="uplodSuccess"
            :on-error="uplodError"
            :show-file-list="false">
            <el-button size="small" type="primary">请选择文件</el-button>
        </el-upload>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogUpload">确认</el-button>
            <el-button type="primary" @click="cancleUpload">确认</el-button>
        </div>
    </el-dialog>
    

	

  </div>
</template>
<script>
import pagination from '@/views/components/pagination';
import breadcrumb from "@/views/components/breadcrumb";
import editTable from "./editTable";
import storePop from "./storePop";
import { getToken } from '@/utils/auth';
import collectionInformation from './collectionInformation'
import spot from '@/assets/images/spot.png';
import {listOrderBySalesmanId, listOrderByOrderIds} from '@/api/receivablesrun/clientcollection/index'
import { mapGetters } from 'vuex';
export default {
  components: {
    breadcrumb,
	pagination,
    editTable,
    storePop,
    collectionInformation
  },
  data() {
    return {
        querys: this.$route.query.source,
        formLabelWidth: '140px',
        size: 'medium',
        //弹框
        popTan: false,
        navList: [],
        searchtext: "",
        value: "",
        total: 10,//总条数
        spot,
        tableData: [],
        tablists:["待收款","已提交","未交票","已收款","已退回"],
        tabstatus:0,
        obj:{
            multiSelection:[], 
        },
        //表格选中值数组
        ruleForm: {
            storeName: '',
            companyId: '',

            // booths: [{
            //     boothName: ''
            // }],
            isSignOrder: false,
            remark: ''
        },
        rules: {
          storeName: [
            { required: true, message: '请输入门店名称', trigger: 'blur' }
          ],
        },
        companyList: [],
        payType : [
            { value: "0", label: "预付款"},
            { value: "1" , label: "合同款"},
            { value: "2", label: "特权定金" },
            { value: "3", label: "定金" }
        ],
        payMeth: [
            { value: "0", label: "POS机收费"},
            { value: "1" , label: "现金"},
            { value: "2", label: "支票" },
            { value: "3", label: "转账" },
            { value: "4" , label: "建材城代收"},
            { value: "5", label: "家装公司代收" }
        ],
        count: [],
        transferForm:{
            storeCustomerIds:[],				    //客户id
            storeCustomerTransferType:2,		//移交类型,2共享
            transferStoreId:"",				      //移交负责门店
            transferStoreAtId:"",           //移交负责人
            isShareDemand:"",                //是否共享客户需求
            isShareAddress:"",               //是否共享客户地址
            isShareWx:"",                    //是否共享客户微信
            isSharePhone:"",                 //是否共享客户电话
            submitStatus:""                  //是否提交        
        },
        // 弹出框的名字
        randomTitle: " ",
        dialogFormVisible: false,
        upLoadtype:{//图片上传参数
            type: 'pc'
        },
        storeList: [
            {
                storeNumber:'1',
                storeName:'asds',
                storeLeader:'',
                boothNumber:'',
                companyName:''
            }
        ],
        choose:[],
        headers: {
          Authorization: getToken()  //从cookie里获取token，并赋值  Authorization ，而不是token
        },
        formList:{
            customerName:"",
            orderNumber:"",
            customerPhone:"",
            page:1,
            limit:10
        },
        isMoneyWayId:null,
        storeStatus:0
    };
  },
  computed: {
    ...mapGetters([
        'orderSelectList',
    ])
  },
  mounted() {
    if(this.querys){
        if(this.orderSelectList && this.orderSelectList.length){
            let data = {
                orderIds: this.orderSelectList.join(',')
            }
            listOrderByOrderIds(data).then(res=>{
                this.tableData = res.data.rows;
                this.total = res.data.total;
            })
        }else{
            this.$router.push({path: "/ordermm/order"})
            this.$message.warning("请重新选择订单");
        }
    }else{
        this.pages()
    }
    // 头部面包屑
	this.navList = this.$route.meta;
	// 代收款--获取表格数据
	// this.getListData();
  },
  methods: {
    moneyWayId(val){
        this.isMoneyWayId=val;
    },
    reset(){
        this.formList.page=1;
        this.formList.customerName="";
        this.formList.orderNumber="";
        this.formList.customerPhone="";
        this.pages()
    },
    pages(){
        listOrderBySalesmanId(this.formList).then(res=>{
            this.tableData=res.data.rows;
            this.total=res.data.total;
        })
    },
    search(){
        this.formList.page=1;
        this.pages()
    },
    changeTable(val){
        this.choose=val
    },
    // 翻页方法
    currentChange(val) {
      this.formList.page = val;
      this.pages()
    },

    // 翻页方法
    sizeChange(val) {
      this.formList.page = 1;
      this.formList.limit = val;
      this.pages()
    },
	onSelect: function (el) {
        this.obj.multiSelection = el;
        this.storeStatus=1;
        console.log(555)
    },
    
    // 提交表单
    submitForm(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
            const params = this.ruleForm;
            const boothNumber = [];
            const brandId = [];
            const categoryId = [];
            this.ruleForm.booths.forEach(item => {
                boothNumber.push(item.boothName);
            })
            this.brands.forEach(item => {
                brandId.push(Number(item));
            })
            this.category.forEach(item => {
                categoryId.push(Number(item));
            })
            params.boothNumber = boothNumber;
            params.isTogetherOrder = this.ruleForm.isSignOrder ? 1 : 0;
            params.startTime = this.ruleForm.businessTime[0];
            params.endTime = this.ruleForm.businessTime[1];
            params.brandId = brandId;
            params.categoryId = categoryId;
            params.storeId = this.storeId ? this.storeId : undefined;
            const fn = this.storeId ? updateStore : insertStore;
            fn(params)
                .then(response => {
                this.$message.success('操作成功');
                if (this.storeId) {
                    // 编辑
                    this.goBack();
                } else {
                    // 添加
                    this.storeId = response.data.storeId;
                }
                })
                .catch(error => {
                console.log('store/insertStore(updateStore):' + error);
                });
            } else {
            return false;
            }
        });
    },

    // 取消 返回上一页
    goBack() {
        this.$router.go(-1);
    },
    dialogUpload () {
      this.dialogFormVisible = false;
      this.$router.push({
          path: 'verifyGoods',
      });
    },
    cancleUpload() {

    },
    // table 颜色切换
    tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
    },
    // 多选改变
    handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$emit('selection-change', this.multipleSelection);
    },

    //上传前的回调
    beforUpload(file){
        console.log(file);
    },
    //文件上传成功回调
    uplodSuccess(response, file, fileList){
        this.brandInfo.brandUrl = response.data.url;
    },
    //图片上传失败回调
    uplodError(err, file, fileList){
        console.log(err, file, fileList)
    },

  }
};
</script>
<style scoped lang="scss">
.ipts{
    width: 217px;
}
.titles{
    position: relative;
    font-size: 20px;
    padding-left:30px;
    color:#006EC7;;
}
.titles::after {
    content: "";
    display: block;
    width: 4px;
    height: 20px;
    background: #006EC7;
    position: absolute;
    left:15px;
    top: 50%;;
    margin-top:-10px;
    border-radius: 5px;
}
.clientcollection {
    .querybox {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        padding-left:42px;
        margin-top:20px;
        
        .orderinp {
            max-width: 420px;
            
        }
        .searchButton{
            margin-left:10px;
        }
    }

    .formCredit{
        margin-top:20px;
    }

    .clientcontent {
        margin-top: 20px;
        .btns {
            margin-top: 20px;
        }
    }
    
    .collec {
        display:flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        width:100%;
        .input_item {
            width: 33%;
        }
        .credit_input {
            width: 30%;
        }
        .poundage_input {
            flex: 1;
            display: flex;
            flex-wrap: nowrap;
        }


    }
}
.model {
    border-bottom: none;
}


</style>
