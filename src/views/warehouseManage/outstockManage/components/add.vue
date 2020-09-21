<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-outstock-good-container">
    <el-dialog :visible.sync="dialog" title="出库" center width="500px" @close="cancel">
      <el-form ref="formData" v-model="formData" label-width="100px" status-icon>
        <el-form-item label="导入模板下载" class="modelDown">
          <a
            href="https://tzg-static.oss-cn-hangzhou.aliyuncs.com/web/admin/%E5%AF%BC%E5%85%A5%E5%BA%8F%E5%88%97%E5%8F%B7%E6%A8%A1%E6%9D%BF.xlsx"
            target="_blank"
          >导入序列号模板.xlsx</a>
        </el-form-item>
        <div v-for="item in formData.goods" :key="item.skuId" class="goodItem">
          <el-form-item label="商品名称">
            <span>{{ item.name }}</span>
            <span v-if="item.specification">[{{ item.specification }}]</span>
          </el-form-item>
          <el-form-item label="待出库数量">
            <span>{{ item.insideWarehouseCount }}</span>
          </el-form-item>
          <el-form-item :rules="[{required: true}]" :ref="'outstockNum'+item.skuId" label="出库数量">
            <el-input
              v-model="item.outstockNum"
              maxlength="20"
              placeholder="请填写要出库的数量"
              class="input-300"
              type="tel"
            />
          </el-form-item>
          <el-form-item label="新增序列号">
            <el-radio v-model="item.createAssetIfNotExisted" :label="false">否</el-radio>
            <el-radio v-model="item.createAssetIfNotExisted" :label="true">是</el-radio>
          </el-form-item>
          <el-form-item :ref="'sns'+item.skuId" label="资产序列号" prop="sns">
            <div v-if="!item.serialNumberUpload">
              <div v-for="(sn, index) in item.sns" :key="index">
                <el-input v-model="item.sns[index]" :ref="'sns'+item.skuId+index" class="input-300" @keyup.enter.native="(val) => {addSn(item)}"/>
                <el-button v-if="index != 0" type="text" @click.prevent="removeSn(sn, item)">删除</el-button>
              </div>
            </div>
            <el-button v-if="!item.serialNumberUpload" class="add-sn-btn" @click="addSn(item)">新增序列号</el-button>
            <el-upload
              v-if="item.sns.length == 0 || item.serialNumberUpload"
              :before-upload="(file) => {beforeAvatarUpload(file, item)}"
              :show-file-list="false"
              action="https://httpbin.org/post"
              class="up-btn"
            >
              <el-button v-if="!item.serialNumberUpload">导入序列号</el-button>
              <el-button v-else>{{ item.serialNumber }}</el-button>
              <span v-if="item.serialNumberUpload">{{ item.sns.length }} 条</span>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item ref="remark" label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="4"
            type="textarea"
            class="input-300"
            placeholder="填写备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save()">确认出库</el-button>
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
      default: () => {
        return [];
      }
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
        if (!val) {
          this.resetForm();
        }
        if (val && this.dataSource) {
          this.dataSource.map(item => {
            this.$set(item, 'createAssetIfNotExisted', false)
          })
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
        const id = 'outstockNum' + item.skuId;
        const snsId = 'sns' + item.skuId
        const znum = /^[1-9]\d*$/;

        if (!znum.test(item.outstockNum)) {
          this.$refs[id][0].$el.classList.add('is-error');
          if (!item.outstockNum) {
            this.$message.error('请填写出库数量');
          } else {
            this.$message.error('请填写正确的出库数量');
          }
          return false;
        } else {
          if (item.outstockNum - 0 > item.insideWarehouseCount - 0) {
            this.$refs[id][0].$el.classList.add('is-error');
            this.$message.error('出库数量不能大于待出库数量');
            return false;
          }
          this.$refs[id][0].$el.classList.remove('is-error');
        }
        item.sns = item.sns.filter(function(s) {
          return s && s + ''.trim();
        });
        item.sns = Array.from(new Set(item.sns));
        if (item.sns.length === 0) {
          this.$message.error('请填写资产序列号');
          return false;
        }
        let snValid = true
        item.sns = item.sns.map(function(currentValue, index) {
          const snzz = /^[R,A,S][a-zA-Z0-9]{4}[0-9]{5}$/;
          const s = (currentValue + '').trim()
          if (item.hasSn) {
            if (!item.outOfWarehouseSns.includes(currentValue)) {
              vuethat.$message.error('资产序列号不合法');
              snValid = false
              vuethat.$refs[snsId + index] ? vuethat.$refs[snsId + index][0].$el.classList.add('snInputError') : ''
              return s;
            }
          } else if (item.situation !== 'RETURN' && item.situation !== 'EXCHANGE' && item.situation !== 'EXPIRED') {
            if (!snzz.test(s) && s !== '') {
              vuethat.$message.error('资产序列号不合法');
              snValid = false
              vuethat.$refs[snsId + index] ? vuethat.$refs[snsId + index][0].$el.classList.add('snInputError') : ''
              return s;
            }
          }
          vuethat.$refs[snsId + index] ? vuethat.$refs[snsId + index][0].$el.classList.remove('snInputError') : ''
          return s
        });
        if (!snValid) return false
        if (item.sns.length != item.outstockNum) {
          this.$refs[id][0].$el.classList.add('is-error');
          this.$message.error('资产序列号数量与出库数量不同');
          return false;
        }
        valid++;
      });
      if (
        this.formData.remark !== '' &&
        this.formData.remark.split('').length > 50
      ) {
        this.$refs['remark'].$el.classList.add('is-error');
        this.$message.error('备注不能超过50个字符');
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
        return this.$message.error('请上传正确的文件类型');
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
    },

    // 重置表单
    resetForm() {
      this.formData.remark = '';
      this.$refs['formData'].clearValidate();
      this.$emit('handClose', 'addDlg');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-outstock-good-container {
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
  .sn-error .add-sn-btn{
    color: #f56c6c;
  }
  .snInputError .el-input__inner{
    color: #f56c6c;
    border-color: #f56c6c;
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
  }
}
</style>
