<template>
  <div class="shopstock">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="m-bottom20">
      <el-row :gutter="10" class="queryForm">
        <el-col :span="span">
          <el-input v-model="queryForm.name" placeholder="商品编码 商品来源单号" clearable :size="size"></el-input>
        </el-col>
        <el-col :span="span">
          <el-date-picker
            v-model="timeArr"
            @change="dataChange"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :size="size"
          ></el-date-picker>
        </el-col>
        <el-col :span="span">
          <el-select v-model="queryForm.status" placeholder="状态" clearable :size="size">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span">
          <el-button type="warning" :size="size" @click="searchFun" class="button-fc">查询</el-button>
          <el-button type="primary" :size="size" @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs type="border-card" v-model="tabActive" @tab-click="tabClick" v-loading="loading">
      <el-tab-pane label="样品管理" name="1">
        <div class="m-bottom10">
          <el-button class="button-96" size="small" @click="handleClick(1)" v-if="btn_share">共享门店</el-button>
        </div>
        <storeInventoryTable :datas="tableData" v-if="tabActive == 1" :type="1" @selectionChange="selectionChange"></storeInventoryTable>
      </el-tab-pane>
      <el-tab-pane label="礼品管理" name="2">
        <div class="m-bottom10">
          <el-button size="small" class="button-96" @click="handleClick(2)" v-if="btn_dismantle">拆套</el-button>
          <el-button size="small" class="button-96" @click="handleClick(3)" v-if="btn_send">礼品派送</el-button>
          <el-button size="small" class="button-96" @click="handleClick(4)" v-if="btn_view">查看派送记录</el-button>
        </div>
        <storeInventoryTable :datas="tableData" @openstock="openstock" v-if="tabActive == 2" :type="2" @selectionChange="selectionChange"></storeInventoryTable>
      </el-tab-pane>
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>
    </el-tabs>
    <!--共享门店-->
    <storedia :visible="storeVisible" @close_store="selectStoreConfirm" :multiple="true" :reserve="true" :selection="selectedIds" v-if="storeVisible"></storedia>
    <!--礼品派送-->
    <stocknumberdia :visible="stocknumber_vis" @close_stock="closeStock" :isbutton="isButton" v-if="stocknumber_vis" :datas="datas"></stocknumberdia>
    <!--拆套-->
    <dismantle :visible="dismantleVisible" :selection="selection" @close="dismantleSubmit" v-if="dismantleVisible"></dismantle>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  import pagination from "@/views/components/pagination";
  import breadcrumb from "@/views/components/breadcrumb";
  import stocknumberdia from "@/views/marketing/shopstock/components/stocknumberdia";
  import storedia from "@/views/customermanagement/myclient/components/storedia";
  import dismantle from '@/views/components/dismantle';
  import storeInventoryTable from '@/views/marketing/shopstock/components/storeInventoryTable';
  import { storeInventorySamplePage, muestraStore, detachable, getMuestraStore, addGiftToSend, giftToSend } from "@/api/marketing/shopStock/shopStock";
  import { getNoNumber } from "@/api/entrepotSet/inventorymanagement/storeInventory/storeInventory";
  import { getUUID, getStorageByStoreId } from "@/api/pulicJava";
