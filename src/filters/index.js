// set function parseTime,formatTime to filter
import i18n from './../lang'; // Internationalization
export { parseTime, formatTime } from '@/utils';

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      );
    }
  }
  return num.toString();
}

export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

// 筛选渠道
export function filtrateChannel(value) {
  switch (value) {
    case '0':
      return '生活号';
    case '1':
      return '花呗';
    case '2':
      return '微信小程序';
    case '3':
      return '微信分销';
    case '4':
      return '支付宝小程序';
    default:
      break;
  }
}

// 状态
export function filtrateStatus(value) {
  value = value + '';
  switch (value) {
    case '0':
      return '未开始';
    case '1':
      return '进行中';
    case '2':
      return '已结束';
    case '3':
      return '已撤销';
    case '-1':
      return '已删除';
    default:
      break;
  }
}

// 状态
export function filtrGoodsStatus(value) {
  switch (value * 1) {
    case 0:
      return '在库';
    case 10:
      return '租赁';
    case 20:
      return '已售';
    default:
      break;
  }
}

// 资产状态
export function filtrAssestStatus(value) {
  switch (value) {
    case 'CREATED':
      return '新建档';
    case 'IN_STOCK':
      return '在仓库';
    case 'IN_TRANSIT':
      return '在途中';
    case 'RENTING':
      return '租赁中';
    case 'SELLING':
      return '售卖中';
    case 'TRANSFERRED':
      return '已转让';
    default:
      break;
  }
}

export function orderStatusFilter(value) {
  var str = String(value);
  switch (str) {
    case '10010':
      return '待支付';
    case '10020':
      return '支付结果确认中';
    case '10031':
      return '待风控审核';
    case '10032':
      return '风控审核通过';
    case '10033':
      return '风控审核拒绝';
    case '10034':
      return '风控自动拒绝';
    case '10035':
      return '处理中';
    case '10036':
      return '风控自动通过';
    case '10041':
      return '待发货';
    case '10042':
      return '待买家确认收货';
    case '10051':
      return '租赁中';
    case '10052':
      return '分期还款中';
    case '10060':
      return '物品待归还';
    case '10061':
      return '待确认物流';
    case '10062':
      return '归还中';
    case '10064':
      return '已归还';
    case '10065':
      return '订单已完成';
    case '10066':
      return '已续租';
    case '10067':
      return '已买断';
    case '10068':
      return '坏账';
    case '10071':
      return '买家申请退款，待审核';
    case '10072':
      return '同意退款，等待买家退货';
    case '10073':
      return '买家已退货，待卖家确认收货';
    case '10074':
      return '退货中';
    case '10080':
      return '部分退款成功';
    case '10090':
      return '退款成功';
    case '10100':
      return '订单已取消';
  }
}
export function channelFilter(value) {
  switch (value) {
    case 'ALIPAY_LIFE':
      return '支付宝生活号';
    case 'APLIPAY_MINI_PROGRAM':
      return '支付宝小程序';
    case 'APP':
      return 'APP';
    case 'BLUEAIR':
      return 'BLUEAIR';
    case 'DingDing':
      return '钉钉';
    case 'FenXiao':
      return '微信分销';
    case 'HuaBei':
      return '花呗';
    case 'JDBT':
      return '京东白条';
    case 'USA':
      return '北美';
    case 'WeChat':
      return '微信小程序';
    case 'YC_ALIPAY_LIFE':
      return '语橙生活号';
    case 'M_STATION':
      return 'm站';
    case 'BY_OPERATOR':
      return '手工建单';
    case 'TAO_ZU_GONG':
      return '淘租公';
    case 'STAGING':
      return 'STAGING';
  }
}
export function riskaRule(value) {
  switch (value) {
    case 'EQ':
      return '等于';
    case 'GT':
      return '大于';
    case 'GE':
      return '大于等于';
    case 'LT':
      return '小于';
    case 'LE':
      return '小于等于';
    case 'NE':
      return '不等于';
    default:
      return '';
  }
}
export function refundStatus(value) {
  value = value + '';
  switch (value) {
    case '10111':
      return '待客服确认提交';
    case '10112':
      return '财务待审核';
    case '10113':
      return '待财务确认退收款';
    case '10114':
      return '退货单已取消';
    case '10115':
      return '退货已完成';
    default:
      return '--';
  }
}
export function goodsType(value) {
  value = value + '';
  switch (value) {
    case '1':
      return '普通商品';
    case '2':
      return '套餐商品';
  }
}
export function payStatus(value) {
  switch (value) {
    case 0:
      return '支付完成';
    case 1:
      return '待支付';
    case 3:
      return '已关闭';
    default:
      return '支付失败';
  }
}
export function payChannel(value) {
  switch (value) {
    case 'JD_H5':
      return '京东H5支付';
    case 'ALIPAY':
      return '支付宝一次性';
    case 'APPLET_WX':
      return '微信一次性';
    case 'SERVICE_WINDOW_ALIPAY':
      return '支付宝生活号一次性';
    case 'APPLET_ALIPAY':
      return '支付宝小程序一次性';
    case 'JD_PERIODIC':
      return '京东分期';
    case 'ALIPAY_AGREEMENT':
      return '支付宝免密';
    case 'ALIPAY_AUTH':
      return '支付宝预授权';
    case 'HUA_BEI':
      return '花呗';
    case 'ALIPAY_ZM_FREE':
      return '支付宝信用免密支付';
    case 'APP_ALIPAY_PAY':
      return '支付宝一次性';
    case 'TRANSFER':
      return '线下转账';
    case 'BRAINTREE_PAYPAL_CHECKOUT':
      return 'PAYPAL';
    case 'LIFE_WX':
      return '微信一次性支付';
  }
}
export function payTypeFilter(value) {
  const val = parseInt(value);
  switch (val) {
    case 0:
      return '京东H5支付';
    case 1:
      return '支付宝一次性支付';
    case 2:
      return '微信一次性支付';
    case 3:
      return '生活号一次性支付';
    case 4:
      return '支付宝小程序一次性支付';
    case 5:
      return '微信一次性支付';
    case 6:
      return '微信一次性支付';
    case 10:
      return '京东签约代扣';
    case 11:
      return '支付宝免密';
    case 12:
      return '支付宝预授权';
    case 13:
      return '花呗';
    case 14:
      return '支付宝免密';
    case 30:
      return '支付宝芝麻信用免密';
    case 31:
      return '支付宝一次性';
    case 60:
      return 'PayPal';
  }
}
// 单位过滤器
export function unitFilter(value) {
  switch (value) {
    case 'DAY':
      return i18n.t('good.day');
    case 'MONTH':
      return i18n.t('good.month');
    default:
      '';
  }
}
export function goodsFilter(val, source) {
  for (let i = 0; i < source.length; i++) {
    if (val === source[i].no) {
      console.log('source[i]', source[i].name);
      return source[i].name;
    }
  }
}

