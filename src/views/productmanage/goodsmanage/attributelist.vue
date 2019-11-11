<template>
  <div>
    <div class="iconBox">
      <i class="Icon"></i>
      <span>商品属性</span>
    </div>
    <div class="attributes m-top20">
      <div class="Commodityattributes">
        <span class="input_befor_text">颜色：</span>
        <el-input v-model="colorsText" @click.native="showColors"></el-input>
      </div>

      <div class="Commodityattributes">
        <span class="input_befor_text">材质：</span>
        <el-input v-model="materialText" @click.native="showMaterial"></el-input>
      </div>
      <div class="Commodityattributes">
        <span class="input_befor_text">系列：</span>
        <el-input v-model="seriesText" @click.native="showSeries"></el-input>
      </div>
      <div class="Commodityattributes">
        <span class="input_befor_text">货号：</span>
        <el-input v-model="itemNumber" placeholder="请输入货号"></el-input>
      </div>
    </div>
    <!-- 颜色************ -->
    <el-dialog
      title="选择颜色"
      custom-class="customDialogTitle"
      :visible.sync="colorsVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="600px"
      top="30px"
      :before-close="handleClose"
    >
      <div class="elInput">
        <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterColors"></el-input>
      </div>
      <div class="ruleModel">
        <el-tree
          :data="colorsList"
          show-checkbox
          ref="colorsTree"
          node-key="id"
          @check="colorsChange"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="colseColors">取 消</el-button>
        <el-button type="primary" @click="colorsConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 材质************* -->
    <el-dialog
      title="选择材质"
      :visible.sync="materialVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="customDialogTitle"
      width="600px"
      top="30px"
      :before-close="handleClose"
    >
      <div class="elInput">
        <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterMaterial"></el-input>
      </div>
      <div class="ruleModel">
        <el-tree
          :data="materialList"
          show-checkbox
          ref="materialTree"
          node-key="id"
          @check="materialChange"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="materialColors">取 消</el-button>
        <el-button type="primary" @click="materialConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 系列************* -->
    <el-dialog
      title="选择系列"
      :visible.sync="seriesVisible"
      custom-class="customDialogTitle"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="600px"
      top="30px"
      :before-close="handleClose"
    >
      <div class="elInput">
        <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterSeries"></el-input>
      </div>
      <div class="ruleModel">
        <el-tree
          :data="seriesList"
          show-checkbox
          ref="seriesTree"
          node-key="id"
          @check="seriesChange"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="seriesColors">取 消</el-button>
        <el-button type="primary" @click="seriesConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listBaseDict } from "api/productmanage/goodsmanage/goodsmanage";