import { error } from 'util';
  export default {
    components: {
      pagination,
      breadcrumb,
      stocknumberdia,
      storeInventoryTable,
      storedia,
      dismantle
    },
    data() {
      return {
        btn_share: false,
        btn_dismantle: false,
        btn_send: false,
        btn_view: false,
        loading: true,
        btnLoading: false,
        navList: [],
        options: [{value: "1", label: "1"}, {value: "1", label: "1"}],
        queryForm: {
          name: '',
          value: ''
        }, // 查询条件对象
        timeArr: [], // 时间数组
        size: 'medium',
        btnSize: 'small',
        span: 6,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        tabActive: '1',
        stocknumber_vis: false, // 是否显示库存数量弹框
        deliver_vis: false,     // 是否显示派送弹框
        elsectVal: [],
        storeVisible: false, // 共享门店弹窗
        dismantleVisible: false, // 拆套弹窗
        selection: [], // 选择的拆套商品
        selectionGift: [], // 选中的礼品
        selectedIds: [], // 选中的门店
        dismantleInfo: [], // 存在的拆套信息
        isButton: false, // 是否是点击的礼品派送按钮
        storeInfo: JSON.parse(this.$loca.getItem('activeStoreId')),
        storageId: '',
        datas: {},
        UUIDAD: '' // 编号
      };
    },
    activated(){
      this.getData();
      this.getStorageByStoreId();
      this.initBtnElements();

      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // created() {
    //   this.getData();
    //   this.getStorageByStoreId();
    //   this.initBtnElements();
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_share = element['shopstockindex:btn_share']; // 分享
        this.btn_dismantle = element['shopstockindex:btn_dismantle']; // 拆套
        this.btn_send = element['shopstockindex:btn_send']; // 礼品派送
        this.btn_view = element['shopstockindex:btn_view']; // 查看派送记录
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // tags标签切换
      tabClick() {
        this.currentPage = 1;
        this.getData();
      },
      // 表格选择数据
      selectionChange(val) {
        this.selection = val;
      },
      // 获取列表
      getData() {
        this.loading = true;
        let params = {
          page: this.currentPage,
          limit: this.pageSize,
          acceptanceType: this.tabActive == '1' ? 1 : 2
        };
        storeInventorySamplePage(params)
          .then(response => {
            this.loading = false;
            this.tableData = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/marketing/shopstock/index.vue-getData:' + error);
          })
      },
      dataChange() {
        this.form.startTime = this.timeArr ? this.timeArr[0] : "";
        this.form.endTime = this.timeArr ? this.timeArr[1] : "";
      },
      // 查询方法
      searchFun() {
        this.currentPage = 1;
        this.getData();
      },
      // 重置方法
      resetFun() {
        this.currentPage = 1;
        this.getData();
      },
      // 点击按钮
      handleClick(btnType) {
        if (btnType == 4) {
          this.viewRecords();
        } else {
          if (this.selection.length) {
            if (btnType == 1) {
              this.handleMuestraStore();
            }
            if (btnType == 2) {
              this.dismantle();
            }
            if (btnType == 3) {
              this.giftDeliver();
            }
          } else {
            this.$message.error('请先选择数据');
          }
        }
      },
      // 点击库存数量  弹出库存数量弹框
      openstock() {
        this.isButton = false;
        this.stocknumber_vis = true;
      },
      // 点击拆套
      dismantle() {
        this.dismantleVisible = true;
      },
      // 确定拆套
      dismantleSubmit(val) {
        if (val) {
          detachable(val)
            .then(response => {
              if (response.status == 200) {
                this.dismantleVisible = false;
                this.$message.success('操作成功');
                this.currentPage = 1;
                this.getData();
              } else {
                this.$message.error(response.message || '操作失败');
              }
            })
            .catch(error => {
              console.log('views/marketing/shopstock/index.vue-dismantleSubmit:' + error);
            })
        } else {
          this.dismantleVisible = false;
        }
      },
      // 点击派送
      giftDeliver() {
        let params = {
          skuGoodsId: this.selection[0].skuGoodsId,
          storeId: this.storeInfo.storeId
        };
        this.datas = params;
        this.isButton = true;
        this.stocknumber_vis = true;
        let uuidParams = {
          serialNumber: 'AD'
        }
        getUUID(uuidParams)
          .then(response => {
            this.UUIDAD = response.data;
          })
          .catch(error => {
            console.log('views/marketing/shopstock/index.vue-getUUID:' + error);
          })
      },
      // 关闭派送弹框
      closeStock(val) {
        if (val) {
          let list = [];
          if (val.arr.length) {
            val.arr.forEach(item => {
              list.push({
                inventoryGoodsId: item.inventoryGoodsId,
                applyNumber: Number(item.receiveNumber)
              })
            })
          }
          let params = {
            applyCode: this.UUIDAD,
            status: this.selection[0].status,
            storeId: this.storeInfo.storeId,
            storageId: this.storageId,
            arrivalTime: val.arrivalTime,
            serveGroupId: val.serveGroupId,
            list: list
          }
          addGiftToSend(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('派送成功');
                this.getData();
                this.stocknumber_vis = false;
              } else {
                this.message.error('派送失败');
              }
            })
            .catch(error => {
              console.log('views/marketing/shopstock/index.vue-closeStock:' + error);
            })
        } else {
          this.stocknumber_vis = false;
        }
      },
      // 点击共享门店
      handleMuestraStore() {
        let params = {
          skuGoodsId: this.selection[0].skuGoodsId,
          primitiveStoreId: this.storeInfo.storeId
        };
        getMuestraStore(params)
          .then(response => {
            if (response.data.length) {
              this.selectedIds = response.data.map(item => {
                return item.storeId;
              })
            }
          })
          .catch(error => {
            console.log('views/marketing/shopstock/index.vue-handleMuestraStore:' + error);
          });
        this.storeVisible = true;
      },
      // 共享门店确认
      selectStoreConfirm(val) {
        if (val) {
          let storeIdList = val.map(item => item.storeId);
          let params = {
            skuGoodsId: this.selection[0].skuGoodsId,
            primitiveStoreId: this.storeInfo.storeId,
            storeIdList
          };
          muestraStore(params)
            .then(response => {
              if (response.status == 200) {
                this.storeVisible = false;
                this.$message.success('操作成功');
                this.getData();
              } else {
                this.$message.error(response.message || '操作失败');
              }
            })
            .catch(error => {
              console.log('views/marketing/shopstock/index.vue-selectStoreConfirm:' + error);
            })
        }
        this.storeVisible = false;
      },
      // 查看派送记录
      viewRecords() {
        this.$router.push({
          path: '/shopstock/deliveryRecord',
          query: {
            storeId: this.storeInfo.storeId
          }
        })
      },
      // 根据门店获取仓库
      getStorageByStoreId() {
        let params = {
          storeId: this.storeInfo.storeId
        };
        getStorageByStoreId(params)
          .then(response => {
            if (response.data.length) {
              this.storageId = response.data[0].storageId;
            }
          })
          .catch(error => {
            console.log('views/marketing/shopstock/index.vue-getStorageByStoreId:' + error);
          })
      },
    },
    computed: {
      ...mapGetters(['activeStoreId'])
    },
    watch: {
      activeStoreId(val) {
        if (val) {
          this.storeInfo = val;
           this.getStorageByStoreId();
        }
      }
    }
  };
</script>

