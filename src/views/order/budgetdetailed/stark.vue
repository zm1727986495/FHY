<template>
  <div>
    <div class="head_nav" v-if="this.$route.path == '/ordermm/stark'">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <div class="queryForm">
      <el-autocomplete size="small" @select="handleSelect" :trigger-on-focus="false" placeholder="请输入货号"
                       v-model="params.itemNumber" :fetch-suggestions="querySearchAsync"
                       @keyup.enter.native="search()"></el-autocomplete>
      <el-button type="warning" class="button-fc" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
    </div>
    <el-row :gutter="10" class="m-top10 queryForm">
      <el-col :span="6" v-for="(item,idx) in getColourArr" :key="idx">
        <div @click="changeColour(item)" class="colorName" :class="{'active':item.colourId == selectColour.colourId}">{{item.colourName}}</div>
      </el-col>
    </el-row>
    <div class="table_list selectCommodity" v-loading="loading">
      <el-table :data="modules" border max-height="300">
        <el-table-column type="index" align="center" width="40" fixed="left"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" min-width="200" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="规格" min-width="180" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityPrice" label="销售价" min-width="100" sortable show-overflow-tooltip></el-table-column>
<!--        <el-table-column align="center" prop="ratedPeriod" label="额定工期" width="100" show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column align="center" prop="classifyName" label="分类" width="180" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column align="center" prop="valuationMethod" label="计价方式" width="120" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column align="center" prop="commodityDescribe" label="备注" width="200" sortable show-overflow-tooltip></el-table-column>-->
        <el-table-column align="center" prop="commodityUnit" label="单位" min-width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="companyName" label="供应商" min-width="180" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" min-width="140" sortable show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="数量" min-width="140" fixed="right">
          <template slot-scope="scope">
            <el-input-number :min="0" size="mini" v-model="scope.row.num"></el-input-number>
            <!-- @input.native="changeVal(scope)"-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="btnList m-top20">
        <el-button size="medium" type="primary" @click="confirm">确 定</el-button>
        <el-button type="default" size="medium" @click="cancel">取消</el-button>
    </div> -->
  </div>
