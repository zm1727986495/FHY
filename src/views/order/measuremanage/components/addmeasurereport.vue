<template>
  <div class="addmeasurereport">
    <el-form
      :label-position="labelPosition"
      label-width="140px"
      :model="addmeasurereportdata"
      :rules="rules"
      ref="ruleForm"
      class="demo-form-inline"
    >
      <el-form-item label="实际上门测量时间" required prop="reportTime">
        <div class="block">
          <el-date-picker
            v-model="addmeasurereportdata.reportTime"
            size="medium"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-M-dd HH:mm:ss"
            format="yyyy-M-dd HH:mm:ss"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="处理结果" required prop="dealResult">
        <el-radio-group v-model="addmeasurereportdata.dealResult" @change="dealChange">
          <el-radio label="1">完成</el-radio>
          <el-radio label="0">未完成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否复测" prop="isRetest">
        <el-radio-group
          :disabled="addmeasurereportdata.dealResult==0"
          v-model="addmeasurereportdata.isRetest"
        >
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="测量附件">
        <template>
          <el-upload
            class="upload-demo"
            action="string"
            :limit="1"
            :http-request="uploadSectionFile"
            :file-list="fileList"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </template>
      </el-form-item>

      <el-form-item label="订单地址" required>
        <template>
          <div>
            <el-input
              placeholder="地图定位"
              :title="maps"
              v-model="maps"
              readonly
              @focus="openMap"
              class="input-with-select"
            ></el-input>
          </div>
          <div class="addresbox m-top10">
            <div class="addresslist">
              <el-input
                placeholder="楼号/区"
                v-model="newObj.building"
                size="medium"
                class="input-with-select"
              ></el-input>
              <span class="max_w">楼号/区</span>
              <el-input
                placeholder="单元/号楼"
                v-model="newObj.unit"
                size="medium"
                class="input-with-select"
              ></el-input>
              <span class="max_w">单元/号楼</span>
              <el-input
                placeholder="室"
                v-model="newObj.room"
                size="medium"
                class="input-with-select"
              ></el-input>
              <span>室</span>
            </div>
            <span class="explaintxttwo table_action_span" @click="cliaddfun">地址管理</span>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="地址" required prop="isScene">
        <el-radio-group v-model="addmeasurereportdata.isScene">
          <el-radio label="1">现场</el-radio>
          <el-radio label="0">非现场</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="未完成原因"
        required
        v-if="addmeasurereportdata.dealResult==0"
        prop="unComplete"
      >
        <el-select v-model="addmeasurereportdata.unComplete" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报描述" v-else>
        <el-input type="textarea" v-model="addmeasurereportdata.taskResult"></el-input>
      </el-form-item>
      <el-form-item v-if="addmeasurereportdata.dealResult==0">
        <el-input type="textarea" v-model="addmeasurereportdata.unfinishedReason"></el-input>
      </el-form-item>
    </el-form>

    <!-- 地址弹框  -->
    <el-dialog title="地址管理" :visible.sync="addmassge" width="60%">
      <div>
        <addresselection
          v-if="addmassge"
          ref="addData"
          :customerId="addmeasurereportdata.customerId"
        ></addresselection>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addmassge = false">取 消</el-button>
        <el-button type="primary" @click="addsubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 地图弹框 -->
    <el-dialog
      :close-on-click-modal='false'
      title="地图"
      top='0'
      :visible.sync="centerDialogVisible"
      v-if="centerDialogVisible"
      custom-class="customDialogTitle"
      width="70%"
    >
      <baidu-map
        class="map"
        :center="center"
        :zoom="15"
        :keyboard="true"
        :scroll-wheel-zoom="true"
        :double-click-zoom="true"
      >
        <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-control>
          <input type="text" v-model="keyword" placeholder="请输入搜索关键字" class="map_input" />
          <bm-local-search
            class="map_searchinfo"
            :keyword="keyword"
            :auto-viewport="true"
            @infohtmlset="infohtmlsets"
            :panel="true"
          ></bm-local-search>
        </bm-control>
      </baidu-map>
      <div slot="footer" style="margin-top: 0px;">
        <el-button @click="confirm" class="button-fc" type="warning" size="medium">确定</el-button>
        <el-button @click="cancel" class="el-button--medium" size="medium">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addresselection from "@/views/components/addresselection";
