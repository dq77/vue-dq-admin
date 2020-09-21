<!--
 * @Author: zhongwenqiang
 * @Date: 2019-08-16 10:05:35
 * @LastEditors: zhongwenqiang
 * @LastEditTime: 2019-08-16 10:07:05
 * @Description: file content
 -->
<template>
  <div v-loading="loading" class="add-coupone-container">
    <div class="content-wrap">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="140px">
        <el-form-item label="选择渠道：" prop="channel">
          <el-checkbox-group v-model="editForm.channel">
            <el-checkbox v-for="item in channelList" :key="item.code" :label="item.code" >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="优惠券名称：" prop="couponName">
          <el-input v-model="editForm.couponName" class="item-huge__input input-200" placeholder="请输入优惠券名称" clearable/>
        </el-form-item>
        <el-form-item label="优惠券类型：">
          <el-radio-group v-model="editForm.couponType">
            <el-radio :label="31">满减</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式：" prop="payType">
          <el-radio-group v-model="editForm.payType" @change="selecPayType">
            <el-radio :label="1">一次性支付</el-radio>
            <el-radio :label="2">分期支付</el-radio>
            <el-radio :label="3">全部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠方式：" prop="discountType">
          <el-radio-group v-model="editForm.discountType">
            <el-radio :label="1">首期优惠</el-radio>
            <el-radio :label="2" :disabled="editForm.payType === 1">均摊优惠</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券面值：" prop="couponMoney">
          <el-input v-model="editForm.couponMoney" class="item-default__input input-200" placeholder="请输入面值" clearable/>
          <span class="fontColor">（第一次支付全部抵扣）</span>
        </el-form-item>
        <el-form-item label="使用门槛：" prop="spendMoney">
          <el-input v-model="editForm.spendMoney" class="item-default__input input-200" placeholder="首月支付减多少$" clearable @blur="spendMoneyBlur"/>
        </el-form-item>
        <el-form-item label="发行量设置：" prop="couponNum">
          <el-radio-group v-model="editForm.releaseType">
            <el-radio :label="1">总发放量</el-radio>
            <el-radio :label="2">每日发放量</el-radio>
          </el-radio-group>
          <div>
            <span v-if="editForm.releaseType === 1">总发放量</span>
            <span v-if="editForm.releaseType === 2">每日发放量</span>
            <el-input v-model="editForm.couponNum" class="item-default__input input-200" placeholder="张数" clearable/>
            <span>张</span>
          </div>
        </el-form-item>
        <el-form-item label="发放时间：" prop="releaseEndTime">
          <span>每日</span>
          <el-time-picker
            v-model="editForm.releaseStartTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="任意时间点"
            @change="timeChang"/>
          <span>至</span>
          <el-time-picker
            v-model="editForm.releaseEndTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="任意时间点"
            @change="timeChang"/>
          <span>可领取优惠券</span>
        </el-form-item>
        <el-form-item label="使用说明：" prop="couponDes">
          <el-input :rows="5" v-model="editForm.couponDes" type="textarea" class="item-default__text input-200" placeholder="请输入使用说明"/>
        </el-form-item>
        <el-form-item label="有效期限：" prop="isExistValue">
          <el-radio-group v-model="methodOfValidityPeriod">
            <el-radio :label="0" class="display">
              <el-date-picker
                :disabled="methodOfValidityPeriod == 1"
                v-model="validTimeRange"
                :picker-options="dateShortcutSelector"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-radio>
            <el-radio :label="1" class="display">
              <span>领取后 </span>
              <el-input v-model="editForm.couponTime" :disabled="methodOfValidityPeriod == 0" type="number" clearable placeholder="请填写有效期" class="input-200"/>
              <span>
                <el-select v-model="editForm.couponTimeUnit" :disabled="methodOfValidityPeriod == 0">
                  <el-option value="DAY" label="天"/>
                  <el-option value="HOUR" label="小时"/>
                  <el-option value="MINUTE" label="分钟"/>
              </el-select>过期，即优惠券从领取当天算起，超过使用天数之后自动失效</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可用范围：" prop="goodsType">
          <el-radio-group v-model="editForm.goodsType" @change="changeOfCoverage">
            <el-radio :label="10">全场商品</el-radio>
            <el-radio :label="11"><el-button :disabled="editForm.goodsType === 10" plain size="small" @click="theDialogOpen">选择商品</el-button></el-radio>
          </el-radio-group><br>
          <!-- <el-tag v-for="(item, index) in checkedGoods" :key="index" closable @close="handleClose(item)">{{ item, allRentalListOfAll | capitalize }}</el-tag> -->
          <el-tag v-for="(item, index) in spuList" :key="index" closable @close="handleClose(index)">{{ item.name }}</el-tag>
        </el-form-item>
        <el-form-item label="发放用户：">
          <el-radio-group v-model="editForm.userType">
            <el-radio :label="20">所有用户</el-radio>
            <el-radio :label="21">新用户</el-radio>
            <el-radio :label="22">老用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="领取方式：" prop="scene">
          <el-radio-group v-model="editForm.scene">
            <el-radio label="GOODS">商品详情领取</el-radio>
            <el-radio label="ACTIVITY">活动专属</el-radio>
            <el-radio label="EXCHAGE">兑换码兑换</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动截止时间：" prop="deadline">
          <el-date-picker
            v-model="editForm.deadline"
            :picker-options="dateShortcutSelector"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"/>
          <span class="fontColor">（无论优惠券是否发放完，到最终截止时间都停止发放，活动变为结束状态。是该次优惠券活动的周期）</span>
        </el-form-item>
        <el-form-item>
          <div class="b-style">
            <p><span>每人限领一张</span></p>
            <p><span>新用户定义：未下过单的用户</span></p>
            <p><span>老用户定义：下过一单及以上的用户</span></p>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button v-if="type === 'add'" type="primary" @click="editCoupons('editForm')">立即创建</el-button>
          <el-button v-if="type === 'edit'" type="primary" @click="editCoupons('editForm')">保存修改</el-button>
          <el-button @click="clickToBack">取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        :visible.sync="dialogVisible"
        title="提示"
        class="el-dialog__body_defalt"
        width="60%">
        <div>
          <el-select v-model="checkedCategory" placeholder="请选择分类" clearable @change="detectionCategory">
            <el-option
              v-for="item in allCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="clear"/>
        <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <!-- <div style="margin: 15px 0;"></div> -->
          <el-checkbox-group v-model="checkedGoods" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item, index) in allRentalList" :label="item.no" :key="index">
              <span style="margin-right:15px">{{ item.name }}</span>
              <el-tag size="mini">{{ item.categoryName }}</el-tag>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="checkGood()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { editCoupons, couponDetail, editCoupon } from '@/api/coupon';