export default {
  props: {
    bindInfo: Object,
    show: Boolean
  },
  data() {
    return {
      //商品属性*********************
      itemNumber: "", //货号
      filterColors: "", //颜色查询
      filterMaterial: "", //材质查询
      filterSeries: "", //系列查询
      // 颜色
      colorsList: [], //颜色集合
      colorsVisible: false, //颜色弹框
      colorsIds: [], //勾选颜色Id集合
      backupscolors: [], //确认颜色Id集合
      colorsNum: 0, //颜色数量
      colorsText: "已选择0种颜色", //颜色文本展示数据
      // 材质
      materialList: [], //材质集合
      materialVisible: false, //材质弹框
      materialIds: [], //勾选材质Id集合
      backupsmaterial: [], //确认材质Id集合
      materialNum: 0, //材质数量
      materialText: "已选择0种材质", //材质文本展示数据

      // 系列
      seriesList: [], //系列集合
      seriesVisible: false, //系列弹框
      seriesIds: [], //勾选系列Id集合
      backupsseries: [], //确认系列Id集合
      seriesNum: 0, //系列数量
      seriesText: "已选择0种系列" //系列文本展示数据
    };
  },
  watch: {
    bindInfo(val) {
      if (this.show) {
        this.colorsIds = this.backupscolors = val.commodityColours;
        this.materialIds = this.backupsmaterial = val.commodityMaterials;
        this.seriesIds = this.backupsseries = val.commoditySeries;
        this.colorsText = `已选择${val.commodityColours.length}种颜色`;
        this.materialText = `已选择${val.commodityMaterials.length}种材质`;
        this.seriesText = `已选择${val.commoditySeries.length}种系列`;
        this.itemNumber = val.itemNumber;
      }
    },
    filterColors(val) {
      this.$refs.colorsTree.filter(val);
    },
    filterMaterial(val) {
      this.$refs.materialTree.filter(val);
    },
    filterSeries(val) {
      this.$refs.seriesTree.filter(val);
    }
  },
  mounted() {
    this.getColors(); //颜色
    this.getMaterial(); //材质
    this.getSeries(); //系列
  },
  methods: {
    //关闭弹框
    handleClose() {
      this.colorsVisible = false;
      this.materialVisible = false;
      this.seriesVisible = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 颜色************************
    getColors() {
      //获取颜色
      let data = {
        dataType: "COMMODITY_COLOR"
      };
      listBaseDict(data)
        .then(res => {
          this.colorsList = res.data.map(item => {
            return { label: item.dictName, id: item.id };
          });
        })
        .catch(error => {
          console.error("获取颜色", error);
        });
    },
    //颜色勾选树
    colorsChange(attr, items) {
      this.colorsNum = items.checkedKeys.length;
      this.colorsText = `已选择${this.colorsNum}种颜色`;
      this.colorsIds = items.checkedKeys;
    },
    //点击颜色输入框
    showColors() {
      this.colorsVisible = true;
      this.$nextTick(() => {
        this.colorsList.forEach(item => {
          this.colorsIds.forEach(attr => {
            if (item.id == attr) {
              this.$refs.colorsTree.setChecked(attr, true);
            }
          });
        });
      });
    },
    //颜色弹框确认
    colorsConfirm() {
      this.backupscolors = this.colorsIds;
      this.colorsVisible = false;
    },
    //颜色弹框取消
    colseColors() {
      this.colorsIds.forEach(item => {
        this.colorsList.forEach(attr => {
          if (item !== attr.id) {
            this.$refs.colorsTree.setChecked(item, false);
          }
        });
      });
      if (this.backupscolors.length == 0) {
        this.colorsIds.forEach(item => {
          this.$refs.colorsTree.setChecked(item, false);
        });
      }
      this.colorsIds = this.backupscolors;
      this.colorsText = `已选择${this.colorsIds.length}种颜色`;
      this.colorsVisible = false;
    },

    // 材质*****************************
    getMaterial() {
      let data = {
        dataType: "COMMODITY_MATERIAL"
      };
      listBaseDict(data)
        .then(res => {
          this.materialList = res.data.map(item => {
            return { label: item.dictName, id: item.id };
          });
        })
        .catch(error => {
          console.error("获取材质", error);
        });
    },
    //勾选树
    materialChange(attr, items) {
      this.materialNum = items.checkedKeys.length;
      this.materialText = `已选择${this.materialNum}种材质`;
      this.materialIds = items.checkedKeys;
    },
    //点击材质输入框
    showMaterial() {
      this.materialVisible = true;
      this.$nextTick(() => {
        this.materialList.forEach(item => {
          this.materialIds.forEach(attr => {
            if (item.id == attr) {
              this.$refs.materialTree.setChecked(attr, true);
            }
          });
        });
      });
    },
    //材质弹框确认
    materialConfirm() {
      this.backupsmaterial = this.materialIds;
      this.materialVisible = false;
    },
    //材质弹框取消
    materialColors() {
      this.materialIds.forEach(item => {
        this.materialList.forEach(attr => {
          if (item !== attr.id) {
            this.$refs.materialTree.setChecked(item, false);
          }
        });
      });
      if (this.backupsmaterial.length == 0) {
        this.materialIds.forEach(item => {
          this.$refs.materialTree.setChecked(item, false);
        });
      }
      this.materialIds = this.backupsmaterial;
      this.materialText = `已选择${this.materialIds.length}种材质`;
      this.materialVisible = false;
    },

    // 系列*****************************
    getSeries() {
      let data = {
        dataType: "COMMODITY_SERIES"
      };
      listBaseDict(data)
        .then(res => {
          this.seriesList = res.data.map(item => {
            return { label: item.dictName, id: item.id };
          });
        })
        .catch(error => {
          console.error("获取系列", error);
        });
    },
    //系列勾选树
    seriesChange(attr, items) {
      this.seriesNum = items.checkedKeys.length;
      this.seriesText = `已经选择${this.seriesNum}系列`;
      this.seriesIds = items.checkedKeys;
    },
    //点击系列输入框
    showSeries() {
      this.seriesVisible = true;
      this.$nextTick(() => {
        this.seriesList.forEach(item => {
          this.seriesIds.forEach(attr => {
            if (item.id == attr) {
              this.$refs.seriesTree.setChecked(attr, true);
            }
          });
        });
      });
    },
    //系列弹框确认
    seriesConfirm() {
      this.backupsseries = this.seriesIds;
      this.seriesVisible = false;
    },
    //系列弹框取消
    seriesColors() {
      this.seriesIds.forEach(item => {
        this.seriesList.forEach(attr => {
          if (item !== attr.id) {
            this.$refs.seriesTree.setChecked(item, false);
          }
        });
      });
      if (this.backupsseries.length == 0) {
        this.seriesIds.forEach(item => {
          this.$refs.seriesTree.setChecked(item, false);
        });
      }
      this.seriesIds = this.backupsseries;
      this.seriesText = `已选择${this.seriesIds.length}种系列`;
      this.seriesVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.ruleModel {
  max-height: 300px;
  overflow-y: auto;
}
.elInput {
  width: 50%;
  margin-bottom: 20px;
}
.attributes {
  display: flex;
  .Commodityattributes {
    display: flex;
    align-items: center;
    width: 25%;
  }
  .input_befor_text {
    width: 120px;
    text-align: right;
  }
}
</style>
