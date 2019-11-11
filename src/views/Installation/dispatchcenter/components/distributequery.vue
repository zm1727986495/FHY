<template>
<div>
  <div class="distribute">
    <el-row :gutter="10" class="queryForm">
        <el-col :span="span">
          <el-input @keyup.enter.native='queryFun()' placeholder="订单号/合同号/采购单/客户姓名/电话" v-model="beforIn.installationOrderGroup" :size="size" maxlength="50" clearable></el-input>
        </el-col>
        <!-- <el-col :span="span">
          <el-input placeholder="商品名称" @keyup.enter.native='queryFun()' v-model="beforIn.commodityName" :size="size" maxlength="50" clearable></el-input>
        </el-col> -->
         <el-col :span="span">
          <el-date-picker
            :size="size"
            v-model="installationTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="预计开始安装时间"
            end-placeholder="预计安装结束时间"
            @change="installationChange"
          ></el-date-picker>
        </el-col>
        <el-col :span="span">
          <el-date-picker
            :size="size"
            v-model="acceptanceTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="接单开始时间"
            end-placeholder="接单结束时间"
            @change="accepChange"
          ></el-date-picker>
        </el-col>
        <el-col :span="span">
          <el-date-picker
            :size="size"
            v-model="dataValue"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="订单完成开始时间"
            end-placeholder="订单完成结束时间"
            @change="pickerFn"
          ></el-date-picker>
        </el-col>
        
        <el-col :span="span" v-if="showInput">
          <el-date-picker
            :size="size"
            v-model="appointmentTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="预约开始上门时间"
            end-placeholder="预约结束上门时间"
            @change="appointmentChange"
          ></el-date-picker>
        </el-col>
        
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="选择订单类型" v-model="beforIn.orderClassify" :size="size">
            <el-option v-for="item in orderType" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="工厂交货情况" v-model="beforIn.stockQuery" :size="size">
            <el-option v-for="item in inventoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="订单状态" multiple v-model="beforIn.orderStatus" :size="size">
            <el-option v-for="item in orderStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="物流配送类型" v-model="beforIn.distributionType" :size="size">
            <el-option
              v-for="item in distributionTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="品牌" v-model="beforIn.brand" :size="size">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="品类" v-model="beforIn.classify" :size="size">
            <el-option
              v-for="item in categoryList"
              :key="item.commodityCategoryId"
              :label="item.categoryName"
              :value="item.commodityCategoryId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="门店" v-model="beforIn.branch" :size="size">
            <el-option
              v-for="item in storeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="订单来源" v-model="beforIn.orderSource" :size="size">
            <el-option
              v-for="item in styleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="选择接单安装部" v-model="beforIn.takeInstallGroup" :size="size">
            <el-option
              v-for="item in serveOptions"
              :key="item.serveGroupId"
              :label="item.serveGroupName"
              :value="item.serveGroupId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="仓库" v-model="beforIn.entrepot" :size="size">
            <el-option
              v-for="item in storageList"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-select placeholder="延期单选择" v-model="beforIn.delaySingle" :size="size">
            <el-option v-for="item in delayList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="showInput">
          <el-input v-model="beforIn.region" placeholder="地区" :size="size" clearable></el-input>
        </el-col>
        <!-- <el-col :span="span">
          <span class="fontMore cursors" @click="fontClick()">{{showInput ? '收起' : '更多'}}</span>
          <el-button type="warning" class="button-fc" :size="size" @click="queryFun">查询</el-button>
          <el-button type="primary" :size="size" @click="resetFun">重置</el-button>
          <el-button type="success" :size="size" @click="exportFun">导出</el-button>
        </el-col> -->
    </el-row>
    <div class="widthStyle">
      <span class="fontMore cursors" @click="fontClick()">{{showInput ? '收起' : '更多'}}</span>
      <el-button type="warning" class="button-fc" :size="size" @click="queryFun" :loading='loading'>查询</el-button>
      <el-button type="primary" :size="size" @click="resetFun">重置</el-button>
      <el-button type="success" :size="size" @click="exportFun">导出</el-button>
    </div>
  </div>
