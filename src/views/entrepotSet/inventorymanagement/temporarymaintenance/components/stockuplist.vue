<template>
  <div class="stockuplist lvs" v-loading="loading">
    <div class="btn-list m-bottom15">
      <div v-for="(item,index) in btnList" :key="index">
        <el-button size="small" class="button-96" v-if="btnJurisdiction[item.jurisdiction]"
          @click="butGroupAction(item.type)">{{item.name}}</el-button>
      </div>
    </div>
    <div class="table_list">
      <el-table border :row-class-name="tableRowClassName" :max-height="maxHeight" :data="tableData" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column align="center" type="selection" width="50" fixed :selectable="selectable"></el-table-column>
        <el-table-column align="center" prop="maintainStatus" label="状态" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.maintainStatus==0">待处理</p>
            <p v-if="scope.row.maintainStatus==1">处理中</p>
            <p v-if="scope.row.maintainStatus==2">再处理</p>
            <p v-if="scope.row.maintainStatus==3">已处理</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maintainSource" label="来源" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="商品型号" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="classifyName" label="商品分类" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="materialName" label="商品材质" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="colourName" label="商品颜色" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="storageName" label="所属仓库" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="regionName" label="货区" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="siteCode" label="货位" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="handling" label="处理方式" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if='scope.row.handling==1'>新增</p>
            <p v-if='scope.row.handling==2'>转可用</p>
            <p v-if='scope.row.handling==3'>报废</p>
            <p v-if='scope.row.handling==4'>内部销售</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
    <!-- 处理 -->
    <el-dialog title="处理" :visible.sync="handleVisible" width="80%" custom-class="customDialogTitle" append-to-body :close-on-click-modal="closeOnClickModal">
      <div>
        <span>处理方式：</span>
        <el-radio-group v-model="radio">
          <el-radio v-for="item in radioList" :label="item.code" :key="item.code">{{ item.value }}</el-radio>
        </el-radio-group>
      </div>
      <div class="table_list m-top20 lvs">
        <el-table border :row-class-name="tableRowClassName" :data="selection">
          <el-table-column align="center" prop="commodityName" label="商品名称" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="oddNumbers" label="订单号" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="采购单号" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="maintainSource" label="来源" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="classifyName" label="商品类型" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="materialName" label="商品材质" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="colourName" label="商品颜色" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="regionName" label="货区" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="siteCode" label="货位" sortable width="200"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submission">提交申请</el-button>
        <el-button @click="handleVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 处理- 转可用-->
    <el-dialog title="转可用" :visible.sync="turnToAvailableVisible" width="60%" custom-class="customDialogTitle turnToAvailableDialog" append-to-body :close-on-click-modal="closeOnClickModal">
      <div slot="title" class="clearfix">
        <span class="fl el-dialog__title">转可用</span>
        <el-button size="small" class="button-96 fr m-right40" @click="selectAreaLocation">选择货区货位</el-button>
      </div>
      <div class="dialogBody" style="height: 200px;">
        <div class="quantity" v-if="isShow">
          <div class="top">
            <div class="close">
              <span @click="closeBox">x</span>
            </div>
            <div class="input_numbers" style="padding-bottom: 10px">
              <span>数量：</span>
              <el-input-number size="small" :min="1" v-model="cargonum"></el-input-number>
            </div>
          </div>
          <div class="areaorlocation">
            <ul class="area">
              <li v-for="(item,index) in arealocation" :class="{ 'areabg': regionIndex==index }" :key="index" @click="areaFun(item,index)">{{item.regionName}}</li><!-- -->
            </ul>
            <ul class="location" v-if="isShowLocation">
              <li v-for="(item,index) in arealocation[regionIndex].siteList" :class="{ 'areabg': siteIndex ==index }" :key="index" :title="item.siteCode" @click="locationFun(item,index)">{{item.siteCode}}</li>
            </ul>
          </div>
        </div>
        <ul class="storage">
          <li>
            <span>商品名称：</span>
            <span>{{ selectedInfo.commodityName }}</span>
          </li>
          <li>
            <span>商品型号：</span>
            <span>{{ selectedInfo.commodityModel }}</span>
          </li>
          <li>
            <span>商品品牌：</span>
            <span>{{ selectedInfo.brandName }}</span>
          </li>
          <li>
            <span>商品材质：</span>
            <span>{{ selectedInfo.materialName }}</span>
          </li>
          <li>
            <span>商品颜色：</span>
            <span>{{ selectedInfo.colourName }}</span>
          </li>
          <li>
            <span>商品品类：</span>
            <span>{{ selectedInfo.categoryName }}</span>
          </li>
          <li>
            <span>商品编码：</span>
            <span>{{ selectedInfo.commodityCode }}</span>
          </li>
          <li>
            <span>原货区货位：</span>
            <span>{{ selectedInfo.regionName }}- {{ selectedInfo.siteCode }}</span>
          </li>
          <li>
            <span>现货区货位：</span>
            <span>{{ regionName }} - {{ siteName }}</span>
          </li>
        </ul>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applySubmit">提交申请</el-button>
        <el-button @click="turnToAvailableVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--转单位-->
    <dismantle :visible="dismantleVisible" :selection="selection" @close="transferUnitSubmit" v-if="dismantleVisible" :transferUnit="true"></dismantle>
  </div>
