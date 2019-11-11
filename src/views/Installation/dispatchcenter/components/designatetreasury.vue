<template>
  <div class="noticedia">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>指派出库</span>
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="上门类型" prop="doorType">
              <el-radio-group v-model="ruleForm.doorType">
                <el-radio label="1">送装一体</el-radio>
                <el-radio label="2">送装分离</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="预约上门时间" prop="appointmentTime">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="ruleForm.appointmentTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="是否等通知" prop="isInform">
              <el-radio-group v-model="ruleForm.isInform">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="是否抗楼" prop="resistance">
              <el-radio-group v-model="ruleForm.resistance">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="老房改造" prop="oldHouse">
              <el-radio-group v-model="ruleForm.oldHouse">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="司机">
              <el-input v-model="ruleForm.driver"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="车牌号">
              <el-input v-model="ruleForm.licensePlateNumber"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="司机电话">
              <el-input v-model.number="ruleForm.driverPhone"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item" v-if="ruleForm.doorType==2">
            <el-form-item label="物流派送时间" prop="logisticsTime">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="ruleForm.logisticsTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="infoform_item" v-if="ruleForm.doorType==2">
            <el-form-item label="选择物流公司" prop="logisticsName">
              <el-input v-model="ruleForm.logisticsName"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <el-form-item label="预约备注" class="width-100">
            <el-input v-model="ruleForm.remakes" resize="none" type="textarea" class="width-100"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <!-- 订单 -->
      <procurement :orderId="orderId" ref="procurement"></procurement>

      <!-- 库取 -->
      <libraryacquisition :orderId="orderId" ref="libraryacquisition"></libraryacquisition>

      <!-- 顾家 -->
      <!-- <lookfamily></lookfamily> -->
    </el-card>

    <div class="btn">
      <el-button type="primary" @click="handleok" :loading="loadingFn">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import procurement from "./procurement";