</div>
</template>
<script>
import { listBrand } from "api/common/common";
import { mapGetters }  from 'vuex';
import {
  getStorageList,
  listCategory,
  listStore
} from "api/Installation/dispatchcenter/dispatchcenter";
import { listServeGroup } from "@/api/systemcenter/department";
import { getToken } from '@/utils/auth';
import FileSaver from "file-saver";
import XLSX from "xlsx";
import module from "../../../../../config/index";
export default {
  props: ["orderStatus",'loading','locationStr','activeName'],
  data() {
    return {
      span:6,
      styleList: [],
      acceptanceTime: [], //接单时间
      installationTime: [], //预计安装时间
      appointmentTime: [], //预约上门时间
      serveOptions: [], //安装部列表
      dataValue:[],
      //订单类型
      orderType: [
        {
          name: "正单",
          id: "0"
        },
        {
          name: "增单",
          id: "1"
        },
        {
          name: "补单",
          id: "2"
        },
        {
          name: "遗留单",
          id: "3"
        },
        {
          name: "上样",
          id: "4"
        },
        {
          name: "撤样",
          id: "5"
        },
        {
          name: "调拨入库",
          id: "6"
        },
        {
          name: "换货入库",
          id: "7"
        },
        {
          name: "退货入库",
          id: "8"
        },
        {
          name: "退库入库",
          id: "9"
        },
        {
          name: "手动入库",
          id: "10"
        },
        {
          name: "接口入库",
          id: "11"
        },
        {
          name: "回库入库单",
          id: "12"
        },
        {
          name: "备货入库",
          id: "13"
        }
      ],
      //配送类型
      distributionTypeList: [
        {
          name: "送装一体",
          id: "1"
        },
        {
          name: "送装分离",
          id: "2"
        }
      ],
      //工厂交货情况
      inventoryList: [
        {
          name: "待确认",
          id: "0"
        },
        {
          name: "存在交期异常",
          id: "1"
        },
        {
          name: "安全正常交货",
          id: "2"
        }
      ],
      //品牌
      brandList: [],
      //品类
      categoryList: [],
      //门店
      storeList: [],
      //仓库
      storageList: [],
      //延期
      delayList: [
        {
          name: "未延期",
          id: "0"
        },
        {
          name: "延期",
          id: "1"
        }
      ],
      showInput: false,
      beforIn: { orderStatus: [] } //查询条件
    };
  },
  created() {
    let start = new Date()
    start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    this.dataValue[0] = start
    this.dataValue[1] = new Date((new Date).getTime() + 24*60*60*1000);

    this.$set(this.beforIn,'installCompleteStartTime',this.getNowFormatDate(this.dataValue[0]))
    this.$set(this.beforIn,'installCompleteEndTime',this.getNowFormatDate(this.dataValue[1]));
  },
  mounted() {
    this.getBrand();
    this.getListCategory();
    this.getStore();
    this.getstorage();
    this.listServeGroup();
  },
  watch: {
    // activeName(val){
    //   console.log(val,'===========');
      
    //   if(val=='stepsFour'){
    //     let start = new Date()
    //     start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    //     this.dataValue[0] = start
    //     this.dataValue[1] = new Date((new Date).getTime() + 24*60*60*1000);
    //     this.$set(this.beforIn,'installCompleteStartTime',this.dataValue[0])
    //     this.$set(this.beforIn,'installCompleteEndTime',this.dataValue[1]);
    //   }else{
    //     this.dataValue = [];
    //   }
    // }
  },
  methods: {
    pickerFn() {
      if(this.dataValue&&this.dataValue.length != 0){
        let str =
          new Date(this.dataValue[1]).getTime() -
          new Date(this.dataValue[0]).getTime();
        if (str <= 7776000000) {
          this.beforIn.installCompleteStartTime = this.dataValue[0];
          this.beforIn.installCompleteEndTime = this.dataValue[1];
        } else {
          this.$message.error("时间不能大于90天!");
          this.dataValue = [];
          this.beforIn.installCompleteStartTime = '';
          this.beforIn.installCompleteEndTime = '';
        }
        console.log(this.beforIn,'============');
      }else{
        this.dataValue = [];
        this.beforIn.installCompleteStartTime = '';
        this.beforIn.installCompleteEndTime = '';
      }
    },
    //获取安装数据
    listServeGroup() {
      listServeGroup().then(res => {
        this.serveOptions = res.data.rows;
      });
    },
    //获取品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.brandList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取品类
    getListCategory() {
      listCategory()
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //获取门店
    getStore() {
      listStore()
        .then(res => {
          this.storeList = res.data;
        })
        .catch(error => {
          console.error("获取门店", error);
        });
    },
    //获取仓库
    getstorage() {
      getStorageList()
        .then(res => {
          this.storageList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    },
    //接单时间改变
    accepChange() {
      this.beforIn.takeStartTime = this.acceptanceTime? this.acceptanceTime[0]: "";
      this.beforIn.takeEndTime = this.acceptanceTime? this.acceptanceTime[1]: "";
    },
    //预计安装时间
    installationChange() {
      this.beforIn.startInstallTime = this.installationTime? this.installationTime[0]: "";
      this.beforIn.endInstallTime = this.installationTime? this.installationTime[1]: "";
    },
    appointmentChange() {
      this.beforIn.visitStartTime = this.appointmentTime? this.appointmentTime[0]: "";
      this.beforIn.visitEndTime = this.appointmentTime? this.appointmentTime[1]: "";
    },
    //查询
    queryFun() {
      this.$emit("switchTab", this.beforIn, 1);
    },
    //重置
    resetFun() {
      this.beforIn = {};
      this.acceptanceTime = []; //接单时间
      this.installationTime = []; //预计安装时间
      this.appointmentTime = []; //预约上门时间
      this.dataValue = [];
      this.$emit("switchTab", this.beforIn, 1);
    },
    //导出
    exportFun() {
    //  var fix = document.querySelector('.el-table__fixed');
    //       var wb;
    //       if (fix) {
    //         wb = XLSX.utils.table_to_book(document.querySelector('#pathtabs_table').removeChild(fix));
    //         document.querySelector('#pathtabs_table').appendChild(fix);
    //       } else {
    //         wb = XLSX.utils.table_to_book(document.querySelector('#pathtabs_table'));
    //       }

    //     var wbout = XLSX.write(wb, {
    //       bookType: "xlsx",
    //       bookSST: true,
    //       type: "buffer"
    //     });
    //     try {
    //       FileSaver.saveAs(
    //         new Blob([wbout], { type: "application/octet-stream" }),
    //         "导出安装.xlsx"
    //       );
    //     } catch (e) {
    //       console.log(e);
    //     }
    //

      /**
       * @param commodityName 订单号
       * @param startInstallTime 预计安装开始时间
       * @param endInstallTime 预计安装结束时间
       * @param installCompleteStartTime 订单完成开始时间
       * @param installCompleteEndTime 订单完成结束时间
       * @param takeStartTime 接单开始时间
       * @param takeEndTime 接单结束时间
       * @param visitStartTime 预约开始上门时间
       * @param visitEndTime 预约结束上门时间
       * @param orderClassify 选择订单类型
       * @param stockQuery 工厂交货情况
       * @param orderStatus 订单状态
       * @param distributionType 物流配送类型
       * @param brand 品牌
       * @param classify 品类
       * @param branch 门店
       * @param orderSource 订单来源
       * @param takeInstallGroup 选择接单安装部
       * @param entrepot 仓库
       * @param delaySingle 延期单选择
       * @param region 地区
      */


      let { installationOrderGroup,commodityName,startInstallTime,endInstallTime,installCompleteStartTime,installCompleteEndTime,takeStartTime,
      takeEndTime,visitStartTime,visitEndTime,orderClassify,stockQuery,orderStatus,distributionType,brand,classify,branch,orderSource,
      takeInstallGroup,entrepot,delaySingle,region} = this.beforIn;

       installationOrderGroup = installationOrderGroup?`&installationOrderGroup=${installationOrderGroup}`:'';
       commodityName = commodityName?`&commodityName=${commodityName}`:'';
       startInstallTime = startInstallTime?`&startInstallTime=${startInstallTime}`:'';
       endInstallTime = endInstallTime?`&endInstallTime=${endInstallTime}`:'';
       //判断当前tab是否是已完成
       if(this.activeName == 'stepsFour'){
          installCompleteStartTime = installCompleteStartTime?`&installCompleteStartTime=${installCompleteStartTime}`:'';
          installCompleteEndTime = installCompleteEndTime?`&installCompleteEndTime=${installCompleteEndTime}`:'';
       }else{
         installCompleteStartTime=''
         installCompleteEndTime=''
       }
       takeStartTime = takeStartTime?`&takeStartTime=${takeStartTime}`:'';
       takeEndTime = takeEndTime?`&takeEndTime=${takeEndTime}`:'';
       visitStartTime = visitStartTime?`&visitStartTime=${visitStartTime}`:'';
       visitEndTime = visitEndTime?`&visitEndTime=${visitEndTime}`:'';
       orderClassify = orderClassify?`&orderClassify=${orderClassify}`:'';
       stockQuery = stockQuery?`&stockQuery=${stockQuery}`:'';
       orderStatus = orderStatus.length?`&orderStatus=${orderStatus.join(',')}`:'';
       distributionType = distributionType?`&distributionType=${distributionType}`:'';
       brand = brand?`&brand=${brand}`:'';
       classify = classify?`&classify=${classify}`:'';
       branch = branch?`&branch=${branch}`:'';
       takeInstallGroup = takeInstallGroup?`&takeInstallGroup=${takeInstallGroup}`:'';
       entrepot = entrepot?`&entrepot=${entrepot}`:'';
       delaySingle = delaySingle?`&delaySingle=${delaySingle}`:'';
       region = region?`&region=${region}`:'';
      let str = module.dev.proxyTable["/api"].target+`/api/pc/installationOrder/exportInstallationOrder?token=${getToken()}&location=${this.locationStr}&installationType=1${installationOrderGroup}${commodityName}${startInstallTime}${endInstallTime}${installCompleteStartTime}${installCompleteEndTime}${takeStartTime}${takeEndTime}${visitStartTime}${visitEndTime}${orderClassify}${stockQuery}${orderStatus}${distributionType}${brand}${classify}${branch}${takeInstallGroup}${entrepot}${delaySingle}${region}`
      window.location.href = str;
    },
    //将时间格式转化成字符串
    getNowFormatDate(date) {
//        let date = new Date();
       var seperator1 = "-";
       var seperator2 = ":";
       var strYear = date.getFullYear();
       var strMonth = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
       var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
       var strHours = date.getHours()<10? "0" + date.getHours():date.getHours();
       var strMinutes = date.getMinutes()<10? "0" + date.getMinutes():date.getMinutes();
       var strSeconds = date.getSeconds()<10? "0" + date.getSeconds():date.getSeconds();
       var currentdate = strYear + seperator1  + strMonth  + seperator1  + strDate ;
       return currentdate;
     },
    //收起
    fontClick() {
      this.showInput = !this.showInput;
    }
  },
  computed: {
    ...mapGetters([
      'size',
      // 'span'
    ])
  }
};
</script>
<style lang='scss' scoped>
.distribute{
  display: flex;
  justify-content:space-between;
}
.widthStyle{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 270px;
  height: 40px;
}
.fontMore {
  color: #d0cfcf;
  min-width: 40px;
  text-align: right;
}
</style>