import { editOrderAssignedMeasure } from "api/order/measuremanage/measuremanage";
import { getUUID } from "api/pulicJava";
import { baiduMap } from "src/api/pulicJava.js";
import { put } from "@/utils/pubilcFn";
import {
  getOrderCustomerAddress,
  listBaseDict
} from "api/order/measuremanage/measuremanage";

export default {
  components: {
    addresselection
  },
  data() {
    return {
      options: [],
      optionsId: "",
      //地图
      maps: "", //地图信息
      mapDialogVisible: false,
      keyword: "",
      mapText: "",
      center: { lng: 116.404, lat: 39.915 },
      building: "",
      unit: "",
      room: "",
      formatted_address: "",
      sematic_description: "",
      num: 20,
      TechnologyList: [], //图片列表
      fileList: [],
      addmassge: false,
      dialogVisible: false,
      labelPosition: "right",
      oldObj: {},
      newObj: {},
      mapData: {},
      addressData: {},
      storeCustomerId: "",
      customerAddressId: null,
      addressstr: "",
      saveaddress: "",
      formInline: {
        user: "",
        region: "",
        desc: "",
        type: [],
        resource: ""
      },
      rules: {
        unComplete: [
          { required: true, message: "请填写描述", trigger: "blur" }
        ],
        reportTime: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        dealResult: [
          { required: true, message: "请选择处理结果", trigger: "change" }
        ],
        isRetest: [
          { required: true, message: "请选择是否复测", trigger: "change" }
        ],
        isScene: [{ required: true, message: "请选择地址", trigger: "change" }],
        unfinishedReason: [
          { required: true, message: "请填写其它原因", trigger: "change" }
        ]
      },
      //地图参数
      keyword: "", //地图关键字搜索
      centerDialogVisible: false, //地图弹框是否显示
      center: { lng: 116.404, lat: 39.915 }, //经纬度
      buildingNumber: "", //楼号
      unitNumber: "", //单元
      roomNumber: "", //室
      mapData: {},
      poiObj: {},
      maps: "",
      addsData:{}
    };
  },
  props: ["addmeasurereportdata", "orderId", "customerId", 'loadingbtn'],
  mounted() {
    this.getaddress();
    this.getlistBase();
    this.getNowFormatDate()
  },
  methods: {
     //时间
    getNowFormatDate() {
      let dateTime = new Date();
      let hour = dateTime.getHours();
      let min = dateTime.getMinutes();
      let sec = dateTime.getSeconds();
      let yy = dateTime.getFullYear();
      let dd = dateTime.getDate();
      let mm = dateTime.getMonth() + 1;

      let time =
        yy +
        "-" +
        this.repair(mm) +
        "-" +
        this.repair(dd) +
        " " +
        this.repair(hour) +
        ":" +
        this.repair(min) +
        ":" +
        this.repair(sec);
      this.$set(this.addmeasurereportdata, "reportTime", time);
    },
    //补0
    repair(str) {
      return str < 10 ? "0" + str : str;
    },
    //打开地图弹框
    openMap() {
      this.centerDialogVisible = true;
    },
    //地图搜索出来的红点点击事件
    infohtmlsets(poi) {
      this.poiObj = poi;
      this.center = poi.point;
    },
    //地图确认按钮
    confirm() {
      if (this.poiObj.address == undefined) {
        this.$message.warning("请通过地图搜索位置");
      } else {
        this.maps = this.poiObj.address + "_" + this.poiObj.title;
        this.centerDialogVisible = false;
        this.keyword = "";
        this.addressstr =
          this.maps +
          "#" +
          this.newObj.building +
          "#" +
          this.newObj.unit +
          "#" +
          this.newObj.room;
        baiduMap(this.poiObj.point.lng, this.poiObj.point.lat).then(res => {
          this.addressData.provinceId =
            res.addressComponent.adcode.substring(0, 2) + "0000";
          this.addressData.cityId =
            res.addressComponent.adcode.substring(0, 4) + "00";
          this.addressData.areaId = res.addressComponent.adcode;
          this.addressData.longitude = res.location.lng;
          this.addressData.latitude = res.location.lat;
        });
      }
    },
    //点击取消
    cancel() {
      this.centerDialogVisible = false;
      this.keyword = "";
    },

    dealChange() {
      this.$set(this.addmeasurereportdata, "taskResult", "");
      this.$set(this.addmeasurereportdata, "unfinishedReason", "");
      if (this.addmeasurereportdata.dealResult == 0) {
        this.rules.isRetest[0].required = false;
      } else {
        this.rules.isRetest[0].required = true;
        this.addmeasurereportdata.isRetest = '0'
      }
    },
    //获取未完成原因
    getlistBase() {
      let data = {
        dataType: "UNFINISHED_REASONS"
      };
      listBaseDict(data)
        .then(res => {
          this.options = res.data;
        })
        .catch(error => {
          console.error("获取未完成原因", error);
        });
    },
    //地址弹框确认
    addsubmit() {
      if (this.$refs.addData.selections.length > 1) {
        this.$message.error("只能勾选一条!");
      } else if (this.$refs.addData.selections.length == 0) {
        this.$message.error("请勾选一条!");
      } else {
        this.addmeasurereportdata.customerAddressId = this.$refs.addData.selections[0].customerAddressId;
        this.maps = this.$refs.addData.selections[0].adddetails;
        this.$set(
          this.newObj,
          "building",
          this.$refs.addData.selections[0].addressArr[0]
        );
        this.$set(
          this.newObj,
          "unit",
          this.$refs.addData.selections[0].addressArr[1]
        );
        this.$set(
          this.newObj,
          "room",
          this.$refs.addData.selections[0].addressArr[2]
        );
        // addressArr
        this.addmassge = false;
      }
    },
    //获取地址
    getaddress() {
      let data = {
        orderId: this.orderId,
        customerId: this.customerId,
        storeId: this.$route.query.storeId
      };
      getOrderCustomerAddress(data)
        .then(res => {
          if (res.data != null) {
            this.addsData = res.data;
            this.storeCustomerId = res.data.storeCustomerId;
            this.center = {};
            this.center.lat = res.data.latitude;
            this.center.lng = res.data.longitude;
            this.saveaddress = res.data.address;
            this.addressstr = res.data.address;
            let status = res.data.address.indexOf("#");
            let arr = res.data.address.substring(status + 1).split("#");

            this.$set(this.newObj, "building", arr[0]);
            this.$set(this.newObj, "unit", arr[1]);
            this.$set(this.newObj, "room", arr[2]);

            this.maps = res.data.address.substring(0, status);

            this.oldObj.building = arr[0];
            this.oldObj.unit = arr[1];
            this.oldObj.room = arr[2];
          }
        })
        .catch(error => {
          console.error("获取地址", error);
        });
    },
    // 客户信息校验
    customcheckfun() {
      if (this.maps == "") {
        this.$message.error("尚未地图选取位置，请在弹出的地图界面点击确认操作");
        return false;
      }
      return true;
    },
    //验证 判断当前地址是否有修改，修改是新增
    verification(oldCarssId) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.customcheckfun()) {
            // 判断当前是否修改过地址
            if ( JSON.stringify(this.newObj) == JSON.stringify(this.oldObj) && this.saveaddress == this.addressstr ) {
              this.addmeasurereportdata.customerAddress = null;
            } else {
              // 判断当前是否是选择地址管理
              if (this.addmeasurereportdata.customerAddressId == "") {
                this.addressstr = `${this.maps}#${this.newObj.building}#${this.newObj.unit}#${this.newObj.room}`;
                if(this.addressData.latitude && this.addmassge.longitude){
                  this.addressData.latitude = this.addsData.lat;
                  this.addmassge.longitude = this.addsData.lng;
                  this.addressData.provinceId = this.addsData.provinceId
                  this.addressData.cityId = this.addsData.cityId
                  this.addressData.areaId = this.addsData.areaId
                }
                this.addmeasurereportdata.customerAddress = {
                  customerId: this.customerId,
                  address: this.addressstr,
                  storeCustomerId: this.storeCustomerId,
                  ...this.addressData
                };
              } else {
                this.addmeasurereportdata.customerAddress = null;
              }
            }


            // if (this.addmeasurereportdata.unComplete != this.optionsId) {
            this.addmeasurereportdata.dictId = this.addmeasurereportdata.unComplete;
            // }
            this.addmeasurereportdata.oldCustomerAddressId = oldCarssId;
            // this.$emit("editOrderFun", this.addmeasurereportdata);
            this.editOrderFun(this.addmeasurereportdata);
          }
        } else {
          return false;
        }
      });
    },
    //提交接口
    editOrderFun(addmeasurereportdata) {
      if ( addmeasurereportdata.TechnologyList && addmeasurereportdata.TechnologyList.length != 0) {
        addmeasurereportdata.enclosures = addmeasurereportdata.TechnologyList.map(item => {
          return {
            fileUrl: item.url,
            sourceName: item.name
          };
        });
        delete addmeasurereportdata.TechnologyList;
      }
      // 确定按钮loading
      this.$emit('loadingFn',true)
      getUUID({ serialNumber: "MT" }).then(res => {
        if (addmeasurereportdata.isRetest == 1) {
          addmeasurereportdata.assignedNumber = res.data;
        } else {
          addmeasurereportdata.assignedNumber = null;
        }
        editOrderAssignedMeasure(addmeasurereportdata)
          .then(res => {
            if (res.status === 200) {
              this.$message.success("测量汇报成功");
              this.$router.push({ path: "measuremanage" });
              this.$emit('loadingFn',false)
            } else {
              this.$emit('loadingFn',false)
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            this.$emit('loadingFn',false)
            console.error(
              "指派测量:测量汇报提交 order/measuremanage/measuredetails.vue",
              error
            );
          });
      });
    },
    cliaddfun() {
      this.addmassge = true;
    },
    //上传
    uploadSectionFile(res) {
      let arr = [];
      put(res).then(data => {
        arr.push(data);
        this.addmeasurereportdata.TechnologyList = arr;
      });
    },
    //刪除
    handleRemove(file) {
      let lengs = String(file.raw.uid).length;
      this.addmeasurereportdata.TechnologyList = this.addmeasurereportdata.TechnologyList.filter(
        item => {
          let str = item.name.substring(0, lengs);
          return str !== String(file.raw.uid);
        }
      );
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.titlecals {
  font-size: 18px;
  position: relative;
  font-weight: 500;
  color: #006ec7;
  margin: 0px 35px;
  top: -20px;
}
.map {
  width: 100%;
  height: 400px;
  .anchorBL {
    　　　　display: none;
  }
}
.addmeasurereport {
  .el-form-item{
    margin-bottom: 10px;
  }
  .addresbox {
    display: flex;
    .explaintxttwo {
      min-width: 70px;
      display: block;
      padding-left: 10px;
      text-align: center;
    }
  }
  .map {
    width: 100%;
    height: 500px;
    .map_input {
      width: 350px;
      height: 30px;
    }
    .map_searchinfo {
      width: 350px;
      max-height: 450px;
      overflow: auto;
    }
  }
  .addresslist {
    display: flex;
    flex-wrap: nowrap;
    // justify-content: space-between;
    // align-items: center;
    .input-with-select {
      width: 30%;
    }
    .max_w {
      min-width: 60px;
      width: 60px;
    }
    .addressStyle {
      display: flex;
      flex-wrap: nowrap;
    }
    .addresele {
      max-width: 150px;
    }
    > div {
      // margin-left: 5px;
    }
  }
}
</style>

