<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="outstockmanager-container">
    <div class="search-container">
      <el-radio-group v-model="queryForm.status" class="risk-status-tab" @change="selectStatus">
        <el-radio-button label="SAVED">待发货</el-radio-button>
        <el-radio-button label="SUBMITTED,STOCK_OUT_PARTLY">待出库</el-radio-button>
        <el-radio-button label="COMPLETED,ARCHIVED">已出库</el-radio-button>
        <el-radio-button label="INVALID">已作废</el-radio-button>
      </el-radio-group>
      <el-button class="new-btn" type="primary" @click="add()">手动建单出库</el-button>
      <el-form :inline="true" label-width="150px">
        <el-form-item v-if="queryForm.status !='SAVED'" label="业务来源：">
          <el-select v-model="queryForm.situation" clearable>
            <el-option value="SELLING" label="销售出库" />
            <el-option value="RENTING" label="租赁出库" />
            <el-option value="EXCHANGE" label="换货出库" />
            <el-option value="COUNT" label="盘点出库" />
            <el-option value="ALLOCATE" label="调拨出库" />
            <el-option value="OTHER" label="其它出库" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="queryForm.status =='SAVED'" label="发货方式：">
          <el-select v-model="queryForm.freightProvider" clearable @change="search">
            <el-option v-for="item in freightList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务单号：">
          <el-input v-model="queryForm.businessNo" clearable />
        </el-form-item>
        <el-form-item v-if="queryForm.status !='COMPLETED,ARCHIVED' && queryForm.status !='INVALID'" label="创建时间">
          <el-date-picker
            v-model="creatTimeList"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getCreatTime"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.status =='COMPLETED,ARCHIVED' " label="出库时间">
          <el-date-picker
            v-model="outTimeList"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getOutTime"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.status =='INVALID' " label="作废时间">
          <el-date-picker
            v-model="brokenTimeList"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getBrokenTime"
          />
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input v-model="queryForm.goodsKeyword" clearable />
        </el-form-item>
        <el-form-item v-if="queryForm.status =='INVALID'" label="出库单号：">
          <el-input v-model="queryForm.stockOutNo" clearable />
        </el-form-item>
        <el-form-item v-if="queryForm.status !='INVALID'" label="出库仓库：">
          <el-input v-model="queryForm.warehouseKeyword" clearable />
        </el-form-item>
        <el-form-item v-if="queryForm.status !='INVALID'" label="收货地址：">
          <el-select v-model="queryForm.districtId" :placeholder="$t('warehouse.iptprovince')" clearable>
            <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="printing" class="paintingdiv" />
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <!-- <el-button type="primary" @click="add()">新增</el-button> -->
      </div>
    </div>
    <div class="outstockmanager-table">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column v-if="queryForm.status =='COMPLETED,ARCHIVED' || queryForm.status =='INVALID'" key="1" label="出库单号" prop="stockOutNo" />
        <el-table-column v-if="queryForm.status !='INVALID'" key="2" label="出库仓库" prop="warehouse">
          <template slot-scope="scope">{{ scope.row.warehouse? scope.row.warehouse.name:'' }}</template>
        </el-table-column>
        <el-table-column v-if="queryForm.status !='INVALID'" key="3" label="收件地址" prop="receiverAddress" width="140">
          <template v-if="scope.row.freight && scope.row.freight.receiverAddress" slot-scope="scope">
            {{ scope.row.freight.receiverAddress.indexAndDetail[1] ||'--' }}
            {{ scope.row.freight.receiverAddress.indexAndDetail[2] ||'--' }}
            {{ scope.row.freight.receiverAddress.indexAndDetail[3] ||'--' }}
            {{ scope.row.freight.receiverAddress.districts[1].name ||'--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status !='INVALID'" key="4" label="收件方信息" prop="receiver" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.freight && scope.row.freight.receiver">
              {{ scope.row.freight.receiver.name }}
              <br />
              {{ scope.row.freight.receiver.mobile }}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="5" label="业务来源" prop="situationDesc" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.situationDesc }}</span>
            <span v-if="scope.row.instruction">[{{ scope.row.instruction }}]</span>
          </template>
        </el-table-column>
        <el-table-column key="6" label="业务单号" prop="businessNo" />
        <el-table-column key="7" label="商品名称" prop="goods">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover" width="300">
              <el-button slot="reference" type="text" class="pop-btn">
                <span v-for="( item, index ) in scope.row.goods" :key="item.skuId">{{ index==0?'':'、' }}{{ item.name }}</span>
              </el-button>
              <el-table :data="scope.row.goods" border style="width: 100%;">
                <el-table-column label="商品名称&规格">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                    <span v-if="scope.row.specification">[{{ scope.row.specification }}]</span>
                  </template>
                </el-table-column>
                <el-table-column label="待出库数量" prop="insideWarehouseCount" />
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column key="8" label="总数量" width="70" prop="goodsCount" />
        <el-table-column v-if="queryForm.status !='INVALID'" key="9" label="发货方式" prop="freight" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.freight?scope.row.freight.freightProviderDesc:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status !='INVALID'" key="10" label="物流单号" prop="freight">
          <template slot-scope="scope">
            <span v-if="scope.row.freight && scope.row.freight.trackingNo">{{ scope.row.freight.trackingNo }}</span>
            <div v-else class="tac">--</div>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status =='SAVED'" key="11" label="状态" prop="statusDesc">
          <template slot-scope="scope">
            <!-- 用户自提与平台配送无物流相关状态 -->
            <span v-if="scope.row.freight && (scope.row.freight.freightProvider === 'PLATFORM' || scope.row.freight.freightProvider === 'USER')">
              待提交出库
            </span>
            <span v-else>
              <span v-if="scope.row.status == 'SAVED'">待预约快递</span>
              <span v-if="scope.row.status == 'BOOKED'">待打印发货单</span>
              <span v-if="scope.row.status == 'PRINTED'">待提交至出库流程</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status =='SAVED'" key="12" label="用户备注" prop="buyerRemark" />
        <el-table-column v-if="queryForm.status =='SAVED'" key="13" label="客服备注" prop="sellerRemarks">
          <template slot-scope="scope">
            <a v-if="scope.row.sellerRemarks[0]" href="javascript:;" @click="remarkView(scope.row.sellerRemarks)">
              <span class="orderRemark">{{ scope.row.sellerRemarks[0].content }}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status =='SUBMITTED,STOCK_OUT_PARTLY'" key="14" label="物流状态" prop="statusDesc" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'SUBMITTED'">待出库</span>
            <span v-else>{{ scope.row.statusDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status =='COMPLETED,ARCHIVED'" key="15" label="出库状态" prop="statusDesc" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'COMPLETED'">已出库</span>
            <span v-else>{{ scope.row.statusDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="queryForm.status =='SAVED' || queryForm.status =='SUBMITTED,STOCK_OUT_PARTLY'"
          key="16"
          label="创建时间"
          prop="createdRecord"
          width="90"
        >
          <template v-if="scope.row.createdRecord" slot-scope="scope">{{ scope.row.createdRecord.time }}</template>
        </el-table-column>
        <el-table-column
          v-if="queryForm.status =='COMPLETED,ARCHIVED' || queryForm.status =='INVALID'"
          key="17"
          label="出库时间"
          prop="stockedOutRecord"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.stockedOutRecord">{{ scope.row.stockedOutRecord.time }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status =='INVALID'" key="18" label="作废时间" prop="brokeRecord" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.brokeRecord">{{ scope.row.brokeRecord.time }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status =='INVALID'" key="19" label="作废操作人" prop="brokeRecord" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.brokeRecord">{{ scope.row.brokeRecord.operatorName }}</span>
          </template>
        </el-table-column>
        <el-table-column key="20" label="操作" width="268" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.actions.BOOK_FREIGHT" type="warning" plain @click="openDlg(scope.row, 'subSendDlg')">预约快递</el-button>
            <el-button v-if="scope.row.status!='PRINTED' && scope.row.actions.PRINT_FREIGHT" type="warning" plain @click="printBtn(scope.row)">打印面单</el-button>
            <el-button v-if="scope.row.actions.CONFIRM_STOCK_OUT" type="warning" plain @click="submit(scope.row)">提交</el-button>
            <el-button v-if="scope.row.actions.EXECUTE_STOCK_OUT" type="warning" plain @click="openDlg(scope.row, 'addDlg')">出库</el-button>
            <el-button type="primary" plain @click="view(scope.row)">查看</el-button>
            <el-dropdown
              v-if="scope.row.status!= 'COMPLETED' && scope.row.status != 'INVALID' && scope.row.status != 'SUBMITTED'"
              trigger="click"
              @command="handleCommand"
            >
              <el-button plain type="success" @click="chooseItem(scope.row)">
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.actions.EDIT_STOCK_OUT" command="outStockDlg">修改出库仓库</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.actions.EDIT_FREIGHT" command="outSendDlg">修改发货方式</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.actions.BIND_TRACKING_NO" command="outTrackNoDlg">绑定货运单号</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status=='PRINTED' && scope.row.actions.PRINT_FREIGHT" command="chooseprintDlg">重新打印</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.actions.CANCEL_FREIGHT" command="cancelFreight">取消预约</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="scope.row.status=='SUBMITTED'" type="danger" plain @click="reject(scope.row)">驳回至物发货确认</el-button>
            <el-button v-if="scope.row.status=='COMPLETED'" type="danger" plain @click="closeOrder(scope.row)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <stock-dialog :show="outStockDlg" :data-source="obj" @handClose="closeDialog" @handOk="changeStock" />
      <change-send :show="outSendDlg" :data-source="obj" @handClose="closeDialog" @handOk="changeSend" />
      <change-track :show="outTrackNoDlg" :data-source="obj" @handClose="closeDialog" @handOk="changeTrackNo" />
      <send-dialog :show="subSendDlg" :data-source="obj" @handClose="closeDialog" @handOk="getList" />
      <add-dialog :show="addDlg" :data-source="obj.goods" @handClose="closeDialog" @handOk="stockOut" />
      <choose-printer :show="chooseprintDlg" :data-source="printers" @handClose="closeDialog" @handOk="printCainiao" />
      <el-dialog :visible.sync="remarkDialog" title="客服备注" center>
        <el-table :data="remarkObj" border>
          <el-table-column label="时间" prop="operateTime" />
          <el-table-column label="内容" prop="content" />
          <el-table-column label="操作人" prop="username" />
        </el-table>
        <div slot="footer">
          <el-button type="info" @click="cancel()">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <a style="font-size:12px;color:#ECEDF1" href="https://dwz.cn/0AcgNMzH" target="_blank">&#x5FEB;&#x4E50;&#x5165;&#x53E3;</a>
  </div>
</template>

<script>
var socket;
import locationList from '@/assets/location/location';
import pagination from '@/components/Pagination/index';
import stockDialog from './components/changeStock';
import changeSend from './components/changeSend';
import changeTrack from './components/changeTrack';
import sendDialog from './components/submitSend';
import addDialog from './components/add';
import choosePrinter from './components/choosePrinter';
import outstockApi from '@/api/warehouse/outstock';
import { saveParameter } from '@/utils/saveParameter.js';
import { getRequestObject, getUUID } from '@/components/printer/printer';
export default {
  components: {
    pagination,
    stockDialog,
    changeSend,
    changeTrack,
    sendDialog,
    addDialog,
    choosePrinter
  },
  data() {
    return {
      queryForm: {
        status: 'SAVED',
        situation: '',
        businessNo: '',
        orderNum: '',
        goodsKeyword: '',
        stockOutNo: '',
        warehouseKeyword: '',
        freightProvider: '',
        gmtCreatedFrom: '',
        gmtCreatedTo: '',
        gmtStockedOutFrom: '',
        gmtStockedOutTo: '',
        gmtBrokenFrom: '',
        gmtBrokenTo: '',
        districtId: ''
      },
      searchForm: {
        status: 'SAVED',
        situation: '',
        businessNo: '',
        orderNum: '',
        goodsKeyword: '',
        stockOutNo: '',
        warehouseKeyword: '',
        freightProvider: '',
        gmtCreatedFrom: '',
        gmtCreatedTo: '',
        gmtStockedOutFrom: '',
        gmtStockedOutTo: '',
        gmtBrokenFrom: '',
        gmtBrokenTo: '',
        districtId: ''
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      loading: false,
      remarkDialog: false, // 客服备注
      provinceList: locationList,
      remarkObj: {
        operateTime: '',
        content: '',
        userName: ''
      },
      obj: { goods: [] }, // 选择的出库单详情
      total: 1,
      creatTimeList: [], // 创建时间范围
      outTimeList: [], // 出库时间范围
      brokenTimeList: [], // 作废时间范围
      freightList: [], // 可用物流
      tableData: [],
      printers: [], // 打印机列表
      printing: false,
      outStockDlg: false, // 修改出库仓库 弹窗
      outSendDlg: false, // 修改发货方式 弹窗
      outTrackNoDlg: false, // 绑定货运单号 弹窗
      subSendDlg: false, // 预约物流 弹窗
      addDlg: false, // 出库 弹窗
      chooseprintDlg: false // 选择打印机 弹窗
    };
  },
  created() {
    if (
      sessionStorage.getItem('pageFlag') &&
      sessionStorage.getItem('path') === this.$route.path
    ) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.searchForm = {
        ...parameter
      };
      this.queryForm = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      };
      if (parameter.startDate && parameter.endDate) {
        this.timeList = [parameter.startDate, parameter.endDate];
      }
      if (parameter.gmtCreatedFrom && parameter.gmtCreatedTo)
        this.creatTimeList = [parameter.gmtCreatedFrom, parameter.gmtCreatedTo];
      if (parameter.gmtStockedOutFrom && parameter.gmtStockedOutTo)
        this.outTimeList = [
          parameter.gmtStockedOutFrom,
          parameter.gmtStockedOutTo
        ];
      if (parameter.gmtBrokenFrom && parameter.gmtBrokenTo)
        this.brokenTimeList = [parameter.gmtBrokenFrom, parameter.gmtBrokenTo];
      sessionStorage.removeItem('pageFlag');
      sessionStorage.removeItem('path');
    }
  },
  mounted() {
    this.getList();
    this.getFreights();
  },
  beforeDestroy() {
    socket && socket.close();
  },
  methods: {
    // 获取列表信息
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        ...this.searchForm
      };
      Object.keys(data).map(item => {
        data[item] === '' && delete data[item];
      });
      this.loading = true;
      setTimeout(() => {
        outstockApi.getOutstockList(data).then(res => {
          if (res.code === 200) {
            res.data.list.map(row => {
              row.goods.map(good => {
                good.sns = [];
                good.serialNumberUpload = false;
                good.file = '';
              });
            });
            this.tableData = res.data.list || [];
            this.total = res.data.totalRecords;
          } else {
            this.$message.info(res.msg);
          }
          this.loading = false;
        });
      }, 800);
    },
    getFreights() {
      outstockApi.getFreights().then(res => {
        if (res.code === 200) {
          this.freightList = [];
          for (var key in res.data) {
            this.freightList.push({ name: res.data[key], value: key });
          }
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    // 查询条件
    search() {
      this.loading = true;
      this.searchForm = {
        ...this.queryForm
      };
      this.listQuery.page = 1;
      this.getList();
    },
    // 出库单详情页
    view(value) {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      const query = {};
      if (
        value.status !== 'COMPLETED' &&
        value.status !== 'ARCHIVED' &&
        value.status !== 'INVALID'
      ) {
        query.groupId = value.groupId;
      } else {
        query.id = value.id;
      }
      this.$router.push({
        name: 'outstockDetail',
        query
      });
    },
    // 创建时间选择
    getCreatTime(value) {
      this.queryForm.gmtCreatedFrom = value ? value[0] : '';
      this.queryForm.gmtCreatedTo = value ? value[1] : '';
    },
    // 出库时间选择
    getOutTime(value) {
      this.queryForm.gmtStockedOutFrom = value ? value[0] : '';
      this.queryForm.gmtStockedOutTo = value ? value[1] : '';
    },
    // 作废时间选择
    getBrokenTime(value) {
      this.queryForm.gmtBrokenFrom = value ? value[0] : '';
      this.queryForm.gmtBrokenTo = value ? value[1] : '';
    },
    // 切换审核状态
    selectStatus() {
      this.resetForm();
      this.search();
    },
    // 更多下拉列表选择内容
    chooseItem(row) {
      this.obj = row;
    },
    // 更多按钮组触发事件
    handleCommand(f) {
      if (f === 'cancelFreight') {
        this[f](this.obj);
      } else {
        this.openDlg(this.obj, f);
      }
    },
    // 打开弹窗
    openDlg(row, dlg) {
      if (dlg === 'chooseprintDlg') {
        this.printBtn(row);
      } else {
        this.obj = row;
        this[dlg] = true;
      }
    },
    // 关闭弹窗
    closeDialog(dlg) {
      this[dlg] = false;
    },
    // 确认修改出库仓库
    changeStock(val) {
      const data = {
        groupId: this.obj.groupId,
        stockOutWarehouseId: val.stockOutWarehouseId,
        version: this.obj.version
      };
      outstockApi.changeStockOut(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.closeDialog('outStockDlg');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 确认修改发货方式
    changeSend(val) {
      const data = {
        freightId: val.freight.freightId,
        freightServiceProvider: val.freightServiceProvider,
        version: val.freight.version
      };
      outstockApi.changeFreight(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.closeDialog('outSendDlg');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 确认绑定货运单号
    changeTrackNo(val) {
      const data = {
        freightId: val.freight.freightId,
        trackingNo: val.trackingNo,
        version: val.freight.version
      };
      outstockApi.changeTrackingNo(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.closeDialog('outTrackNoDlg');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 驳回至发货确认环节
    reject(row) {
      this.$confirm('确定要驳回此出库单至发货确认环节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outstockApi
          .rejectStockOut({ groupId: row.groupId, version: row.version })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '驳回成功!'
              });
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
      });
    },
    // 作废
    closeOrder(row) {
      this.$confirm('确定要作废此出库单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outstockApi
          .breakOutstock({ stockOutId: row.id, version: row.version })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '作废成功!'
              });
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
      });
    },
    // 提交
    submit(row) {
      this.$confirm('确定要提交此出库单吗？', '提示', { type: 'warning' }).then(
        () => {
          outstockApi
            .confirmOut({ groupId: row.groupId, version: row.version })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.getList();
              } else {
                this.$message.info(res.msg);
              }
            });
        }
      );
    },
    // 出库操作
    stockOut(val) {
      const data = {
        groupId: this.obj.groupId,
        version: this.obj.version,
        remark: val.remark,
        sns: []
      };
      val.goods.map(item => {
        data.sns.push(...item.sns);
        data.createAssetIfNotExisted = item.createAssetIfNotExisted;
      });
      outstockApi.deliverOut(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '出库成功!'
          });
          this.closeDialog('addDlg');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 打印
    printBtn(row) {
      this.obj = row;
      if (row.freight.freightProvider === 'YTO') {
        this.initPainter();
        this.chooseprintDlg = true;
      } else if (row.freight.freightProvider === 'SFEXPRESS') {
        this.printSF();
      }
    },
    // 初始化打印机
    initPainter() {
      const that = this;
      let tip;
      socket = new WebSocket('wss://localhost:13529');
      // socket = new WebSocket('ws://10.5.30.159:13528');
      socket.onopen = event => {
        console.log('打印机连接成功');
        socket.onmessage = event => {
          console.log('打印机消息： ', event);
          const data = JSON.parse(event.data);

          switch (data.cmd) {
            case 'getPrinters':
              // 获取打印机
              this.printers = data.printers;
              break;
            case 'print':
              // 打印请求返回
              if (data.status === 'success') {
                tip = that.$message({
                  message: '正在打印中,请稍候......',
                  duration: 0
                });
                that.printing = true;
              } else {
                that.$message.error('打印失败!');
              }
              break;
            case 'notifyPrintResult':
              // 打印通知
              switch (data.taskStatus) {
                case 'rendered':
                  // 渲染成功
                  break;
                case 'printed':
                  // 打印成功
                  that.printing = false;
                  tip.close();
                  that.$message.success('打印成功!');
                  break;
                case 'failed':
                  // 打印失败
                  that.printing = false;
                  tip.close();
                  that.$message.error(data.msg);
                  break;
                default:
              }
              break;
            default:
          }
        };
        socket.onclose = event => {
          console.log('打印机连接关闭', event);
        };
        const request = getRequestObject('getPrinters');
        socket.send(JSON.stringify(request));
      };
      socket.onerror = event => {
        console.log('打印机连接失败', event);
        this.$message.error('未连接打印组件!');
      };
    },
    // 打印菜鸟面单
    printCainiao(row) {
      const params = {
        freightId: this.obj.freight.freightId,
        version: this.obj.freight.version
      };
      outstockApi.getPrintInfo(params).then(res => {
        if (res.code === 200) {
          const data = JSON.parse(res.data.content);
          data.task.printer = row.printer;
          // data.task.preview = true // 预览模式
          data.requestID = getUUID(8, 16);
          data.task.taskID = getUUID(8, 16);
          socket.send(JSON.stringify(data));
          this.search();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 打印顺丰面单
    printSF() {
      const params = {
        freightId: this.obj.freight.freightId,
        version: this.obj.freight.version
      };
      outstockApi.getPrintInfo(params).then(res => {
        if (res.code === 200) {
          this.$confirm('确定要打印此面单吗？', '提示', {
            type: 'warning'
          }).then(() => {
            window.open(res.data.content);
          });
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 取消预约
    cancelFreight(row) {
      this.$confirm('确定要取消预约吗？', '提示', { type: 'warning' }).then(
        () => {
          outstockApi
            .cancelFreight({
              freightId: row.freight.freightId,
              version: row.freight.version
            })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '取消成功!'
                });
                this.getList();
              } else {
                this.$message.info(res.msg);
              }
            });
        }
      );
    },
    // 手动建单出库
    add() {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'createOutstock'
      });
    },
    // 查看客服备注
    remarkView(value) {
      this.remarkDialog = true;
      this.remarkObj = value;
    },
    // 关闭备注弹窗
    cancel() {
      this.remarkDialog = false;
    },
    resetForm() {
      for (const key in this.queryForm) {
        key === 'status' ? '' : (this.queryForm[key] = '');
      }
      this.creatTimeList = [];
      this.outTimeList = [];
      this.brokenTimeList = [];
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.outstockmanager-container {
  padding: 15px;
  .risk-status-tab {
    margin-bottom: 20px;
    margin-left: 68px;
    .el-radio-button__inner {
      padding: 12px 30px;
      font-size: 14px;
    }
  }
  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    .new-btn {
      float: right;
      font-size: 14px;
    }
    .adrs-dtl {
      display: inline-block;
      width: 200px;
      margin-left: 4px;
    }
    .paintingdiv {
      float: left;
      width: 20px;
      height: 20px;
      opacity: 1;
      background-color: #f56c6c;
      border-radius: 10px;
      animation: mymove 2s infinite;
      -webkit-animation: mymove 2s infinite;
    }
    @keyframes mymove {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @-webkit-keyframes mymove {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .outstockmanager-table {
    padding: 15px;
    background-color: #fff;
    .orderRemark {
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #4da9ec;
    }
    .tac {
      text-align: center;
    }
    .pop-btn.el-button {
      width: 100%;
      margin-right: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-button {
      // padding: 7px 7px;
      margin-right: 2px;
      margin-bottom: 2px;
    }
    .el-button + .el-button {
      margin-left: 0px;
    }
  }
}
</style>
