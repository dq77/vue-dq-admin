<template>
  <div class="pageContent">
    <div class="newpurchase">
      <div class="header">
        <div class="header_text">{{ $t('purchasesManage.newpuritem') }}</div>
      </div>
      <div class="main">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px" status-icon max>
          <el-form-item :label="$t('warehouse.supplier')" prop="supplierId">
            <el-select
              v-model="form.supplierId"
              :placeholder="$t('good.slctsupplier')"
              filterable
              class="input-300"
              popper-class="my-autocomplete"
              @change="selectSupplier"
            >
              <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id">
                <!-- <div> -->
                <div class="name">{{ item.name }}</div>
                <span class="addr">{{ item.remark }}</span>
                <!-- </div> -->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商类型:" prop="supplierType">
            <el-select v-model="form.supplierType" filterable class="input-300" popper-class="my-autocomplete" @change="changeSupplierMode">
              <el-option v-for="item in supplierTypeList" :key="item.supplierMode" :label="item.supplierModeDescShow" :value="item.supplierMode">
                <div>{{ item.supplierModeDescShow }}</div>
                <!-- <span class="addr">{{ item.supplierMode }}</span> -->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('warehouse.instockwarehouse')" prop="warehouseId">
            <el-select v-model="form.warehouseId" :placeholder="$t('purchasesManage.slctinstock')" filterable class="input-300" popper-class="my-autocomplete">
              <el-option v-for="item in warehouseslist" :key="item.id" :label="item.name" :value="item.id">
                <div class="name">{{ item.name }}</div>
                <span class="addr">{{ item.remark }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('warehouse.planinstocktime')" prop="plannedWarehousingDate">
            <el-date-picker v-model="form.plannedWarehousingDate" :picker-options="pickerOptions" value-format="yyyy-MM-dd" align="right" style="width:300px" />
          </el-form-item>
          <el-form-item :label="$t('purchasesManage.purchasegood')">
            <div class="addGoodContent">
              <el-row type="flex" justify="space-between">
                <el-button type="primary" class="addBtn" @click="addGoods()">{{ $t('warehouse.addgood') }}</el-button>
                <div>
                  <span class="red">{{ $t('purchasesManage.logisticsFee') }}</span>
                  <el-input
                    v-enter-number2
                    v-model.number="form.logisticFee"
                    :placeholder="$t('purchasesManage.iptlogisticsFee')"
                    type="number"
                    class="input-200"
                    style="margin-left:10px;"
                    min="0"
                    max="99999.99"
                    oninput="if(value>99999.99) value=99999.99; if(value<0) value=0"
                    @change="logisticFeeChange"
                  />
                </div>
              </el-row>
              <el-table :data="checkedPurchaseGood" border style="width: 100%" max-height="550">
                <el-table-column label="SKUID" prop="skuId" align="center" />
                <el-table-column :label="$t('warehouse.goodcode')" prop="spuNo" align="center" show-overflow-tooltip />
                <el-table-column :label="$t('warehouse.goodnamespec')" prop="spuName" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.spuName }}</span>
                    <span v-if="scope.row.detail">{{ `[${scope.row.detail}]` }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('good.businessTypes')" prop="goodType" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.businessType === 0">{{ $t('good.rent') }}</el-tag>
                    <el-tag v-if="scope.row.businessType === 20">{{ $t('good.sale') }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('purchasesManage.purchaseoneprice')" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-enter-number2
                      v-model="scope.row.price"
                      :placeholder="$t('purchasesManage.iptpurchaseoneprice')"
                      type="number"
                      min="0"
                      max="99999.99"
                      class="input-100"
                      oninput="if(value>99999.99) value=99999.99;if(value<0) value=0"
                      @change="e => handlePriceChange(e, scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('purchasesManage.purchaseamount')" prop="quantity" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-enter-number
                      v-model="scope.row.quantity"
                      :placeholder="$t('purchasesManage.iptpurchaseamount')"
                      type="number"
                      min="0"
                      max="999999"
                      class="input-100"
                      oninput="if(value>99999) value=99999;if(value<0) value=0"
                      @change="e => handlequantityChange(e, scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('purchasesManage.totalprice')" prop="price" align="center">
                  <template slot-scope="scope">
                    <span>{{ amoutprice(scope.row) }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.actions')" prop="price" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      @click.native.prevent="
                        deleRow(
                          scope.$index,
                          checkedPurchaseGood,
                          scope.row.skuId
                        )
                      "
                    >{{ $t('common.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top:15px; display:flex;">
                <span style="display:flex;align-items: baseline ;">
                  <span style="margin-right:5px;">{{ $t('purchasesManage.calculatetotalnum') }}:</span>
                  <!-- <digit-roll :roll-digits="totalAmount" :dur="500" class="number" /> -->
                  <span class="number">{{ totalAmount }}</span>
                </span>
                <span style="display:flex;align-items: baseline ; margin-left:100px;">
                  <span style="margin-right:5px;">{{ $t('purchasesManage.calculatetotalprice') }}($):</span>
                  <!-- <digit-roll :roll-digits="totalPrice" class="number" /> -->
                  <span class="number">{{ totalPrice }}</span>
                </span>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('purchasesManage.settleperiod')">
            <div style="display:flex">
              <span style="margin-right:10px">By</span>
              <div v-if="selectTime">
                <el-select v-model="form.settlementStrategy.baseTimeStrategy">
                  <el-option
                    :label="form.settlementStrategy.supplierMode==='SUPPLY' ? $t('warehouse.purchaseintime') : $t('purchasesManage.byreceiptime')"
                    value="RECEIPT_DATE"
                  />
                  <el-option :label="$t('purchasesManage.purchasesubmittime')" value="BILL_DATE" />
                </el-select>
                <i class="el-icon-check pointer blue" @click="selectTime = false" />
              </div>
              <div v-else>
                <el-tag effect="dark" size="medium" style="margin-right:10px;">
                  {{
                  form.settlementStrategy.baseTimeStrategy === 'RECEIPT_DATE'
                  ? form.settlementStrategy.supplierMode==='SUPPLY' ? $t('warehouse.purchaseintime') : $t('purchasesManage.byreceiptime')
                  : $t('purchasesManage.purchasesubmittime')
                  }}
                </el-tag>
                <i class="el-icon-edit pointer blue" @click="selectTime = true" />
              </div>
              <span style="margin:0 10px;">+</span>
              <div v-if="timeType">
                <el-select v-model="form.settlementStrategy.accountPeriodType">
                  <el-option :label="$t('purchasesManage.delayNdays')" value="AFTER_TRANSACTION" />
                  <el-option :label="$t('purchasesManage.bymonth')" value="MONTHLY" />
                </el-select>
                <span
                  v-if="
                    form.settlementStrategy.accountPeriodType ==
                      'AFTER_TRANSACTION'
                  "
                  style="margin-left:10px"
                >
                  <span>N=</span>
                  <el-input v-enter-number v-model="form.settlementStrategy.periodDate" type="number" class="input-80" oninput="if(value<0) value=0" min="0" />
                </span>
                <span v-else style="margin-left:10px">
                  <!-- 英文排版差异问题 需等翻译后再调整settlebyMonth字段 还有其他地方用 一起调 -->
                  <span>每月</span>
                  <el-input
                    v-enter-number
                    v-model="form.settlementStrategy.periodDate"
                    type="number"
                    class="input-80"
                    max="31"
                    oninput="if(value>31) value=31;if(value<1) value=1"
                    min="1"
                  />为结算日
                </span>
                <i class="el-icon-check pointer blue" @click="timeType = false" />
              </div>
              <div v-else>
                <el-tag effect="dark" size="medium" style="margin-right:10px;">
                  {{
                  form.settlementStrategy.accountPeriodType ===
                  'AFTER_TRANSACTION'
                  ? `${form.settlementStrategy.periodDate}天结算`
                  : `每月${form.settlementStrategy.periodDate}为结算日`
                  }}
                </el-tag>
                <i class="el-icon-edit pointer blue" @click="timeType = true" />
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('purchasesManage.purchasecontract')">
            <el-upload
              :action="coverOptions.upLoadUrl"
              :headers="token"
              :file-list="uploadFileList"
              :on-remove="fileRemove"
              :on-success="upLoadSuc"
              :before-upload="uploadBefore"
              :on-exceed="notupload"
              :limit="coverOptions.limit"
            >
              <el-button size="small" type="primary">{{ $t('financial.clickupload') }}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('common.remark')">
            <el-input :rows="4" v-model="form.remark" class="input-300" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" icon="el-icon-back" size="medium" @click="back()">{{ $t('common.back') }}</el-button>
        <div>
          <el-button type="primary" size="medium" @click="submitPurchase(true)">{{ $t('common.submit') }}</el-button>
          <el-button type="primary" size="medium" @click="savePurchase">{{ $t('purchasesManage.savenosubmit') }}</el-button>
        </div>
      </div>
    </div>
    <add-good :show="visible" @handOk="handOk" @handCancel="handCancel" />
  </div>
</template>

<script>
import addGood from './children/addGood';
import { imgBasePath } from '@/common/config.js';
import DigitRoll from '@huoyu/vue-digitroll'; // 数字滚动组件
import { getToken } from '@/utils/auth.js';
import warehouseApi from '@/api/warehouse/warehouse';
import {
  rqEnterprisesList,
  rqsaveNewPurchase, // 新增采购单
  rqeditOldPurchase, // 编辑采购单
  rqpurchaseDetail // 根据 Id 查询采购单详情
} from '@/api/purchase/index';
import { mapGetters } from 'vuex';
import store from '../../../../store';

export default {
  components: {
    addGood,
    DigitRoll
  },
  inject: ['reload'],
  data() {
    return {
      visible: false,
      editTableData: [], // 采购的商品
      selectTime: false,
      timeType: false,
      supplierTypeShow: false,
      pickerOptions: {
        disabledDate(time) {
          // 只能选择今天以及今天以后的日期
          return time.getTime() <= Date.now() - 8.64e7;
        },
        shortcuts: [
          {
            text: this.$t('purchasesManage.today'),
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: this.$t('purchasesManage.yestoday'),
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: this.$t('purchasesManage.longtimeago'),
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }
        ]
      },
      form: {
        supplierId: '', // 供应商 ID
        supplierType: '', // 供应商类型
        warehouseId: '', // 仓库 ID
        plannedWarehousingDate: '', // 计划入库时间
        remark: '', // 备注
        logisticFee: '', // 物流费用
        settlementStrategy: {
          accountPeriodType: 'AFTER_TRANSACTION',
          baseTimeStrategy: 'RECEIPT_DATE',
          periodDate: '1',
          supplierMode: ''
        } // 采购结算策略
      },
      rules: {
        supplierId: [{ required: true, message: this.$t('good.iptsupplier') }],
        warehouseId: [
          { required: true, message: this.$t('warehouse.iptinstockwarehouse') }
        ],
        plannedWarehousingDate: [
          { required: true, message: this.$t('financial.iptsuppliername') }
        ]
      },
      coverOptions: {
        upLoadUrl: `${imgBasePath}/goods/active/upload_img`,
        sizes: 5,
        limit: 1
      },
      uploadFileList: [],
      token: {
        Authorization: getToken()
      },
      warehouseslist: [],
      supplierTypeList: [],
      supplierList: [],
      totalAmount: 0, // 合计数量
      totalPrice: 0, // 合计总额
      version: '', // 版本号  在编辑状态下需要传递
      contract: {}
    };
  },
  computed: {
    ...mapGetters(['checkedPurchaseGood']),
    sumPrice(row) {
      return row.price * row.quantity;
    }
  },

  watch: {
    checkedPurchaseGood(val, oldval) {
      // console.log(
      //   'val=>',
      //   val,
      //   'oldVal',
      //   oldval,
      //   'this.editTableData',
      //   this.editTableData
      // );
      if (val.length > 0) {
        var arr = val;
        arr.map(item => {
          this.editTableData.map(one => {
            if (one.skuId === item.skuId) {
              one.price && (item.price = one.price);
              one.quantity && (item.quantity = one.quantity);
            }
          });
        });
      }
      this.calculation(arr);
    }
  },

  created() {
    if (this.$route.query.purchaseId) {
      this.fetchDetail(this.$route.query.purchaseId);
    } else {
      store.dispatch('SelecetedGood', []);
    }
    this.calculation(this.checkedPurchaseGood);
  },

  mounted() {
    this.fetchwarehousesList(); // 获取所有的仓库列表
    this.fetchsupplierList(); // 获取所有的供应商列表
  },

  methods: {
    // 编辑状态先要查询原始数据
    fetchDetail(purchaseId) {
      rqpurchaseDetail({ purchaseId }).then(async res => {
        if (res.code === 200) {
          this.form.remark = res.data.remark || ''; // 备注
          this.contract = res.data.contract || {}; // 合同
          this.uploadFileList = this.dealJson(res.data.contract) || [];
          this.form.logisticFee = res.data.logisticsFee || 0; // 物流费用
          this.version = res.data.version; // 版本号
          this.form.supplierId = res.data.supplier && res.data.supplier.id; // 供应商 ID
          this.form.plannedWarehousingDate = res.data.plannedWarehousingDate; // 计划入库时间
          this.form.warehouseId =
            res.data.stockInWarehouse && res.data.stockInWarehouse.id; // 仓库 ID
          this.form.settlementStrategy.accountPeriodType =
            res.data.settlementStrategy &&
            res.data.settlementStrategy.accountPeriodType; // 账期类型
          this.form.settlementStrategy.baseTimeStrategy =
            res.data.settlementStrategy &&
            res.data.settlementStrategy.baseTimeStrategy; // 结算基准时间
          this.form.settlementStrategy.periodDate =
            res.data.settlementStrategy &&
            res.data.settlementStrategy.periodDate; // 时间
          this.form.settlementStrategy.supplierMode =
            res.data.settlementStrategy.supplierMode;
          this.editTableData = res.data.goodsLists || [];
          await this.fetchsupplierList()
          this.selectSupplier(this.form.supplierId)
          switch (res.data.supplierMode) {
            case 0: this.form.supplierType = 'SUPPLY'; break
            case 1: this.form.supplierType = 'SELLING'; break
            case 2: this.form.supplierType = 'SELLING'; break
            case 3: this.form.supplierType = 'DELIVER'; break
            default: this.form.supplierType = ''
          }
          store.dispatch(
            'SelecetedGood',
            this.dealEditArr(res.data.goodsLists)
          ); // 还原表格数据
        }
      });
    },

    dealJson(val) {
      var arr = [];
      for (const key in val) {
        arr.push({ name: val[key], url: key });
      }
      return arr;
    },

    dealEditArr(arr) {
      arr.forEach(item => {
        item.spuNo = item.goodsCode;
        item.spuName = item.name;
        item.detail = item.specification;
        item.businessType = item.businessType === this.$t('good.rent') ? 0 : 20;
        item.skuId = Number(item.skuId);
      });
      return arr;
    },

    // 表格每行的总金额计算
    amoutprice(row) {
      const price = row.price || 0;
      const num = row.quantity || 0;
      if (price > 0 && num > 0) {
        return (Number(price) * Number(num)).toFixed(2);
      } else {
        return 0;
      }
    },

    //
    back() {
      this.$router.go(-1);
    },

    // 添加按钮回调
    handOk() {
      this.visible = false;
    },

    // 取消
    handCancel() {
      this.visible = false;
    },

    //
    addGoods() {
      this.visible = true;
    },

    // 上传文件格式验证
    uploadBefore(file) {
      const size = file.size / 1024 / 1024 < this.coverOptions.sizes;
      if (!size) {
        this.$message.error(
          this.$t('good.uploadSizeMax') + ` ${this.coverOptions.sizes}MB!`
        );
        return false;
      }
    },

    // 上传成功
    upLoadSuc(response, file, fileList) {
      console.log(response, 'file', file, 'fileList', fileList);
      if (response.code === 200) {
        this.$message.success(this.$t('financial.uploadsuccess'));
        const url = response.data.baseUrl + response.data.fileUrl;
        const name = file.name;
        this.contract[url] = name;
        // this.contract.push({ name: name, url: url });
      } else {
        this.$message.error(response.msg);
      }
      console.log('已上传的文件:', this.uploadFileList);
    },

    // 删除上传文件
    fileRemove(file, fileList) {
      this.contract = {};
      console.log('file', file, 'fileList', fileList);
    },

    // 上传数量超过最大数量的钩子
    notupload(files, fileList) {
      console.log(files, fileList);
      this.$message.warning(this.$t('purchasesManage.onlyonefile'));
    },

    // 查询所有的仓库列表接口
    fetchwarehousesList() {
      const data = {
        page: 1,
        pageSize: 1000,
        name: '',
        enabled: true // 启用状态
      };
      warehouseApi.getStockList(data).then(res => {
        if (res.code === 200) {
          this.warehouseslist = res.data.list || [];
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    // 获取供应商列表信息
    fetchsupplierList() {
      const params = {
        page: 1,
        pageSize: 1000,
        supplierId: '',
        name: '',
        status: 'UNDERWAY', // 合作中
        supplierMode: 'SUPPLY'
      };
      return rqEnterprisesList({ ...params }).then(res => {
        if (res.code === 200) {
          this.supplierList = res.data.list || [];
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    // 提交
    submitPurchase(flag) {
      if (this.timeType || this.selectTime) {
        this.$message.warning(this.$t('purchasesManage.confirmsettleperiod'));
        return;
      } else if (
        this.form.logisticFee === '' ||
        this.form.logisticFee === undefined ||
        this.form.logisticFee < 0
      ) {
        this.$message.warning(this.$t('purchasesManage.iptlogisticsFee'));
        return;
      }
      this.$refs['form'].validate(valid => {
        if (!valid) return;
        const params = {
          purchaseId: this.$route.query.purchaseId || undefined, // 采购单 ID(编辑状态下需要传)
          supplierId: this.form.supplierId, // 供应商 ID
          warehouseId: this.form.warehouseId, // 入库仓库 ID
          plannedWarehousingDate: this.form.plannedWarehousingDate, // 入库日期
          goodsLists: this.checkedPurchaseGood.map(v => ({
            price: Number(v.price),
            quantity: Number(v.quantity),
            skuId: Number(v.skuId)
          })), // 采购单添加的商品列表
          logisticFee: this.form.logisticFee, // 物流费用
          supplierMode: this.form.supplierType, // 供应商类型
          remark: this.form.remark, // 备注
          contract: this.contract, // 采购合同
          submitted: flag, // 是否提交
          settlementStrategy: this.form.settlementStrategy, // 采购端策略
          version: this.version || undefined
        };
        if (this.$route.query.purchaseId) {
          // 如果存在采购单 ID 则是编辑
          rqeditOldPurchase({ ...params }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('common.editSuccess'));
              store.dispatch('SelecetedGood', []).then(res => {});
              this.$router.go(-1);
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          rqsaveNewPurchase({ ...params }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('common.addSuccess'));
              this.reload();
              this.$router.go(-1);
              store.dispatch('SelecetedGood', []).then(res => {});
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },

    // 暂时保存不提交
    savePurchase() {
      this.submitPurchase(false);
    },

    // 删除表格某一行
    deleRow(index, rows, skuId) {
      rows.splice(index, 1);
      if (this.editTableData.length > 0) {
        if (this.editTableData.findIndex(item => item.skuId === skuId) !== -1) {
          this.editTableData.splice(
            this.editTableData.findIndex(item => item.skuId === skuId),
            1
          );
        }
      }
      console.log('rows', rows, 'this.editTableData', this.editTableData);
      const newRows = rows;
      store.dispatch('SelecetedGood', newRows).then(res => {
        this.$message.success(this.$t('common.deleteSuccess'));
      });
    },

    // 输入采购单价
    handlePriceChange(e, row) {
      row.price = e;
      this.editAddArr(row);
      this.calculation();
    },

    // 输入采购数量
    handlequantityChange(e, row) {
      // console.log(e, row, this.checkedPurchaseGood);
      row.quantity = e;
      this.calculation();
      this.editAddArr(row);
    },

    // 计算
    calculation(rows) {
      console.log('当前计算的数组', this.checkedPurchaseGood);
      let num = 0;
      let price = 0;
      this.checkedPurchaseGood.forEach(v => {
        num += Number(v.quantity || 0);
        price += Number(this.amoutprice(v));
      });
      console.log('计算后的数量:时间', num, ':', price);
      this.totalAmount = num.toFixed(2);
      this.totalPrice = price.toFixed(2) * 1 + this.form.logisticFee; // 加上物流费用;
    },

    // 将改动过的数据放进数组
    editAddArr(row) {
      const skuid = row.skuId;
      const spuIdlist = this.editTableData.map(item => item.skuId);
      if (spuIdlist.includes(skuid)) {
        this.editTableData.map(one => {
          if (one.skuId === skuid) {
            one.skuId = row.skuId;
            one.price = row.price;
            one.quantity = row.quantity;
          }
        });
      } else {
        this.editTableData.push({
          skuId: row.skuId,
          price: row.price,
          quantity: row.quantity
        });
      }
      // console.log('修改过的数组', this.editTableData);
    },

    // 供应商选择
    selectSupplier(value) {
      console.log(value);
      this.supplierList.map(v => {
        const repArr =
          v.cooperationModes &&
          v.cooperationModes.length > 0 &&
          v.cooperationModes[0].strategies
        if (v.id * 1 === value * 1 && repArr && repArr.length > 0) {
          this.form.settlementStrategy.accountPeriodType =
            repArr[0].accountPeriodType;
          this.form.settlementStrategy.baseTimeStrategy =
            repArr[0].baseTimeStrategy;
          this.form.settlementStrategy.periodDate = repArr[0].periodDate;
          this.form.settlementStrategy.supplierMode = repArr[0].supplierMode;
          this.supplierTypeList = repArr.map(item => {
            switch (item.supplierMode) {
              case 'SUPPLY': item.supplierModeDescShow = '自营_常规'; break
              case 'DELIVER': item.supplierModeDescShow = '自营_代发货'; break
              case 'SELLING': item.supplierModeDescShow = '代租售'; break
              default: item.supplierModeDescShow = ''
            }
            return item
          }).filter(item => { return item.supplierMode !== 'SELLING' })
          this.form.supplierType = this.supplierTypeList[0].supplierMode
          this.supplierTypeShow = repArr.length > 1
        }
      });
    },
    changeSupplierMode(mode) {
      const chooseType = this.supplierTypeList.filter(type => {
        return type.supplierMode === mode
      })[0]
      this.form.settlementStrategy.accountPeriodType = chooseType.accountPeriodType;
      this.form.settlementStrategy.baseTimeStrategy = chooseType.baseTimeStrategy;
      this.form.settlementStrategy.periodDate = chooseType.periodDate;
      this.form.settlementStrategy.supplierMode = chooseType.supplierMode;
    },

    // 物流费用变动
    logisticFeeChange(val) {
      if (val !== '') {
        this.calculation();
      }
      console.log(this.form.logisticFee);
    }
  }
};
</script>

<style lang="scss">
.newpurchase {
  .el-upload-list {
    width: 300px;
  }
  background: #fff;
  height: 100%;
  // overflow: auto;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  .header {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    .header_text {
      border-left: 2px solid #2592fc;
      line-height: 16px;
      padding-left: 8px;
    }
  }
  .main {
    padding: 15px;
    flex: 1;
    overflow: auto;
  }

  .footer {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
  }
  .addGoodContent {
    border: 1px solid #ebeef5;
    padding: 15px;
    .addBtn {
      margin-bottom: 15px;
    }
  }
  .number {
    font-size: 30px;
    color: red;
    margin: 0;
    width: auto;
  }
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    min-height: 50px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