</template>
<script>
  import breadcrumb from "@/views/components/breadcrumb";
  import {
    insertOrderBudget,
    saveStackDetail,
    getItemNumber,
    getStackDetail,
    listStackDetail
  } from "@/api/order/budgetdetailed/budgetdetailed"
  import {getUUID} from "@/api/pulicJava"
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    components: {
      breadcrumb
    },
    props: {
      // 价格策略
      priceStrategyId: {
        type: Number,
        default: null
      },
      // 当前订单上的门店id
      storeId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        loading: false,
        navList: [],
        params: {
          itemNumber: '',
          colourName: ''
        },
        colourArr: [],
        selectColour: {},
        colorObj: [],
        colorNameArr: [],
        commodityId: '',
        modules: [],
        id: null,
        show: false,
        selectColorArr: [],
        budgetId: this.$route.query.budgetId,
        addGoodsParams: {
          orderId: 24568,
          versionName: "银河版",
          totalAmount: 10,
          isActivityPackage: 1,
          isDiscountPermit: 0,
          activityId: 1,
          specialDiscountId: 1,
          totalAmount: 1,
          discountAmount: 1,
          orderBudgetRooms: [
            {
              roomId: 1,    //房间类型ID  
              roomCode: "1",   //房间编号  
              originalPrice: "1",  //原价小计  
              discountsPrice: "1",  //优惠价  
              commodity: []
            }
          ],
          commodityInfo: {}
        }
      }
    },
    mounted() {
      this.navList = this.$route.meta;
      if (this.$route.query.itemNumber) {
        this.starkMethod(1)
      }
    },
    methods: {
      ...mapMutations([
        'SET_STACKLIST'
      ]),
      cancel() {
        this.$router.go(-1)
      },
      confirmApp() {
        this.SET_STACKLIST([]);
        if (this.priceStrategyId) {
          if (this.selectColorArr.length) {
            let arr = [];
            this.selectColorArr.map((item, idx) => {
              arr.push(item.value)
            })
            let brr = [];
            let crr = [];
            // 筛选数量大于0的商品
            let modulesNew = this.modules.filter(item => {
              return item.num > 0;
            })
            if (!modulesNew.length) { // 没有选择商品
              this.$message.error('商品没有输入数量');
            } else if (modulesNew.length == 1) { // 只有一个商品
              this.$emit('success', true);
            } else { // 多个商品进行组套
              modulesNew.map((item, idx) => {
                for (let i = 0; i < item.num; i++) {
                  brr.push(item.value)
                  crr.push(item.value)
                }
              });
              this.colorObj = this.colorObj.map(res => {
                if (str = res.colourName) {
                  return res;
                }
              })
              let str = "'" + arr.join(",") + "'";
              let str2 = "'" + crr.join(",") + "'";

              getUUID({
                serialNumber: "Z"
              }).then(resion => {
                saveStackDetail({
                  commodityId: this.commodityId,
                  itemNumber: this.params.itemNumber,
                  colourNames: str,
                  commodityCode: resion.data,
                  commodityModels: brr.join("+"),
                  findCommodityModels: str2,
                  priceStrategyId: this.priceStrategyId,
                  commoditySizes: "",
                  budgetId: ''
                }).then(res => {
                  if (res.status == 500) {
                    this.$message({
                      message: '已有组套商品请在商品中选择',
                      type: 'error'
                    });
                  } else if (res.status == 200) {
                    this.$emit('success', true);
                    this.SET_STACKLIST(res.data);
                  }
                })
              })
            }

          } else {
            this.$message({
              message: '必须选择颜色',
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: '没有价格策略',
            type: 'error'
          });
        }
      },
      // 货号远程搜索
      querySearchAsync(queryString, cb) {
        getItemNumber({
          itemNumber: queryString,
          brandId: this.$route.query.brandId,
          commodityCategoryId: this.$route.query.commodityCategoryId
        }).then(res => {
          res.data.forEach(res => {
            res.value = res.itemNumber;
          })
          var restaurants = res.data;
          cb(restaurants);
        }).catch(error => {

        })
      },
      handleSelect(item) {
        //do something
      },
      changeVal(row) {
        if (this.modules[row.$index].num !== null) {
          this.modules[row.$index].num = this.modules[row.$index].num.replace(/[^\d]/g, '');
        }
      },
      search() {
        this.params.colourName = '';
        this.starkMethod(1);
      },
      reset() {
        this.params.itemNumber = '';
      },
      selectColor(val, idx) {
        this.loading = true;
        this.id = val.id;
        this.selectColorArr = [val];
        this.params.colourName = val.value;
        this.starkMethod(2);
      },
      starkMethodApp(value) {
        let params = {
          ...this.params,
          storeId: this.storeId
        }
        getStackDetail(params).then(res => {
          this.loading = false;
          this.colorObj = [];
          let colorId = [];
          let colourNames = [];
          if (res.data.colourIds) {
            colorId = res.data.colourIds.split(',');
          }
          if (res.data.colourNames) {
            colourNames = res.data.colourNames.split(',');
          }
          colorId.forEach((res, index) => {
            colourNames.forEach((item, i) => {
              if (index == i) {
                this.colorObj.push({colourName: item, colourId: res})
              }
            })
          })
          if (value == 1) {
            let arr = []
            res.data.colourNames.split(",").map((item, idx) => {
              let obj = {
                value: item,
                id: idx,
              }
              arr.push(obj)
            })
            this.colorNameArr = arr;
          } else {
            this.show = true;
            this.commodityId = res.data.commodityId;
            let arr = []
            res.data.commodityModels.split(",").map((item, idx) => {
              let obj = {
                value: item,
                num: 0,
                commodityCodes: res.data.commodityCodes.split(",")[idx],
                commodityNames: res.data.commodityNames.split(",")[idx]

              }
              arr.push(obj)
            })
            this.modules = arr;
          }
        })
      },
      // 根据货号和颜色获取商品列表
      starkMethod(value) {
        this.loading = true;
        let params = {
          ...this.params,
          priceStrategyId: this.priceStrategyId,
          storeId: this.storeId
        }
        listStackDetail(params)
          .then(res => {
            this.loading = false;
            if (value == 1) {
              res.data.forEach(item => {
                item.num = 0;
                this.colourArr.push({
                  colourId: item.colourId,
                  colourName: item.colourName
                })
              })
            } else {
              res.data.forEach(item => {
                item.num = 0;
              })
            }
            this.modules = res.data;
          })
          .catch(error => {
            this.loading = false;
            console.log('组套公用组件-starkMethod：' + error)
          })
      },
      // 选择颜色
      changeColour(colourObj) {
        this.selectColorArr = [colourObj];
        this.selectColour = colourObj;
        this.params.colourName = colourObj.colourName;
        this.starkMethod(2);
      },
      // 组套
      confirm() {
        this.SET_STACKLIST([]);
        if (this.priceStrategyId) {
          if (this.selectColorArr.length) {
            let arr = [];
            this.selectColorArr.map((item, idx) => {
              arr.push(item.colourName)
            })
            let brr = [];
            let crr = [];
            if (!this.modules.length) {
              this.$message.error('该货号和颜色下没有商品');
            } else {
              // 筛选数量大于0的商品
              let modulesNew = this.modules.filter(item => {
                return item.num > 0;
              })
              if (!modulesNew.length) { // 没有选择商品
                this.$message.error('商品没有输入数量');
              } else if (modulesNew.length == 1) { // 只有一个商品
                let sourceData = modulesNew[0];
                let datas = {
                  coefficient: sourceData.coefficient,
                  commodityCode: sourceData.commodityCode,
                  colourId: sourceData.colourId,
                  commodityId: sourceData.commodityId,
                  commodityModel: sourceData.commodityModel,
                  commodityModels: sourceData.commodityModel,
                  commodityName: sourceData.commodityName,
                  commodityPrice: sourceData.commodityPrice,
                  sellingPrice: sourceData.commodityPrice,
                  costPrice: sourceData.costPrice,
                  itemNumber: this.params.itemNumber,
                  commodityNumber: this.params.itemNumber,
                  valuationMethodValue: sourceData.valuationMethodValue,
                  commodityUnit: sourceData.commodityUnit,
                  companyName: sourceData.companyName,
                  ratedPeriod: sourceData.ratedPeriod,
                  classifyName: sourceData.classifyName
                }
                this.SET_STACKLIST(datas);
                this.$emit('success', true);
              } else { // 多个商品进行组套
                modulesNew.map((item, idx) => {
                  for (let i = 0; i < item.num; i++) {
                    brr.push(item.commodityModel);
                    crr.push(item.commodityModel);
                  }
                });
                let str = "'" + arr.join(",") + "'";
                let str2 = "'" + crr.join(",") + "'";
                getUUID({
                  serialNumber: "Z"
                }).then(resion => {
                  saveStackDetail({
                    commodityId: modulesNew[0].commodityId,
                    itemNumber: this.params.itemNumber,
                    colourNames: str,
                    commodityCode: resion.data,
                    commodityModels: brr.join("+"),
                    findCommodityModels: str2,
                    priceStrategyId: this.priceStrategyId,
                    commoditySizes: "",
                    budgetId: '',
                    storeId: this.storeId,
                    brandId: this.$route.query.brandId,
                    commodityCategoryId: this.$route.query.commodityCategoryId
                  }).then(res => {
                    if (res.status == 200) {
                      if (res.data.newCommodityId) {
                        res.data.colourId = this.selectColour.colourId;
                      } else {
                        res.data.sellingPrice = res.data.commodityPrice;
                        res.data.colourId = res.data.commodityColourId;
                      }
                      this.SET_STACKLIST(res.data);
                      this.$emit('success', true);
                    } else {
                      this.$message.error(res.message || '组套失败');
                    }
                  })
                })
              }
            }
          } else {
            this.$message({
              message: '必须选择颜色',
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: '没有价格策略',
            type: 'error'
          });
        }
      }
    },
    computed: {
      // 颜色数组去重
      getColourArr() {
        let hash = {};
        return this.colourArr.reduce(function(item, next) {
          hash[next.colourId] ? '' : hash[next.colourId] = true && item.push(next);
          return item
        }, []);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .btnList {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .colorName {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    height: 30px;
    line-height: 28px;
    padding: 0 3px;
    text-align: center;
  }

  .active {
    background: rgba(253, 239, 227, 1);
    border-color: rgba(235, 97, 0, 1);
    color: #EB6100;
  }

  ul {
    li {
      display: flex;
      justify-content: space-evenly;
      margin-top: 20px;

      span {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
