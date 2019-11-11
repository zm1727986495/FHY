<template>
  <div>
    <el-dialog title="转单位" :visible.sync="visible" width="70%" custom-class="customDialogTitle" append-to-body :close-on-click-modal="false" top="2vh" @close="handleClose">
      <div class="table_list m-bottom lvs">
        <el-table border :row-class-name="tableRowClassName" :data="selection" max-height="300">
          <el-table-column align="center" type="index" width="50" fixed="left"></el-table-column>
          <el-table-column prop="commodityCode" label="商品编码" align="center" sortable width="150"></el-table-column>
          <el-table-column prop="commodityName" label="商品名称" align="center" sortable width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="purchaseNumber" label="品牌" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="categoryName" label="品类" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="commodityModel" label="型号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="seriesName" label="系列" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="materialName" label="材质" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="colourName" label="颜色" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="commodityUnit" label="单位" align="center" width="120" sortable ></el-table-column>
          <el-table-column prop="commodityWide" label="宽" align="center" width="100" sortable ></el-table-column>
          <el-table-column prop="commodityHigh" label="高" align="center" width="100" sortable ></el-table-column>
          <el-table-column prop="commodityLong" label="深" align="center" width="100" sortable></el-table-column>
          <el-table-column prop="commodityThick" label="厚" align="center" width="100" sortable></el-table-column>
          <el-table-column prop="receivableNumber" label="数量" align="center" width="100" fixed="right"></el-table-column>
          <el-table-column prop="acceptanceNumberReal" label="验收数量" align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.acceptanceNumberReal" placeholder="验收数量" size="small" @blur="checkNumber(scope.row, scope.$index,'selection')"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn-list m-bottom15">
        <el-button size="small" class="button-96" @click="addProduct">选择商品</el-button>
      </div>
      <div class="table_list lvs">
        <el-table border :row-class-name="tableRowClassName" :data="tableDataSeletecd" height="300">
          <el-table-column align="center" type="index" width="50" fixed></el-table-column>
          <el-table-column prop="commodityCode" label="商品编码" align="center" sortable width="150"></el-table-column>
          <el-table-column prop="commodityName" label="商品名称" align="center" sortable width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brand_name" label="品牌" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="category_name" label="品类" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="commodityModel" label="型号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="seriesName" label="系列" align="center" sortable width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.seriesId" size="small" @change="getsku(scope.row)">
                <el-option v-for="item in scope.row.seriesList" :key="item.seriesId" :value="item.seriesId" :label="item.seriesName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="materialName" label="材质" align="center" sortable width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.materialId" size="small" @change="getsku(scope.row)">
                <el-option v-for="item in scope.row.materialList" :key="item.materialId" :value="item.materialId" :label="item.materialName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="colourName" label="颜色" align="center" sortable width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.colourId" size="small" @change="getsku(scope.row)">
                <el-option v-for="item in scope.row.colourList" :key="item.colourId" :value="item.colourId" :label="item.colourName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="commodityUnit" label="单位" align="center" width="120" sortable ></el-table-column>
          <el-table-column prop="commodityWide" label="宽" align="center" width="150" sortable ></el-table-column>
          <el-table-column prop="commodityHigh" label="高" align="center" width="150" sortable ></el-table-column>
          <el-table-column prop="commodityLong" label="深" align="center" width="100" sortable></el-table-column>
          <el-table-column prop="commodityThick" label="厚" align="center" width="100" sortable></el-table-column>
          <el-table-column prop="acceptanceNumberReal" label="验收数量" align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.acceptanceNumberReal" placeholder="验收数量" size="small" @blur="checkNumber(scope.row, scope.$index,'tableDataSeletecd')"></el-input>
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
        <el-button type="primary" @click="addProductConfirm" :loading="btnLoading">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selectCommodity from '@/views/components/selectCommodity';
  import { listCommoditySeries, listCommodityMaterial, listCommodityColour } from '@/api/administrationCenter/stockmanagement/index';
  import { getGoodsSKUId } from '@/api/pulicJava';
  import { insertCommoditySku } from "api/entrepotSet/stockManagement/stockPending/stockPending";
  export default {
    components: {
      selectCommodity
    },
    props: {
      visible: { // 弹窗
        type: Boolean,
        default: () => false
      },
      selection: { // 要转单位的商品
        type: Array,
        default: () => []
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
        btnLoading: false,
        selectedProducts: [], // 勾选商品
        tableDataSeletecd: [] // 表格里的商品
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      handleClose() {
        this.$emit('close');
      },
      // 点击提交传值
      transferUnitSubmit() {
        if (!this.selection[0].acceptanceNumberReal) {
          this.$message.error('请输入数量');
          return;
        }
        if (this.tableDataSeletecd.length) {
          let errorData = [];
          for (let i = 0; i < this.tableDataSeletecd.length; i++) {
            if (!this.tableDataSeletecd[i].acceptanceNumberReal) {
              errorData.push(this.tableDataSeletecd[i]);
              break;
            }
          }
          if (errorData.length) {
            this.$message.error('请输入数量');
          } else {
            let val = {
              sourceData: this.selection,
              targetData: this.tableDataSeletecd
            };
            this.$emit('close', val);
          }
        } else {
          this.$message.error('请选择商品');
        }
      },
      // 点击添加商品
      addProduct() {
        this.selectList.selectedCommodities = this.getSelectedCommodityIds;
        this.productDialog = true;
      },
      // 选择商品-勾选
      selectionChange(val) {
        this.selectedProducts = val;
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
      // 验证输入验收数量
      checkNumber(row, index, tableData) {
        if (row.acceptanceNumberReal || row.acceptanceNumberReal == 0) {
          if (typeof row.acceptanceNumberReal !== 'number') {
            this.$message.error('请输入数字');
            row.acceptanceNumberReal = '';
          } else {
            if (row.acceptanceNumberReal < 1) {
              this.$message.error('验收数量至少为1');
              row.acceptanceNumberReal = '1';
            }
            if (tableData == 'selection') {
              if (row.acceptanceNumberReal > row.receivableNumber) {
                this.$message.error('验收数量不能大于应收数量');
                row.acceptanceNumberReal = '';
              }
            }
          }
        }
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
            if (resGet.data && resGet.data.commoditySKUId) {
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
      }
    },
    computed: {
      // 获取所有的商品id，避免重复选择商品
      getSelectedCommodityIds() {
        const arr = [];
        if (this.tableDataSeletecd.length) {
          this.tableDataSeletecd.forEach(item => {
            arr.push(item.commodityId);
          })
        }
        return arr;
      }
    }
  }
</script>
