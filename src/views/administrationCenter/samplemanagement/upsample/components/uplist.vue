<template>
  <div>
      <!-- <div class="tableBox tableBoxMax">
        <div class="multipleTable purchaseTable"> -->
            <div v-for="(item,index) in datas" :key="item.roomId" class="table_list">
                <ul class="multipleTableHeader multipleTableHeaderBg bt1" v-if="item.isShow">
                    <li class="checkAll">
                        <el-checkbox v-model="checkAll" @change="checkAllChange"></el-checkbox>
                    </li>
                    <li>序号</li>
                    <li>产品款型</li>
                    <!-- <li class="commodityNumber">商品编码</li> -->
                    <li>名称款式</li>
                    <li>型号</li>
                    <li>数量</li>
                    <li>单价</li>
                    <li>非标系数</li>
                    <li>计价方式</li>
                    <li>小计/元</li>
                    <li>材质</li>
                    <li>工艺</li>
                    <li>备注</li>
                    <li>产品分类</li>
                    <li>产品品牌</li>
                    <li>产品编号</li>
                </ul>
                <ul>
                    <li></li>
                    <li>橱柜</li>
                </ul>
                <!-- <p class="tableHeader">
                    <span>{{ item.roomName }}</span>
                </p> -->
                <ul class="multipleTableHeader" v-for="(info,idx) in item.products" :key="idx" :class="{ bt1: idx === 0 }">
                    <li>
                        <el-checkbox v-model="info.checked" @change="handleChange(info)"></el-checkbox>
                    </li>
                    <li>1</li>
                    <li class="commodityNumber">4</li>
                    <li>{{ info.name }}</li>
                    <li>6</li>
                    <li>7</li>
                    <li>8</li>
                    <li>12</li>
                    <li>17</li>
                    <li>18</li>
                    <li>19</li>
                    <li><el-input-number v-model="info.num" :controls="false" :size="size" :min="1"></el-input-number></li>
                    <li>{{ info.price }}</li>
                    <li>22</li>
                    <li>23</li>
                    <li>24</li>
                </ul>
                <ul class="multipleTableHeader mutipleTableAmount" v-if="item.products && item.products.length">
                    <li>总计</li>
                    <li></li>
                    <li></li>
                    <li class="commodityNumber"></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li>1000</li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <TableBody :datas="item.children" v-if="item.children && item.children.length"></TableBody>
            </div>
        <!-- </div>
      </div> -->
  </div>
</template>

<script>
 import spot from '@/assets/images/spot.png';
  import { mapGetters } from 'vuex';
  export default {
    name: 'TableBody',
    data() {
      return {
        spot,
        size: 'small',
        selection: {},
        isInStorage: false,
        isInstall: false,
        checkAll: false,
        arr: [],
        allData: [],

         data1 : [
            {
              goodsId: 1,
              roomName: '橱柜',
              isShow: true,
              children: [
                {
                  roomId: 11,
                  roomName: '二级分类1-1',
                  children: [],
                  products: [
                    {
                      id: 1,
                      name: '商品1-2-2',
                      checked:false,
                      price: 200
                    },
                    {
                      id: 2,
                      name: '商品1-2-3',
                      checked:false,
                      price: 100
                    }
                  ]
                }
              ]
            },
            {
              roomId: 2,
              roomName: '一级分类2',
              children: [
                {
                  roomId: 22,
                  roomName: '二级分类2-1',
                  children: [
                    {
                      roomId: 33,
                      roomName: '三级分类2-1',
                      children: [],
                      products: [
                        {
                          id:2,
                          name: '商品2-3-1',
                          checked:false,
                          price: 300
                        },
                        {
                          id:2,
                          name: '商品2-3-2',
                          checked:false,
                          price: 200
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              roomId: 3,
              roomName: '一级分类3',
              children: [],
              products: [
                {
                  id:3,
                  name: '商品3-1-1',
                  checked:false,
                  price: 100
                },
                {
                  id:4,
                  name: '商品3-1-2',
                  checked:false,
                  price: 500
                }
              ]
            }
          ],


      }
    },
    props: {
      datas: {
        type: Array,
        default: () => []
      },
      visible: {
        type: Boolean,
        default: () => false
      }
    },
    methods: {
      handleChange(val) {
        // this.allData = this.$store.getters.rowsData;
        // if (this.allData.length != 0) {
        //   for (let i = 0; i < this.allData.length; i++) {
        //     if (val.checked) {
        //       this.allData.push(val)
        //       this.$store.dispatch('CHOOSE_SELECT', this.allData);
        //       break;
        //     } else {
        //       if (this.allData[i].id == val.id) {
        //         this.allData.splice(i, 1)
        //         this.$store.dispatch('CHOOSE_SELECT', this.allData)
        //       }
        //     }
        //   }
        // } else {
        //   this.allData.push(val)
        //   this.$store.dispatch('CHOOSE_SELECT', this.allData)
        // }
      },
      checkAllChange(val) {
        this.checkAll = val;
        this.arr = [];
        window.newArr = [];
        this.selectAll(this.datas, val);
        // if (val) {
        //   this.$store.dispatch('CHOOSE_SELECT', this.arr);
        // } else {
        //   this.arr = [];
        //   this.$store.dispatch('CHOOSE_SELECT', this.arr);
        // }
      },
      selectAll(datas, isChecked) {
        datas.map((item, idx) => {
          if (item.products) {
            item.products.map((info, index) => {
              this.arr.push(info)
              info.checked = isChecked
            })
          } else {
            this.selectAll(item.children, isChecked)
          }
        })
      },
      handleMove(val) {
        let params = {
          info: val,
          visible: true
        }
        this.$store.dispatch('MOVETO_WAREHOUSE', params);
      }
    }
  }
</script>