import libraryacquisition from "./libraryacquisition";
import lookfamily from "./lookfamily";
import {
  appointmentDoorDetails,
  addSesignateOutLibrary,
  getStorageList
} from "api/Installation/dispatchcenter/dispatchcenter";
import { getUUID } from "api/pulicJava";
export default {
  props: ["isDesignatetreasury"],
  components: {
    pagination,
    breadcrumb,
    procurement,
    libraryacquisition,
    lookfamily
  },
  created() {
    this.orderId = this.$route.query.orderId;
  },
  data() {
    return {
      ruleForm: {
        doorTypeP: "",
        appointmentTime: "",
        isInform: "",
        resistance: "",
        oldHouse: "",
        driver: "",
        licensePlateNumber: "",
        driverPhone: "",
        logisticsTime: "",
        logisticsName: "",
        remakes: ""
      },
      loadingFn:false,
      orderId: "",
      navList: [], //
      rules: {
        //检验
        driver: [{ required: true, message: "请输入司机", trigger: "blur" }],
        licensePlateNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        doorType: [
          { required: true, message: "请选择上门类型", trigger: "change" }
        ],
        // receivingPeopleType: [
        //   { required: true, message: "请选择指派类型", trigger: "change" }
        // ],
        isInform: [
          { required: true, message: "请选择是否等通知", trigger: "change" }
        ],
        resistance: [
          { required: true, message: "请选择是否抗楼", trigger: "change" }
        ],
        oldHouse: [
          { required: true, message: "请选择老放改造", trigger: "change" }
        ],
        name3: [
          { required: true, message: "请选择是否老房改造", trigger: "change" }
        ],
        remakes: [{ required: true, message: "请输入备注", trigger: "blur" }],
        storageId: [
          { required: true, message: "请选择出库仓库", trigger: "change" }
        ],
        logisticsName: [
          { required: true, message: "请输入物流公司", trigger: "blur" }
        ],
        driverPhone: [
          { required: true, message: "司机电话不能为空" },
          { type: "number", message: "电话必须为数字值" }
        ],
        logisticsTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        truckLodingTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        appointmentTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      warehouseList: []
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getData();
    this.getWarehouse();
  },
  methods: {
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          console.log(res);
          this.warehouseList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    },
    //获取列表
    getData() {
      let data = {
        installationOrderId: this.$route.query.installationOrderId
      };
      appointmentDoorDetails(data)
        .then(res => {
          if (res.status == 200) {
            if (res.data) {
              this.ruleForm = res.data;
              if (res.data.isInform != null) {
                this.ruleForm.isInform = String(res.data.isInform);
              }
            }
          }
        })
        .catch(error => {
          console.error("指派出库回显", error);
        });
    },
    //取消
    handleClose() {
      this.$router.go(-1);
    },

    //指派出库确认按钮
    handleok() {
      //结构赋值
      let {
        procurement: { orderData, dataList }, //二次结构
        libraryacquisition: { librariesTakeDTOS, tableData } //二次结构
      } = this.$refs;
       let purchaseOrderVOS = orderData();
      if (dataList.length == 0 && tableData.length == 0) {
        this.$message.warning("当前订单已经全部出库!");
        return;
      }
      
      if (purchaseOrderVOS.length == 0 && librariesTakeDTOS.length == 0) {
        this.$message.error("只少选一个出库!");
        return;
      }

      if (this.ruleForm.isInform == 1) {
        this.$message.error("当前状态是等通知,不能出库!");
        return;
      }

      if (this.ruleForm.doorType == 1) {
        this.ruleForm.logisticsName = null;
        this.ruleForm.logisticsTime = null;
        this.ruleForm.truckLodingTime = null;
      }
      let storageId = "";
     
      if (purchaseOrderVOS.length != 0) {
        storageId = purchaseOrderVOS[0].storageId;
      }
      if (librariesTakeDTOS.length != 0) {
        storageId = librariesTakeDTOS[0].storageId;
      }
      
      let deliveryCount=0
      purchaseOrderVOS.forEach(item=>{
        deliveryCount+=item.deliveryNumber;
      })
      librariesTakeDTOS.forEach(item=>{
        deliveryCount+=item.number;
      })
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = {
            installationOrderId: this.$route.query.installationOrderId, //安装订单ID
            orderId: this.$route.query.orderId, //订单ID
            purchaseOrderVOS: purchaseOrderVOS, //采购集合
            librariesTakeDTOS: librariesTakeDTOS, //库取
            designateType: this.ruleForm.doorType, //上门类型
            logisticsName: this.ruleForm.logisticsName, //物流公司
            logisticsDeliveryTime: this.ruleForm.logisticsTime, //物流派送时间
            appointmentTime: this.ruleForm.appointmentTime, //预约上门时间
            isInform: this.ruleForm.isInform, //是否等通知
            resistance: this.ruleForm.resistance, //是否抗楼
            oldHouse: this.ruleForm.oldHouse, //老房改造
            storageId, //出库仓库ID
            outboundType: "1", //出库类型
            driver: this.ruleForm.driver, //司机
            licensePlateNumber: this.ruleForm.licensePlateNumber, //车牌号
            driverPhone: this.ruleForm.driverPhone, //司机电话
            appointmentDoorId: this.ruleForm.appointmentDoorId, //预约上门ID
            remake: this.ruleForm.remakes, //备注
            deliveryCount
          };
          console.log(data);
          this.loadingFn = true;
          getUUID({ serialNumber: "ST" }).then(res => {
            data.outboundNumber = res.data;
            addSesignateOutLibrary(data)
              .then(res => {
                if (res.status == 200) {
                  this.$router.go(-1)
                  this.$message.success("指派出库成功");
                  this.loadingFn = false;
                }else{
                  this.loadingFn = false;
                }
              })
              .catch(error => {
                console.error("指派出库", error);
                this.loadingFn = false;
              });
          });
        } else {
          this.$message.error("请检查填写信息是否遗漏");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.noticedia {
  .btn {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .form_class {
    width: 90%;
    margin: 0 auto;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      // justify-content: space-between;
      .infoform_item {
        width: 33%;
      }
    }
  }
  .dialog-footer {
    width: 95%;
    text-align: right;
  }
}
</style>

