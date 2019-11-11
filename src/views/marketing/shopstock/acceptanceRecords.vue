<template>
  <div class="shopstock">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-collapse v-model="activeNames" class="customCollapse">
      <el-collapse-item title="待验收列表" name="1">
        <div class="m-bottom20">
          <el-button class="button-96" :size="btnSize" @click="handleTransferUnit">转单位</el-button>
          <el-button class="button-96" :size="btnSize" @click="handleCheck">验收</el-button>
        </div>
        <acceptanceTable :type="1" :datas="tableData1" @selectionChange="selectionChange1"></acceptanceTable>
      </el-collapse-item>
      <el-collapse-item title="验收列表" name="2">
        <div class="m-bottom20">
          <el-button class="button-96" :size="btnSize" @click="handleCancelCheck">取消验收</el-button>
        </div>
        <acceptanceTable :type="2" :datas="tableData2" @selectionChange="selectionChange2"></acceptanceTable>
      </el-collapse-item>
    </el-collapse>
    <div class="btnList m-top10 m-bottom10 center">
      <el-button type="primary" @click="handleCheckSubmit" :loading="loadingBtn">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
    <transferUnit :visible="transferVisible" :selection="selection1" @close="transferSubmit" v-if="transferVisible"></transferUnit>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  import pagination from "@/views/components/pagination";
  import breadcrumb from "@/views/components/breadcrumb";
  import acceptanceTable from '@/views/marketing/shopstock/components/acceptanceTable';
  import transferUnit from '@/views/components/transferUnit';
  import { getStorageByStoreId } from '@/api/pulicJava';
  import { listStoreAcceptanceGoods, storeAcceptanceGoods, turnTheUnit } from "@/api/marketing/shopStock/shopStock";
  export default {
    components: {
      pagination,
      breadcrumb,
      acceptanceTable,
      transferUnit
    },
    data() {
      return {
        navList: [],
        activeNames: ['1', '2'],
        tableData1: [],
        tableData2: [],
        selection1: [], // 选择的商品-待验收列表
        selection2: [], // 选择的商品-验收列表
        transferVisible: false, // 转单位弹出层
        storeAcceptanceId: this.$route.query.storeAcceptanceId,
        loadingBtn: false,
        storeInfo: JSON.parse(this.$loca.getItem('activeStoreId')),
        storageId: ''
      };
    },
    created() {
      this.getData();
      this.getStorageByStoreId();
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
      // 返回
      goBack() {
        this.$router.go(-1);
      },
      selectionChange1(val) {
        this.selection1 = val;
      },
      selectionChange2(val) {
        this.selection2 = val;
      },
      // 取消
      handleCancel() {
        this.getData();
        this.tableData2 = [];
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
            console.log('views/marketing/shopstock/components/acceptanceTable.vue-getStorageByStoreId:' + error);
          })
      },
      // 获取列表
      getData() {
        let params = {
          storeAcceptanceId: this.storeAcceptanceId
        };
        listStoreAcceptanceGoods(params)
          .then(response => {
            this.tableData1 = response.data.rows;
          })
          .catch(error => {
            console.log('views/marketing/shopstock/acceptanceRecords.vue-getData:' + error);
          })
      },
      // 点击转单位
      handleTransferUnit() {
        if (this.selection1.length) {
          if (this.selection1.length > 1) {
            this.$message.error('只能选择一条数据');
          } else {
            this.$set(this.selection1[0], 'acceptanceNumberReal', '');
            this.transferVisible = true;
            // if (this.tableData2.length) {
            //   this.$confirm('进行转单位操作后，验收列表数据将会重置，是否继续，?', '提示', {
            //     type: 'warning'
            //   }).then(() => {
            //     this.transferVisible = true;
            //   }).catch(() => {});
            // } else {
            //   this.transferVisible = true;
            // }
          }
        } else {
          this.$message.error('请选择商品');
        }
      },
      // 点击验收
      handleCheck() {
        if (this.selection1.length) {
          this.selection1.forEach(item => {
            this.tableData2.push(item);
          });
          this.tableData1 = this.tableData1.filter(item => {
            return this.selection1.indexOf(item) == -1;
          });
        } else {
          this.$message.error('请选择商品');
        }
      },
      // 提交
      handleCheckSubmit() {
        if (this.tableData2.length) {
          this.$confirm('确定验收?', '提示', {
            type: 'warning'
          }).then(() => {
            let acceptanceNumberTotal = 0;
            this.getGoodsList.goodsList.forEach(item => {
              acceptanceNumberTotal += Number(item.acceptanceNumber);
            });
            let queryParams = this.$route.query;
            let params = {
              storeAcceptanceId: Number(queryParams.storeAcceptanceId),
              storeId: this.storeInfo.storeId,
              storageId: this.storageId,
              sourceId: Number(queryParams.sourceId),
              acceptanceType: Number(queryParams.acceptanceType),
              receivableNumber: Number(queryParams.receivableNumber),
              acceptanceNumber: acceptanceNumberTotal,
              oddNumbers: Number(queryParams.oddNumbers),
              goodsList: this.getGoodsList.goodsList,
              inventoryGoodsList: this.getGoodsList.inventoryGoodsList
            };
            this.loadingBtn = true;
            storeAcceptanceGoods(params)
              .then(response => {
                this.loadingBtn = false;
                if (response.status == 200) {
                  this.$message.success('验收成功');
                  this.goBack();
                } else {
                  this.$message.error('验收失败');
                }
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('views/marketing/shopstock/components/acceptanceTable.vue-handleCheck:' + error);
              })
          }).catch(() => {});
        } else {
          this.$message.error('请选择验收商品');
        }
      },
      // 点击取消验收
      handleCancelCheck() {
        if (this.selection2.length) {
          this.selection2.forEach(item => {
            this.tableData1.push(item);
          });
          this.tableData2 = this.tableData2.filter(item => {
            return this.selection2.indexOf(item) == -1;
          });
        } else {
          this.$message.error('请选择商品');
        }
      },
      // 确定转单位
      transferSubmit(val) {
        if (val) {
          let goodsList = [];
          val.targetData.forEach(item => {
            goodsList.push({
              storeAcceptanceGoddsId: val.sourceData[0].storeAcceptanceGoddsId,
              storeAcceptanceId: val.sourceData[0].storeAcceptanceId,
              skuGoodsId: item.skuGoodsId,
              receivableNumber: Number(item.acceptanceNumberReal),
              status: 1,
              type: 1
            })
          });
          let params = {
            transferRecordList: [
              {
                outStoreAcceptanceGoddsId: val.sourceData[0].storeAcceptanceGoddsId,
                skuGoodsId: val.sourceData[0].skuGoodsId,
                intoNumber: val.sourceData[0].acceptanceNumberReal
              }
            ],
            goodsList
          };
          turnTheUnit(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('操作成功');
                this.transferVisible = false;
                this.goBack();
                // this.getData();
                // this.tableData2 = [];
              } else {
                this.$message.error('操作失败');
              }
            })
            .catch(error => {
              console.log('views/marketing/shopstock/components/acceptanceTable.vue-transferSubmit:' + error);
            })
        } else {
          this.transferVisible = false;
        }
      }
    },
    computed: {
      ...mapGetters([
        'activeStoreId',
        'btnSize'
      ]),
      // 验收提交获取所有验收商品信息
      getGoodsList() {
        let goodsList = [];
        let inventoryGoodsList = [];
        this.tableData2.forEach(item => {
          goodsList.push({
            storeAcceptanceId: Number(this.$route.query.storeAcceptanceId),
            skuGoodsId: item.skuGoodsId,
            receivableNumber: Number(item.receivableNumber),
            acceptanceNumber: item.acceptanceNumberReal ? Number(item.acceptanceNumberReal) : 0,
            status: 1,
            type: 0,
            storeAcceptanceGoddsId: item.storeAcceptanceGoddsId
          });
          inventoryGoodsList.push({
            storageId: this.storageId,
            skuGoodsId: item.skuGoodsId,
            inventoryNumber: item.acceptanceNumber ? Number(item.acceptanceNumber) : 0,
            storeId: this.storeInfo.storeId
          });
        });
        return {
          goodsList,
          inventoryGoodsList
        }
      }
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

