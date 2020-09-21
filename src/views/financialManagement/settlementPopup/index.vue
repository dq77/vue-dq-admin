<template>
  <el-dialog
    v-el-drag-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="title"
    width="520px"
    center
  >
    <el-form
      ref="moduleForm"
      :rules="rules"
      :model="moduleForm"
      status-icon
      label-width="25%"
    >
      <div v-if="sourceinfo.source==='DELIVER'">
        <el-form-item :label="$t('financial.isslctordernum')">
          <span>{{ sourceinfo.orderNum || 0 }}</span>
        </el-form-item>
        <el-form-item :label="$t('financial.goodtotalnum')">
          <span>{{ sourceinfo.goodsNum || 0 }}</span>
        </el-form-item>
      </div>
      <el-form-item :label="$t('financial.besettled')">
        <div>{{ sourceinfo.expectedSettlementPrice || 0 }}</div>
      </el-form-item>
      <el-form-item :label="$t('financial.duedate')">
        <div>{{ sourceinfo.expectedSettlementDate || '--' }}</div>
      </el-form-item>
      <el-form-item
        :label="$t('financial.actualsettlesprice')"
        prop="settlementPrice"
      >
        <el-input
          v-enter-number2
          v-model="moduleForm.settlementPrice"
          :placeholder="$t('financial.iptsettlesprice')"
          type="number"
        />
      </el-form-item>
      <el-form-item
        :label="$t('financial.actualsettlesday')"
        prop="settlementDate"
      >
        <el-date-picker
          v-model="moduleForm.settlementDate"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item :label="$t('financial.voucher')">
        <el-upload
          :action="coverOptions.upLoadUrl"
          :headers="token"
          :file-list="uploadFileList"
          :on-remove="fileRemove"
          :on-success="upLoadSuc"
          :before-upload="uploadBefore"
          :limit="coverOptions.limit"
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
        prop="remark"
      >
        <el-input
          v-model.trim="moduleForm.remark"
          :placeholder="$t('warehouse.remarkmax')"
          maxlength="50"
          type="text"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
      style="text-align:right"
    >
      <el-button @click="handleClose('cacel')">{{ $t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        @click="handleClose('ok')"
      >{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog';
import { imgBasePath } from '@/common/config.js';
import { getToken } from '@/utils/auth.js';
import {
  rqsettlementsOpertion // 结算操作
} from '@/api/financialManagement/index';

export default {
  directives: { elDragDialog }, // 自定义指令
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sourceinfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checsettlementPrice = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        callback(new Error(this.$t('financial.iptactualsettlesprice')));
      } else if (value < 0.01) {
        callback(new Error(this.$t('financial.actualsettlespricemin0')));
      } else {
        callback();
      }
    };
    return {
      title: this.$t('financial.confirmsettle'),
      visible: this.show, // 弹窗显隐
      moduleForm: {
        settlementDate: '', // 实际结算金额
        expectedSettlementDate: '', // 实际结算日期
        remark: '' // 备注
      },
      rules: {
        settlementPrice: [
          {
            required: true,
            validator: checsettlementPrice,
            trigger: 'blur'
          }
        ],
        settlementDate: [
          {
            required: true,
            message: this.$t('financial.slctactualsettlesday'),
            trigger: 'blur'
          }
        ]
      },
      voucher: {}, // 结算凭证
      coverOptions: {
        upLoadUrl: `${imgBasePath}/goods/active/upload_img`,
        sizes: 5,
        limit: 5
      },
      uploadFileList: [],
      token: {
        Authorization: getToken()
      }
    };
  },
  watch: {
    show() {
      console.log(this.show);
      this.visible = this.show;
    },
    'sourceinfo.source': {
      handler(val) {
        console.log(val);
        if (val === 'SELLING') {
          this.title = this.$t('financial.consolidatesettle');
        }
      },
      deep: true
    }
  },
  created() {},

  mounted() {},
  methods: {
    // 弹窗关闭
    handleClose(val) {
      if (val === 'ok') {
        this.Settlement().then(val => {
          this.$emit('handOk');
          this.$refs['moduleForm'].resetFields();
          this.uploadFileList = [];
          this.$refs['moduleForm'].clearValidate();
        }); // 结算
      } else if (val === 'cacel') {
        this.$confirm(this.$t('setCenter.confirmclose'))
          .then(_ => {
            this.$emit('handCancel');
            this.$refs['moduleForm'].resetFields();
            this.uploadFileList = [];
            this.$refs['moduleForm'].clearValidate();
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel');
        this.$refs['moduleForm'].resetFields();
        this.uploadFileList = [];
        this.$refs['moduleForm'].clearValidate();
      }
    },

    //  上传前的验证
    uploadBefore(file) {
      const size = file.size / 1024 / 1024 < this.coverOptions.sizes;
      if (!size) {
        this.$message.error(this.$t('good.uploadSizeMax') + ` ${this.coverOptions.sizes}MB!`);
        return false;
      }
    },

    // 上传成功
    upLoadSuc(response, file) {
      if (response.code === 200) {
        this.$message.success(this.$t('financial.uploadsuccess'));
        const url = response.data.baseUrl + response.data.fileUrl;
        const name = file.name;
        this.voucher[url] = name;
      } else {
        this.$message.error(response.msg);
      }
      console.log('已上传的文件:', this.voucher);
    },

    // 文件删除
    fileRemove(file) {
      console.log('file', file);
      const url = file.response.data.baseUrl + file.response.data.fileUrl;
      delete this.voucher[url];
      console.log('已上传的文件:', this.voucher);
    },

    // 结算操作
    Settlement() {
      return new Promise((resolve, reject) => {
        this.$refs['moduleForm'].validate(valid => {
          if (!valid) return false;
          const params = {
            ...this.moduleForm,
            voucher: this.voucher, // 凭证
            version: this.sourceinfo.version, // 版本号
            settlementBillId: this.sourceinfo.id // 结算 ID
          };

          rqsettlementsOpertion({ ...params }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('financial.settlesuccess'));
              resolve();
            } else {
              this.$message.error(res.msg);
              reject();
            }
          });
        });
      });
    }
  }
};
</script>

<style>
</style>