</template>
<script>
import pagination from '@/views/components/pagination';
import dismantle from '@/views/components/dismantle';
import { mapGetters } from "vuex";
import { maintenanceGoodsByPage, addInternalSalesApply, turnTheAvailable, getcombinationDetachable } from 'api/entrepotSet/inventorymanagement/temporarymaintenance/index';
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import module from "../../../../../../config/index.js";
export default {
  components: {
    pagination,
    dismantle
  },
  props: ['params', 'isReset'],
  data() {
    return {
      closeOnClickModal: false,
      currentPage: 1, // 当前页数
      pageSize: 10, // 总页数
      total: 0, // 总条数
      btnList: [
        {name: '导出',type: 0, jurisdiction: "temporarymain_export"},
        {name: '处理',type: 1, jurisdiction: "temporarymain_manage"},
        {name: '转单位',type: 2, jurisdiction: "temporarymain_transferunit"}
      ],
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      handleVisible: false, // 处理
      turnToAvailableVisible: false, // 处理-转可用
      isShow: false,
      transferVisible: false, // 转单位,
      internalVisible: false,
      dismantleVisible: false, // 转单位弹窗（拆套）
      loading: false,
      productDialog: false,
      tableData: [],
      tableDataSeletecd: [],
      selection: [],
      selectedInfo: {},
      active: 0,
      radioList: [
        { code: 1, value: '转可用' },
        { code: 2, value: '报废' },
        { code: 3, value: '内部销售' }
      ],
      radio: '',
      selectList: { // 选择商品参数
        selectedCommodities: [], // 选中的商品 可不传
        height: '350px', // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true, // 是否为弹出层（不传默认为页面）
        brandList: [],
        categoryList: []
      },
      isDisabled: false,
      arealocation: [], // 货区
      cargonum: 0,
      regionIndex: 0, // 获取下标
      siteIndex: '',
      regionId: '', // 货区id
      regionName: '', // 货区名称
      siteId: '', // 货位id
      siteName: '' // 货位名称
    };
  },
  created() {
    this.getData();
  },
  methods: {
    sizeChange(val) {
      this.$emit('resetPage');
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    currentChange(val) {
      this.$emit('resetPage');
      this.currentPage = val;
      this.getData();
    },
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? 'el-f0' : '';
    },
    // 是否可选
    selectable(row, index) {
      return row.maintainStatus != 3;
    },
    // 获取备货列表
    getData() {
      this.loading = true;
      const data = {
        page: this.currentPage,
        limit: this.pageSize,
        ...this.params
      };
      maintenanceGoodsByPage(data)
        .then(res => {
          this.loading = false;
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          this.loading = false;
          console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/stockuplist.vue-getData:' + error)
        });
    },
    // 点击按钮组
    butGroupAction(type) {
      if (type == 0) {
        let str = module.dev.proxyTable["/api"].target + "/api/pc/maintainGoods/exportMaintainGoods";
        window.location.href = str;
      } else if (type == 1) {
        // 处理
        this.handleHandle();
      } else if (type == 2) {
        // 转单位
        this.handleTransferUnit();
      }
    },
    // 备货列表选择数据
    handleSelectionChange(val) {
      this.selection = val;
      if (this.selection.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.selection[0]);
      }
      this.selectedInfo = val[0];
    },
    // 点击处理按钮
    handleHandle() {
      if (this.selection.length) {
        this.handleVisible = true;
        this.getArea();
      } else {
        this.$message.error('请先选择');
      }
    },
    // 转单位
    handleTransferUnit() {
      if (this.selection.length) {
        if (this.selection.length > 1) {
          this.$message.error('只能选择一条数据');
        } else {
          this.dismantleVisible = true;
        }
      } else {
        this.$message.error('请先选择数据');
      }
    },
    // 转单位提交
    transferUnitSubmit(val) {
      if (val) {
        
      } else {
        this.dismantleVisible = false;
      }
    },
    // 处理-提交申请
    submission() {
      // 1 转可用 2 报废 3 内部销售
      if (this.radio == 1) {
        this.turnToAvailableVisible = true;
      } else if (this.radio == 2){
        this.$router.push({
          path: '/scrapmanagement/addscrap'
        })
      } else if (this.radio == 3) {
        let params = {
          maintainGoodsId: this.selection[0].maintainGoodsId,
          status: 1
        }
        addInternalSalesApply(params)
          .then(response => {
            if (response.status == 200) {
              this.handleVisible = false;
              this.$message.success('申请成功');
              this.getData();
            } else {
              this.$message.error(response.message || '申请失败');
            }
          })
          .catch(error => {
            console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/stockuplist.vue-submission:' + error)
          })
      } else {
        this.$message.error('请选择处理方式');
      }
    },
    // 点击选择货区货位按钮
    selectAreaLocation() {
      if (this.indexs === 0) {
        this.regionId = this.arealocation[0].regionId;
        this.regionName = this.arealocation[0].regionName;
      }
      this.isShow = true;
    },
    // 获取货区货位列表
    getArea() {
      let params = {
        storageId: this.selection[0].storageId,
        theStaging: 0
      }
      getTreeById(params)
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
          }
        })
        .catch(error => {
          console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/conmponents/stockuplist.vue-getArea:' + error)
        });
    },
    // 点击货区
    areaFun(item, i) {
      this.regionIndex = i;
      this.regionId = item.regionId;
      this.regionName = item.regionName;
      this.siteId = '';
      this.siteName = '';
    },
    // 点击货位
    locationFun(item, i) {
      this.siteIndex = i;
      this.siteId = item.siteId;
      this.siteName = item.siteCode;
      this.isShow = false;
    },
    // 关闭货区货位弹出层
    closeBox() {
      this.isShow = false;
    },
    // 处理-转可用提交
    applySubmit() {
      this.isShow = false;
      if (this.regionId == '' || this.siteId == '') {
        this.$message.warning('请选择货区货位');
        return;
      }
      let params = {
        maintainGoodsId: this.selection[0].maintainGoodsId,
        inventoryGoodsId: this.selection[0].inventoryGoodsId,
        maintainStatus: this.selection[0].maintainStatus,
        handling: 2,
        skuGoodsId: this.selection[0].skuGoodsId,
        storageId: this.selection[0].storageId,
        regionId: this.regionId,
        siteId: this.siteId,
        internalSalesApplyId: this.selection[0].internalSalesApplyId,
        maintain_source_id: this.selection[0].purchaseNumber
      }
      turnTheAvailable(params)
        .then(response => {
          if (response.status == 200) {
            this.$message.success('操作成功');
            this.turnToAvailableVisible = false;
            this.handleVisible = false;
            this.getData();
          } else {
            this.$message.error(response.message || '操作失败');
          }
        })
        .catch(error => {
          console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/stockuplist.vue-applySubmit:' + error)
        })
    }
  },
  computed: {
    ...mapGetters(["maxHeight"]),
    getSelectedCommodityIds() {
      const arr = [];
      if (this.tableDataSeletecd.length) {
        this.tableDataSeletecd.forEach(item => {
          arr.push(item.commodityId);
        })
      }
      return arr;
    },
    // 是否显示货位
    isShowLocation() {
      return this.arealocation && this.arealocation.length && this.arealocation[this.regionIndex] && this.arealocation[this.regionIndex].siteList;
    }
  },
  watch: {
    isReset(newVal, oldVal) {
      if (newVal) {
        this.currentPage = 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.stockuplist{
  .btn-list{
    display: flex;
    button{
      margin: 0 5px;
    }
  }
  .turnToAvailableDialog {
    .storage {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20px;
      li {
        width: 50%;
        margin-bottom: 15px;
      }
    }
    .step{
      padding: 0 20px;
    }
  }
}
</style>
