<template>
  <div>
    <div class="moduleHeader moduleHeaderBorder">
      <div class="clearfix">
        <div class="fl m-right20">
          <label class="label fl">采购合同号</label>
          <div class="fl">
            <el-input v-model="purchaseNumber" placeholder="请输入采购合同号" size="small"></el-input>
          </div>
          <span class="line fl">-</span>
          <div class="fl" style="width: 50px">
            <el-input v-model="purchaseNumber" placeholder="01" size="small"></el-input>
          </div>
        </div>
        <div class="fl m-right20">
          <label class="label">是否入库：</label>
          <el-radio-group v-model="isInStorage">
            <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
          </el-radio-group>
        </div>
        <!-- <div class="fl m-left20">
          <label class="label">是否安装：</label>
          <el-radio-group v-model="isInstall">
            <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
          </el-radio-group>
        </div> -->
        <!-- <p class="fr">采购单状态：待执行</p> -->
      </div>
      <div class="clearfix m-top10">
        <div class="fl">
          <span class="cSuccess">房间：主卧（房间备注）</span>
          <span class="m-left20">供应商：广州橱柜工厂 </span>
          <span class="m-left20 cDanger">总计：4747.00</span>
        </div>
        <div class="fr t-right">
<!--          <el-button class="button-96" size="small">保存</el-button>-->
        </div>
      </div>
    </div>
    <div class="tableBox tableBoxMax">
      <div class="multipleTable purchaseTable">
        <PurchaseTableBody :datas="tablesData"></PurchaseTableBody>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import PurchaseTableBody from '@/views/administrationCenter/contractmanagement/components/PurchaseTableBody';
  export default {
    name: 'PurchaseTable',
    components: {
      PurchaseTableBody
    },
    data() {
      return {
        size: 'medium',
        btnSize: 'small',
        spot,
        checkAll: false,
        purchaseNumber: '',
        radioList: [
          { code:1, value: '是' },
          { code:0, value: '否' }
        ],
        selection: {},
        isInStorage: false,
        isInstall: false
      }
    },
    computed:{
      ...mapGetters([
        "tablesData"
      ])
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      }
    }
  }
</script>
<style scoped>
  .line{
    padding: 0 5px;
  }
</style>
