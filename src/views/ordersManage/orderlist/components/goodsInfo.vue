<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 14:30:08
 * @LastEditTime: 2020-08-21 11:13:17
 * @LastEditors: わからないよう
 -->
<template>
  <div class="order-goods">
    <el-card class="box-card">
      <div slot="header" class="goods-info title-info">
        <span>商品信息及支付信息</span>
      </div>
      <div class="info-content">
        <table class="table">
          <tr>
            <td class="table-td-bgcolor">总订单金额</td>
            <td>{{ goodsObj.amount + '$' }}</td>
            <td class="table-td-bgcolor">总押金</td>
            <td>
              {{ goodsObj.totalDeposit + '$' }}
            </td>
            <td class="table-td-bgcolor">支付方式</td>
            <td>
              {{ goodsObj.payChannel | payChannel }}
              <el-button v-if="goodsObj.payChannel === 'ALIPAY_AGREEMENT'" type="text" @click="record">签约查看</el-button>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">总优惠</td>
            <td>
              {{ goodsObj.discountFee + '$' }}
              <el-button type="text" @click="viewCoupon()">查看</el-button>
            </td>
            <td class="table-td-bgcolor">减免押金</td>
            <td>{{ goodsObj.freeDeposit + '$' }}</td>
            <td v-if="goodsObj.payChannel === 'ALIPAY_AUTH'" class="table-td-bgcolor">预授金额</td>
            <td v-else-if="goodsObj.payChannel === 'JD_PERIODIC' || goodsObj.payChannel === 'JD_H5'" class="table-td-bgcolor">已支付押金</td>
            <td v-else-if="goodsObj.payChannel === 'ALIPAY_AGREEMENT'" class="table-td-bgcolor">已冻结押金</td>
            <td v-else class="table-td-bgcolor">已支付押金</td>
            <td v-if="goodsObj.payChannel !== 'ALIPAY_AUTH'">{{ goodsObj.deposit + '$' }}
              <el-button v-if="goodsObj.payChannel === 'ALIPAY_ZM_FREE'" type="text" @click="record">信用记录</el-button>
              <el-button v-if="goodsObj.payChannel === 'JD_PERIODIC' || goodsObj.payChannel === 'JD_H5'" type="text" @click="record">查看押金</el-button>
            </td>
            <td v-if="goodsObj.payChannel === 'ALIPAY_AUTH'">
              {{ (goodsObj.deposit * 100 + goodsObj.payableAmount * 100)/100 + '$' }}
              <el-button type="text" @click="record">查看预授</el-button>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">应付金额</td>
            <td>{{ goodsObj.payableAmount + '$' }}</td>
            <td class="table-td-bgcolor">应付押金</td>
            <td>{{ goodsObj.deposit + '$' }}</td>
            <td class="table-td-bgcolor">已支付金额</td>
            <td>{{ goodsObj.paidAmount + '$' }}<el-button type="text" @click="billView(goodsObj.orderNo)">查看账单</el-button></td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">运费</td>
            <td>{{ goodsObj.freight + '$' }}</td>
            <td class="table-td-bgcolor">税费</td>
            <td>{{ goodsObj.taxFee + '$' }}</td>
            <td class="table-td-bgcolor">其他费用</td>
            <td>{{ goodsObj.otherFee + '$' }}</td>
          </tr>
        </table>
        <el-button :disabled="slctGoods.length === 0" type="primary" @click="mutiReturn()">批量退货</el-button>
        <el-table :data="goodsObj.orderDetailVos" border style="width:100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column label="商品" width="200px">
            <template slot-scope="scope">
              <div class="good">
                <el-popover
                  placement="top-start"
                  trigger="hover">
                  <img v-if="scope.row.productInfo && scope.row.productInfo.cover" slot="reference" :src="scope.row.productInfo.cover" class="good-img">
                  <img v-if="scope.row.productInfo && scope.row.productInfo.cover" :src="scope.row.productInfo.cover" class="good-img-popover" style="width: 200px">
                </el-popover>
                <div class="name-brief">
                  <el-tooltip v-if="scope.row.productInfo && scope.row.productInfo.name" :content="scope.row.productInfo.name" effect="light" placement="top" class="item">
                    <div v-if="scope.row.productInfo && scope.row.productInfo.name" class="good-name">{{ scope.row.productInfo.name }}</div>
                  </el-tooltip>
                  <el-tooltip :content="scope.row.productInfo.detail" class="item" effect="light" placement="top">
                    <div class="good-detail">规格：{{ scope.row.productInfo.detail }}</div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="!(goodsObj.channel === 'BY_OPERATOR' && goodsObj.tradeType === 'Sales')" :label="labelName" prop="period">
            <template slot-scope="scope">
              <span v-if="String(scope.row.period) !== 'null'">{{ scope.row.period }}
                <span v-if="scope.row.unit === '月'">个</span>{{ scope.row.unit }}
              </span>
              <span v-if="String(scope.row.period) === 'null'">--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="!(goodsObj.channel === 'BY_OPERATOR' && goodsObj.tradeType === 'Sales')" :label="labelMoney" prop="periodAmount">
            <template slot-scope="scope">
              <span v-if="String(scope.row.periodAmount) !== 'null'">{{ scope.row.periodAmount + '$' }}</span>
              <span v-if="String(scope.row.periodAmount) === 'null'">--</span>
              <span v-if="scope.row.unit">/{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalRent" label="订单金额">
            <template slot-scope="scope">
              <span v-if="goodsObj.channel === 'BY_OPERATOR'">{{ (scope.row.productInfo.onePayPrice/100).toFixed(2) * scope.row.productInfo.count + '$' }}</span>
              <span v-else>{{ scope.row.totalRent + '$' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量"/>
          <el-table-column prop="apportionDiscount" label="优惠">
            <template slot-scope="scope">
              <span>{{ scope.row.apportionDiscount + '$' }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="!goodsObj.channel === 'BY_OPERATOR'" prop="deposit" label="押金">
            <template slot-scope="scope">
              <span>{{ scope.row.deposit + '$' }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="!goodsObj.channel === 'BY_OPERATOR'" prop="freeDeposit" label="免除押金">
            <template slot-scope="scope">
              <span>{{ scope.row.freeDeposit + '$' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="序列号" class-name="number" min-width="150px">
            <template slot-scope="scope">
              <el-popover placement="top-start" trigger="hover">
                <el-button slot="reference" type="text" class="pop-btn">
                  <span
                    v-for="( item, index ) in scope.row.snList"
                    :key="item"
                  >{{ index==0?'':' ' }}{{ item }}</span>
                </el-button>
                <el-table :data="scope.row.snList" border>
                  <el-table-column label="序列号" prop="snList" width="250px">
                    <template slot-scope="scope">{{ scope.row }}</template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column v-if="goodsObj.tradeType !== 'Buyout' && goodsObj.tradeType !== 'Sales'" label="租期范围" width="200px">
            <template slot-scope="scope">
              <div>开始时间：{{ scope.row.beginTime }}</div>
              <div>结束时间：{{ scope.row.endTime }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.status | orderStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="300px">
            <template slot-scope="scope">
              <el-button type="primary" @click="childBill(scope.row.oid)">子账单</el-button>
              <el-button v-if="!scope.row.refundNo && goodsObj.status !== 10010 && goodsObj.status !== 10100" type="primary" @click="returned(scope.row)">退货</el-button>
              <div v-if="scope.row.refundNo || scope.row.renewalFlag || scope.row.buyoutFlag || (!scope.row.buyoutFlag && ( scope.row.status === 10051 || scope.row.status === 10060 )) || goodsObj.tradeType === 'Buyout' || goodsObj.tradeType === 'Renewal'" class="more-opreate">
                <el-dropdown split-button type="primary" @command="(command)=>changeClick(command,scope.row)" >
                  更多操作
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="scope.row.refundNo" command="returnedClose">撤销退货</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.refundNo" :divided="scope.row.refundNo ? true: false" command="returnStep">退货进度</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.renewalFlag || goodsObj.tradeType === 'Renewal'" command="renewal" divided>续租记录</el-dropdown-item>
                    <el-dropdown-item v-if="!scope.row.buyoutFlag && ( scope.row.status === 10051 || scope.row.status === 10060 )" command="buyOut" divided>买断价格</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.buyoutFlag || goodsObj.tradeType === 'Buyout'" command="buyOutNote" divided>买断记录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 优惠券 -->
    <el-dialog
      :visible.sync="couponDialog"
      title="优惠券"
      center>
      <el-table :data="goodsObj.discountList" border>
        <el-table-column label="优惠方式" prop="discountDesc"/>
        <el-table-column label="优惠金额">
          <template slot-scope="scope">
            <span>{{ scope.row.discountAmount + '$' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 退货申请 -->
    <el-dialog
      :visible.sync="returnDialog"
      title="退货申请"
      width="1000px"
      center>
      <el-form :model="formData" label-width="150px">
        <el-form-item label="商品名称：">
          <span>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="退货数量：">
          <el-input-number v-model="formData.count" :min="maxCount" :max="maxCount" label="退货数量"/>
        </el-form-item>
        <el-form-item label="退货类型：">
          <el-select v-model="formData.refundType">
            <el-option value="REFUND_ONLY" label="无货品回仓"/>
            <el-option :disabled="formData.status < 10042" value="REFUND_GOODS" label="需货品回仓"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.refundType === 'REFUND_GOODS'" label="回仓仓库：">
          <el-select
            v-model="formData.warehouseId"
            :remote-method="searchWarehouse"
            :loading="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入仓库名称"
            class="input-300"
            @change="chooseWarehouse"
          >
            <el-option v-if="formData.supplierMode === 3" value="dai" label="代发仓"/>
            <el-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货原因：">
          <el-autocomplete
            v-model="formData.refundReason"
            :fetch-suggestions="querySearch"
            class="input-300"
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item v-if="formData.refundType === 'REFUND_ONLY'" label="退款金额：">
          <el-input v-model="formData.poundage" class="input-180" placeholder="请填写退款金额"/>
        </el-form-item>
        <el-form-item v-if="formData.refundType === 'REFUND_GOODS'" label="退货金额：">
          <span>回仓再填写</span>
        </el-form-item>
        <el-form-item label="优惠券：">
          <el-select v-if="formData.apportionDiscount" v-model="formData.returnCoupon">
            <el-option :value="true" label="退回账户"/>
            <el-option :value="false" label="失效"/>
          </el-select>
          <span v-else>无可用优惠券</span>
        </el-form-item>
        <template v-if="formData.refundType === 'REFUND_ONLY'">
          <el-form-item label="总订单金额：">
            <span>{{ formData.totalRent }}$</span>
          </el-form-item>
          <el-form-item label="总优惠：">
            <span>{{ formData.apportionDiscount }}$</span>
          </el-form-item>
          <el-form-item label="应付金额：">
            <span>{{ formData.payableAmount }}$</span>
          </el-form-item>
          <el-form-item label="总押金：">
            <span>{{ formData.totalDeposit }}$</span>
          </el-form-item>
          <el-form-item label="免押金额：">
            <span>{{ formData.freeDeposit }}$</span>
          </el-form-item>
          <el-form-item label="应付押金：">
            <span>{{ formData.deposit }}$</span>
          </el-form-item>
          <el-form-item label="支付方式：">
            <span>{{ goodsObj.payChannel | payChannel }}</span>
          </el-form-item>
          <el-form-item :label="goodsObj.payChannel === 'ALIPAY_AUTH' ? '预授金额（冻结）' : (goodsObj.payChannel === 'JD_PERIODIC' ? '已支付押金：' : '已冻结押金：')">
            <span v-if="goodsObj.payChannel === 'ALIPAY_AUTH'">{{ formData.deposit + formData.payableAmount }}$</span>
            <span v-else>{{ formData.deposit }}$</span>
          </el-form-item>
          <el-form-item label="已支付金额：">
            <span>{{ formData.paidAmount }}$</span>
          </el-form-item>
          <el-form-item label="已返现金额：">
            <span>{{ formData.payBackMoney }}$</span>
          </el-form-item>
          <hr class="line">
          <el-form-item label="应退金额：">
            <span>{{ formData.poundage }}$</span>
          </el-form-item>
          <el-form-item label="应退押金：">
            <span>{{ formData.deposit }}$</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="close()">取消</el-button>
        <el-button type="primary" @click="refund()">确认</el-button>
      </span>
    </el-dialog>
    <!-- 退货进度弹窗 -->
    <el-dialog
      :visible.sync="returnInfo"
      title="退货进度"
      width="600px"
      center>
      <el-form :model="returnStepData" label-width="120px">
        <el-form-item label="退货单号：">
          <span>{{ returnStepData.refundNo }}</span>
        </el-form-item>
        <el-form-item label="退货时间：">
          <span>{{ returnStepData.createTime }}</span>
        </el-form-item>
        <el-form-item label="退货商品：">
          <span>{{ returnStepData.spuNo }}</span>
        </el-form-item>
        <el-form-item label="退货数量：">
          <span>{{ returnStepData.refundCount }}</span>
        </el-form-item>
        <el-form-item label="退货类型：">
          <span v-if="returnStepData.refundType === 'REFUND_GOODS'">需货品回仓</span>
          <span v-if="returnStepData.refundType === 'REFUND_ONLY'">无货品回仓</span>
        </el-form-item>
        <el-form-item label="退货原因：">
          <span>{{ returnStepData.refundReason }}</span>
        </el-form-item>
        <!-- <el-form-item label="退款手续费：">
          <span>{{ returnStepData.poundage }}</span>
        </el-form-item> -->
        <el-form-item v-if="returnStepData.poundageType === 'REFUND'" label="应退金额：">
          <span>{{ returnStepData.poundage + '$' }}</span>
        </el-form-item>
        <el-form-item v-if="returnStepData.poundageType === 'RECIEVE'" label="应收金额：">
          <span>{{ returnStepData.poundage + '$' }}</span>
        </el-form-item>
        <el-form-item label="应解冻押金：">
          <span>{{ returnStepData.refundDeposit + '$' }}</span>
        </el-form-item>
        <el-form-item label="优惠券：">
          <span v-if="returnStepData.isRefundCoupon ===1">退回账户</span>
          <span v-if="returnStepData.isRefundCoupon === 0">失效</span>
        </el-form-item>
        <el-form-item label="操作人记录：">
          <el-steps :active="1" direction="vertical">
            <el-step v-for="(item,index) in returnStepData.operateLog" :key="index" :title="item.content" :description="item.username + ' ' + item.operateTime"/>
          </el-steps>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看账单弹窗 -->
    <el-dialog
      :visible.sync="billDialog"
      title="查看账单"
      center
      width="1000px">
      <el-table :data="billData" border>
        <el-table-column prop="dividedNum" label="账期">
          <template slot-scope="scope">
            <span v-if="scope.row.dividedNum">第{{ scope.row.dividedNum }}期</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectedTime" label="账期时间"/>
        <el-table-column prop="payAmount" label="应付金额">
          <template slot-scope="scope">
            <span>{{ scope.row.payAmountYuan + '$' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付渠道">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | payTypeFilter }}</span>
            <span v-if="scope.row.balanceEnable">、余额</span>
          </template>
        </el-table-column>
        <el-table-column label="使用余额" prop="balanceMoneyYuan"/>
        <el-table-column prop="outTradeNo" label="支付单号"/>
        <el-table-column prop="tradeNo" label="第三方交易流水号"/>
        <el-table-column prop="payTime" label="实际支付时间"/>
        <el-table-column label="逾期天数" prop="delayTime">
          <template slot-scope="scope">
            <span>{{ scope.row.delayTime }}天</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | payStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="responseDes" label="支付接口返回信息"/>
        <el-table-column v-if="origin === 'parent'" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="payLog(scope.row)">支付日志</el-button>
            <el-button v-if=" scope.row.status === 1 || scope.row.status === 2" type="primary" plain @click="changeStatus(scope.row)">修改状态</el-button>
            <el-button v-if=" scope.row.status === 1 || scope.row.status === 2" type="primary" plain @click="payAgin(scope.row)">发起支付</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 支付日志弹窗 -->
    <el-dialog :visible.sync="payDialog" title="支付日志" center>
      <el-table :data="payInfo" border>
        <el-table-column label="支付时间" prop="gmtCreated"/>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | payStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付渠道">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | payTypeFilter }}</span>
            <span v-if="scope.row.balanceEnable">、余额</span>
          </template>
        </el-table-column>
        <el-table-column label="支付金额（$）">
          <template slot-scope="scope">
            <span>{{ scope.row.amountYuan }}$</span>
          </template>
        </el-table-column>
        <el-table-column label="支付接口返回信息" prop="responseDes"/>
        <el-table-column label="备注" prop="reason"/>
      </el-table>
      <div slot="footer">
        <el-button type="info" @click="closePayDialog()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="renewalDialog"
      title="续租记录"
      center>
      <el-table :data="renewalObj" border>
        <el-table-column label="续租次数">
          <template slot-scope="scope">
            <span v-if="scope.$index ===0 ">原始订单</span>
            <span v-else>续租订单{{ scope.$index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <a v-if="scope.row.tid !== goodsObj.orderNo" href="javascript:;" type="text" class="a-color" @click="buyOfRenewal(scope.row)">{{ scope.row.tid }}</a>
            <span v-else>{{ scope.row.tid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="租期" prop="period">
          <template slot-scope="scope">
            <span>{{ scope.row.period }}{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime"/>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="buyOutDialog" title="买断价格" center width="550px">
      <el-form ref="formBuyOut" :model="formBuyOut" :rules="buyOutRule" label-width="100px">
        <el-form-item label="买断售价：" prop="price">
          <el-input v-model="formBuyOut.price" class="input-200" placeholder="请填写买断价格"/>(单价)
        </el-form-item>
        <span class="buyout-tip">用户买断实际支付金额 = 买断售价 * 订单商品数量 - 订单已支付金额（包含续租和优惠券）</span>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancelBuyOut()">取消</el-button>
        <el-button type="primary" @click="submitBuyOut('formBuyOut')">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="buyNoteDialog" title="买断记录" center>
      <el-table :data="buyOutObj" border>
        <el-table-column label="续租次数">
          <template slot-scope="scope">
            <span v-if="scope.$index ===0 ">原始订单</span>
            <span v-else>买断订单{{ scope.$index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <a v-if="scope.row.tid !== goodsObj.orderNo" href="javascript:;" type="text" class="a-color" @click="buyOfRenewal(scope.row)">{{ scope.row.tid }}</a>
            <span v-else>{{ scope.row.tid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="买断价格" prop="totalRent"/>
        <el-table-column label="下单时间" prop="createTime"/>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="statusDialog" title="修改账单状态" center>
      <el-form ref="billObj" :model="billObj" :rules="billObjRule" label-width="150px">
        <el-form-item label="账单状态：" prop="status">
          <el-select v-model="billObj.status">
            <el-option :value="1" label="待支付"/>
            <el-option :value="0" label="已完成（线下转账）"/>
            <el-option :value="3" disabled label="已关闭"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="billObj.remark" :rows="3" type="textarea" placeholder="请填写备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="closeStatus()">取消</el-button>
        <el-button type="primary" @click="submitStatus('billObj')">完成</el-button>
      </div>
    </el-dialog>
    <record-dialog :show="recordDialog" :data-source="recordObj" @handClose="closeRecord"/>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
import billApi from '@/api/order/bill.js'
import warehouseApi from '@/api/warehouse/warehouse';
import recordDialog from './record'
export default {
  components: {
    'record-dialog': recordDialog
  },
  props: {
    goodsObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    var checkBuyOut = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'));
      } else if (isNaN(value)) {
        callback(new Error('填写数字'))
      } else if (!/^[0-9]+(.[0-9]*)?$/.test(value)) {
        callback(new Error('填写有效数字'));
      } else if (value * 1 < 0 || value * 1 === 0) {
        callback(new Error('必须大于0'));
      } else if (value * 1 > 9999999) {
        callback(new Error('价格过大'));
      } else {
        callback()
      }
    }
    return {
      restaurants: [
        { value: '用户不想要' },
        { value: '商品库存不足' },
        { value: '发错货' }
      ], // 退货建议
      origin: 'parent',
      labelName: '租期',
      labelMoney: '租金',
      maxCount: 1,
      payInfo: [],
      couponDialog: false, // 优惠券弹窗
      returnDialog: false, // 退货弹窗
      returnInfo: false, // 退货进度弹窗
      billDialog: false, // 查看账单信息
      payDialog: false, // 支付日志弹窗
      statusDialog: false, // 修改账单状态
      recordDialog: false, // 预授权、押金记录弹窗
      recordObj: {}, // 预授权、押金记录数据
      billObj: {},
      parentNo: '', // 存储查看付账单时的订单号
      status: '',
      num1: 1,
      formBuyOut: {},
      buyOutObj: [], // 买断记录
      buyOutDialog: false,
      buyNoteDialog: false,
      returnStepData: {}, // 退货进度数据
      billData: [], // 账单数据
      renewalObj: [],
      slctGoods: [], // 已选批量退货商品列表
      renewalDialog: false,
      activeNames: '', // 折叠面板
      value: '',
      returnType: 1, // 退款方式 1退款 2扣款
      money: '',
      warehouses: [],
      formData: {
        refundReason: '用户不想要',
        refundType: 'REFUND_ONLY',
        returnType: 'RECIEVE',
        warehouseId: '',
        supplierMode: '',
        returnCoupon: true
      }, // 退货申请
      goodsData: [
        {
          termType: 3
        }
      ],
      buyOutRule: {
        price: [
          { required: true, validator: checkBuyOut, trigger: 'blur' }
        ]
      },
      billObjRule: {
        status: [
          { required: true, message: '请选择账单状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请填写修改备注', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    goodsObj: {
      handler(value) {
        console.log('订单信息', value);
        if (this.goodsObj.ordersProductInfo && this.goodsObj.ordersProductInfo[0].businessType === 0) {
          this.labelName = '租期';
          this.labelMoney = '租金';
        } else if (this.goodsObj.ordersProductInfo && this.goodsObj.ordersProductInfo[0].businessType === 20) {
          this.labelName = '分期';
          this.labelMoney = '分期金额';
        }
        console.log('htis.labelName', this.labelName, 'this.labelMoney', this.labelMoney);
      },
      deep: true
    }
  },
  methods: {
    // 退货原因建议
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 查看续租、买断订单详情
    buyOfRenewal(row) {
      console.log('查看续租订单', row);
      this.buyNoteDialog = false;
      this.renewalDialog = false;
      this.$emit('refresh', { no: row.tid, origin: 1000 });
    },
    // 下拉操作按钮
    changeClick(command, row) {
      switch (command) {
        case 'returnedClose':
          this.returnedClose(row);
          break;
        case 'returnStep':
          this.returnStep(row);
          break;
        case 'renewal':
          this.renewal(row);
          break;
        case 'buyOut':
          this.buyOut(row);
          break;
        case 'buyOutNote':
          this.buyOutNote(row);
          break;
      }
    },
    closePayDialog() {
      this.payDialog = false;
    },
    // 买断价格
    buyOut(row) {
      this.buyOutDialog = true;
      this.$set(this.formBuyOut, 'orderNo', row.oid);
      this.$set(this.formBuyOut, 'price', row.buyoutPrice)
    },
    cancelBuyOut() {
      this.buyOutDialog = false;
    },
    submitBuyOut(formBuyOut) {
      this.$refs[formBuyOut].validate(valid => {
        if (valid) {
          orderApi.buyOutPrice(this.formBuyOut).then(res => {
            console.log('买断', res);
            if (res.code === 200) {
              this.$message.success('添加成功！')
              this.buyOutDialog = false;
              this.$emit('refresh', { origin: 1111 });
            } else {
              this.$message.error(res.msg);
            }
          })
        } else {
          this.$message.error('请填写买断价格');
          return false;
        }
      })
    },
    // 买断记录
    buyOutNote(row) {
      this.buyNoteDialog = true;
      orderApi.buyOutLog({ orderNo: row.oid }).then(res => {
        if (res.code === 200) {
          this.buyOutObj = res.data;
          console.log('res', res);
        }
      })
    },
    // 查看续租记录
    renewal(value) {
      this.renewalDialog = true;
      this.getRenewal(value.oid);
    },
    getRenewal(value) {
      orderApi.renewalLog({ orderNo: value }).then(res => {
        if (res.code === 200) {
          this.renewalObj = res.data;
          console.log('续租记录', res);
        }
      })
    },
    // 查看优惠券
    viewCoupon() {
      this.couponDialog = true;
    },
    handleSelectionChange(val) {
      this.slctGoods = val;
    },
    mutiReturn() {
      let goodHTML = '<p>请确认以下商品批量退货：</p><ul>'
      this.slctGoods.map(item => {
        goodHTML += `<li>${item.productInfo.name} ${item.productInfo.detail ? '【' + item.productInfo.detail + '】' : ''}</li>`
      })
      goodHTML += '</ul>'
      this.$confirm(goodHTML, '确认批量退货', { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
        // orderApi.renewalLog({ goodList: this.slctGoods }).then(res => {
        //   if (res.code === 200) {
        //     this.$message.success('批量退货成功');
        //     this.$emit('refresh', { origin: 1111 });
        //   } else {
        //     this.$message.error(res.msg);
        //   }
        // });
      });
    },
    // 撤销退货申请
    returnedClose(value) {
      orderApi.returnedClose({ refundNo: value.refundNo }).then(res => {
        if (res.code === 200) {
          this.$message.success('撤销成功！');
          this.$emit('refresh', { origin: 1111 });
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 退货操作
    returned(value) {
      console.log('退货数据', value);
      this.returnDialog = true;
      this.formData = {
        ...value
      }
      this.maxCount = value.count
      this.$set(this.formData, 'refundReason', '用户不想要')
      this.$set(this.formData, 'refundType', 'REFUND_ONLY')
      this.$set(this.formData, 'returnType', 'RECIEVE')
      this.$set(this.formData, 'returnCoupon', true)
      this.$set(this.formData, 'name', value.productInfo.name)
      this.$set(this.formData, 'orderType', 'OID')
    },

    // 搜索仓库
    searchWarehouse(query) {
      if (query !== '') {
        const data = {
          page: 1,
          pageSize: 10,
          enabled: true,
          name: query
        };
        warehouseApi.getStockList(data).then(res => {
          if (res.code === 200) {
            this.warehouses = res.data.list;
          } else {
            this.$message.info(res.msg);
          }
        });
      } else {
        this.warehouses = [];
      }
    },
    // 选中仓库
    chooseWarehouse(id) {
      this.formData.warehouseId = id;
    },
    // 打开退货进度弹窗
    returnStep(row) {
      this.returnInfo = true;
      orderApi.viewReturned({ refundNo: row.refundNo }).then(res => {
        if (res.code === 200) {
          this.returnStepData = res.data;
        }
      })
    },
    // 关闭退货申请弹窗
    close() {
      this.returnDialog = false;
    },
    // 退货申请
    refund() {
      if (this.formData.refundType === 'REFUND_ONLY' && this.formData.poundage === '') {
        this.$message.warning('退款金额不能为空！');
        return;
      }
      if (this.formData.warehouseId === '' && this.formData.refundType === 'REFUND_GOODS') {
        this.$message.warning('请选择回仓仓库！');
        return;
      }
      if (this.formData.poundage > this.formData.paidAmount) {
        this.$message.warning('退款金额不能大于实付金额！');
        this.formData.poundage = null;
        return;
      }
      this.formData.warehouseId === 'dai' ? this.formData.warehouseId = '' : ''
      const data = {
        count: this.formData.count,
        orderType: 'OID',
        poundage: this.formData.poundage,
        no: this.formData.oid,
        refundReason: this.formData.refundReason,
        refundType: this.formData.refundType,
        warehouseId: this.formData.warehouseId,
        returnCoupon: this.formData.returnCoupon
      }
      orderApi.returnApplication(data).then(res => {
        if (res.code === 200) {
          this.$message.success('申请成功！');
          this.$emit('refresh', { origin: 1111 });
          this.returnDialog = false;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 查看父账单信息
    billView(no) {
      this.origin = 'parent';
      console.log('查看账单');
      this.parentNo = no; // 方便修改账单状态时刷新
      this.billDialog = true;
      billApi.orderBill(no).then(res => {
        if (res.code === 200) {
          this.billData = res.data;
        }
      })
    },
    // 查看子账单信息
    childBill(no) {
      this.origin = 'child';
      console.log('查看账单');
      this.billDialog = true;
      this.viewChilBill(no);
    },
    // 查看子账单信息
    viewChilBill(no) {
      billApi.childBill(no).then(res => {
        if (res.code === 200) {
          this.billData = res.data;
        }
      })
    },
    // 查看支付日志
    payLog(row) {
      this.payDialog = true;
      if (this.origin === 'parent') {
        billApi.orderPayLog(row.id).then(res => {
          if (res.code === 200) {
            this.payInfo = res.data;
          }
        })
      } else if (this.origin === 'child') {
        billApi.childPayLog(row.id).then(res => {
          if (res.code === 200) {
            this.payInfo = res.data;
          }
        })
      }
    },
    //  打开修改父账单状态弹窗
    changeStatus(row) {
      this.statusDialog = true;
      console.log('修改状态', row);
      this.billObj = row;
    },
    // 父账单发起支付
    payAgin(row) {
      const loading = this.$loading({
        lock: true,
        text: '支付中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      billApi.payAgin(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('支付成功！');
          this.billView(this.parentNo);
        } else {
          this.$message.info(res.msg);
        }
        loading.close();
      })
    },
    // 查看预授权、解冻记录
    record() {
      this.recordDialog = true;
      this.recordObj = this.goodsObj;
    },

    // 关闭预授权、解冻记录弹窗
    closeRecord(val) {
      this.recordDialog = false;
    },
    // 提交修改父账单状态
    submitStatus(billObj) {
      this.$refs[billObj].validate(valid => {
        if (valid) {
          billApi.billStatus(this.billObj.id, { status: this.billObj.status, remark: this.billObj.remark }).then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功！');
              this.statusDialog = false;
              this.billView(this.parentNo);
              this.$refs['billObj'].resetFields();
            } else {
              this.$message.info(res.msg);
            }
          })
        } else {
          return false;
        }
      })
    },
    closeStatus() {
      this.statusDialog = false;
      this.$refs['billObj'].resetFields();
      this.$refs['billObj'].clearValidate();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .order-goods {
    .box-card {
      margin-bottom: 16px;
      .title-info {
        padding: 10px 10px 10px 15px;
        border-left: 2px solid #2592FC;
        background-color: #f3f3f3;
      }
      .order-status {
        margin-left: 40px;
        color: orange;
      }
      .left-text {
        text-align: right;
      }
      .good {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        white-space: nowrap;
        overflow: hidden;
        .name-brief {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
        }
        .good-name, .good-detail {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .good-detail {
          color: #b7b5b5;
        }
        .good-img {
          width: 40px;
          height: 40px;
        }
        .good-img-popover {
          width: 200px;
          height: 200px;
        }
      }
    }
    .more-opreate {
      display: inline-block;
      margin-left: 10px;
    }
    .table{
      width: 100%;
      margin-bottom: 20px;
      border: 1px solid #ebeef5;
      border-collapse: collapse;
      tr td:nth-of-type(1){
        width: 12%;
      }
      tr td:nth-of-type(3){
        width: 12%;
      }
      tr td:nth-of-type(5){
        width: 12%;
      }
      tr td:nth-of-type(7){
        width: 12%;
      }
    }
    .table tr td{
      border: 1px solid #ebeef5;
      text-align: center;
      height:36px;
      font-size: 12px;
      color: #606266;
      padding: 0 6px;
      box-sizing: border-box;
    }
    .table-td-bgcolor{
      background: #FAFAFA;
    }
    .line {
      width: 90%;
      color: #cccccc;
    }
    .buyout-tip {
      font-size: 10px;
      color: red;
    }
  }
</style>
<style lang="scss">
  .el-table {
    .number {
      padding: 0;
      .cell {
        padding: 0;
        div div:last-of-type {
          border-bottom: 0;
        }
      }
    }
  }
</style>
