<template>
  <div>
    <el-dialog :title="transferUnit?'转单位':'拆套'" :visible.sync="visible" width="70%" custom-class="customDialogTitle" append-to-body :close-on-click-modal="false" top="5vh" @before-close="handleClose">
      <div class="table_list m-bottom unsortable">
        <el-table border :row-class-name="tableRowClassName" :data="selection">
          <el-table-column align="center" type="index" fixed="left" width="50"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150"></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="classifyName" label="分类" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="型号" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="seriesName" label="系列" width="150"></el-table-column>
          <el-table-column align="center" prop="materialName" label="材质" width="150"></el-table-column>
          <el-table-column align="center" prop="colourName" label="颜色" width="150"></el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="单位" width="150"></el-table-column>
          <el-table-column align="center" prop="commodityWide" label="宽" width="100"></el-table-column>
          <el-table-column align="center" prop="commodityHigh" label="高" width="100"></el-table-column>
          <el-table-column align="center" prop="commodityLong" label="深" width="100"></el-table-column>
          <el-table-column align="center" prop="commodityThick" label="厚" width="100"></el-table-column>
          <el-table-column align="center" prop="acceptanceNumber" label="数量" width="120"></el-table-column>
        </el-table>
      </div>
      <div class="btn-list m-bottom15">
        <el-button size="small" class="button-96" @click="addProduct" :disabled="isHasInfo">选择商品</el-button>
      </div>
      <div class="table_list" :class="{ 'unsortable' : isHasInfo }">
        <el-table border :row-class-name="tableRowClassName" :data="tableDataSeletecd" max-height="300">
          <el-table-column align="center" type="index" fixed="left" width="50"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150"></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="classifyName" label="分类" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="型号" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="seriesName" label="系列" width="150" v-if="isHasInfo"></el-table-column>
          <el-table-column align="center" prop="materialName" label="材质" width="150" v-if="isHasInfo"></el-table-column>
          <el-table-column align="center" prop="colourName" label="颜色" width="150" v-if="isHasInfo"></el-table-column>
          <el-table-column align="center" prop="seriesName" label="系列" sortable width="120" v-if="!isHasInfo">
            <template slot-scope="scope">
              <el-select v-model="scope.row.seriesId" size="small" @change="getsku(scope.row)">
                <el-option v-for="item in scope.row.seriesList" :key="item.seriesId" :value="item.seriesId" :label="item.seriesName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="materialName" label="材质" sortable width="120" v-if="!isHasInfo">
            <template slot-scope="scope">
              <el-select v-model="scope.row.materialId" size="small" @change="getsku(scope.row)">
                <el-option v-for="item in scope.row.materialList" :key="item.materialId" :value="item.materialId" :label="item.materialName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="colourName" label="颜色" sortable width="150" v-if="!isHasInfo">
            <template slot-scope="scope">
              <el-select v-model="scope.row.colourId" size="small" @change="getsku(scope.row)">
                <el-option v-for="item in scope.row.colourList" :key="item.colourId" :value="item.colourId" :label="item.colourName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="单位" width="150"></el-table-column>
          <el-table-column align="center" prop="commodityWide" label="宽" width="100"></el-table-column>
          <el-table-column align="center" prop="commodityHigh" label="高" width="100"></el-table-column>
          <el-table-column align="center" prop="commodityLong" label="深" width="100"></el-table-column>
          <el-table-column align="center" prop="commodityThick" label="厚" width="100"></el-table-column>
          <el-table-column align="center" label="拆套数量" width="150" fixed="right">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" size="small" placeholder="数量"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transferUnitSubmit">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="商品列表" :visible.sync="productDialog" width="90%" class="selectCommodity customDialogTitle" append-to-body :close-on-click-modal="false" top="2vh">
      <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList" v-if="productDialog"></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProductConfirm">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selectCommodity from '@/views/components/selectCommodity';
  import { listCommoditySeries, listCommodityMaterial, listCommodityColour } from '@/api/administrationCenter/stockmanagement/index';
  import { getGoodsSKUId } from '@/api/pulicJava'
  import { insertCommoditySku } from "api/entrepotSet/stockManagement/stockPending/stockPending";
  import { getcombinationDetachable } from "@/api/marketing/shopStock/shopStock";
  export default {
    components: {
      selectCommodity
    },
    props: {
      visible: { // 弹窗
        type: Boolean,
        default: () => false
      },
      selection: { // 要拆套的商品
        type: Array,
        default: () => []
      },
      transferUnit: { // 名称是否叫转单位
        type: Boolean,
        default: () => false
      }
    },
    data() {
      return {
        productDialog: false,
        selectList: { // 选择商品参数
          selectedCommodities: [], // 选中的商品 可不传
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true, // 是否为弹出层（不传默认为页面）
          brandList: [],
          categoryList: []
        },
        selectedProducts: [], // 勾选商品
        tableDataSeletecd: [], // 表格里的商品
        dismantleInfo: []
      }
    },
    created() {
      this.getcombinationDetachable();
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      selectionChange(val) {
        this.selectedProducts = val;
      },
      // 获取拆套信息
      getcombinationDetachable() {
        let params = {
          skuGoodsId: this.selection[0].skuGoodsId
        };
        getcombinationDetachable(params)
          .then(response => {
            this.dismantleInfo = response.data;
            response.data.forEach(item => {
              this.tableDataSeletecd.push(item);
            })
          })
          .catch(error => {
            console.log('views/marketing/shopstock/index.vue-dismantle:' + error);
          })
      },
      handleClose() {
        this.$emit('close');
      },
      getsku(row) {
        let paramsGetSku = {
          commoditySeriesId: row.seriesId,
          commodityColourId: row.colourId,
          commodityMaterialId: row.materialId,
          commodityId: row.commodityId,
          commodityWide: row.commodityWide,
          commodityHigh: row.commodityHigh,
          commodityLong: row.commodityLong,
          commodityThick: row.commodityThick,
          commodityNumber: row.commodityNumber
        };
        getGoodsSKUId(paramsGetSku)
          .then(resGet => {
            if (resGet.data) {
              row.skuGoodsId = resGet.data.commoditySKUId;
            } else {
              insertCommoditySku(paramsGetSku)
                .then(resAdd => {
                  row.skuGoodsId = resAdd.data;
                })
                .catch(error => {
                  console.log('通用接口新增skuid-transfer.vue')
                })
            }
          })
          .catch(error => {
            console.log('根据颜色、系列、材质、商品id生成skuid-views/components/transferUnit.vue-getGoodsSKUId' + error);
          });
      },
      // 点击添加商品
      addProduct() {
        this.selectList.selectedCommodities = this.getSelectedCommodityIds;
        this.productDialog = true;
      },
      // 确定添加商品
      addProductConfirm() {
        this.btnLoading = true;
        if (this.selectedProducts.length) {
          this.selectedProducts.forEach(item => {
            item.brandName = item.brand_name;
            item.categoryName = item.category_name;
            const params = {
              commodityId: item.commodityId
            };
            const p1 = new Promise(resolve => {
              listCommoditySeries(params)
                .then(response => {
                  resolve(response)
                })
                .catch(error => {
                  console.log('根据商品获取系列：' + error);
                });
            });
            const p2 = new Promise(resolve => {
              listCommodityMaterial(params)
                .then(response => {
                  resolve(response)
                })
                .catch(error => {
                  console.log('根据商品获取材质：' + error);
                });
            });
            const p3 = new Promise(resolve => {
              listCommodityColour(params)
                .then(response => {
                  resolve(response)
                })
                .catch(error => {
                  console.log('根据商品获取颜色：' + error);
                });
            });
            Promise.all([p1, p2, p3]).then(res => {
              item.seriesList = res[0].data;
              item.materialList = res[1].data;
              item.colourList = res[2].data;
              item.seriesId = res[0].data.length ? res[0].data[0].seriesId : '';
              item.materialId = res[1].data.length ? res[1].data[0].materialId : '';
              item.colourId = res[2].data.length ? res[2].data[0].colourId : '';
              let paramsGetSku = {
                commoditySeriesId: item.seriesId,
                commodityColourId: item.colourId,
                commodityMaterialId: item.materialId,
                commodityId: item.commodityId,
                commodityWide: item.commodityWide,
                commodityHigh: item.commodityHigh,
                commodityLong: item.commodityLong,
                commodityThick: item.commodityThick,
                commodityNumber: item.commodityNumber
              };
              getGoodsSKUId(paramsGetSku)
                .then(resGet => {
                  if (resGet.data && resGet.data.commoditySKUId) {
                    this.btnLoading = false;
                    item.skuGoodsId = resGet.data.commoditySKUId;
                    this.tableDataSeletecd.push(item);
                  } else {
                    this.btnLoading = true;
                    insertCommoditySku(paramsGetSku)
                      .then(resAdd => {
                        this.btnLoading = false;
                        item.skuGoodsId = resAdd.data;
                        this.tableDataSeletecd.push(item);
                      })
                      .catch(error => {
                        this.btnLoading = false;
                        console.log('通用接口新增skuid-transfer.vue')
                      })
                  }
                })
                .catch(error => {
                  this.btnLoading = false;
                  console.log('根据颜色、系列、材质、商品id生成skuid-views/components/transferUnit.vue-getGoodsSKUId' + error);
                });
            });
          });
          this.productDialog = false;
        } else {
          this.$message.warning('请选择要添加的商品');
        }
      },
      // 点击提交传值
      transferUnitSubmit() {
        let errorData = [];
        this.tableDataSeletecd.forEach(item => {
          if (!item.amount || Number(item.amount) <= 0) {
            errorData.push(item);
          }
        });
        if (errorData.length) {
          this.$message.error('请输入拆套数量');
        } else {
          this.$emit('close', this.getAllCommodities);
        }
      }
    },
    computed: {
      getSelectedCommodityIds() {
        const arr = [];
        if (this.tableDataSeletecd.length) {
          this.tableDataSeletecd.forEach(item => {
            arr.push(item.commodityId);
          })
        }
        return arr;
      },
      getAllCommodities() {
        let selection = this.selection[0];
        let params = {
          detachableSkuGoodsId: selection.skuGoodsId,
          storeAcceptanceId: selection.storeAcceptanceId,
          storeId: selection.storeId,
          inventoryGoodsId: selection.inventoryGoodsId,
          combinationAmount: selection.acceptanceNumber,
          list: []
        };
        this.tableDataSeletecd.forEach(item => {
          params.list.push({
            detachableSkuGoodsId: params.detachableSkuGoodsId,
            combinationSkuGoodsId: item.skuGoodsId,
            amount: Number(item.amount),
            storageId: selection.storageId
          })
        });
        return params;
      },
      // 判断是否有拆套信息
      isHasInfo() {
        return this.dismantleInfo.length > 0;
      }
    }
  }
</script>

<style scoped>

</style>
