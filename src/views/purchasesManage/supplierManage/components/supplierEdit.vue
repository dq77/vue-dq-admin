<template>
  <div class="pageContent">
    <div class="supplierEdit-container">
      <div class="header">
        <div class="header_text">{{ title }}{{ $t('warehouse.supplier') }}</div>
        <!-- <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button> -->
      </div>
      <div
        v-loading="loading"
        class="box-card"
      >
        <el-form
          ref="formData"
          :model="formData"
          :rules="formRule"
          label-width="200px"
        >
          <el-form-item
            :label="$t('financial.suppliername')"
            prop="name"
            label-width="25%"
          >
            <el-input
              v-model="formData.name"
              :placeholder="$t('financial.iptsuppliername')"
              maxlength="45"
              class="input-300"
            />
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.suppliertype')"
            prop="strategies"
            label-width="25%"
          >
            <el-checkbox-group v-model="formData.strategies">
              <el-row>
                <div>
                  <el-col :span="3">
                    <el-checkbox label="SUPPLY">{{ $t('good.supply') }}</el-checkbox>
                  </el-col>
                  <span v-if="formData.strategies.includes('SUPPLY')">
                    <span class="checkbox-txt">{{ $t('purchasesManage.settleperiod') }} &nbsp; by：</span>
                    <el-select
                      v-model="formData.radio_one.baseTimeStrategy"
                    >
                      <el-option
                        :label="$t('warehouse.purchaseintime')"
                        value="RECEIPT_DATE"
                      />
                      <el-option
                        :label="$t('purchasesManage.purchasesubmittime')"
                        value="BILL_DATE"
                      />
                    </el-select>
                    <el-select
                      v-model="formData.radio_one.accountPeriodType"
                      :placeholder="$t('purchasesManage.slctperiod')"
                      class="select-two"
                    >
                      <el-option
                        :label="$t('purchasesManage.delayNdays')"
                        value="AFTER_TRANSACTION"
                      />
                      <el-option
                        :label="$t('purchasesManage.bymonth')"
                        value="MONTHLY"
                      />
                    </el-select>
                    <span
                      v-if="formData.radio_one.accountPeriodType == 'AFTER_TRANSACTION'"
                      class="checkbox-txt"
                      style="padding-left:0px"
                    >
                      N =
                      <el-input
                        v-enter-number
                        v-model="formData.radio_one.periodDate"
                        type="number"
                        min="0"
                        oninput="if(value<0) value=0"
                        class="input-80"
                      />
                    </span>
                    <span
                      v-if="formData.radio_one.accountPeriodType == 'MONTHLY'"
                      class="checkbox-txt"
                      style="padding-left:0px"
                    >
                      <!-- 英文排版差异问题 需等翻译后再调整settlebyMonth字段 还有其他地方用 一起调 -->
                      <!-- {{ $t('financial.settlebyMonth') }} -->
                      每月
                      <el-input
                        v-enter-number
                        v-model.number="formData.radio_one.periodDate"
                        type="number"
                        max="31"
                        min="1"
                        class="input-80"
                        oninput="if(value>31) value=31;if(value<1) value=1"
                      />日为结算日
                    </span>
                  </span>
                </div>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.contactname')"
            prop="contacts_person"
            label-width="25%"
          >
            <el-input
              v-model="formData.contacts_person"
              :placeholder="$t('purchasesManage.iptcontactname')"
              maxlength="10"
              class="input-300"
            />
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.contactphone')"
            prop="contacts_mobile"
            label-width="25%"
          >
            <el-input
              v-model.trim="formData.contacts_mobile"
              :placeholder="$t('purchasesManage.iptcontactphone')"
              type="mobile"
              maxlength="15"
              class="input-300"
            />
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.email')"
            prop="contacts_email"
            label-width="25%"
          >
            <el-input
              v-model="formData.contacts_email"
              :placeholder="$t('purchasesManage.iptemail')"
              type="text"
              class="input-300"
            />
          </el-form-item>
          <el-form-item :label="$t('purchasesManage.supplieraddr')" label-width="25%" prop="detail">
            <el-input v-model="formData.address.detail" class="input-300" placeholder="Street and number, P.O. box, c/o."/>
          </el-form-item>
          <el-form-item prop="address.street" label-width="25%">
            <el-input v-model="formData.address.street" class="input-300" placeholder="Apartment, suite, unit, building, floor, etc."/>
          </el-form-item>
          <el-form-item prop="address.city" label-width="25%">
            <el-input v-model="formData.address.city" :placeholder="$t('warehouse.iptcity')" class="input-300"/>
          </el-form-item>
          <el-form-item prop="address.provinceCode" label-width="25%">
            <el-select v-model="formData.address.provinceCode" :placeholder="$t('warehouse.iptprovince')" class="input-300" @change="selectProvince">
              <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('purchasesManage.supplieraddr')" prop="address" label-width="25%">
            <v-distpicker :province="formData.address.provinceName" :city="formData.address.cityName" :area="formData.address.districtName" class="distpicker" @selected="selectedData"/>
            <el-input v-model="formData.address.detail" class="input-300" placeholder="请填写详细地址"/>
          </el-form-item> -->
          <el-form-item :label="$t('purchasesManage.postaddr')" label-width="25%" prop="deliveryAddress.detail">
            <el-input v-model="formData.deliveryAddress.detail" class="input-300" placeholder="Street and number, P.O. box, c/o."/>
          </el-form-item>
          <el-form-item prop="deliveryAddress.street" label-width="25%">
            <el-input v-model="formData.deliveryAddress.street" class="input-300" placeholder="Apartment, suite, unit, building, floor, etc."/>
          </el-form-item>
          <el-form-item prop="deliveryAddress.city" label-width="25%">
            <el-input v-model="formData.deliveryAddress.city" :placeholder="$t('warehouse.iptcity')" class="input-300"/>
          </el-form-item>
          <el-form-item prop="deliveryAddress.provinceCode" label-width="25%">
            <el-select v-model="formData.deliveryAddress.provinceCode" :placeholder="$t('warehouse.iptprovince')" class="input-300" @change="changeDeliveryAddress">
              <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('purchasesManage.postaddr')" prop="deliveryAddress" label-width="25%">
            <v-distpicker :province="formData.deliveryAddress.provinceName" :city="formData.deliveryAddress.cityName" :area="formData.deliveryAddress.districtName" class="distpicker" @selected="deliveryAddress"/>
            <el-input v-model="formData.deliveryAddress.detail" class="input-300" placeholder="请填写详细地址"/>
          </el-form-item> -->
          <el-form-item
            :label="$t('purchasesManage.creatbank')"
            prop="bankOfDeposit"
            label-width="25%"
          >
            <el-input
              v-model="formData.bankAccount.bankOfDeposit"
              :placeholder="$t('purchasesManage.iptcreatbank')"
              maxlength="20"
              class="input-300"
            />
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.bankaccount')"
            prop="account"
            label-width="25%"
          >
            <el-input
              v-model="formData.bankAccount.account"
              :placeholder="$t('purchasesManage.iptbankaccount')"
              class="input-300"
            />
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.qualification')"
            prop="qualifications"
            label-width="25%"
          >
            <el-upload
              :action="coverOptions.upLoadUrl"
              :headers="token"
              :file-list="uploadFileList"
              :on-remove="fileRemove"
              :on-success="upLoadSuc"
              :before-upload="uploadBefore"
              multiple
            >
              <el-button
                size="small"
                type="primary"
              >{{ $t('financial.clickupload') }}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item
            :label="$t('common.remark')"
            label-width="25%"
          >
            <el-input
              v-model="formData.remark"
              :rows="4"
              :placeholder="$t('warehouse.remarkmax')"
              maxlength="50"
              type="textarea"
              class="input-300"
            />
          </el-form-item>
          <el-form-item
            :label="$t('purchasesManage.cooperatstatus')"
            prop="enabled"
            label-width="25%"
          >
            <el-select v-model="formData.status">
              <el-option
                :label="$t('purchasesManage.underway')"
                value="UNDERWAY"
              />
              <el-option
                :label="$t('purchasesManage.terminate')"
                value="TERMINATE"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-back"
          @click="goBack()"
        >{{ $t('common.back') }}</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submitForm('formData')"
        >{{ $t('common.save') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import locationList from '@/assets/location/location';
import { imgBasePath } from '@/common/config.js';
import { regExpConfig } from '@/utils/regExpConfig';
import { getToken } from '@/utils/auth.js';
import { IsNullObject, formatAddress } from '@/utils/index';
import {
  rqSaveNewEnterprises, // 新增
  rqEditEnterprises, //  编辑
  rqEnterPrisesDetail // 查询详情
} from '@/api/purchase/index';

export default {
  components: {
  },
  inject: ['reload'],
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('purchasesManage.iptcontactphone')));
      } else if ((value + '').length < 6) {
        callback(new Error(this.$t('setCenter.illegalphonenum')));
      } else {
        callback();
      }
    };
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('purchasesManage.iptcontactname')));
      } else {
        callback();
      }
    };
    // var checkEmail = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请填写邮箱'));
    //   } else if (!regExpConfig.Email.test(value)) {
    //     callback(new Error('请填写正确的邮箱地址'));
    //   } else {
    //     callback();
    //   }
    // };
    var checkStrategies = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('purchasesManage.slctsuppliertype')));
      } else {
        callback();
      }
    };

    return {
      title: this.$t('common.new'), // 新增
      loading: true,
      formData: {
        name: '',
        status: 'TERMINATE', // 状态
        address: {
          detail: '',
          street: '',
          city: '',
          provinceCode: '',
          provinceName: ''
        }, // 供应商地址
        deliveryAddress: {
          detail: '',
          street: '',
          city: '',
          provinceCode: '',
          provinceName: ''
        }, // 寄件地址
        contacts_person: '', // 方便验证做一级处理
        contacts_mobile: '1000000', // 方便验证做一级处理
        contacts_email: '', // 方便验证做一级处理
        contacts: {
          name: '', // 联系人姓名
          mobile: '', // 联系人电话
          email: '' // 联系人邮箱
        },
        bankAccount: {
          bankOfDeposit: '', // 开户银行
          account: '' // 银行账户
        },
        strategies: [],
        remark: '', // 备注
        radio_one: {
          supplierMode: 'SUPPLY', // 供应商类型
          accountPeriodType: '', // 账期方式
          baseTimeStrategy: '', // 结算时间类型
          periodDate: '' // 时间
        },
        radio_Two: {
          supplierMode: 'DELIVER', // 供应商类型
          accountPeriodType: '', // 账期方式
          baseTimeStrategy: '', // 结算时间类型
          periodDate: '' // 时间
        },
        radio_Three: {
          supplierMode: 'SELLING', // 供应商类型
          accountPeriodType: '', // 账期方式
          baseTimeStrategy: '', // 结算时间类型
          periodDate: '' // 时间
        }
      },
      coverOptions: {
        upLoadUrl: `${imgBasePath}/goods/active/upload_img`,
        sizes: 5,
        limit: 5
      },
      provinceList: locationList,
      uploadFileList: [],
      qualifications: {},
      token: {
        Authorization: getToken()
      },
      formRule: {
        name: [
          { required: true, message: this.$t('financial.iptsuppliername'), trigger: 'blur' }
        ],
        strategies: [
          { required: true, validator: checkStrategies, trigger: 'blur' }
        ],
        contacts_person: [
          { required: true, validator: checkName, trigger: 'blur' }
        ],
        contacts_mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
        // contacts_email: [
        //   { required: true, validator: checkEmail, trigger: 'blur' }
        // ]
      },
      version: ''
    };
  },

  created() {
    console.log('页面初始化');
  },

  mounted() {
    const ID = this.$route.query.id;
    if (ID) {
      this.title = this.$t('common.edit');
      this.fetchFormData(ID);
      this.loading = false;
    } else {
      this.title = this.$t('common.new');
      this.loading = false;
    }
  },

  methods: {
    // 根据 id 获取详情 将数据还原
    fetchFormData(id) {
      rqEnterPrisesDetail({ id }).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.version = res.data.version; // 编辑状态需要传
          this.formData.name = res.data.name || ''; // 姓名
          this.formData.contacts_email = res.data.contacts.email || ''; // 邮箱
          this.formData.contacts_mobile = res.data.contacts.mobile || ''; // 联系号码
          this.formData.contacts_person = res.data.contacts.name || ''; // 联系人姓名
          this.formData.remark = res.data.remark; // 备注
          this.formData.status =
            res.data.modeStatus && res.data.modeStatus.SUPPLIER; // 状态
          this.formData.bankAccount.bankOfDeposit =
            res.data.bankAccount && res.data.bankAccount.bankOfDeposit; // 开户银行
          this.formData.bankAccount.account =
            res.data.bankAccount && res.data.bankAccount.account; // 银行账户
          this.formData.address.detail = res.data.address && res.data.address.indexAndDetail[1]
          this.formData.address.street = res.data.address && res.data.address.indexAndDetail[2]
          this.formData.address.city = res.data.address && res.data.address.indexAndDetail[3]
          this.formData.address.provinceCode = res.data.address && res.data.address.districts[1] && res.data.address.districts[1].id
          this.formData.address.provinceName = res.data.address && res.data.address.districts[1] && res.data.address.districts[1].name
          if (res.data.cooperationModes.length > 0) {
            this.formData.deliveryAddress.detail = res.data.cooperationModes[0].deliveryAddress.indexAndDetail[1]
            this.formData.deliveryAddress.street = res.data.cooperationModes[0].deliveryAddress.indexAndDetail[2]
            this.formData.deliveryAddress.city = res.data.cooperationModes[0].deliveryAddress.indexAndDetail[3]
            this.formData.deliveryAddress.provinceCode = res.data.cooperationModes[0].deliveryAddress.districts[1] ? res.data.cooperationModes[0].deliveryAddress.districts[1].id : ''
            this.formData.deliveryAddress.provinceName = res.data.cooperationModes[0].deliveryAddress.districts[1] ? res.data.cooperationModes[0].deliveryAddress.districts[1].name : ''
            this.uploadFileList =
              this.dealJson(res.data.cooperationModes[0].qualifications) || {}; // 默认的文件列表
            this.qualifications = res.data.cooperationModes[0].qualifications; // 资质文件
            // 供应商类型
            var arr = [];
            const strategiesArr = res.data.cooperationModes[0].strategies;
            strategiesArr.map(item => {
              arr.push(item.supplierMode);
            });
            this.formData.strategies = arr;
            console.log(arr);
            strategiesArr.map(item => {
              if (item.supplierMode === 'SUPPLY') {
                this.formData.radio_one = item;
              } else if (item.supplierMode === 'DELIVER') {
                this.formData.radio_Two = item;
              } else if (item.supplierMode === 'SELLING') {
                this.formData.radio_Three = item;
              }
            });
          }
        }
      });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 供应商地址选择
    selectProvince(val) {
      this.formData.address.provinceName = this.provinceList.filter(item => {
        return item.id === val
      })[0].name
    },

    // 发货收件地址选择
    changeDeliveryAddress(val) {
      this.formData.deliveryAddress.provinceName = this.provinceList.filter(item => {
        return item.id === val
      })[0].name
    },

    // 上传文件格式验证
    uploadBefore(file) {
      const size = file.size / 1024 / 1024 < this.coverOptions.sizes;
      if (!size) {
        this.$message.error(this.$t('good.uploadSizeMax') + ` ${this.coverOptions.sizes}MB!`);
        return false;
      }
    },

    // 上传成功
    upLoadSuc(response, file, fileList) {
      // console.log(response, file, fileList);
      if (response.code === 200) {
        this.$message.success(this.$t('financial.uploadsuccess'));
        const url = response.data.baseUrl + response.data.fileUrl;
        const name = file.name;
        this.qualifications[url] = name;
      } else {
        this.$message.error(response.msg);
      }
      console.log('已上传的文件:', this.qualifications);
    },

    // 上传列表删除
    fileRemove(file, fileList) {
      console.log('file', file);
      const url = file.response.data.baseUrl + file.response.data.fileUrl;
      delete this.qualifications[url];
      console.log('已上传的文件:', this.qualifications);
    },

    // 保存表单数据提交后天
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log('valid:', valid);
        if (!valid) return false;
        if (this.isNull(this.formData)) {
          this.$message.error(this.$t('purchasesManage.lacksuppliertype'));
          this.$refs[formName].clearValidate('strategies');
          return false;
        }
        this.pushData();
      });
    },

    //
    pushData() {
      const ID = this.$route.query.id;
      const params = {
        id: ID || undefined,
        version: this.version || undefined,
        ...this.formData,
        address: IsNullObject(this.formData.address)
          ? formatAddress(this.formData.address)
          : undefined,
        deliveryAddress: IsNullObject(this.formData.deliveryAddress)
          ? formatAddress(this.formData.deliveryAddress)
          : undefined,
        bankAccount: IsNullObject(this.formData.bankAccount)
          ? this.formData.bankAccount
          : undefined,
        qualifications: IsNullObject(this.qualifications)
          ? this.qualifications
          : undefined,
        contacts: {
          email: this.formData.contacts_email,
          mobile: this.formData.contacts_mobile,
          name: this.formData.contacts_person
        },
        strategies: this.dealData(this.formData)
      };
      if (ID) {
        // 编辑
        rqEditEnterprises({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.editSuccess'));
            this.$router.go(-1);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        // 新建
        rqSaveNewEnterprises({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.addSuccess'));
            this.reload(); // 刷新页面
            this.$router.go(-1);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },

    dealJson(val) {
      var arr = [];
      for (const key in val) {
        arr.push({ name: val[key], url: key });
      }
      return arr;
    },

    // 处理供应商类型数据
    dealData(data) {
      const newArr = data.strategies.slice(0);
      const strategiesArr = [];
      newArr.map(item => {
        if (item === 'SUPPLY') {
          // 自营常规
          strategiesArr.push({ ...data.radio_one });
        } else if (item === 'DELIVER') {
          strategiesArr.push({ ...data.radio_Two });
        } else if (item === 'SELLING') {
          strategiesArr.push({ ...data.radio_Three });
        }
        return strategiesArr;
      });
      return strategiesArr;
    },

    isNull(data) {
      const newArr = data.strategies.slice(0);
      let flag = false;
      newArr.map(item => {
        if (item === 'SUPPLY') {
          for (const key in data.radio_one) {
            if (data.radio_one[key] === '') {
              flag = true;
            }
          }
          // 自营常规
        } else if (item === 'DELIVER') {
          for (const key in data.radio_Two) {
            if (data.radio_Two[key] === '') {
              flag = true;
            }
          }
          // 自营待发货
        } else if (item === 'SELLING') {
          // 代租售
          for (const key in data.radio_Three) {
            if (data.radio_Three[key] === '') {
              flag = true;
            }
          }
        }
      });
      return flag;
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.supplierEdit-container {
  .el-upload-list {
    width: 300px;
  }
  // padding: 15px;
  flex: 1;
  background: #fff;
  overflow: auto;
  // border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  .supplierEdit-content {
    flex: 1;
    overflow: auto;
  }
  .header {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    .header_text {
      border-left: 2px solid #2592fc;
      line-height: 16px;
      padding-left: 8px;
    }
  }
  .box-card {
    padding-top: 16px;
    flex: 1;
    overflow: auto;
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
      margin-bottom: 15px;
    }
    .checkbox-txt {
      font-size: 14px;
      padding-left: 30px;
    }
    .select-two {
      margin: 0 15px;
    }
    .input-50 {
      width: 50px;
    }
    .distpicker {
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
    .disabledUpload .upload-demo .el-upload--picture-card {
      display: none;
    }
  }
  .footer {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
  }
}
</style>
