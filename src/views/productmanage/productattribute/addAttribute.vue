<template>
  <!-- 弹框页面 -->
  <div style="width:100%">
    <!-- 新增 -->
    <div v-if="editindex==0">
      <div class="Dialog_input_cell">
        <span class="Dialog_input_cell_title">属性名称：</span>
        <div class="Dialog_input_cell_input">
          <el-input placeholder="品牌名称/联系人/联系人电话" v-model="brandInfo.attributeName" maxlength="50"></el-input>
        </div>
      </div>

      <div class="Dialog_input_cell">
        <span class="Dialog_input_cell_title">属性值录入方式：</span>
        <div class="Dialog_input_cell_input">
          <el-select v-model="brandInfo.mode">
            <el-option
              v-for="item in DialogbrandList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="toggle_box">
        <div v-if="brandInfo.mode == 0">
          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">输入类型：</span>
            <div class="Dialog_input_cell_input">
              <el-select v-model="brandInfo.attributeType">
                <el-option
                  v-for="item in DialoginsertList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="Dialog_input_cell" v-if="brandInfo.attributeType== 0">
            <span class="Dialog_input_cell_title">是否有单位：</span>
            <div class="Dialog_input_cell_input">
              <el-checkbox v-model="isHaveunit"></el-checkbox>
            </div>
          </div>
          <div class="Dialog_input_cell" v-if="isHaveunit && brandInfo.attributeType== 0">
            <span class="Dialog_input_cell_title">单位类型：</span>
            <div class="Dialog_input_cell_input">
              <el-select v-model="brandInfo.attributeUnit" placeholder>
                <el-option
                  v-for="item in DialogunitList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div v-else-if="brandInfo.mode==1" class="dialog_table">
          <div class="add">
            <el-button class="default button-96" @click="adddialogList">新 增</el-button>
            <el-button class="default button-96" @click="removedialogLists">删 除</el-button>
          </div>
          <el-table
            border
            :header-cell-style="tableHeaderColor"
            :row-style="tableBodycolor"
            @selection-change="dialoghandleSelectionChange"
            :data="dialogtabList"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="操作" width="100">
              <template slot-scope="scope">
                <span class="table_action_span" @click="removedialogList(scope.$index)">删除</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="属性值名称" width="400">
              <template slot-scope="scope">
                <el-input placeholder v-model="scope.row.value" maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否可修改">
              <template slot-scope="scope">
                <el-button @click="yesModify(scope.row.id)" :type="scope.row.yes?'primary':''">是</el-button>
                <el-button @click="noModify(scope.row.id)" :type="scope.row.no?'primary':''">否</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 编辑 -->
    <div v-else>
      <div class="Dialog_input_cell">
        <span class="Dialog_input_cell_title">属性名称：</span>
        <div class="Dialog_input_cell_input">
          <el-input placeholder="品牌名称/联系人/联系人电话" v-model="brandInfo.attributeName" maxlength="50"></el-input>
        </div>
      </div>

      <div class="Dialog_input_cell">
        <span class="Dialog_input_cell_title">属性值录入方式：</span>
        <div class="Dialog_input_cell_input">
          <el-select v-model="brandInfo.mode" placeholder="品牌类型">
            <el-option
              v-for="item in DialogbrandList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="toggle_box">
        <div v-if="brandInfo.mode == 0">
          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">输入类型：</span>
            <div class="Dialog_input_cell_input">
              <el-select v-model="brandInfo.attributeType" placeholder="品牌类型">
                <el-option
                  v-for="item in DialoginsertList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="Dialog_input_cell" v-if="brandInfo.attributeType== 0">
            <span class="Dialog_input_cell_title">是否有单位：</span>
            <div class="Dialog_input_cell_input">
              <el-checkbox v-model="isHaveunit"></el-checkbox>
            </div>
          </div>
          <div class="Dialog_input_cell" v-if="isHaveunit && brandInfo.attributeType== 0">
            <span class="Dialog_input_cell_title">单位类型：</span>
            <div class="Dialog_input_cell_input">
              <el-select v-model="brandInfo.attributeUnit" placeholder>
                <el-option
                  v-for="item in DialogunitList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div v-else-if="brandInfo.mode==1" class="dialog_table">
          <div class="add">
            <el-button class="default button-96" @click="adddialogList">新 增</el-button>
            <el-button class="default button-96" @click="removedialogLists">删 除</el-button>
          </div>
          <el-table
            border
            :header-cell-style="tableHeaderColor"
            :row-style="tableBodycolor"
            @selection-change="dialoghandleSelectionChange"
            :data="editdialogtabList"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="操作" width="100">
              <template slot-scope="scope">
                <span class="table_action_span" @click="removedialogList(scope.$index)">删除</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="属性值名称" width="400">
              <template slot-scope="scope">
                <el-input placeholder v-model="scope.row.value" maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否可修改" min-width="150px">
              <template slot-scope="scope">
                <div>
                  <el-button @click="yesModify(scope.row.id)" :type="scope.row.yes?'primary':''">是</el-button>
                  <el-button @click="noModify(scope.row.id)" :type="scope.row.no?'primary':''">否</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addCommodityAttribute,
  getCommodityAttribute,
  editCommodityAttribute
} from "api/productmanage/productattribute/productattribute";
export default {
  props: ["editindex", "attrdataList"],
  created() {
    if (this.editindex == 1) {
      this.brandInfo = JSON.parse(JSON.stringify(this.attrdataList));
      if (this.brandInfo.attributeUnit) {
        this.isHaveunit = true;
      }
      if (this.attrdataList.attributeValue) {
        this.attrdataList.attributeValue.split(",").forEach((item, index) => {
          this.editdialogtabList.push({ value: item, id: index + 1 });
        });
      }
    }
  },
  data() {
    return {
      brandInfo: {}, //要提交的页面数局
      //选择属性值类型选择
      DialogbrandList: [
        { label: "手工录入", value: 0 },
        { label: "从列表里选择", value: 1 }
      ],
      //属性值类型选择
      attribute: 1,
      //属性列表
      dialogtabList: [
        {
          value: "",
          yes: "",
          no: "",
          id: 1
        },
        {
          value: "",
          yes: "",
          no: "",
          id: 2
        }
      ],
      editdialogtabList: [],
      //属性输入方式
      DialoginsertList: [
        { label: "数字", value: 0 },
        { label: "文本", value: 1 }
      ],
      indexVal: [],
      //属性输入方式选择
      attributeStyle: 1,
      //是否有单位
      isHaveunit: false,
      //单位类型list
      DialogunitList: [
        { label: "米", value: "米" },
        { label: "分米", value: "分米" },
        { label: "厘米", value: "厘米" },
        { label: "件", value: "件" },
        { label: "套", value: "套" }
      ],
      //单位类型
      unitStyle: ""
    };
  },
  mounted() {},
  methods: {
    yesModify(id) {
      //是
      this.dialogtabList = this.dialogtabList.map(item => {
        if (item.id == id) {
          item.yes = true;
          item.no = false;
        }
        return item;
      });
    },
    noModify(id) {
      //否
      this.dialogtabList = this.dialogtabList.map(item => {
        if (item.id == id) {
          item.yes = false;
          item.no = true;
        }
        return item;
      });
    },
    getEdit() {},
    addAttribute() {
      //添加新属性 接口
      let data = {};
      data = this.brandInfo;

      if (!this.brandInfo.attributeName) {
        this.$message.error("内容不能为空");
        return;
      }
      if (this.brandInfo.mode == 1) {
        data.attributeValue = this.dialogtabList
          .map(item => {
            return item.value;
          })
          .join();
        data.isChange = this.dialogtabList
          .map(item => {
            if (item.yes) {
              return 1;
            } else {
              return 0;
            }
          })
          .join();
      }

      addCommodityAttribute(data)
        .then(res => {
          if (res.status == 200) {
            this.$message({ message: "添加成功", type: "success" });
            this.brandInfo = {};
            this.dialogtabList = this.dialogtabList.map(item => {
              item.yes = false;
              item.no = false;
              return item;
            });
            this.$emit("getListData");
            this.$emit("closeFn");
          }
        })
        .catch(error => {
          this.$message.error({ message: "操作失败" });
        });
    },
    editAttribute(obj) {
      let data = {};
      data = this.brandInfo;

      if (!this.brandInfo.attributeName) {
        this.$message.error("内容不能为空");
        return;
      }
      if (this.brandInfo.mode == 1) {
        data.attributeValue = this.editdialogtabList
          .map(item => {
            return item.value;
          })
          .join();
      }
      data.isEnable = obj.isEnable;
      data.commodityAttributeId = obj.commodityAttributeId;
      editCommodityAttribute(data)
        .then(res => {
          if (res.status == 200) {
            this.$emit("getListData");
            this.$emit("closeFn");
          }
        })
        .catch(error => {
          console.error("编辑", error);
        });
    },
    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    //勾选函数回调
    dialoghandleSelectionChange(value) {
      this.indexVal = [];
      value.forEach(val => {
        if (this.editindex == 1) {
          this.editdialogtabList.forEach((item, index) => {
            if (val.id == item.id) {
              this.indexVal.push(item.id);
            }
          });
        } else {
          this.dialogtabList.forEach((item, index) => {
            if (val.id == item.id) {
              this.indexVal.push(item.id);
            }
          });
        }
      });
    },
    //列表添加属性
    adddialogList() {
      let cell = {
        id: this.dialogtabList.length + 1,
        value: ""
      };
      if (this.editindex == 1) {
        this.$set(this.editdialogtabList, this.editdialogtabList.length, cell);
      } else {
        this.$set(this.dialogtabList, this.dialogtabList.length, cell);
      }
    },
    //弹框列表添加属性  table内删除功能
    removedialogList(index) {
      if (this.editindex == 1) {
        this.editdialogtabList.splice(index, 1);
      } else {
        this.dialogtabList.splice(index, 1);
      }
    },
    //改变tab颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },
    //弹框列表添加属性 按钮删除属性
    removedialogLists() {
      this.indexVal.forEach(item => {
        if (this.editindex == 1) {
          this.editdialogtabList.forEach((val, index) => {
            if (val.id == item) {
              this.editdialogtabList.splice(index, 1);
            }
          });
        } else {
          this.dialogtabList.forEach((val, index) => {
            if (val.id == item) {
              this.dialogtabList.splice(index, 1);
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.add {
  margin-bottom: 10px;
}
.el-table .el-button {
  padding: 10px;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
}
.dialog_con_box {
}
.dialog_con_box .content_box {
  display: flex;
  flex-wrap: wrap;
}
.dialog_con_box .left_form {
  width: 60%;
}
.dialog_con_box .right_logo {
  width: 40%;
}
.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 50px;
  align-items: center;
  width: 100%;
}
.left_form > .lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
  width: 135px;
  text-align: right;
  padding-right: 10px;
}
.Dialog_input_cell_input {
  flex: 1;
}
.Dialog_input_cell_input .el-select {
  width: 100%;
}
.toggle_box {
  padding-top: 10px;
  width: 100%;
}
</style>
<style>
.dialog_table table {
  width: 100%;
}
</style>

