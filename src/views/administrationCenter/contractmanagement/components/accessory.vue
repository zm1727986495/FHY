<template>
  <div class="accessory">
    <div class="btnList clearfix">
      <!-- 按钮 -->
      <el-button :type="item.id === accessoryType ? 'primary' : ''"
        v-for="item in btnList" :size="btnSize"
        @click="searchAccessory(item.id)" :key="item.id">
        {{ item.value }}
      </el-button>
    </div>
    <div v-loading="loading">
      <!-- 非合同列表 -->
      <div class="table_list unsortable" v-if="accessoryType != 5" key="accessoryType">
        <el-table :data="tableListUploadNewest" max-height="200">
          <el-table-column width="100" align="center" v-if="btnswatch && isCanUpload || accessoryType != 6">
            <template slot="header" slot-scope="scope">
              <el-button size="mini" type="primary" class="upbtnclas" @click="uploadfil">上传</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="hreffun(scope.row)">下载</el-button>
              <el-button type="text" @click="handleDelete(scope.row.accessoryId)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="accessoryType" label="附件类型" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" prop="sourceName" label="附件名称" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="table_action_span">{{scope.row.sourceName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="上传时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createName" label="上传人" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination_wrap">
          <pagination :current-page="currentPage" :pageSize="pageSize" :total="total"
                      @sizeChange="handleSizeChange" @currentChange="handleCurrentChange">
          </pagination>
        </div>
      </div>
      <!-- 合同列表 -->
      <div class="table_list unsortable" v-if="accessoryType == 5" key="accessoryType5">
        <el-table :data="tableListUploadNewest" max-height="200">
          <!-- <el-table-column width="100px" align="center">
            <template slot="header" slot-scope="scope">
              <el-button size="mini" type="primary" class="upbtnclas" @click="uploadfil">上传</el-button>
            </template>
            <template slot-scope="scope">
              <div></div>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="previewContract" :loading="previewLoading">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="contractSerialNumber" label="合同编码" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" prop="contractState" label="合同状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <p v-if="scope.row.contractState == 0">合同待生成</p>
              <p v-else-if="scope.row.contractState == 1">待签署</p>
              <p v-else-if="scope.row.contractState == 2">合同生效</p>
              <p v-else-if="scope.row.contractState == 3">合同作废</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="signingTime" label="签合同日期" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination_wrap">
          <pagination :current-page="currentPage" :pageSize="pageSize" :total="total"
            @sizeChange="handleSizeChange" @currentChange="handleCurrentChange">
          </pagination>
        </div>
      </div>
      <!-- 下载记录 -->
      <div class="titlecals" v-if="accessoryType != 5">下载记录</div>
      <div class="table_list unsortable" v-if="accessoryType != 5">
        <el-table :data="tableListUploadHistory" border max-height="300">
          <el-table-column align="center" prop="accessoryType" label="附件类型" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" prop="accessoryName" label="附件名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="uploadTime" label="上传时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="downloadTime" label="下载时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createName" label="下载人" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination_wrap">
          <pagination :current-page="currentPageHistory" :pageSize="pageSizeHistory" :total="totalHistory"
            @sizeChange="handleSizeChangeHistory" @currentChange="handleHistory">
          </pagination>
        </div>
      </div>
    </div>
    <!-- 上传 -->
    <el-dialog title="上传" :visible.sync="visibleDialogs" :modal="false" width="50%" custom-class="customDialogTitle">
      <div v-if="visibleDialogs">
        <el-form label-position="right" label-width="100px" class="demo-form-inline">
          <!-- <el-form-item label="附件类型" required>
            <el-select v-model="vals" placeholder="请选择附件类型" :size="size" class="selewi">
              <el-option :label="itm.dictName" :value="itm.dataCode" v-for="itm in accesslist" :key="itm.dataCode"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="上传">
            <el-upload action="string" :limit='1' :http-request="uploadSectionFile">
              <el-button size="small" class="button-96" style="height:35px;">上传附件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="uploading" @click="subminbtn">确 定</el-button>
        <el-button @click="visibleDialogs = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { put, getBuffer } from "@/utils/pubilcFn";
  import pagination from '@/views/components/pagination'
  import spot from '@/assets/images/spot.png';
  import module from '../../../../../config/index.js';
  import { mapGetters } from 'vuex';
  import { 
    contractAccessoryManagement, // 合同附件管理列表
    accessoryManagement, // 附件管理列表
    downloadRecordList, // 附件下载记录
    removeAccessoryImgById, // 删除附件
    addAccessorys, // 保存附件
    uploadOrderPicture, // 上传下单图
    accessoryTypef, // 附件类型
    fileDownload, // 附件类型
  } from 'api/order/order/order';
  import { getPreviewContract } from 'api/order/contract/contract';
  export default {
    name: 'accessory',
    components: {
      pagination
    },
    props: {
      orderId: "",
      contractId: '',
      isDialog: {
        type: Boolean,
        default: false
      },
      accessoryTypes: {
        type: Number,
        default: 1
      },
      btns: {
        type: Array,
        default: () => []
      },
      btnswatch: { // 上传按钮开关
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        uploading: false,
        loading: true,
        previewLoading: false, // 合同点击查看按钮
        accesslist: [],
        orderIds: this.orderId || this.$route.query.orderId,
        contractIds: this.contractId || this.$route.query.contractId,
        vals: "",
        fileUrl: "",
        urldatas: {},
        sourceName: "",
        Brandli: [
          {brandName: "收费附件",brandId: 1},
          {brandName: "测量附件",brandId: 2},
          {brandName: "下单图",brandId: 3},
        ],
        visibleDialogs: false,
        span: 6,
        spot,
        btnListAll: [
          { id: 1, value: '订单跟进附件' },
          { id: 2, value: '收费附件' },
          { id: 3, value: '测量附件' },
          { id: 6, value: '下单图' },
          { id: 5, value: '合同' },
          { id: 4, value: '设计附件' },
          { id: 7, value: '送货附件' },
          { id: 8, value: '安装附件' },
          { id: 9, value: '定责附件' },
          { id: 10, value: '外部人推荐附件' },
          { id: 11, value: '上传量尺单' }
        ],
        btnList: [],
        accessoryType: this.accessoryTypes, // 附件类型
        tableListUploadNewest: [],
        tableListUploadHistory: [],
        total: 0,    // 总数
        pageSize: 10,  // 单页条数
        currentPage: 1, // 当前页
        totalHistory: 0,    // 总数下载记录
        pageSizeHistory: 10,  // 单页条数下载记录
        currentPageHistory: 1 // 当前页下载记录
      }
    },
    created() {
      if (this.btns.length) {
        this.btnList = this.btnListAll.filter(item => this.btns.some(ele => ele === item.id));
      } else {
        this.btnList = this.btnListAll;
      }
      // 附件列表
      this.accessorfun();
      // 下载记录
      this.historyfun();
    },
    methods: {
      hreffun(val){
        this.loading = true;
        // 获取下载记录
        let data = {
          accessoryId: val.accessoryId,
          orderId: this.orderIds,
        }
        fileDownload(data).then(res =>{
          if(res.status == 200){
            this.loading = false;
            // 下载到本地
            getBuffer(val.sourceName).then(data=>{
              var a = document.createElement('a');
              a.href = data;
              a.download = data;
              document.body.appendChild(a);
              a.click();
              // 下载记录
              this.historyfun();
            }).catch(err => {
              this.loading = true;
              console.log(err);
            })
          }
        }).catch(error =>{
          this.loading = false;
          console.log('附件下载记录 administrationCenter/contractmanagement/components/accessory.vue', error);
        })
      },
      uploadSectionFile(res){
        put(res).then(data=>{
          this.urldatas = data;
          this.fileUrl = data.url;
          this.sourceName = data.name;
        })
      },
      subminbtn(){
        // if(this.vals === ""){
        //   this.$message.warning("请选择附件类型");
        //   return false
        // }
        if(this.fileUrl === ""){
          this.$message.warning("请上传附件");
          return false
        }
        let data = {
          orderId: this.orderIds,
          dataCode: "",
          newAccessoryFile: [{
            fileUrl: this.fileUrl,
            sourceName: this.sourceName
          }]
        }
        this.uploading = true;
        if(this.accessoryType == 11){// 上传量尺单
          data.dataCode = "MeasureSingleAccessory"
          addAccessorys(data).then(res =>{
            if(res.status == 200){
              this.$message.success("上传成功");
              this.visibleDialogs = false;
              this.accessorfun();
              this.uploading = false;
            }
          }).catch(error =>{
            this.uploading = false;
            console.log('附件下载记录 administrationCenter/contractmanagement/components/accessory.vue', error);
          })
        }else if(this.accessoryType == 6){// 上传下单图
          let plase = {
            orderId: this.orderIds,
            dataCode: "PlaceOrderAccessory",
            placeOrderFigure: [{
              fileUrl: this.fileUrl,
              sourceName: this.sourceName
            }]
          }
          uploadOrderPicture(plase).then(res =>{
            if(res.status == 200){
              this.uploading = false;
              this.$message.success("上传成功");
              this.visibleDialogs = false;
              this.accessorfun();
            }
          }).catch(error =>{
            this.uploading = false;
            console.log('附件下载记录 administrationCenter/contractmanagement/components/accessory.vue', error);
          })
        }
      },
      uploadfil(){
        this.visibleDialogs = true;
        accessoryTypef().then(res =>{
          this.accesslist = res.data.rows;
        }).catch(error =>{
          console.log('附件类型 administrationCenter/contractmanagement/components/accessory.vue', error);
        })
      },
      //分页函数回调
      handleCurrentChange(val) {
        this.currentPage = val;
        this.accessorfun();
      },
      // 单页条数改变
      handleSizeChange(val){
        this.pageSize = val;
        this.accessorfun();
      },
      //分页函数回调下载记录
      handleHistory(val) {
        this.currentPageHistory = val;
        this.historyfun()
      },
      // 单页条数改变下载记录
      handleSizeChangeHistory(val){
        this.pageSizeHistory = val;
        this.historyfun()
      },
      historyfun(){
        let data = {
          orderId: this.orderIds,
          page: this.currentPageHistory,
          limit: this.pageSizeHistory,
          accessoryType: this.accessoryType
        }
        downloadRecordList(data).then(res =>{
          if(res.status == 200){
            this.tableListUploadHistory = res.data.rows;
            this.totalHistory = res.data.total
          }
        }).catch(error =>{
          console.log('附件下载记录 administrationCenter/contractmanagement/components/accessory.vue', error);
        })
      },
      accessorfun(){
        this.loading = true;
        if(this.accessoryType == 5){
          let data = {
            orderId: this.orderIds,
            page: this.currentPage,
            limit: this.pageSize,
          }
          contractAccessoryManagement(data).then(res =>{
            if(res.status == 200){
              this.loading = false;
              this.tableListUploadNewest = res.data.rows;
              this.total = res.data.total
            }
          }).catch(error =>{
            this.loading = false;
            console.log('附件管理列表 administrationCenter/contractmanagement/components/accessory.vue', error);
          })
        }else{
          this.loading = true;
          let data = {
            orderId: this.orderIds,
            accessoryType: this.accessoryType,
            page: this.currentPage,
            limit: this.pageSize,
          }
          if(this.accessoryType == 3 || this.accessoryType == 4){
            data.accessoryType2 = 1
          }
          accessoryManagement(data).then(res =>{
            if(res.status == 200){
              this.loading = false;
              this.tableListUploadNewest = res.data.rows;
              this.total = res.data.total
            }
          }).catch(error =>{
            console.log('附件管理列表 administrationCenter/contractmanagement/components/accessory.vue', error);
          })
        }
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 点击按钮
      searchAccessory(accessoryType) {
        this.accessoryType = accessoryType;
        this.currentPage = 1;
        this.total = 0;
        this.accessorfun();
        this.historyfun();
      },
      // 删除附件
      handleDelete(val) {
        let data = {
          orderId: this.orderIds,
          accessoryId: val
        }
        removeAccessoryImgById(data).then(res =>{
          if(res.status == 200){
            this.$message.success("成功删除附件");
            this.accessorfun();
          }
        }).catch(error =>{
          console.log('附件管理列表 administrationCenter/contractmanagement/components/accessory.vue', error);
        })
      },
      // 合同附件预览
      previewContract() {
        this.previewLoading = true;
        let data = {
          orderId: this.orderIds,
          customerContractId: this.contractIds
        };
        getPreviewContract(data).then(res =>{
          this.previewLoading = false;
          if (res.status == 200) {
            window.open('https://fanhuayiju.oss-cn-beijing.aliyuncs.com/' + res.data);
          } else {
            this.$message.error(res.message || '获取合同附件失败');
          }
        }).catch(error =>{
          this.previewLoading = false;
          console.log('views/contractmanagement/components/accessory.vue-previewContract:' + error);
        })
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight',
        'btnSize',
        'size'
      ]),
      isCanUpload() {
        // 只有驳回状态和没有图纸才能上传
        let arr = [];
        if (this.tableListUploadNewest.length) {
          this.tableListUploadNewest.forEach(item => {
            if (item.drawingAuditStatus != 2) {
              arr.push(item); // 未审核、通过  不可上传
            }
          })
        }
        return (!arr.length && this.tableListUploadNewest.length) || !this.tableListUploadNewest.length;
      }
    }
  }
</script>

<style scoped lang="scss">
  .accessory{
    .btnList{
      button{
        margin-bottom: 10px;
      }
    }
    .table_list{
      margin-top: 10px;
    }
    .ope-btn{
      margin: 0 5px;
    }
    .titlecals{
      top: 0;
      margin: 10px 35px;
    }
    .upbtnclas{
      padding: 7px 15px;
    }
  }
</style>
