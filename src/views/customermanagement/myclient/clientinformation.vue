
<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class="page_head_div">
        <span class="page_head_div_title">客户信息</span>
        <span class="page_head_div_id">客户ID：C1806220001</span>
      </div>
      <div class="pageTitle">查询条件</div>-->
      <!-- 查询条件组 -->
      <el-tabs type="border-card">
        <el-tab-pane label="客户信息">
          <table class="tab_class">
            <tr>
              <td>
                <span class="befor_text_bold">客户姓名：</span>
                {{userInfo.customerName}}
              </td>
              <td colspan="2">
                <span class="befor_text_bold">性别：</span>
                <span v-if="userInfo.customerSex=='1'">男</span>
                <span v-if="userInfo.customerSex=='2'">女</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="befor_text_bold">客户电话：</span>
                {{userInfo.customerPhone}}
              </td>
              <td colspan="2">
                <span class="befor_text_bold">备用电话：</span>
                {{userInfo.otherPhone}}
              </td>
            </tr>
            <tr>
              <td>
                <span class="befor_text_bold">年龄段：</span>
                {{userInfo.ageGroupName}}
              </td>
              <td>
                <span class="befor_text_bold">所属门店：</span>
                {{userInfo.storeName}}
              </td>
              <td>
                <span class="befor_text_bold">负责人：</span>
                {{userInfo.liableName}}
              </td>
            </tr>
            <tr v-if="userInfo.map">
              <td>
                <span class="befor_text_bold">客户来源：</span>
                {{userInfo.map.customerSourcePname}}
              </td>
              <td v-if="userInfo.map.customerSourcePid == '2'">
                <span class="befor_text_bold">推荐人：</span>
                {{userInfo.map.insideRefereeName}}
              </td>
              <td v-if="userInfo.map.customerSourcePid == '3'">
                <span class="befor_text_bold">外部推荐人：</span>
                {{userInfo.map.externalRefereeName}}
              </td>
              <td v-if="userInfo.map">
                <div v-if="userInfo.map.customerSourcePid == '2'">
                  <span class="befor_text_bold">推荐门店：</span>
                  {{userInfo.map.insideRecommendStoreName}}
                </div>
              </td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>

      <el-tabs @tab-click="tabclickH" type="border-card" class="m-top20">
        <el-tab-pane label="客户需求" name="0">
          <div class="table_warp_box">
            <!-- 按钮组 -->
            <div class="warp_head_action_btn fr border_none">
              <el-button type="primary" @click="addCustomerDemand">新增</el-button>
              <el-button type="default" @click="delCustomerDemand(tableSelectList)">删除</el-button>
            </div>
            <!-- 表格 -->
            <div class="table_list lvs attribute">
              <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column sortable align="center" prop="id" label="操作">
                  <template slot-scope="scope">
                    <div>
                      <el-button class="operaItems" @click="createHandle(scope.row)">创建订单</el-button>
                      <el-button class="operaItems" @click="editCustomerDemand(scope.row)">编辑</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="str" label="需求标注" sortable align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.str}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable align="center" prop="housingTypeId" label="房屋类型">
                  <template slot-scope="scope">
                    <span v-if="scope.row.housingTypeId==1">新房</span>
                    <span v-else>老房</span>
                  </template>
                </el-table-column>
                <el-table-column sortable align="center" prop="housingTypeName" label="房屋户型"></el-table-column>
                <el-table-column sortable align="center" prop="housingArea" label="房屋总面积"></el-table-column>
                <el-table-column sortable align="center" prop="finishingTimeOfDecoration" label="装修完成时间"></el-table-column>
                <el-table-column sortable align="center" prop="demandStatus" label="状态"></el-table-column>
              </el-table>
              <div class="pagination_wrap">
                <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="客户订单" name="1">
          <div class="table_warp_box">
            <!-- <div class="order_search_form">
              <el-input placeholder="订单号/订单地址" v-model="oderform.names" style="width:250px;margin-right:20px;"></el-input>
              <el-date-picker v-model="searchData2" style="width:250px;margin-right:20px;" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                @change="datapickChange2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              <el-button type="primary" @click="searchOrderList" size="mini">查询</el-button>
            </div> -->
            <div class="table_list lvs attribute">
              <el-table :row-class-name="tableRowClassName" border :data="tabList" style="width: 100%;">
                <el-table-column prop="orderNumber" label="订单编号" width="240" sortable align="center">
                  <template slot-scope="scope">
                    <p
                      class="table_action_span"
                      @click="orderdetail(scope.row)"
                    >{{scope.row.orderNumber}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="orderType" label="订单类型" width="240" sortable align="center">
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.orderType==0">正单</p>
                      <p v-if="scope.row.orderType==1">增单</p>
                      <p v-if="scope.row.orderType==2">补单</p>
                      <p v-if="scope.row.orderType==3">遗留单</p>
                      <p v-if="scope.row.orderType==4">退货单</p>
                      <p v-if="scope.row.orderType==5">上样</p>
                      <p v-if="scope.row.orderType==6">撤样</p>
                      <p v-if="scope.row.orderType==7">退款</p>
                      <p v-if="scope.row.orderType==8">换货</p>
                      <p v-if="scope.row.orderType==9">第三方订单</p>
                      <p v-if="scope.row.orderType==10">售后问题</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderStatusName" label="订单状态" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="orderGoodsType" label="订单货品类型" width="240" sortable align="center">
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.orderGoodsType==1">成品</p>
                      <p v-if="scope.row.orderGoodsType==2">订制品</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="reportedType" label="报备类型" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="brandName" label="产品品牌" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="categoryName" label="产品类别" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="contractMoney" label="合同金额" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="paymentAmount" label="收款金额" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="customerName" label="客户姓名" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="customerPhone" label="客户电话" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="address" label="订单地址" width="240" show-overflow-tooltip sortable align="center"></el-table-column>
                <el-table-column prop="createOrderTime" label="创建时间" width="240" sortable align="center"></el-table-column>
              </el-table>
              <div class="pagination_wrap">
                <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="银行账号" name="2">
          <div class="table_warp_box">
            <!-- 按钮组 -->
            <div class="warp_head_action_btn fr border_none">
              <el-button type="primary" @click="openDia3">新增</el-button>
              <el-button type="default" @click="delBankCard">删除</el-button>
            </div>
            <!-- 表格 -->
            <div class="table_list lvs attribute">
              <el-table
                :row-class-name="tableRowClassName"
                border
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="brandname" label="操作" width="120">
                  <template slot-scope="scope">
                    <div>
                      <el-button class="operaItems" @click="editHandle3(scope.row)">编辑</el-button>
                      <el-button class="operaItems" @click="delOneBankCard(scope.row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="accountName" label="开户名" sortable align="center"></el-table-column>
                <el-table-column prop="openingBankName" label="开户行" sortable align="center"></el-table-column>
                <el-table-column prop="bankCardNumber" label="银行卡号" sortable align="center"></el-table-column>
                <el-table-column prop="isDefault" label="是否默认" sortable align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isDefault==1">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination_wrap">
                <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
              </div>
            </div>

            <!-- 弹框页面 -->
            <div class="dialog_con_box">
              <el-dialog title :visible.sync="centerDialogVisible3" width="40%" :before-close="closeDia3">
                <div class="titlecals">银行账号</div>
                <div class="content_box">
                  <div class="warp_head_list">
                    <span class="title">开户行：</span>
                    <div class="head_nav_search_t">
                      <el-select v-model="editBankCard.openingBank" placeholder="请选择银行">
                        <el-option v-for="item in bankList3" :key="item.id" :label="item.dictName" :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>

                  <div class="warp_head_list">
                    <span class="title">开户名：</span>
                    <div class="head_nav_search_t">
                      <el-input placeholder="请输入开户名" v-model="editBankCard.accountName" maxlength="50"></el-input>
                    </div>
                  </div>

                  <!-- <div class="warp_head_list">
                    <span class="title">开户行：</span>
                    <div class="head_nav_search_t">
                      <el-input placeholder="请输入开户行" v-model="editBankCard.openingBank" maxlength="50"></el-input>
                    </div>
                  </div> -->

                  <div class="warp_head_list">
                    <span class="title">银行卡号：</span>
                    <div class="head_nav_search_t">
                      <el-input placeholder="请输入银行卡号" v-model="editBankCard.bankCardNumber" maxlength="50"></el-input>
                    </div>
                  </div>
                  <div class="warp_head_list">
                    <span class="title"></span>
                    <el-checkbox v-model="isDefault" value="false">是否默认</el-checkbox>
                  </div>
                </div>

                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addBankCard">确认</el-button>
                  <el-button @click="closeDia3">取消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="客户地址" name="3">
          <div class="table_warp_box">
            <!-- 按钮组 -->
            <div class="warp_head_action_btn fr border_none">
              <el-button type="primary" v-if="addShow" @click="addAddress">新增</el-button>
              <el-button type="default" @click="delAddress(tableSelectList)">删除</el-button>
            </div>

            <!-- 表格 -->
            <div class="table_list lvs attribute">
              <el-table
                :row-class-name="tableRowClassName"
                border
                @selection-change="handleSelectionChange"
                :data="addressData"
                style="width: 100%;"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="id" label="操作" width="100">
                  <template slot-scope="scope">
                    <div>
                      <el-button
                        class="operaItems"
                        v-if="scope.row.add!==1"
                        @click="editAddress(scope.row)"
                      >编辑</el-button>
                      <el-button class="operaItems" @click="delAddressOne(scope.row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="isDefault" label="是否默认" width="120" sortable align="center">
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.isDefault == 1">是</p>
                      <p v-else>否</p>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="add" label="地址">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.add != 1"
                    >{{scope.row.adddetails}} {{scope.row.addressArr[0]}} 楼号/区 {{scope.row.addressArr[1]}} 单元/号楼 {{scope.row.addressArr[2]}} 室</div>
                    <div v-else class="table_edit_column">
                      <div class="input_box">
                        <el-input
                          placeholder="地图定位"
                          v-model="maps"
                          maxlength="50"
                          :title="maps"
                          readonly
                          @focus="maplocation"
                        ></el-input>
                      </div>
                      <div class="input_box">
                        <el-input placeholder v-model.number="buildingNumber" maxlength="10"></el-input>
                        <div class="input_box_lou">楼号/区</div>
                      </div>
                      <div class="input_box">
                        <el-input placeholder v-model.number="unitNumber" maxlength="10"></el-input>
                        <div class="input_box_lou">单元/号楼</div>
                      </div>
                      <div class="input_box">
                        <el-input placeholder v-model.number="roomNumber" maxlength="10"></el-input>
                        <div class="input_box_lou">室</div>
                      </div>
                      <div class="input_box">
                        <el-checkbox v-model="isAddressDefault" value="false">是否默认</el-checkbox>
                      </div>
                      <div class="input_box">
                        <el-button type="default" @click="sendAddress" class="saveHandle_class">提交</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination_wrap">
                <!-- <el-pagination background layout="prev, pager, next" :pager-count="8" prev-text="上一页" next-text="下一页" :total="1000"></el-pagination> -->
                <pagination
                  :current-page="currentPage"
                  :pageSize="pageSize"
                  :total="total"
                  @sizeChange="sizeChange"
                  @currentChange="currentChange"
                ></pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="其他门店" name="4">
          <!-- 表格 -->
          <div class="table_list m-top20 lvs attribute">
            <el-table
              border
              :row-class-name="tableRowClassName"
              :data="tabList"
              style="width: 100%;"
            >
              <el-table-column prop="storeName" label="所属门店" sortable align="center"></el-table-column>
              <el-table-column prop="storeLeader" label="店长" sortable align="center"></el-table-column>
              <el-table-column prop="shopper" label="导购" sortable align="center"></el-table-column>
              <el-table-column prop="storePhone" label="联系方式" sortable align="center"></el-table-column>
            </el-table>
            <div class="pagination_wrap">
              <!-- <el-pagination background layout="prev, pager, next" :pager-count="8" prev-text="上一页" next-text="下一页" :total="1000"></el-pagination> -->
              <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
              ></pagination>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="联系记录" name="5">
          <div class="warp_head_action_btn fr border_none">
            <el-button type="primary" @click="addFollowRecord">新增</el-button>
            <el-button type="default" @click="delFollowRecord(tableSelectList)">删除</el-button>
          </div>
          <!-- 表格 -->
          <div class="table_list lvs attribute">
            <el-table
              border
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              :data="tabList"
              style="width: 100%;"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <el-button class="operaItems" @click="editFollowRecord(scope.row)">编辑</el-button>
                  <el-button class="operaItems" @click="delFollowRecord(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="contactWayId" label="客户联系方式" sortable align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.contactWayId==1">微信</span>
                  <span v-else-if="scope.row.contactWayId==2">电话</span>
                  <span v-else>座机</span>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="联系人" sortable align="center"></el-table-column>
              <el-table-column prop="followTime" label="联系时间" sortable align="center"></el-table-column>
              <el-table-column prop="remarks" label="联系内容" sortable align="center"></el-table-column>
            </el-table>
            <div class="pagination_wrap">
              <!-- <el-pagination background layout="prev, pager, next" :pager-count="8" prev-text="上一页" next-text="下一页" :total="1000"></el-pagination> -->
              <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
              ></pagination>
            </div>
          </div>
          <!-- 弹框页面 -->
          <div class="dialog_con_box">
            <el-dialog
              title
              :visible.sync="centerDialogVisible6"
              width="40%"
              :before-close="closeDia6"
            >
              <div class="titlecals">{{titleDialogVisible6}}</div>
              <div class="content_box">
                <div class="warp_head_list dia6">
                  <span class="title">联系方式：</span>
                  <div class="head_nav_search_t">
                    <el-select v-model="contentType6" placeholder>
                      <el-option
                        v-for="item in contentList6"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="warp_head_list dia6">
                  <span class="title">联系时间：</span>
                  <div class="head_nav_search_t">
                    <el-date-picker
                      class="wid_28vw"
                      v-model="followTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="-选择日期-"
                    ></el-date-picker>
                  </div>
                </div>
                <div class="warp_head_list m-top20">
                  <span class="title">备注：</span>
                  <div class="head_nav_search_t">
                    <el-input
                      placeholder="备注"
                      type="textarea"
                      v-model="note6"
                      maxlength="50"
                      resize="none"
                    ></el-input>
                  </div>
                </div>
              </div>

              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sendFollowRecord">保 存</el-button>
                <el-button @click="closeDia6">取 消</el-button>
              </span>
            </el-dialog>
          </div>
        </el-tab-pane>

        <el-tab-pane label="历史记录" name="6">
          <!-- <div class="warp_head_action_btn">
              <div class="head_nav_search_t">
              历史足迹
              </div>
              <div class="head_nav_btn">
              <el-input placeholder="店面/订单/业务人员" v-model="searchtext" maxlength="50"></el-input>
              <el-button type="default" @click="searchFun">搜索</el-button>
              </div>
          </div>-->
          <!-- 表格 -->
          <!-- <div class="table_list">
          <div class="step_history">
              <div class="step_historycell">
                  <div></div>
                  <span>欧派</span>
              </div>
          </div>
          </div>-->
        </el-tab-pane>

        <el-tab-pane label="修改日志" name="7">
          <!-- <div class="warp_head_action_btn">
            修改日志
          </div>-->
          <!-- 表格 -->
          <!-- <div class="table_list">
              <el-steps direction="vertical">
                  <el-step title="京北橱柜店导购李丽把客户性别“女”改成了“男”" description="2018-06-12   10:00"></el-step>
                  <el-step title="客户张三在微信个人中心里修改了个人资料，把客户姓名“张三”改成了“李四”" description="2018-06-10   10:00"></el-step>
                  
              </el-steps>
            
          </div>-->
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 地图弹框 -->
    <el-dialog title="地图" :visible.sync="mapDialogVisible" v-if="mapDialogVisible" custom-class="customDialogTitle" width="70%">
      <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="true">
        <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-control>
          <input type="text" v-model="keyword" placeholder="请输入搜索关键字" class="map_input"/>
          <bm-local-search
            class="map_searchinfo"
            :keyword="keyword"
            :auto-viewport="true"
            @infohtmlset = "infohtmlsets"
            :panel="true"
          ></bm-local-search>
        </bm-control>
      </baidu-map>
      <div slot="footer" style="margin-top: 0px;">
        <el-button @click="cancel" class="el-button--medium" type="primary" size="medium">取消</el-button>
        <el-button @click="confirm" class="button-fc" type="warning" size="medium">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import pagination from "../../components/pagination";
import spot from "@/assets/images/spot.png";
import { baiduMap } from "src/api/pulicJava.js";
import { listBaseDict //字典
} from "api/order/order/order";
import { listOrder } from "api/order/order/order";
import {
  getCustomerInfo, //编辑客户_获取客户信息
  listCustomerDemand, //客户名称_获取客户需求列表
  listOtherStore, //获取其他门店列表
  insertCustomerDemand, //新增客户需求
  updateCustomerDemand, //删除客户需求
  listCustomerRecommend, //我推荐客户列表
  listCustomerBankCard, //客户银行账号信息_获取列表
  insertCustomerBankCard, //客户银行账号_新增
  updateCustomerBankCard, //编辑银行账号_新增
  listCustomerAddress, //获取客户地址列表
  updateCustomerAddress, //修改客户地址信息
  insertCustomerAddress, //新增地址
  listFollowRecord, //客户联系记录_获取列表
  insertFollowRecord, //客户联系记录_新增
  updateFollowRecord //客户联系方式——编辑
} from "api/customermanagement/myclient/myclient";
export default {
  // name: 'brandmanagement',
  data() {
    return {
      //地图数据
      mapTitle: "地图定位", //地图弹出标题
      mapDialogVisible: false, // 地图是否隐藏

      buildingNumber: "", //楼号
      unitNumber: "", //单元
      roomNumber: "", //室
      addressData: [],
      changeAddress: "", //判断是编辑还是修改地址信息
      addShow: true,

      //百度地图
      mapText: "",
      value: Boolean,
      showMapComponent: this.value,
      keyword: "",
      poiObj:{},//地图红点取到的对象
      center: { lng: 116.404, lat: 39.915 }, //经纬度
      zoom: 15,
      maps: "", //地图信息

      //状态栏切换
      tablists: ["客户需求","客户订单","银行账号","客户地址","其他门店","联系记录","历史足迹","修改日志"],
      tabstatus: 0,

      isDefault: "", //添加银行卡选项中是否
      isAddressDefault: "", //添加地址是否默认
      spot,
      tabNumber: "",

      isinsert: true,
      editBankCard: {
        customerId: "", //客户id
        accountName: "", //开户名
        openingBank: "", //开户行,
        bankCardNumber: "" //银行卡号
      },

      statusstyle: "",
      pageSize: 20,
      total: 1,

      //头部面包屑导航
      navList: [],
      //头部日期选择
      searchData: [],
      //开始结束时间
      startTime: "",
      endTime: "",
      //默认展开的
      opentab: "1",
      // TABLE  页1

      //客户信息
      userInfo: {},

      tabList: [
        // {
        //   name: "张三",
        //   phone: "18879432548",
        //   brandname: "北京欧派",
        //   brandtype: "自营",
        //   type: 1, //0为禁用  1为启用
        //   id: 1
        // }
      ],
      tableSelectList: [],
      //分页
      currentPage: 1,
      totle: 100,
      //查询内容
      searchtext: "",
      //页面操作按钮list
      actionBtnList: [
        { name: "新增", style: "default", url: "/addbrand", type: 1 },
        { name: "删除", style: "default", url: "/addbrand", type: 3 }
      ],
      //分页
      currentPage2: 1,
      totle2: 100,
      //查询内容
      //头部日期选择
      searchData2: [],
      oderform: {},
      //开始结束时间
      startTime2: "",
      endTime2: "",
      //页面操作按钮list
      actionBtnList2: [],
      tableSelectList3: [],
      //分页
      currentPage3: 1,
      totle3: 100,
      //查询内容
      dialogTitle: "",
      centerDialogVisible3: false,
      //页面操作按钮list
      bankname3: "",
      bankcard3: "",
      countbank3: "",
      countname3: "",
      bankList3: [],

      // TABLE  页4
      tableSelectList4: [],
      tabList4: [
        {
          name: "张三",
          phone: "18879432548",
          brandname: "北京欧派",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1,
          isNew: 1,
          editFalg: 1
        }
      ],
      //分页
      currentPage4: 1,
      totle4: 100,
      //查询内容

      //页面操作按钮list
      actionBtnList4: [
        { name: "客户接收", style: "default", url: "/addbrand", type: 1 }
      ],

      // TABLE  页5
      tableSelectList5: [],
      //分页
      currentPage5: 1,
      totle5: 100,
      // TABLE  页6
      tableSelectList6: [],
      titleDialogVisible6: "",
      //分页
      currentPage6: 1,
      totle6: 100,
      centerDialogVisible6: false,
      contentType6: "",
      followTime: "", //联系时间
      contentList6: [
        { label: "微信", value: 1 },
        { label: "电话", value: 2 },
        { label: "座机", value: 3 }
      ],
      note6: "",
      followRecordId: ""
      //查询内容
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getYinHangFun('opening_bank');
    this.getUserInfo();
    this.getCustomerDemandList(); // 初始化调用获取客户需求列表接口
  },
  methods: {
    getYinHangFun(typeName){
      let data = {
        dataType: typeName
      };
      listBaseDict(data).then(res=>{
        this.bankList3 = res.data;
      })
    },

    //地图点击事件
    getClickInfo(e) {
      console.log(e, 12);
      this.center = {};
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },
    getClickInfo(e) {
      console.log(e, 12);
      this.center = {};
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },

    //地图确认按钮 
    confirm(){
      if(this.poiObj.address == undefined){
        this.$message.warning("请通过地图搜索位置")
      }else{
        this.maps = this.poiObj.address +"_"+ this.poiObj.title;
        this.mapDialogVisible = false;
        this.keyword = "";
      }
    },

    //点击取消
    cancel() {
      this.mapDialogVisible = false;
      this.keyword = "";
    },

    //地图搜索出来的红点点击事件
    infohtmlsets(poi) {
      this.poiObj = poi;
      this.center = poi.point;
    },

    //弹出地图框
    maplocation() {
      this.mapDialogVisible = true;
    },

    //获取订单列表
    searchOrderList() {
      this.currentPage = 1;
      this.getOrderList();
    },

    getOrderList() {
      let data = {
        ...this.oderform,
        customerId: this.$route.query.customerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listOrder(data).then(res => {
        this.tabList = res.data.rows;
        this.total = res.data.total;
      });
    },

    //跳订单详情
    orderdetail(obj) {
      this.$router.push({
        path: "/ordermm/details",
        query: {
          orderId: obj.orderId,
          orderNumber: obj.orderNumber
        }
      });
    },

    //获取客户地址
    getAddress() {
      let data = {
        customerId: this.$route.query.customerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listCustomerAddress(data)
        .then(res => {
          this.addressData = res.data.rows;
          this.total = res.data.total;
          for (let i = 0; i < this.addressData.length; i++) {
            let start;
            start = this.addressData[i].address.indexOf("#");
            this.addressData[i]["adddetails"] = this.addressData[
              i
            ].address.substring(0, start);
            this.addressData[i]["addressArr"] = this.addressData[i].address
              .substring(start + 1)
              .split("#");
          }
        })
        .catch(error => {
          console.log(
            "客户地址_获取列表 customermanagementmyclientcustomeradd",
            error
          );
        });
    },

    //编辑地址信息
    editAddress(val) {
      this.changeAddress = "编辑";
      console.log(val);
      console.log(val.isDefault == 1 ? true : false);

      if (this.addShow) {
        this.addressData.push({ add: 1 });
        this.buildingNumber = parseInt(val.addressArr[0]);
        this.unitNumber = parseInt(val.addressArr[1]);
        this.roomNumber = parseInt(val.addressArr[2]);
        this.center = {};
        this.center.lng = val.longitude;
        this.center.lat = val.latitude;
        this.customerAddressId = val.customerAddressId;
        this.isAddressDefault = val.isDefault == 1 ? true : false;
        this.mapDialogVisible = true;

        baiduMap(val.longitude, val.latitude).then(res => {
          console.log(res);
        });
      } else {
        this.$message.error("提交完当前编辑项后才能进行其他数据的编辑操作");
      }
      this.addShow = false;
    },

    //提交地址
    sendAddress() {
      if(this.buildingNumber == "" || this.unitNumber == "" || this.roomNumber == ""){
        this.$message.warning("请填写楼号，单元号，门牌号");
        return;
      }
      if(this.maps == "" ){
        this.$message.warning("请根据地图搜索位置选地址");
        return;
      }
      new Promise((resolve, reject)=>{
        baiduMap(this.center.lng, this.center.lat).then(res => { 
          resolve(res)
        })
      }).then(res=>{
          this.mapData = res;
          this.addressHandle();//提交处理地图的数据
      })
      
    },
    //提交处理地图的数据
    addressHandle(){
      this.addressData.splice(this.addressData.length - 1, 1);
      this.addShow = true;
      if (this.changeAddress == "新增") {
        let str = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;
        let data = {
          customerId: this.$route.query.customerId,
          storeCustomerId: this.$route.query.id,
          provinceId: this.mapData.addressComponent.adcode.substring(0, 2) + "0000", //110203	  110000  110200  110203
          cityId: this.mapData.addressComponent.adcode.substring(0, 4) + "00",
          areaId: this.mapData.addressComponent.adcode,
          address: str,
          longitude: this.center.lng,
          latitude: this.center.lat,
          isDefault: this.isAddressDefault ? 1 : 0
        };
        insertCustomerAddress(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("添加地址成功");
              this.getAddress();
              this.addressData.splice(this.addressData.length - 1, 1);
              this.mapData = {};
              this.poiObj = {};
              this.buildingNumber = "";
              this.unitNumber = "";
              this.roomNumber = "";
              this.isAddressDefault = false;
              this.center = { lng: 116.404, lat: 39.915 };
              this.keyword = "";
              this.addShow = true;
            } else {
              this.$message.error("添加地址失败");
            }
          })
          .catch(error => {
            console.error(
              "客户地址_新增 customermanagementmyclientcustomeradd",
              error
            );
          });
      } else {
        let str = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;
        baiduMap(this.center.lng, this.center.lat).then(res => {
          this.mapData = res;
          console.log(res);
        });
        let arr = [];
        arr.push(this.customerAddressId);
        let data = {
          customerId: this.$route.query.customerId,
          storeCustomerIds: this.$route.query.id,
          provinceId: parseInt(
            this.mapData.addressComponent.adcode.substring(0, 2) + "0000"
          ),
          cityId: parseInt(
            this.mapData.addressComponent.adcode.substring(0, 4) + "00"
          ),
          areaId: parseInt(this.mapData.addressComponent.adcode),
          address: str,
          longitude: this.center.lng,
          latitude: this.center.lat,
          customerAddressIds: arr,
          isDefault: this.isAddressDefault ? 1 : 0
        };
        updateCustomerAddress(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("编辑地址成功");
              this.getAddress();
              this.addressData.splice(this.addressData.length - 1, 1);
              this.mapData = {};
              this.poiObj = {};
              this.buildingNumber = "";
              this.unitNumber = "";
              this.isAddressDefault = false;
              this.roomNumber = "";
              this.center = { lng: 116.404, lat: 39.915 };
              this.keyword = "";
              this.addShow = true;
            }
          })
          .catch(error => {
            console.error(
              "客户地址_编辑 customermanagementmyclientcustomeradd",
              error
            );
          });
      }
    },

    //添加地址
    addAddress() {
      this.addressData.push({ add: 1 });
      this.changeAddress = "新增";
      this.addShow = false;
      this.mapDialogVisible = true;
    },

    //批量删除
    delAddress(val) {
      if (val.length == "0") {
        this.$message.error("请勾选后再进行批量操作");
      } else {
        if (val[val.length - 1].add == undefined) {
          //选中数据都是对象
          this.addShow = true;
          this.mapData = {};
          this.buildingNumber = "";
          this.unitNumber = "";
          this.roomNumber = "";
          this.isAddressDefault = false;
          this.center = { lng: 116.404, lat: 39.915 };
          this.keyword = "";
          this.maps = "";
          this.addShow = true;
        } else {
          //选中最后的一项是删除的操作框
          this.addressData.splice(this.addressData.length - 1, 1);
          this.addShow = true;
        }
        let arr = val.filter(item => {
          return !item.add;
        });

        arr = arr.map(item => {
          return item.customerAddressId;
        });
        let data = {
          customerAddressIds: arr,
          isDelete: 1
        };
        console.log(data);
        updateCustomerAddress(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除数据成功");
              this.isAddressDefault = false;
              this.getAddress();
              this.mapData = {};
              this.buildingNumber = "";
              this.unitNumber = "";
              this.roomNumber = "";
              this.isAddressDefault = false;
              this.center = { lng: 116.404, lat: 39.915 };
              this.maps = "";
              this.keyword = "";
              this.addShow = true;
            } else {
              this.$message.error("删除数据失败");
            }
          })
          .catch(error => {
            console.error(
              "客户地址_删除 customermanagementmyclientcustomeradd",
              error
            );
          });
      }
    },
    //单个删除
    delAddressOne(val) {
      if (val.add == undefined) {
        console.log(val);
        let arr = [];
        arr.push(val.customerAddressId);
        let data = {
          customerAddressIds: arr,
          isDelete: 1
        };
        console.log(data);
        updateCustomerAddress(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除数据成功");
              this.getAddress();
              this.isAddressDefault = false;
              this.addShow = true;
            } else {
              this.$message.error("删除数据失败");
            }
          })
          .catch(error => {
            console.error(
              "客户地址_删除 customermanagementmyclientcustomeradd",
              error
            );
          });
      } else {
        this.addressData.splice(this.addressData.length - 1, 1);
        this.mapData = {};
        this.buildingNumber = "";
        this.unitNumber = "";
        this.roomNumber = "";
        this.isAddressDefault = false;
        this.center = { lng: 116.404, lat: 39.915 };
        this.keyword = "";
        this.maps = "";
        this.addShow = true;
      }
    },

    currentChange(val) {
      //翻页方法

      this.currentPage = val;
      console.log(this.tabNumber);
      switch (this.tabNumber) {
        case "0":
          this.getCustomerDemandList();
          break;
        case "1":
          this.getOrderList();
          break;
        case "2":
          this.getCustomerRecommendList();
          break;
        case "3":
          this.getAddress();
          break;
        case "4":
          this.getOtherStore();
          break;
        case "5":
          this.getFollowRecordList();
          break;
        case "6":
          console.log("方法7  调用");
          break;
        case "7":
          console.log("方法8  调用");
          break;
      }
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      switch (this.tabNumber) {
        case "1":
          this.getCustomerDemandList();
          break;
        case "2":
          console.log("方法2调用");
          break;
        case "3":
          this.getCustomerRecommendList();
          break;
        case "4":
          this.getAddress();
          break;
        case "5":
          this.getOtherStore();
          break;
        case "6":
          this.getFollowRecordList();
          break;
        case "7":
          console.log("方法7  调用");
          break;
        case "8":
          console.log("方法8  调用");
          break;
      }
    },

    //删除客户需求
    delCustomerDemand(val) {
      if (val.length == undefined) {
        let arr = [];
        arr.push(val.customerDemandId);
        let data = {
          customerDemandIds: arr,
          isDelete: 1
        };
        console.log(data);
        updateCustomerDemand(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除成功");
              this.getCustomerDemandList();
            } else {
              this.$message.error("删除失败");
            }
          })
          .catch(error => {
            console.error(
              "获取地址列表  customermanagementmyclientindex",
              error
            );
          });
      } else if (val.length == "0") {
        this.$message.error("请勾选后再进行批量操作");
      } else {
        let arr = [];
        arr = val.map(item => {
          return item.customerDemandId;
        });
        let data = {
          customerDemandIds: arr,
          isDelete: 1
        };
        updateCustomerDemand(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除成功");
              this.getCustomerDemandList();
            } else {
              this.$message.error("删除失败");
            }
          })
          .catch(error => {
            console.error(
              "获取地址列表  customermanagementmyclientindex",
              error
            );
          });
      }
    },

    handleCurrentChange3() {},
    handleCurrentChange6() {},
    //listOtherStore获取其他门店列表
    getOtherStore() {
      let query = {
        customerId: this.$route.query.customerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listOtherStore(query)
        .then(res => {
          this.total = res.data.total;
          this.tabList = res.data.rows;
          console.log(res);
        })
        .catch(error => {
          console.error(
            "获取其他门店列表  customermanagementmyclientindex",
            error
          );
        });
    },

    //获取客户联系记录_获取列表
    getFollowRecordList() {
      let query = {
        customerId: this.$route.query.customerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listFollowRecord(query)
        .then(res => {
          this.total = res.data.total;
          this.tabList = res.data.rows;
        })
        .catch(error => {
          console.error(
            "获取客户联系记录_获取列表  customermanagementmyclientindex",
            error
          );
        });
    },

    //获取银行列表
    getCustomerRecommendList() {
      let query = {
        customerId: this.$route.query.customerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listCustomerBankCard(query)
        .then(res => {
          this.total = res.data.total;
          this.tabList = res.data.rows;
        })
        .catch(error => {
          console.error(
            "编辑客户_获取客户信息  customermanagementmyclientindex",
            error
          );
        });
    },

    //获取客户需求列表
    getCustomerDemandList() {
      let query = {
        customerId: this.$route.query.customerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listCustomerDemand(query)
        .then(res => {
          console.log(res);
          this.total = res.data.total;
          this.tabList = res.data.rows;
          this.tabList.forEach(item => {
            let str = item.housingTypeId == 1 ? "新房" : "老房";
            str = str + "-" + item.productName + "-" + item.styletName;
            item.str = str;
          });

          console.log(this.tabList);
        })
        .catch(error => {
          console.error(
            "编辑客户_获取客户信息  customermanagementmyclientindex",
            error
          );
        });
    },

    //获取客户信息
    getUserInfo() {
      let query = {
        storeCustomerId: this.$route.query.id
      };
      getCustomerInfo(query)
        .then(res => {
          console.log(res);
          this.userInfo = res.data;
        })
        .catch(error => {
          console.error(
            "编辑客户_获取客户信息  customermanagementmyclientindex",
            error
          );
        });
    },

    datapickChange(val) {
      console.log(val);
      console.log(this.searchData);
      this.startTime = this.searchData[0];
      this.endTime = this.searchData[1];
    },

    //tab页选择
    tabclickH(e) {
      //点开的tab页用来加载数据
      this.currentPage = 1;
      this.tabNumber = e.name;
      // this.tabstatus = a;
      switch (e.name) {
        case "0":
          this.getCustomerDemandList();
          break;
        case "1":
          this.searchOrderList();
          break;
        case "2":
          this.getCustomerRecommendList();
          break;
        case "3":
          this.getAddress();
          break;
        case "4":
          this.getOtherStore();
          break;
        case "5":
          this.getFollowRecordList();
          break;
        case "6":
          console.log("方法7  调用");
          break;
        case "8":
          console.log("方法8  调用");
          break;
      }
    },

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    // 改变tablebody颜色
    // tableBodycolor({ row, rowIndex }) {
    //   return "height: 80px";
    // },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
    },
    //勾选函数回调

    //按钮组函数
    butGroupAction(url, type) {
      if (type == 1) {
        //弹框
        this.addbrand();
      } else if (type == 2) {
        //页面跳转
      } else if (type == 3) {
        //
      }
    },

    //添加新
    addbrand() {
      this.$router.push({ path: "/customermanagement/customeradd" });
    },

    //编辑
    editHandle(row) {
      this.$router.push({
        path: "/customermanagement/customereditor",
        query: { id: row.id }
      });
    },

    //移交
    moveHandle(row) {
      this.$router.push({
        path: "/customermanagement/myclient/customerHandover",
        query: { id: row.id }
      });
    },

    //共享
    shareHandle(row) {
      this.$router.push({ path: "/customersharing", query: { id: row.id } });
    },

    //新增客户需求
    addCustomerDemand(row) {
      this.$router.push({
        //新增时需传入客户id
        path: "customerdemand",
        query: {
          id: this.$route.query.id,
          customerId: this.$route.query.customerId
        }
      });
    },

    //编辑客户需求  需传递客户id和需求id
    editCustomerDemand(val) {
      console.log(val.customerDemandId);
      this.$router.push({
        //新增时需传入客户id
        path: "customerdemand",
        query: {
          id: this.$route.query.id,
          customerDemandId: val.customerDemandId,
          storeCustomerId: this.userInfo.storeCustomerId
        }
      });
    },

    //需求
    needHandle(row) {
      this.$router.push({
        path: "/customermanagement/customerdemand",
        query: { id: row.id }
      });
    },

    //创建
    createHandle(row) {
      this.$message.error("订单功能未开发");
      // this.$router.push({
      //   path: "/customermanagement/customerdemand",
      //   query: { id: row.id }
      // });
    },

    //table表格
    handleSelectionChange(val) {
      this.tableSelectList = val;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //tab2方法
    datapickChange2(val) {
      this.oderform.createTimeStart = this.searchData2
        ? this.searchData2[0]
        : "";
      this.oderform.createTimeEnd = this.searchData2 ? this.searchData2[1] : "";
    },
    //table表格
    handleSelectionChange3(val) {
      this.tableSelectList3 = val;
    },

    //编辑银行账号信息
    editHandle3(row) {
      this.dialogTitle = "编辑银行";
      let arr = [];
      arr.push(row.customerBankCardId);
      this.editBankCard.customerId = row.customerId;
      this.editBankCard.accountName = row.accountName;
      this.editBankCard.openingBank = row.openingBank;
      this.editBankCard.bankCardNumber = row.bankCardNumber;
      this.isDefault = row.isDefault == "1" ? true : false;
      this.editBankCard.customerBankCardIds = arr;
      this.centerDialogVisible3 = true;
    },

    //删除单个银行账号信息
    delOneBankCard(val) {
      console.log(val);
      let arr = [];
      arr.push(parseInt(val.customerBankCardId));
      let data = {
        // updateCustomerBankCard
        customerBankCardIds: arr,
        isDelete: 1
      };
      updateCustomerBankCard(data)
        .then(res => {
          console.log(res);
          if (res.status == "200") {
            this.$message.success("删除成功");
          }
          this.getCustomerRecommendList();
        })
        .catch(error => {
          console.error("删除银行信息  customermanagementmyclientindex", error);
        });
    },

    //批量删除银行账号信息
    delBankCard() {
      if (this.tableSelectList.length == "0") {
        this.$message.error("请勾选后再进行批量操作");
      } else {
        let customerBankCardIdArr = this.tableSelectList.map(item => {
          return parseInt(item.customerBankCardId);
        });
        console.log(customerBankCardIdArr);
        let data = {
          // updateCustomerBankCard
          customerBankCardIds: customerBankCardIdArr,
          isDelete: 1
        };
        updateCustomerBankCard(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除成功");
            }
            this.getCustomerRecommendList();
            console.log(res);
          })
          .catch(error => {
            console.error(
              "删除银行信息  customermanagementmyclientindex",
              error
            );
          });
      }
    },

    //弹出添加添加银行卡页面
    openDia3() {
      (this.dialogTitle = "添加银行"), (this.centerDialogVisible3 = true);
    },

    //关闭添加银行卡页面
    closeDia3() {
      (this.dialogTitle = "添加银行"), (this.centerDialogVisible3 = false);
      this.editBankCard = {};
    },
    //点击添加银行卡的提交   提交银行卡信息   id=202599&customerId=324292
    addBankCard() {
      this.editBankCard.customerId = this.$route.query.customerId;
      this.editBankCard.storeCustomerId = this.userInfo.storeCustomerId;
      if (this.isDefault) {
        this.editBankCard.isDefault = 1;
      } else {
        this.editBankCard.isDefault = 0;
      }
      console.log(this.editBankCard);
      if (this.editBankCard.accountName == "") {
        this.$message.error("请输入开户名");
      } else if (this.editBankCard.openingBank == "") {
        this.$message.error("请输入开户行");
      } else if (this.editBankCard.bankCardNumber == "") {
        this.$message.error("请输入银行账号");
      } else {
        if (this.dialogTitle == "添加银行") {
          insertCustomerBankCard(this.editBankCard)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("添加银行账号信息成功");
                this.centerDialogVisible3 = false;
                this.editBankCard.customerId = "";
                this.editBankCard.accountName = "";
                this.editBankCard.openingBank = "";
                this.editBankCard.bankCardNumber = "";
                this.getCustomerRecommendList();
                this.isDefault = false;
              } else {
                this.$message.error("添加银行账号信息失败");
              }
            })
            .catch(error => {
              console.error(
                "添加银行卡  customermanagementmyclientindex",
                error
              );
            });
        } else {
          //updateCustomerBankCard
          console.log(this.editBankCard);
          updateCustomerBankCard(this.editBankCard)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("编辑银行账号信息成功");
                this.centerDialogVisible3 = false;
                this.editBankCard.customerId = "";
                this.editBankCard.accountName = "";
                this.editBankCard.openingBank = "";
                this.editBankCard.bankCardNumber = "";
                this.getCustomerRecommendList();
                this.isDefault = false;
              }else {
                this.$message.error("编辑银行账号信息失败");
              }
            })
            .catch(error => {
              console.error(
                "添加银行卡  customermanagementmyclientindex",
                error
              );
            });
        }
      }
    },

    //tab4方法
    handleSelectionChange4(val) {
      this.tableSelectList4 = val;
    },

    //打开6方法
    addFollowRecord() {
      this.centerDialogVisible6 = true;
      this.titleDialogVisible6 = "新增联系方式";
    },

    //编辑联系方式
    editFollowRecord(row) {
      this.titleDialogVisible6 = "编辑联系方式";
      this.centerDialogVisible6 = true;
      console.log(row);
      this.contentType6 = row.contactWayId;
      this.followTime = row.followTime;
      this.note6 = row.remarks;
      this.followRecordId = row.followRecordId;
    },

    //closeDia6
    closeDia6() {
      this.centerDialogVisible6 = false;
      this.note6 = "";
      this.contentType6 = "";
      this.followTime = "";
    },

    //编辑新增联系方式
    sendFollowRecord() {
      if (this.contentType6 == "") {
        this.$message.error("请选择联系方式");
      } else if (this.note6 == "") {
        this.$message.error("请填写备注");
      } else {
        if (this.titleDialogVisible6 == "新增联系方式") {
          //insertFollowRecord
          let data = {
            customerId: parseInt(this.$route.query.customerId), //客户id
            contactWay: parseInt(this.contentType6), //联系方式
            followTime: this.followTime, //联系时间
            remarks: this.note6 //备注
          };
          insertFollowRecord(data)
            .then(res => {
              console.log(res);
              if (res.status == "200") {
                this.$message.success("添加联系方式成功");
                this.centerDialogVisible6 = false;
                this.note6 = "";
                this.contentType6 = "";
                this.followTime = "";
                this.getFollowRecordList();
              }
            })
            .catch(error => {
              console.error(
                "新增客户联系方式  customermanagementmyclientindex",
                error
              );
            });
        } else {
          let arr = [];
          arr.push(this.followRecordId);
          let data = {
            followRecordIds: arr, //联系主键id
            contactWay: parseInt(this.contentType6), //联系方式
            followTime: this.followTime, //联系时间
            remarks: this.note6 //备注
          };
          updateFollowRecord(data)
            .then(res => {
              console.log(res);
              if (res.status == "200") {
                this.$message.success("编辑客户信息成功");
                this.centerDialogVisible6 = false;
                this.note6 = "";
                this.contentType6 = "";
                this.followTime = "";
                this.getFollowRecordList();
              }
            })
            .catch(error => {
              console.error(
                "编辑客户联系方式  customermanagementmyclientindex",
                error
              );
            });
        }
      }
    },

    //删除客户联系方式
    delFollowRecord(val) {
      //console.log(val);//followRecordId
      if (val.length == undefined) {
        //单个删除操作
        let arr = [];
        arr.push(val.followRecordId);
        let data = {
          followRecordIds: arr,
          isDelete: 1
        };
        console.log(data);
        updateFollowRecord(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除数据成功");
              this.getFollowRecordList();
            } else {
              this.$message.error("删除失败");
            }
          })
          .catch(error => {
            console.error(
              " 删除联系方式  customermanagementmyclientindex",
              error
            );
          });
      } else if (val.length == "0") {
        this.$message.error("请勾选后再进行批量操作");
      } else {
        let arr = [];
        arr = val.map(item => {
          return item.followRecordId;
        });
        let data = {
          followRecordIds: arr,
          isDelete: 1
        };
        console.log(data);
        updateFollowRecord(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("删除数据成功");
              this.getFollowRecordList();
            } else {
              this.$message.error("删除失败");
            }
          })
          .catch(error => {
            console.error(
              " 删除联系方式  customermanagementmyclientindex",
              error
            );
          });
      }
    }
  },

  components: {
    breadcrumb,
    pagination
  }
};
</script>
<style scoped>
.flexBox {
  width: 100%;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
}
.flexBox > div {
  width: 25%;
  height: 50px;
}
.flexBox > div > span {
  position: relative;
  top: 28%;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.collapse_cell_div {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  padding: 10px 0;
}

.warp_head_list {
  justify-content: space-between;
}
.search_nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
}
.pageTitle {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.head_nav_search {
  width: 200px;
}
.tabel_page_box {
  position: relative;
  margin-top: 10px;
}
.left_fix_table {
  position: absolute;
  right: 10px;
  top: 8px;
}
.dialog_con_box {
}
.dialog_con_box .content_box {
  display: flex;
  flex-wrap: nowrap;
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
}
.left_form > .lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.collapse_input_cell_box {
  width: 50%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
}
.collapse_input_cell_box .input_befor_text {
  width: 8em;
}
.collapse_input_cell_box .input_after_div {
  flex: 1;
}
.collapse_input_cell_box_three {
  width: 33%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
}

.collapse_input_cell_box_three .input_befor_text {
  width: 8em;
}
.collapse_input_cell_box_three .input_after_div {
  flex: 1;
}
.head_nav_btn {
  display: flex;
}
.warp_head_action_btn {
  justify-content: space-between;
}
.dialog_con_box .warp_head_list {
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
}
.dialog_con_box .warp_head_list .title {
  width: 8em;
  text-align: right;
  margin-right: 10px;
}
.dialog_con_box .warp_head_list .head_nav_search_t {
  flex: 1;
}
.table_edit_column {
  display: flex;
  align-items: center;
}
.table_edit_column .input_box {
  width: 20%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.input_box_lou {
  min-width: 68px;
  margin-left: 10px;
}
</style>
<style lang='scss' scoped>
.dialog_con_box .content_box {
  flex-wrap: wrap !important;
}
.table_edit_column .input_box .el-input {
  width: 60%;
}
.table_edit_column .input_box:first-child .el-input {
  width: 90%;
}
.dia6 {
  height: 250px;
}

.btn_top18 {
  margin-top: -18px;
}
.map {
  width: 100%;
  height: 550px;
  .map_input{
    width:350px;
    height:30px;
  }
  .map_searchinfo{
    width:350px;
    max-height:450px;
    overflow:auto;
  }
}
table tr td {
  width: 33%;
  height: 48px;
  border: solid #ebeef5;
  border-width: 0px 1px 1px 0px;
  padding-left: 10px;
}
.tab_class {
  border: solid #ebeef5;
  border-radius: 5px;
  color: #606266;
  font-size: 14px;
  border-width: 1px 0px 0px 1px;
  width: 95%;
  margin: 20px 2.5%;
}
.tabtop {
  position: absolute;
  margin-top: 70px;
  // top: -27px;
  // left: 0px;
  transform: translate(-20px, -47px);
  display: flex;
  font-size: 14px;
  background: #006ec7;
  border-radius: 5px 5px 0px 0px;
  border-bottom: none;
  cursor: pointer;
  li {
    padding: 5px 8px;
    color: #ffffff;
    transition: 1s all;
    height: 100%;
  }
  .checkclass {
    background: #ffffff;
    color: #333;
    border-radius: 5px 5px 0px 0px !important;
    transition: 1s all;
    border-bottom: none;
  }
}
.header_info {
  display: block;
  height: 25px;
  background-color: #006ec7;
  width: 80px;
  border-radius: 5px 5px 0px 0px;
  text-align: center;
  color: #ffffff;
  font-size: 14px;
  line-height: 25px;
}
.operaItems {
  color: rgb(127, 221, 228);
  border: none;
}
.saveHandle_class {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #409eff;
  border-color: #409eff;
}
.befor_text_bold {
  font-weight: bold;
}
.border_none {
  border: none;
}

.titlecals {
  font-size: 18px;
  position: relative;
  font-weight: 500;
  color: #006ec7;
  margin: 0px 35px;
  top: -20px;
}
.titlecals::after {
  content: "";
  display: block;
  width: 4px;
  height: 15px;
  background: #006ec7;
  position: absolute;
  left: -16px;
  top: 50%;
  border-radius: 5px;
  transform: translateY(-50%);
}
.order_search_form {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 15px;
  justify-content: flex-end;
}
</style>


