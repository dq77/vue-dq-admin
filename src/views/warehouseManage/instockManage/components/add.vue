<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-05-13 22:02:40
 * @Description: file content
 -->
<template>
  <div class="add-instock-good-container">
    <el-dialog :visible.sync="dialog" :title="$t('warehouse.instock')" center width="500px" @close="cancel">
      <el-form ref="formData" v-model="formData" label-width="100px" status-icon>
        <el-form-item :label="$t('warehouse.importtempdowm')" class="modelDown">
          <a href="https://tzg-static.oss-cn-hangzhou.aliyuncs.com/web/admin/ImportSN.xlsx" target="_blank">ImportSN.xlsx</a>
        </el-form-item>
        <div v-for="item in formData.goods" :key="item.skuId" class="goodItem">
          <el-form-item :label="$t('good.goodname')">
            <span>{{ item.name }}</span>
            <span v-if="item.specification">[{{ item.specification }}]</span>
          </el-form-item>
          <el-form-item :label="$t('warehouse.waitforinstocknum')">
            <span>{{ item.outOfWarehouseCount }}</span>
          </el-form-item>
          <el-form-item :rules="[{required: true}]" :ref="'instockNum'+item.skuId" :label="$t('warehouse.instocknum')">
            <el-input
              v-model="item.instockNum"
              :placeholder="$t('warehouse.iptinstocknum')"
              maxlength="20"
              class="input-300"
              type="tel"
            />
          </el-form-item>
          <el-form-item :ref="'sns'+item.skuId" :label="$t('warehouse.serialNumber')" prop="sns">
            <div v-if="!item.serialNumberUpload">
              <div v-for="(sn, index) in item.sns" :key="index">
                <el-input v-model="item.sns[index]" :ref="'sns'+item.skuId+index" class="input-300" @keyup.enter.native="(val) => {addSn(item)}"/>
                <el-button v-if="index != 0" type="text" @click.prevent="removeSn(sn, item)">{{ $t('common.delete') }}</el-button>
              </div>
            </div>
            <el-button v-if="!item.serialNumberUpload" class="add-sn-btn" @click="addSn(item)">{{ $t('warehouse.addsn') }}</el-button>
            <el-upload
              v-if="item.sns.length == 0 || item.serialNumberUpload"
              :before-upload="(file) => {beforeAvatarUpload(file, item)}"
              :show-file-list="false"
              action="https://httpbin.org/post"
              class="up-btn"
            >
              <el-button v-if="!item.serialNumberUpload">{{ $t('warehouse.importsn') }}</el-button>
              <el-button v-else>{{ item.serialNumber }}</el-button>
              <span v-if="item.serialNumberUpload">{{ item.sns.length }} SNs</span>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item ref="remark" :label="$t('common.remark')" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="4"
            :placeholder="$t('warehouse.iptremark')"
            type="textarea"
            class="input-300"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="save()">{{ $t('warehouse.confirminstock') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { deepClone } from '../../../../utils';
import { readWorkbookFromLocalFile } from '../../../../utils/xlsx.js';
export default {
  components: {},
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗标志
      formData: {
        goods: [],
        remark: ''
      },
      upItem: {}
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        console.log(this.formData.goods);
        if (!val) {
          this.resetForm();
        }
        if (val && this.dataSource) {
          this.formData.goods = this.dataSource;
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },

    // 保存
    save() {
      let valid = 0;
      const vuethat = this
      this.formData.goods.map(item => {
        const id = 'instockNum' + item.skuId;
        const snsId = 'sns' + item.skuId
        const znum = /^[1-9]\d*$/;

        if (!znum.test(item.instockNum)) {
          this.$refs[id][0].$el.classList.add('is-error');
          if (!item.instockNum) {
            this.$message.error(this.$t('warehouse.iptinstocknum'));
          } else {
            this.$message.error(this.$t('good.notallownum'));
          }
          return false;
        } else {
          if (item.instockNum - 0 > item.outOfWarehouseCount - 0) {
            this.$refs[id][0].$el.classList.add('is-error');
            this.$message.error(this.$t('warehouse.instocknummax'));
            return false;
          }
          this.$refs[id][0].$el.classList.remove('is-error');
        }
        // 添加过滤那些未填写空序列号的数组的值
        item.sns = Array.from(new Set(item.sns)).filter(d => d);
        if (item.sns.length === 0) {
          this.$refs[snsId][0].$el.classList.add('sn-error')
          this.$message.error(this.$t('warehouse.snnotept'));
          return false;
        }
        this.$refs[snsId][0].$el.classList.remove('sn-error')
        let snValid = true
        item.sns = item.sns.map(function(currentValue, index) {
          const snzz = /^[R,A,S][a-zA-Z0-9]{4}[0-9]{5}$/;
          const s = (currentValue + '').trim()
          if (!snzz.test(s) && s !== '') {
            vuethat.$message.error('资产序列号不合法');
            snValid = false
            vuethat.$refs[snsId + index] ? vuethat.$refs[snsId + index][0].$el.classList.add('snInputError') : ''
            return s;
          }
          vuethat.$refs[snsId + index] ? vuethat.$refs[snsId + index][0].$el.classList.remove('snInputError') : ''
          return s
        });
        if (!snValid) return false
        if (item.sns.length !== parseInt(item.instockNum)) {
          this.$refs[id][0].$el.classList.add('is-error');
          this.$message.error(this.$t('warehouse.snquantitywrong'));
          return false;
        }
        valid++;
      });
      if (
        this.formData.remark !== '' &&
        this.formData.remark.split('').length > 50
      ) {
        this.$refs['remark'].$el.classList.add('is-error');
        this.$message.error(this.$t('warehouse.remarkmax'));
        return false;
      } else {
        this.$refs['remark'].$el.classList.remove('is-error');
      }
      valid === this.formData.goods.length
        ? this.$emit('handOk', this.formData)
        : '';
    },

    addSn(item) {
      item.sns.push('');
      setTimeout(() => {
        this.$refs['sns' + item.skuId + (item.sns.length - 1)][0].focus();
      }, 100);
    },
    removeSn(sn, item) {
      var index = item.sns.indexOf(sn);
      if (index !== -1) {
        item.sns.splice(index, 1);
      }
    },
    // 上传钩子
    beforeAvatarUpload(file, item) {
      const fileType = file.name.slice(
        ((file.name.lastIndexOf('.') - 1) >>> 0) + 2
      );
      if (fileType !== 'xlsx' && fileType !== 'xls') {
        return this.$message.error(this.$t('warehouse.uploadrighttype'));
      }
      item.serialNumberUpload = true;
      item.serialNumber = file.name;
      item.file = file;
      item.sns = [];
      this.upItem = item;
      readWorkbookFromLocalFile(file, this.readWorkbook);
    },
    readWorkbook(workbook) {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      for (const key in sheet) {
        ((key + '').slice(0, 1) === 'C') && sheet[key].v ? this.upItem.sns.push(sheet[key].v) : null;
      }
      this.upItem.sns.shift();
      this.upItem.sns = Array.from(new Set(this.upItem.sns));
      console.log(this.upItem.sns);
    },

    // 重置表单
    resetForm() {
      this.formData.goods.map(item => {
        const id = 'instockNum' + item.skuId
        const snsId = 'sns' + item.skuId
        this.$refs[id][0].$el.classList.remove('is-error')
        this.$refs[snsId][0].$el.classList.remove('sn-error')
      })
      this.formData.remark = '';
      this.$refs['formData'].clearValidate();
      this.$emit('handClose', false);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-instock-good-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .modelDown {
    margin-bottom: 4px;
    a,
    a:hover,
    a:active,
    a:visited {
      color: #409eff;
    }
  }
  .goodItem {
    border-bottom: 1px solid #aaa;
    padding-bottom: 4px;
    margin-bottom: 4px;
    .el-form-item--mini.el-form-item {
      margin-bottom: 4px;
    }
    .add-sn-btn {
      margin-right: 6px;
    }
    .up-btn {
      display: inline-block;
    }
    .sn-error .add-sn-btn{
      color: #f56c6c;
    }
    .snInputError .el-input__inner{
      color: #f56c6c;
      border-color: #f56c6c;
    }
    .checkSn{
      display: block;
    }
    .el-checkbox.checkSn+.el-checkbox.checkSn {
      margin-left: 0;
    }
  }
}
</style>
