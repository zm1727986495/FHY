<template>
  <div class="urgentapply">

        <el-form
            :model="regoods"
            :rules="rules"
            ref="regoods"
            label-width="120px"
            class="demo-regoods" label-position="right">

            <el-form-item :label="instru.money" prop="money">
                <el-input placeholder="请输入退货退款金额"  v-model="regoods.money"></el-input>
            </el-form-item>
            
            <el-form-item label="付款方式" prop="company">
                <el-select v-model="regoods.type" placeholder="请选择付款方式">
                    <el-option
                        v-for="item in typeList" :key="item.value"
                        :label="item.label" :value="item.value">
                    </el-option>
                </el-select>

                <el-input placeholder="账户"  v-model="regoods.accountin" v-if="regoods.type == 1"></el-input>
                <el-input placeholder="开户行"  v-model="regoods.bankin" v-if="regoods.type == 1"></el-input>
                <el-input placeholder="卡号"  v-model="regoods.cardnumin" v-if="regoods.type == 1"></el-input>
                
            </el-form-item>      
        
            <el-form-item :label="instru.reason"  prop="remarks">
                <el-input type="textarea" v-model="regoods.remarks"></el-input>
            </el-form-item>
        </el-form>

        <el-tabs type="border-card"  v-model="activeName"  @tab-click="handleClick" v-if="status == 5">
            <el-tab-pane label="退货原因"  name="first">
                <regoodstable></regoodstable>
            </el-tab-pane>
        </el-tabs>

        <el-tabs type="border-card"  v-model="activeName"  @tab-click="handleClick" v-if="status == 6">
            <el-tab-pane label="原商品"  name="first">
                <regoodstable></regoodstable>
            </el-tab-pane>

            <el-tab-pane label="换货商品"  name="second">
                <regoodstable></regoodstable>
            </el-tab-pane>
        </el-tabs>

    <!-- 商品清单table -->
    <goodslist></goodslist>

    <div class="app_text">
        <span>上传附件：</span>
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>
    <!-- 审批意见组件 -->
    <auditopinion v-if="isAudit" :orderId="orderId"></auditopinion>

    <div class="btn_btn">
        <el-button type="primary" size="medium" class="reset_btn m-left20" >申 请</el-button>
        <el-button type="info" size="medium" class="reset_btn m-left20" >取 消</el-button>
    </div>

  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import goodslist from "./goodslist";
import regoodstable from "./regoodstable";
import auditopinion from "../../components/auditopinion";

export default {
    components: {
      breadcrumb,
      pagination,
      goodslist,
      regoodstable,
      auditopinion,
  },
  // name: 'brandmanagement',
  data() {
    return {
        isAudit: false,
        // 分页
        currentPage: 1,//当前页数
        pageSize: 20,//总页数
        total: 100,//总条数
		
        regoods: {
            money: '', // 金额 -- 退货退款金额 or 差异金额
            type: "", // 付款方式 
            remarks: "", // 退货退款原因
            accountin: "", // 账户
            bankin: "", // 开户行
            cardnumin: "", // 卡号
        },
        typeList: [{ // 退款方式2
            label: '内部转账',value: '0',
        },{
            label: '转账',value: '1',
        }],
		rules: {
            money: [
                { required: true, message: '请输入退单金额', trigger: 'blur' },
            ],
            type: [
            	{ required: true, message: '请选择退款方式', trigger: 'change' }
            ],
            remarks: [
                { required: true, message: '请输入描述',trigger: 'blur'}, 
            ]
        },
        activeName: 'first',
        instru: { // input框前面的说明文字
            money: '',
            reason: '',
        },
    };
  },
  props: ["status"],
  created() {
      if(this.status == 5){
          this.instru.money = "退货退款金额";
          this.instru.reason = "退货退款原因";
      }else if(this.status == 6){
          this.instru.money = "差异金额";
          this.instru.reason = "换货原因";
      }
      if(this.$route.path == "/minemanagement/audit") {
          this.isAudit = true;
      }
  },
  mounted() {

  },
  methods: {

    //翻页方法
    sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
        this.currentPage = val;
    },

    
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    //tab切换
    handleClick(tab) {
        console.log(tab.name);
    },
    
  }
};
</script>
<style scoped lang='scss'>
.urgentapply{
	.demo-regoods{
        >div {
            >div {
                width: 36%;
            }
        }
    }
	.app_text{
        padding: 12px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        span{
            min-width: 100px;
            padding-left: 12px;
            text-align: right;
            white-space: nowrap;
            font-size: 14px;
        }
	}
	.btn_btn{
        width: 200px;
        margin: 10px auto;
    }
  


}



</style>

<style lang="scss">
.demo-regoods{
    >div {
        >div {
            width: 36%;
        }
    }
}
</style>