import couponApi from '@/api/coupon.js'
import goodsApi from '@/api/goods.js'
export default {
  filters: {
    _filters_category(val) {
      switch (val) {
        case 4:
          return '餐厨';
        case 5:
          return '洗护';
        case 6:
          return '居家';
        case 7:
          return '电器';
        case 8:
          return '数码';
        case 9:
          return '美妆';
        default:
          break;
      }
    },
    capitalize(value, scoure) {
      for (let i = 0, len = scoure.length; i < len; i++) {
        if (value === scoure[i].sn) {
          return scoure[i].name;
        }
      }
    }
  },
  data() {
    var checkMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('金额不能为空'));
      }
      setTimeout(() => {
        value = value - 0;
        var x = String(value).indexOf('.') + 1; // 小数点的位置
        var y = String(value).length - x; // 小数的位数
        if (isNaN(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (x !== 0 && y > 2) {
            callback(new Error('数字最多只能到小数点后两位'));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkCouponCount = (rule, value, callback) => {
      if (!this.editForm.releaseType) {
        return callback(new Error('发行量类型不能为空'));
      } else if (!value) {
        callback(new Error('发行量不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('只填写数字'))
      } else if (value * 1 % 1 !== 0) {
        callback(new Error('只能填写整数'))
      } else if (value * 1 > 9999999) {
        callback(new Error('数量超过上限'))
      } else {
        callback()
      }
    };
    var checkreleaseEndTime = (rule, value, callback) => {
      console.log(new Date(value), new Date(this.editForm.releaseStartTime));
      if (!value || !this.editForm.releaseStartTime) {
        callback(new Error('请选择发放时间！'))
      } else if (new Date(value) * 1 < new Date(this.editForm.releaseStartTime) * 1) {
        callback(new Error('结束时间不能小于开始时间！'))
      } else {
        callback()
      }
    }

    var checkDate = (rule, value, callback) => {
      if (this.methodOfValidityPeriod * 1 === 1) {
        if (!this.editForm.couponTime) {
          callback(new Error('有效期限不能为空'))
        } else if (isNaN(this.editForm.couponTime * 1)) {
          callback(new Error('只填写数字'))
        } else if (this.editForm.couponTime * 1 < 1) {
          callback(new Error('日期必须大于0'))
        } else if (this.editForm.couponTime * 1 % 1 !== 0) {
          callback(new Error('只能填写整数'))
        } else if (!this.editForm.couponTimeUnit) {
          callback(new Error('单位不能为空'))
        } else {
          callback()
        }
      } else if (this.methodOfValidityPeriod * 1 == 0) {
        if (this.validTimeRange && this.validTimeRange.length < 1) {
          callback(new Error('有效期限不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      channelList: [], // 渠道下拉框
      releaseTime: [new Date(), new Date()], // 发放时间
      type: 'add', // 判断是编辑还是新增
      validTimeRange: [],
      spuList: [], // 装换后的商品对象
      editForm: {
        discountType: '',
        channel: [],
        checked: false,
        couponName: '',
        goodsList: [],
        fullReduction: '',
        couponType: 31,
        couponMoney: '',
        couponTimeUnit: null,
        couponDes: '',
        goodsType: 10,
        userType: 20,
        couponNum: '',
        spendMoney: '',
        deadline: '',
        releaseStartTime: '00:00:00',
        releaseEndTime: '23:59:59',
        isExistValue: '',
        payType: null // 支付方式
      },
      checkAll: false,
      isIndeterminate: true,
      locking: false,
      allRentalListOfAll: [],
      checkedGoods: [],
      valueOfdetection: '',
      dialogVisible: false,
      methodOfValidityPeriod: 1,
      checkedCategory: '',
      theCurrentlySelectedData: [],
      allCategory: [],
      allRentalList: [],
      loading: false,
      periodOfValidity: [
        {
          value: '1'
        },
        {
          value: '2'
        },
        {
          value: '3'
        },
        {
          value: '4'
        },
        {
          value: '5'
        },
        {
          value: '6'
        },
        {
          value: '7'
        },
        {
          value: '8'
        },
        {
          value: '9'
        },
        {
          value: '10'
        }
      ],
      rules: {
        payType: [
          {
            required: true, message: '请选择支付方式', trigger: 'change'
          }
        ],
        discountType: [
          {
            required: true, message: '请选择优惠方式', trigger: 'blur'
          }
        ],
        channel: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ],
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { max: 10, message: '长度最多为10个字符', trigger: 'blur' }
        ],
        couponMoney: [
          { validator: checkMoney, trigger: 'blur', required: true }
        ],
        spendMoney: [
          { validator: checkMoney, trigger: 'blur', required: true }
        ],
        couponNum: [
          { validator: checkCouponCount, trigger: 'blur', required: true }
        ],
        releaseEndTime: [
          {
            validator: checkreleaseEndTime, trigger: 'blur', required: true
          }
        ],
        couponDes: [
          { required: true, message: '请输入使用说明', trigger: 'blur' },
          { min: 2, max: 30, message: '长度最少为2最多为30', trigger: 'blur' }
        ],
        goodsType: [
          {
            required: true, message: '可用范围必填', trigger: 'blur'
          }
        ],
        deadline: [
          { required: true, message: '请选择日期', trigger: ['blur', 'change'] }
        ],
        scene: [
          {
            required: true, message: '请选择领取方式', trigger: 'blur'
          }
        ],
        isExistValue: [
          {
            required: true,
            validator: checkDate,
            trigger: ['blur', 'change']
          }
        ]
      },
      dateShortcutSelector: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  computed: {
    validStartTime() {
      return this.validTimeRange ? this.validTimeRange[0] : '';
    },
    validEndTime() {
      return this.validTimeRange ? this.validTimeRange[1] : '';
    }
  },
  watch: {
    methodOfValidityPeriod(val) {
      if (val === 1) {
        this.validTimeRange = [];
        this.editForm.validTimeRange = null;
      } else {
        this.editForm.couponTime = '';
        this.editForm.couponTimeUnit = null;
      }
    },
    editForm: {
      handler(newVal, oldVal) {
        console.log('newVal', newVal);
        if (newVal.couponTime === '' && !this.validTimeRange) {
          this.editForm.isExistValue = '';
        } else {
          this.editForm.isExistValue = '10';
        }
      },
      deep: true
    }
  },
  created() {
    this.getChannel();

    var id = this.$route.query.id || '';
    if (id) {
      this.getDetail(id);
      this.type = 'edit';
    } else {
      this.type = 'add';
    }
  },
  methods: {

    // 时间选择
    timeChang(val) {
      console.log('选择的时间', val);
    },
    // 选择支付方式
    selecPayType(val) {
      if (val === 1) {
        this.editForm.discountType = 1
      }
    },
    // 取消部分商品弹窗
    cancel() {
      this.dialogVisible = false;
      this.checkedGoods = [];
    },
    // 选择部分商品
    checkGood() {
      // this.$set(this.editForm, 'goodsList', this.goodsSpuList(this.checkedGoods));
      this.spuList = this.goodsSpuList(this.checkedGoods);
      this.dialogVisible = false;
      console.log('this.spuList', this.spuList);
    },
    // 遍历数组将name也放入对象中
    goodsSpuList(arr) {
      const _spuList = [];
      arr.map(item => {
        this.allRentalList.map(items => {
          if (items.no === item) {
            _spuList.push(items);
          }
        })
      });
      console.log('过滤后的数组', _spuList);
      return _spuList;
    },
    // 保证使用门槛一定大于优惠券面值
    spendMoneyBlur(event) {
      const couponeMoney = this.editForm.couponMoney * 1;
      const spendMoney = this.editForm.spendMoney * 1;
      if (spendMoney < couponeMoney) {
        this.$message.error('使用门槛不能小于优惠面值！');
      }
    },
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        }
      })
    },
    getDetail(id) {
      couponApi.couponDetail({ couponId: id }).then(res => {
        if (res.code === 200) {
          this.editForm = res.data;
          console.log('查询的商品详情', this.editForm);
          if (this.editForm.couponTime && this.editForm.couponTimeUnit) {
            this.methodOfValidityPeriod = 1;
          } else if (this.editForm.validStartTime && this.editForm.validEndTime) {
            this.methodOfValidityPeriod = 0;
            this.validTimeRange = [res.data.validStartTime, res.data.validEndTime];
          }
          this.getGoodsList().then(() => {
            this.spuList = this.goodsSpuList(this.editForm.goodsList);
          });
        }
      })
    },
    changeOfCoverage(val) {
      if (val == '0') {
        this.checkedGoods = [];
      }
    },
    // 商品全选
    handleCheckAllChange(val) {
      this.checkedGoods = val ? this.allRentalList : []
      this.isIndeterminate = false;
      if (val == true) {
        this.checkedGoods = this.allRentalList.map(item => {
          return item;
        });
      } else {
        this.checkedGoods = [];
      }
    },
    // 选择商品
    handleCheckedCitiesChange(value) {
      this.locking = true;
      var checkedCount = value.length
      this.checkAll = checkedCount === this.allRentalList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRentalList.length;
      console.log('选取的商品', this.checkedGoods)
    },
    // 清除选择的商品
    handleClose(index) {
      this.spuList.splice(index, 1);
    },

    detectionCategory() {
      this.getGoodsList();
      if (this.allRentalListOfAll.length == this.checkedGoods.length) {
        this.isIndeterminate = false
        this.checkAll = true
      } else {
        this.isIndeterminate = true
        this.checkAll = false
      }
    },
    editCoupons(editForm) {
      this.$refs[editForm].validate(valid => {
        if (valid) {
          if (this.editForm.couponMoney * 1 > this.editForm.spendMoney * 1) {
            this.$message.error('使用门槛不能小于优惠券面值');
          } else if (this.editForm.scene === 'EXCHAGE' && (
              this.editForm.releaseType != 1 || this.editForm.userType != 20 || !this.editForm.channel.includes('APLIPAY_MINI_PROGRAM') )) {
            let errStr = '领取方式为兑换码兑换时：'
            if ( this.editForm.releaseType != 1 ) {
              errStr += '发行量设置必须选择“总发放量”'
            } else if ( this.editForm.userType != 20 ) {
              errStr += '发放用户必须选择“所有用户”'
            } else {
              errStr += '渠道必须包含“支付宝小程序”'
            }
            this.$message.error(errStr);
          } else {
            this.editForm.validStartTime = this.validStartTime;
            this.editForm.validEndTime = this.validEndTime;
            // 如果是选择部分商品
            if (this.editForm.goodsType === 11) {
              this.editForm.goodsList = this.noList(this.spuList);
            }
            if (this.type === 'edit') {
              this.loading = true;
              this.editFunction(this.editForm);
            } else if (this.type === 'add') {
              this.loading = true;
              this.addFunction(this.editForm);
            }
          }
        }
      })
    },
    editFunction(data) {
      couponApi.updateCoupone(data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功！');
          this.$router.push({
            name: 'coupons'
          })
        } else {
          this.$message.info(res.msg);
        }
        this.loading = false;
      })
    },
    addFunction(data) {
      couponApi.newCoupone(data).then(res => {
        if (res.code === 200) {
          this.$message.success('新增成功！');
          this.$router.push({
            name: 'coupons'
          })
        } else {
          this.$message.info(res.msg);
        }
        this.loading = false;
      })
    },
    // 选择部分商品弹窗
    theDialogOpen() {
      console.log('this.editForm.channel', this.editForm.channel);
      if (this.editForm.channel.length < 1) {
        this.$message.warning('请先选择渠道！')
      } else {
        this.getGoodsList();
        this.dialogVisible = true;
        this.categoryList();
        this.checkedGoods = this.noList(this.spuList);
      }
    },
    // 只保留商品的no
    noList(arr) {
      const list = [];
      for (let i = 0; i < arr.length; i++) {
        list.push(arr[i].no);
      }
      return list;
    },
    clickToBack() {
      this.$router.push({ name: 'coupons' });
    },
    // 获取部分商品列表
    getGoodsList() {
      const data = {
        channels: this.editForm.channel,
        categoryId: this.checkedCategory || null
      };
      return new Promise((resolve, reject) => {
        goodsApi.CouponGoodsList(data)
          .then(res => {
            if (res.code === 200) {
              this.allRentalList = res.data;
              console.log('this.checkedGoods', this.allRentalList);
              if (this.checkedGoods.length == this.allRentalList.length) {
                this.isIndeterminate = false;
                this.checkAll = true;
              } else if (this.checkedGoods.length == '0') {
                this.isIndeterminate = false;
                this.checkAll = false;
              } else {
                this.isIndeterminate = true;
                this.checkAll = false;
              }
              resolve(this.allRentalList);
              // this.spuList = this.goodsSpuList(this.editForm.goodsList);
            } else {
              this.$message.info(res.msg);
              reject(res.msg);
            }
          })
          .catch(err => {
            throw err;
          });
      })
    },
    categoryList() {
      goodsApi.selectCategory().then(res => {
        if (res.code === 200) {
          this.allCategory = res.data;
        }
      }).catch(err => {
        throw err;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.add-coupone-container {
  margin: 15px;
}
.content-wrap{
  padding: 16px;
  background: #fff;
  border: 1px solid #dfe4ea;
}
.el-radio + .display {
  display: block;
  margin: 15px 0 0 0;
}
.el-radio__label {
  span {
    color: #606266;
  }
}
.fontColor {
  color: #606266;
}
.b-style {
  margin: 20px 0;
  p {
    margin: 0;
    line-height: 25px;
    color: #606266;
  }
}
.el-form {
  .el-form-item:last-of-type {
    text-align: center;
  }
}
.el-checkbox-group {
  // margin: 3px 0 20px 0;
  display: flex;
  flex-flow: row wrap;
}
.dialog {
  text-align: right;
}
.el-tag {
  margin-left: 10px;
}
.el-dialog {
  text-align: left;
  .el-dialog__body {
    .el-checkbox {
      flex: 0 0 50%;
      line-height: 2;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border: solid 1px #e0e0e0;
      padding: 0 20px;
      .el-checkbox__label {
        // overflow: hidden;
        // text-align: right;
        .right {
          // color: red
          float: right;
        }
      }
      + .el-checkbox {
        margin-left: 0;
      }
    }
  }
}
.el-dialog__body_defalt {
  .el-dialog {
    .el-dialog__body {
      padding: 0 20px;
      .el-select {
        // margin-bottom: 15px;
        float: right;
      }
    }
  }
}
.clear {
  clear: both;
}
// .el-table {
//   margin: 0 auto;
// }
// .el-tag {
//   margin-left: 10px;
// }
</style>
