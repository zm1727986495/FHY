<template>
  <div>
    <div class="table_list">
      <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="datas" :max-height="maxHeight">
        <el-table-column type="selection" width="45" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" width="45" align="center" fixed="left"></el-table-column>
        <el-table-column prop="commodityCode" label="商品编码" width="150" sortable align="center" v-if="type == 2">
<!--          <template slot-scope="scope">-->
<!--            <el-button type="text" @click="viewInfo(scope.row)">{{ scope.row.commodityCode }}</el-button>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="commodityCode" label="商品编码" width="150" sortable align="center" v-if="type == 1"></el-table-column>
        <el-table-column prop="commodityName" label="名称" width="200" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="120" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" label="品类" width="120" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityModel" label="型号" width="120" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="seriesName" label="系列" width="120" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="材质" width="120" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="colourName" label="颜色" width="120" sortable align="center"></el-table-column>
        <el-table-column prop="commodityUnit" label="单位" width="120" sortable align="center"></el-table-column>
        <el-table-column prop="commodityWide" label="宽" width="100" sortable align="center"></el-table-column>
        <el-table-column prop="commodityHigh" label="高" width="100" sortable align="center"></el-table-column>
        <el-table-column prop="commodityLong" label="深" width="100" sortable align="center"></el-table-column>
        <el-table-column prop="commodityThick" label="厚" width="100" sortable align="center"></el-table-column>
        <el-table-column prop="receivableNumber" label="数量" width="120" sortable align="center" v-if="type == 1"></el-table-column>
        <el-table-column prop="acceptanceNumberReal" label="验收数量" width="200" sortable align="center" v-if="type == 1">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.acceptanceNumberReal" placeholder="验收数量" size="small" @blur="checkNumber(scope.row,scope.$index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="acceptanceNumberReal" label="数量" width="120" sortable align="center" v-if="type == 2"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    props: {
      type: {
        type: Number,
        default: () => 1
      },
      datas: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        tableData: []
      }
    },
    watch: {
      activeStoreId(val) {
        if (val) {
          this.storeInfo = val;
          // this.getStorageByStoreId();
        }
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      handleSelectionChange(val) {
        this.$emit('selectionChange', val);
      },
      // 验证输入验收数量
      checkNumber(row, index) {
        if (row.acceptanceNumberReal) {
          if (typeof row.acceptanceNumberReal !== 'number') {
            this.$message.error('请输入数字');
            row.acceptanceNumberReal = '';
          } else {
            if (row.acceptanceNumberReal < 0) {
              this.$message.error('验收数量不能为负数');
              row.acceptanceNumberReal = '';
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight'
      ])
    }
  }
</script>
