<template>
  <div class="assignmeasure">
    <el-dialog title="指派测量设计" custom-class="customDialogTitle" :visible.sync="dialogvisibletwo" :before-close="handleDialogClose" top='2vh' width="65%">
      <div>
        <div>
          <!-- <div class="titlecals">指派测量设计</div> -->
          <div class="orderfrom">
            <el-form
              :label-position="labelPosition"
              label-width="130px"
              :model="assignmeasuredata"
              class="demo-form-inline"
            >
              <el-form-item label="所属门店">
                <el-input v-model="assignmeasuredata.storeName" disabled size="medium"></el-input>
              </el-form-item>
              <el-form-item label="所属销售员/业务员">
                <el-input v-model="assignmeasuredata.salesmanName" disabled size="medium"></el-input>
              </el-form-item>
              <el-form-item label="订单号">
                <el-input v-model="assignmeasuredata.orderNumber" disabled size="medium"></el-input>
              </el-form-item>
              <el-form-item label="预计订单金额">
                <el-input v-model="assignmeasuredata.orderExpectMoney" disabled size="medium"></el-input>
              </el-form-item>
              <el-form-item label="客户姓名">
                <el-input v-model="assignmeasuredata.customerName" disabled size="medium"></el-input>
              </el-form-item>
              <el-form-item label="客户电话">
                <el-input v-model="assignmeasuredata.customerPhone" disabled size="medium"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="assignmeasuredata.address" disabled size="medium"></el-input>
              </el-form-item>

              <el-form-item label="指派类型">
                <el-select
                  v-model="assignedType"
                  placeholder="请选择"
                  size="medium"
                  class="addresele width-100"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.assignedType"
                    :label="item.label"
                    :value="item.assignedType"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预计测量时间">
                <div class="block">
                  <el-date-picker
                    v-model="assignmeasuredata.assignedTime"
                    size="medium"
                    value-format="yyyy-M-dd"
                    format="yyyy-M-dd"
                    type="date"
                    placeholder="选择日期"
                    class="selewi"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="指派人员">
                <el-select
                  v-model="Employee"
                  placeholder="请选择"
                  class="width-100"
                  filterable
                  @change="designatedFun"
                >
                  <el-option
                    v-for="item in employeeList"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="人员工号">
                <el-input v-model="Employee1" size="medium" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="fromtwo">
            <el-form ref="form" label-width="130px" :model="assignmeasuredata">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="remark"></el-input>
              </el-form-item>
              <el-form-item label>
                <el-checkbox v-model="isInform">通知客户</el-checkbox>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subminbtntask" :loading="loadingbtn">提 交</el-button>
        <el-button @click="subminbtn">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addOrderAssignedMeasure,
  listOrganization,
  listUserPost
} from "api/order/measuremanage/measuremanage";
import { getUUID } from "api/pulicJava";
export default {
  data() {
    return {
      selectedOptions: "",
      assignedType: "",
      assignedTime: "",
      assignedAt: "",
      remark: "",
      assignedTissue: "",
      isInform: false,
      labelPosition: "right",
      organizelist: [],
      loadingbtn:false,
      optionProps: {
        value: "id",
        label: "label",
        children: "children"
      },
      options: [
        { assignedType: "0", label: "测量" },
        { assignedType: "1", label: "设计" },
        { assignedType: "2", label: "测量和设计" }
      ],
      // assignmeasuredata: {
      //     user: '',
      //     region: '',
      //     type: [],
      //     desc: "",
      //     checked: false,
      //     textarea2: "",
      //     resource: ""
      // },
      value1: "2019-04-10 00:00:10",
      employeeList: [],
      Employee: "",
      Employee1: ""
    };
  },
  props: {
    dialogvisibletwo: Boolean,
    asssinstatus: Number,
    assignmeasuredata: Object
  },
  created() {
    listOrganization()
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.organizelist = res.data;
        }
      })
      .catch(error => {
        console.log(
          "指派测量:指派测量获取组织机构 src/views/components/assignmeasure",
          error
        );
      });
  },
  mounted() {
    console.log(this.assignmeasuredata, "assignmeasuredata");
    // this.staff()
  },
  methods: {
    //指派人员
    designatedFun() {
      this.Employee1 = this.employeeList.filter(item => {
        return item.id == this.Employee;
      })[0].number;
    },
    staff(storeId) {
      // let data = {
      //   dataCode: "G080",
      // };

      listUserPost({ storeId })
        .then(res => {
          this.employeeList = res.data;
        })
        .catch(error => {
          console.error("员工", error);
        });
    },
    handleDialogClose() {
      this.$emit("assignmeasurefun");
    },
    subminbtn() {
      this.$emit("assignmeasurefun");
    },
    subminbtntask() {
      // 验证
      if (!this.assignedType) {
        this.$message.error("请选择指派类型");
        return;
      }
      if (!this.Employee) {
        this.$message.error("请选择指派人员");
        return;
      }
      if (this.assignmeasuredata.assignedTime == null) {
        this.$message.error("请选择预计测量时间");
        return;
      }
      let obj = {
        orderId: this.assignmeasuredata.orderId,
        assignedType: this.assignedType,
        assignedAt: this.Employee,
        assignedTime: this.assignmeasuredata.assignedTime,
        isInform: this.isInform ? 1 : 0,
        remark: this.remark
      };
      // 测量编码
      if (this.assignedType == "0") {
        getUUID({ serialNumber: "MT" }).then(res => {
          obj.assignedNumber = res.data;
          this.getAddOrder(obj);
        }).catch(error=>{
          this.loadingbtn = false
          console.error(error);
          
        })
      }
      // 设计编码
      if (this.assignedType == "1") {
        getUUID({ serialNumber: "DT" }).then(res => {
          obj.assignedNumber = res.data;
          this.getAddOrder(obj);
        }).catch(error=>{
          this.loadingbtn = false
          console.error(error);
          
        })
      }
      // 测量和设计编码
      if (this.assignedType == "2") {
        let p1 = new Promise((resolve, reject) => {
          getUUID({ serialNumber: "MT" }).then(res => {
            resolve(res);
          }).catch(error=>{
            this.loadingbtn = false
            console.error(error);
          })
        });
        let p2 = new Promise((resolve, reject) => {
          getUUID({ serialNumber: "DT" }).then(res => {
            resolve(res);
          }).catch(error=>{
            this.loadingbtn = false
            console.error(error);
            
          })
        });

        Promise.all([p1, p2]).then(res => {
          obj.assignedNumber = res
            .map(item => {
              return item.data;
            })
            .join(",");
          this.getAddOrder(obj);
        });
      }

      // this.$router.push({path: 'order/accepttask'});
    },
    // 新增指派测量
    getAddOrder(obj) {
      this.loadingbtn = true;
      addOrderAssignedMeasure(obj)
        .then(res => {
          if (res.status == 200) {
            this.$emit("getDataFun");
            this.$emit("assignmeasurefun");
            this.$message.success("提交成功!");
            this.loadingbtn=false
          } else {
            this.$message.error(res.message);
            this.loadingbtn=false
          }
        })
        .catch(error => {
          this.loadingbtn = false
          console.error("指派测量:指派测量设计新增指派单", error);
        });
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.assignmeasure {
  .el-form-item{
    margin-bottom:5px;
  }
  .orderfrom {
    margin-top: 10px;
    padding: 0px 70px 0px 20px;
  }
  .fromtwo {
    padding: 0px 70px 0px 20px;
  }
  .orderfrom .el-form-item__label {
    font-weight: 400;
  }

  .orderfrom .demo-form-inline {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .orderfrom .demo-form-inline > div {
    width: 45%;
  }
  .reason {
    display: flex;
    margin-top: 10px;
  }
  .reason .explatxt {
    font-size: 14px;
    width: 100px;
    padding-right: 20px;
    text-align: right;
  }
  .textareabox {
    flex: 1;
  }
  .selewi {
    width: 100%;
  }
}
</style>