// 短信发送场景
export function messageType(val) {
  switch (val) {
    case 'REGISTER':
      return '用户注册';
    case 'USER_LOGIN':
      return '用户登录';
    case 'BIND_MOBILE':
      return '绑定手机号';
    case 'RESET_PASSWORD':
      return '重置密码';
    case 'UPDATE_MOBILE,':
      return '更新手机号';
    case 'SEND_GOODS':
      return '发货';
    case 'EXPIRE_NOTICE':
      return '租赁到期';
    case 'BEFORE_PAY':
      return '代扣通知';
    case 'OVER_DUE':
      return '逾期通知';
    case 'RISK_NOTICE':
      return '风控通知';
  }
}

export function orderType(val) {
  switch (val) {
    case 'Sales':
      return '售卖';
    case 'Renewal':
      return '续租';
    case 'Buyout':
      return '买断';
    case 'Lease':
      return '租赁';
  }
}

// 优惠券时间
export function timeFilter(val) {
  switch (val) {
    case 'DAY':
      return '天';
    case 'HOUR':
      return '小时';
    case 'MINUTE':
      return '分钟';
  }
}

// 返回时间格式化
export function reTimeFilter(val) {
  if (!val) return '';
  return val.split('T')[0] + ' ' + val.split('T')[1].slice(0, 8);
}

// 合作状态
export function cooperationStatus(val) {
  val = Number(val);
  switch (val) {
    case 1:
      return '合作中';
    case 0:
      return '未合作';
  }
}
// 企业返佣规则
export function planStatus(val) {
  val = Number(val);
  switch (val) {
    case 1:
      return '方案一';
    case 2:
      return '方案二';
  }
}
// 结算方式
export function settleStatus(val) {
  val = Number(val);
  switch (val) {
    case 1:
      return '结算至合伙人余额';
    case 2:
      return '结算至企业余额';
  }
}

// 实名信息审核状态
export function realNameStatus(val) {
  val = Number(val);
  switch (val) {
    case 0:
      return '待审核';
    case 1:
      return '审核拒绝';
    case 2:
      return '审核通过';
  }
}

// 采购单状态
export function purchaseStatusFilter(val) {
  switch (val) {
    case 'SAVED':
      return '待提交';
    case 'SUBMITTED':
      return '待入库';
    case 'PART_IN_WAREHOUSE':
      return '部分入库';
    case 'ALL_IN_WAREHOUSE':
      return '已入库';
    case 'INVALID':
      return '已取消';
    case 'FINISHED':
      return '已完成';
  }
}

export function settlementStatusFilter(val) {
  switch (val) {
    case 'UNBALANCED':
      return '待结算';
    case 'SETTLED':
      return '已结算';
    case 'PARTLY_SETTLED':
      return '部分结算'
  }
}

export function supplierFilter(val) {
  switch (val) {
    case 'SUPPLY':
      return '自营_常规';
    case 'DELIVER':
      return '自营_代发';
    case 'SELLING':
      return '代租售';
  }
}

export function suppliertimeFilter(val) {
  switch (val) {
    case 'BILL_DATE':
      return '采购单提交时间';
    case 'RECEIPT_DATE':
      return '按入库时间';
    case 'ILL_DATE':
      return '用户账单时间';
    case 'PAYMENT_DATE':
      return '用户实际支付时间';
  }
}
