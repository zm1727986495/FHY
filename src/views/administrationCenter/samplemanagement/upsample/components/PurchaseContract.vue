<template>
  <div>
    <div class="moduleHeader clearfix">
      <!-- <div class="title fl">采购合同</div> -->
      <div class="textitle">
          <div class="titlecals">采购合同</div>
      </div>
      <div class="btnList fr">
        <el-button class="button-96" :size="btnSize" @click="addTab">新增采购单</el-button>
        <el-button class="button-96" :size="btnSize" @click="exportFun">导出</el-button>
        <!-- <el-button class="button-96" :size="btnSize" @click="showListingDialog">清单处罚</el-button> -->
      </div>
    </div>
    <div class="tabsBox">
      <el-tabs type="border-card" v-model="tabActive">
        <el-tab-pane :label="'采购单'+ (index + 1)" :name="'采购单'+ (index + 1)" v-for="(item,index) in tabs" :key="index">
          <PurchaseTable></PurchaseTable>
          <!-- <PurchaseTable :datas="datas['data'+(index + 1)]" @selectionChange="selectionChangePurchaseList"></PurchaseTable> -->
        </el-tab-pane>
      </el-tabs>
      <div class="btnList">
        <el-button v-for="(item,index) in actionBtnList" :type="item.style" :size="btnSize" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index">{{item.name}}</el-button>
      </div>
    </div>
    <el-dialog title="清单处罚" :visible.sync="listingPunishmentDialog" width="1024px" class="customDialogTitle">
      <IllegalPunishment :shortkey="true" :punishtype="4"></IllegalPunishment>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="listingPunishmentDialog = false">确 定</el-button>
        <el-button @click="listingPunishmentDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="商品列表" :visible.sync="productDialog" width="90%" class="selectCommodity customDialogTitle" top="2vh">
      <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList"></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectProduct">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 移动操作按钮 -->
    <el-dialog title="选择采购单" :visible.sync="purchaseListDialog" class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :size="size">
        <el-form-item label="采购单名称" prop="purchaseMenu">
          <el-select v-model="ruleForm.purchaseMenu">
            <el-option v-for="item,index in tabs" :label="'采购单'+(index + 1)" :value="index + 1" :key="index" :disabled="tabActive == '采购单'+(index + 1)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectPurchaseList('ruleForm')">确 定</el-button>
        <el-button @click="purchaseListDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="加入库取" :visible.sync="moveSelectRow.visible" custom-class="customDialogTitle" append-to-body>
      <div class="table_list unsortable warehouseDialog">
        <h4 class="moduleHeaderBorder">
          <span class="classifyNumber m-right20">MT1277319</span>
          <span class="classifyName">吊柜</span>
        </h4>
        <el-table border :data="dialogData" class="tableMaxHeightDialog">
          <el-table-column align="center" prop="storageName" label="仓库"> </el-table-column>
          <el-table-column align="center" label="类型">
           <template slot-scope="scope">
             <p class="storageType">可用</p>
             <p class="storageType">暂扣</p>
             <p class="storageType">在途可用</p>
             <p class="storageType">占用</p>
           </template>
          </el-table-column>
          <el-table-column align="center" label="数量">
            <template slot-scope="scope">
              <p class="storageType">{{ scope.row.canUse }}</p>
              <p class="storageType">
                <el-button type="text" size="medium" @click="showWithholdDialog">{{ scope.row.withholdNum }}</el-button>
              </p>
              <p class="storageType">
                <el-button type="text" size="medium" @click="showInRoadDialog">{{ scope.row.inRoad }}</el-button>
              </p>
              <p class="storageType">{{ scope.row.inUse }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="购买数量" width="200">
            <template slot-scope="scope">
              <p class="storageType">
                <el-input-number v-model="scope.row.buyCanUse" size="mini" :controls="false" placeholder="购买数量"></el-input-number>
              </p>
              <p class="storageType">10</p>
              <p class="storageType">5</p>
              <p class="storageType"></p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moveToWareHouseListConfirm">确 定</el-button>
        <el-button @click="cancelMove">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="withholdVisible" append-to-body>
      <div class="table_list">
        <el-table border :data="withholdData">
          <el-table-column property="date" label="销售员" align="center"></el-table-column>
          <el-table-column property="name" label="折扣数量" align="center"></el-table-column>
          <el-table-column property="address" label="购买数量" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.buyCanUse" size="mini" :controls="false" placeholder="购买数量"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="withholdVisible = false">确 定</el-button>
        <el-button @click="withholdVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="inRoadVisible" append-to-body>
      <div class="table_list">
        <el-table border :data="inRoadData">
          <el-table-column property="date" label="采购单号" align="center"></el-table-column>
          <el-table-column property="name" label="预计到货时间" align="center"></el-table-column>
          <el-table-column property="address" label="在途可用数量" align="center"></el-table-column>
          <el-table-column property="address" label="购买数量" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.buyCanUse" size="mini" :controls="false" placeholder="购买数量"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inRoadVisible = false">确 定</el-button>
        <el-button @click="inRoadVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import PurchaseTable from '@/views/administrationCenter/contractmanagement/components/PurchaseTable';
  // import PurchaseTable from './PurchaseTable';
  import IllegalPunishment from '@/views/administrationCenter/contractmanagement/components/IllegalPunishment';
  import selectCommodity from '@/views/components/selectCommodity';
  import { getAllData } from '@/utils/pubilcFn'
  const dialogData = [
    {
      id: 1,
      storageName: '北京仓库',
      canUse: 1,
      withholdNum: 2,
      inRoad: 3,
      inUse: 4
    },
    {
      id: 2,
      storageName: '上海仓库',
      canUse: 1,
      withholdNum: 3,
      inRoad: 4,
      inUse: 5
    }
  ]
  export default {
    name: 'PurchaseContract',
    components: {
      PurchaseTable,
      IllegalPunishment,
      selectCommodity
    },
    data() {
      return {
        size: 'medium',
        btnSize: 'small',
        spot,
        actionBtnList: [
        { name: '添加商品', style: 'default', url: '', type: 1 },
        { name: '保存', style: 'default', url: '', type: 2 },
        // { name: '移动', style: 'default', url: '', type: 3 },
        { name: '删除', style: 'default', url: '', type: 4 },
        { name: '执行完成', style: 'default', url: '', type: 5 }
        ],
        tabs: ['', ''],
        tabActive: '采购单1',
        checkAll: false,
        selection: {},
        listingPunishmentDialog: false,
        selectList: {
          selectedCommodities: [], // 选中的商品 可不传
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true // 是否为弹出层（不传默认为页面）
        },
        purchaseListDialog: false,
        productDialog: false,
        selectedProducts: [],
        allProducts: [],
        dialogData,
        withholdData: [],
        inRoadData: [],
        withholdVisible: false,
        inRoadVisible: false,
        ruleForm: {
          purchaseMenu: ''
        },
        rules: {
          purchaseMenu: [
            { required: true, message: '请选择采购单', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      // 新增采购单
      addTab() {
        this.$confirm('确定要新增采购单?', '提示', {
          type: 'warning'
        }).then(() => {
          this.tabs.push('');
          let index = this.tabs.length;
          this.$set(this.datas, 'data' + index, []);
        }).catch(() => { });
      },
      // 导出
      exportFun() {

      },
      // 按钮组函数
      butGroupAction(url, type) {
        window.newArr = [];
        this.selectedProducts = getAllData(this.$store.getters.tablesData, true);
        if (type == 1) { // 添加商品
          this.addProduct();
        } else if (type == 2) { // 保存
          window.newArr = [];
          this.allProducts = getAllData(this.$store.getters.tablesData);
          this.savePurchaseList();
        } else if (type == 3) { // 移动
          this.handleMove();
        } else if (type == 4) { // 删除
          this.deleteProduct();
        } else { // 执行完成
          this.completed();
        }
      },
      // 清单处罚
      showListingDialog() {
        this.listingPunishmentDialog = true;
      },
      addProduct() {
        this.productDialog = true;
      },
      selectProduct() {

      },
      // 点击删除
      deleteProduct() {
        if (!this.selectedProducts.length) {
          this.$message.warning('请选择要删除的商品');
          return;
        }
      },
      // 选择商品 复选框
      selectionChange(val) {
        this.selectedProducts = val;
      },
      // 移动商品
      handleMove() {
        if (!this.selectedProducts.length) {
          this.$message.warning('请选择要移动的商品');
          return;
        }
        this.resetForm('ruleForm');
        this.ruleForm.purchaseMenu = '';
        this.purchaseListDialog = true;
      },
      // 移动商品确定
      selectPurchaseList(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.purchaseListDialog = false;
          } else {
            return false;
          }
        });
      },
      // 确定加入库取
      moveToWareHouseListConfirm() {
        console.log(this.$store.getters.moveSelectRow)
      },
      // 取消加入库取
      cancelMove() {
        this.$store.dispatch('MOVETO_WAREHOUSE', {});
      },
      // 暂扣弹出层
      showWithholdDialog() {
        this.withholdVisible = true;
      },
      // 在途弹出层
      showInRoadDialog() {
        this.inRoadVisible = true;
      },
      // 保存采购单
      savePurchaseList() {
        console.log(this.allProducts)
      },
      // 执行完成
      completed() {
        console.log(444)
      }
    },
    computed: {
      ...mapGetters([
        'moveSelectRow',
        'tablesData'
      ])
    }
  }
</script>
