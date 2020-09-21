<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-05 10:52:45
 * @Description: file content
 -->
<template>
  <div class="list-add-order-container">
    <div>
      <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="base-info title-info">
        <span>手动建单</span>
      </div>
      <div class="tips">个人订单不建议走手工建单，建议企业采购走该流程</div>
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="130px" status-icon>
        <el-form-item label="订单类型" prop="goodsBusinessModel">
          <el-radio-group v-model="formData.goodsBusinessModel" @change="goodsBusinessModelChange">
            <el-radio label="RENTING">租赁订单</el-radio>
            <el-radio label="SELLING">售卖订单</el-radio>
            <el-radio label="STAGING">Staging订单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户" prop="partnerType">
          <el-radio-group v-model="formData.partnerType">
            <el-radio label="gg">个人用户</el-radio>
            <el-radio label="qq">企业客户</el-radio>
          </el-radio-group>
          <el-button type="primary" class="add-user" @click="addUser()">新增{{ formData.partnerType == 'gg'? '个人用户':'企业客户' }}</el-button>
        </el-form-item>
        <el-form-item v-if="formData.partnerType == 'gg'" prop="user" label="">
          <el-select v-model="formData.user" :remote-method="userSearch" filterable remote reserve-keyword placeholder="请输入用户手机号" class="input-300">
            <el-option v-for="item in userList" :key="item.uid" :label="item.mobile" :value="item.mobile">{{ item.mobile }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.partnerType == 'qq'" prop="enterprise" label="">
          <el-select v-model="formData.enterprise" :remote-method="enterpriseSearch" filterable remote reserve-keyword placeholder="请输入企业名称" class="input-300">
            <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" prop="name">
          <el-input v-model="formData.name" maxlength="20" placeholder="请填写收件人姓名" class="input-300"/>
        </el-form-item>
        <el-form-item label="收货联系方式" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请填写收件手机号" class="input-300"/>
        </el-form-item>
        <el-form-item label="收货地址" prop="detail">
          <el-input v-model="formData.detail" class="input-300" placeholder="Street and number, P.O. box, c/o." />
        </el-form-item>
        <el-form-item prop="street">
          <el-input v-model="formData.street" class="input-300" placeholder="Apartment, suite, unit, building, floor, etc." />
        </el-form-item>
        <el-form-item label="城市" prop="cityCode">
          <el-select v-model="formData.cityCode" :placeholder="$t('warehouse.iptcity')" class="input-300" filterable @change="selectCity">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" class="required-item">
          <div><el-button type="text" @click="addGood()">添加商品</el-button></div>
          <el-form ref="goodForm" :model="goodForm" :rules="goodForm.rules" status-icon class="spec-detail-form">
            <el-table :data="goodForm.tableData" border>
              <el-table-column label="SKUID" prop="id"/>
              <el-table-column label="商品名称" prop="spuName">
                <template slot-scope="scope">
                  <span>{{ scope.row.spuName }}</span>
                  <span v-if="scope.row.detail"> [{{ scope.row.detail }}]</span>
                </template>
              </el-table-column>
              <el-table-column label="业务类型" prop="businessType">
                <template slot-scope="scope">
                  <span v-if="scope.row.businessType === 0">租赁</span>
                  <span v-if="scope.row.businessType ===20">售卖</span>
                </template>
              </el-table-column>
              <el-table-column label="下单数量" prop="quantity">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.quantity" maxlength="5" placeholder="请填写下单数量" @change="(val)=>{changeNum(scope.row, val)}"/>
                </template>
              </el-table-column>
              <el-table-column v-if="formData.goodsBusinessModel === 'RENTING'" label="租期" prop="chooseStage">
                <template slot-scope="scope">
                  <span>{{ scope.row.chooseStage.stageNumber }}{{ scope.row.chooseStage.unit=='月'?'个月':'天' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="formData.goodsBusinessModel !== 'STAGING'" label="单价" prop="unitPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.unitPrice'" :rules="goodForm.rules.unitPrice" class="unitPriceitem">
                    <el-input v-model="scope.row.unitPrice" placeholder="请输入单价"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column v-if="formData.goodsBusinessModel !== 'STAGING'" label="商品总价" prop="quantity">
                <template slot-scope="scope">
                  {{ getTotalPrice(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column v-if="formData.goodsBusinessModel !== 'STAGING'" label="优惠" prop="discountPrice">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.discountPrice" placeholder="请填写优惠金额" @change="(val)=>{changeSup(scope.row, val)}"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button type="danger" plain icon="el-icon-delete" @click="deleteGood(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-form-item>
        <el-form-item v-if="formData.goodsBusinessModel === 'STAGING'" label="租赁时长" prop="rentTime">
          <el-date-picker v-model="timeArr" :default-time="['00:00:00', '23:59:59']" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" @change="getTime"/>
        </el-form-item>
        <el-form-item v-if="formData.goodsBusinessModel === 'STAGING'" label="商品总价" prop="goodsTotalPrice">
          <el-input v-model="formData.goodsTotalPrice" maxlength="20" placeholder="请填写商品总价" class="input-300"/>$
        </el-form-item>
        <el-form-item label="运费" prop="logisticFee">
          <el-input v-model="formData.logisticFee" maxlength="20" placeholder="请填写运费" class="input-300"/>$
        </el-form-item>
        <el-form-item label="其他费用" prop="otherFee">
          <el-input v-model="formData.otherFee" maxlength="20" placeholder="如税费等其他额外增加费用" class="input-300"/>$
        </el-form-item>
        <el-form-item label="结算方式" prop="status">
          <el-select v-model="formData.status" class="input-300">
            <!-- <el-option :value="0" label="线上付款"/> -->
            <el-option :value="1" label="线下转账"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" :rows="4" type="textarea" class="input-300" placeholder="填写备注"/>
        </el-form-item>
        <el-form-item label="订单总额">
          <span> {{ totalMoney }} $</span>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" class="create-order-btn" @click="save()">创建订单</el-button>
      </div>
    </el-card>
    <add-goods :show="addGoodDialog" :order-type="formData.goodsBusinessModel" @handClose="closeDialog" @handOk="addGoodSubmit"/>
    <add-user :show="addUserDialog" :user-type="formData.partnerType" @handClose="closeDialog" @handOk="addGoodSubmit"/>
  </div>
</template>

<script>
import store from '@/store';
import locationList from '@/assets/location/location';
import { deepClone } from '@/utils/index.js';
import { mapGetters } from 'vuex';
import { managementList } from '@/api/member'
import { formatAddress } from '@/utils/index';
import { rqGetEnterprises } from '@/api/purchase/index'
import orderApi from '@/api/order/order.js'
import addGoods from './addGoods'
import addUser from './addUser'
export default {
  components: {
    addGoods,
    addUser
  },
  data() {
    var checkNum = (rule, value, callback) => {
      const znum = /^(0?|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!znum.test(value)) {
        callback(new Error('请填写正确的数字'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        goodsBusinessModel: 'RENTING',
        partnerType: 'gg',
        user: '',
        enterprise: '',
        name: '',
        mobile: '',
        detail: '',
        street: '',
        cityCode: '',
        cityName: '',
        provinceName: '',
        provinceCode: '',
        goodsTotalPrice: '',
        logisticFee: '',
        otherFee: '',
        status: 1,
        remark: ''
      },
      goodForm: {
        tableData: [],
        rules: {
          unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }]
        }
      },
      timeArr: [], // 租赁时间范围
      addGoodDialog: false,
      addUserDialog: false,
      userList: [],
      enterpriseList: [],
      cityList: locationList,
      formRule: {
        goodsBusinessModel: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
        partnerType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        user: [{ required: true, message: '请输入用户电话', trigger: 'change' }],
        enterprise: [{ required: true, message: '请输入企业名称', trigger: 'change' }],
        name: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }, { min: 1, max: 15, message: '姓名格式不正确', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入收件手机号', trigger: 'blur' }, { min: 1, max: 15, message: '手机号格式不正确', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入具体地址', trigger: 'blur' }],
        street: [{ required: true, message: '请输入街道信息', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请输入城市名称', trigger: 'blur' }],
        provinceCode: [{ type: 'string', required: true, message: '请选择省份', trigger: 'change' }],
        goodsTotalPrice: [{ required: true, message: '请填写商品总价', trigger: 'blur' }, { required: true, validator: checkNum, trigger: 'blur' }],
        logisticFee: [{ required: true, message: '请填写运费', trigger: 'blur' }, { required: true, validator: checkNum, trigger: 'blur' }],
        otherFee: [{ required: false, validator: checkNum, trigger: 'blur' }],
        status: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
        remark: [{ min: 0, max: 50, message: '50字以内', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['selectedOrderGoods']),
    totalMoney() {
      let num = 0
      // 总价计算方法注释
      if (this.formData.goodsBusinessModel === 'STAGING') {
        num = (this.formData.goodsTotalPrice - 0) + (this.formData.logisticFee - 0) + (this.formData.otherFee - 0)
      } else {
        this.goodForm.tableData.map(item => {
          num += (item.quantity - 0) * (item.unitPrice - 0) - (item.discountPrice ? (item.discountPrice - 0) : 0)
        })
        num += (this.formData.logisticFee - 0) + (this.formData.otherFee - 0)
      }
      return num.toFixed(2)
    }
  },
  watch: {
    selectedOrderGoods(val, oldval) {
      if (val.length > 0) {
        this.goodForm.tableData = val
      }
    }
  },
  mounted() {
    store.dispatch('addOrderGoods', [])
  },
  methods: {

    // 保存
    save() {
      if (this.goodForm.tableData.length === 0) {
        this.$message.error('请添加商品！');
        return false
      }
      // if (this.goodForm.tableData.length > 1) {
      //   this.$message.error('暂时只支持下单一种商品！');
      //   return false
      // }
      // const businessType = this.goodForm.tableData[0].businessType
      // let bsvalid = true
      this.goodForm.tableData.map((item, index) => {
        item.stageNumber = item.chooseStage.stageNumber
        item.unit = item.chooseStage.unit === '月' ? 'MONTH' : 'DAY'
      })
      // if (!bsvalid) {
      //   return false
      // }
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$refs['goodForm'].validate(valid => {
            if (valid) {
              const data = {
                ...this.formData,
                goodsList: this.goodForm.tableData
              }
              if (data.partnerType === 'gg') {
                data.customerId = this.userList.filter(item => {
                  return item.mobile === data.user
                })[0].uid
              } else {
                data.customerId = data.enterprise
              }
              data.address = formatAddress(data)
              data.receiver = {
                name: data.name,
                mobile: data.mobile
              }
              orderApi.creatOrder(data).then(res => {
                if (res.code === 200) {
                  this.$message.success('建单成功！');
                  this.goBack()
                } else {
                  this.$message.info(res.msg)
                }
              })
            }
          })
        }
      })
    },
    // 搜索用户
    userSearch(query) {
      if (query !== '') {
        const params = {
          mobile: query,
          page: 1,
          pageSize: 10
        }
        managementList(params).then(res => {
          if (res.code === 200) {
            this.userList = res.data.list || [];
          }
        })
      }
    },
    // 搜索企业
    enterpriseSearch(query) {
      if (query !== '') {
        const params = {
          keyword: query,
          page: 1,
          pageSize: 10
        }
        rqGetEnterprises(params).then(res => {
          if (res.code === 200) {
            this.enterpriseList = res.data.list || [];
          }
        })
      }
    },
    selectCity(val) {
      const city = this.cityList.filter(item => {
        return item.id === val
      })[0]
      this.formData.cityName = city.name
      this.formData.cityCode = city.id
      this.formData.provinceCode = city.state.id
      this.formData.provinceName = city.state.name
    },
    // 选择租赁时长
    getTime(value) {
      this.formData.rentStartTime = value ? value[0] : '';
      this.formData.rentEndTime = value ? value[1] : '';
    },
    // 切换订单类型
    goodsBusinessModelChange(val) {
      store.dispatch('addOrderGoods', [])
      this.goodForm.tableData = []
    },
    // 添加商品
    addGood() {
      this.addGoodDialog = true
    },
    // 添加用户
    addUser() {
      this.addUserDialog = true
    },
    closeDialog() {
      this.addGoodDialog = false
      this.addUserDialog = false
    },
    deleteGood(row) {
      const newTable = this.goodForm.tableData.filter(item => {
        return item.id !== row.id
      })
      console.log(newTable);
      store.dispatch('addOrderGoods', deepClone(newTable)).then(res => {
        this.$message.success('删除成功');
        this.goodForm.tableData = newTable
      });
    },
    changeNum(row, val) {
      const znum = /^([1-9][0-9]*)$/;
      if (isNaN(val) || !znum.test(val)) {
        this.$message({
          message: '请输入正确的下单数量',
          type: 'error'
        })
        row.quantity = 1
        return false
      } else if (row.discountPrice - 0 > (val - 0) * (row.chooseStage.unitPrice - 0)) {
        row.discountPrice = ''
        return false
      }
    },
    changeSup(row, val) {
      const znum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (isNaN(val) || !znum.test(val)) {
        this.$message({
          message: '请输入正确的优惠金额',
          type: 'error'
        })
        row.discountPrice = ''
        return false
      } else if (val - 0 > (row.quantity - 0) * (row.unitPrice - 0)) {
        this.$message({
          message: '优惠金额不能大于商品总价',
          type: 'error'
        })
        row.discountPrice = ''
        return false
      }
    },
    addGoodSubmit(val) {
      this.addGoodDialog = false
      this.addUserDialog = false
    },
    // 没啥用 可以删了 现在单价不是算的 而是自己手写的
    getStagePrice(row) {
      if (row.businessType === 0) {
        row.stagePrice = ((row.chooseStage.stagePrice - 0) * (row.chooseStageNum)).toFixed(2)
      } else if (row.businessType === 20) {
        row.stagePrice = row.salePrice
      }
      return row.stagePrice
    },
    getTotalPrice(row) {
      const price = ((row.unitPrice - 0) * (row.quantity - 0)).toFixed(2)
      if (price > 0) {
        return price
      } else {
        return 0
      }
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
  .list-add-order-container {
    display: flex;
    flex-direction: column;
    padding: 15px;
    .go-back{
      margin-bottom: 15px;
    }
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592FC;
      background-color: #f3f3f3;
    }
    .tips{
      font-size: 12px;
      color: #F56C6C;
      margin: -12px 0 20px 80px;
      line-height: 14px;
    }
    .tips::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    .add-user{
      margin-left: 30px;
      margin-bottom: 10px;
    }
    .distpicker{
      select {
        color: #606266;
        font-size: 12px;
        cursor: pointer;
        width: 97.5px;
        padding: 0 10px;
        padding-right: 0px;
        text-align: center;
        height: 28px;
        line-height: 26px;
        -webkit-appearance: none;
        -moz-appearance: none;
        margin-bottom: 4px;
      }
      select:hover {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      }
      select:focus {
        outline: none;
      }
    }
    .unitPriceitem{
      margin-top: 14px;
      margin-bottom: 14px;
    }
    .el-form-item.required-item>.el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    .create-order-btn{
      margin-left: 200px;
    }
  }
</style>
