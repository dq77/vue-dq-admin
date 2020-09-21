<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="add-outstock-goods">
    <el-dialog :visible.sync="dialog" title="添加商品" center width="600px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="导入模板下载" class="modelDown">
          <a
            href="https://tzg-static.oss-cn-hangzhou.aliyuncs.com/web/admin/ImportSN.xlsx"
            target="_blank"
          >导入序列号模板.xlsx</a>
        </el-form-item>
        <el-form-item label="商品" prop="skuId">
          <el-select
            v-model="formData.skuId"
            :remote-method="searchGoods"
            :loading="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            class="input-400"
            @change="chooseGood"
          >
            <el-option
              v-for="item in goods"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }} <span style="color: #909399">{{ item.erpCode }}</span></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库数量" prop="num">
          <el-input v-model="formData.num" maxlength="20" placeholder="请填写出库数量" class="input-400" @keyup.enter.native="addSn()"/>
        </el-form-item>
        <el-form-item ref="sns" label="资产序列号" prop="sns">
          <div v-if="!formData.serialNumberUpload">
            <div v-for="(sn, index) in formData.sns" :key="index">
              <el-input v-model="formData.sns[index]" :ref="'sn'+index" class="input-400" />
              <el-button v-if="index != 0" type="text" @click.prevent="removeSn(sn)">删除</el-button>
            </div>
          </div>
          <el-button v-if="!formData.serialNumberUpload" class="add-sn-btn" @click="addSn()">新增序列号</el-button>
          <el-upload
            v-if="formData.sns.length == 0 || formData.serialNumberUpload"
            :before-upload="(file) => {beforeAvatarUpload(file)}"
            :show-file-list="false"
            action="https://httpbin.org/post"
            class="up-btn"
          >
            <el-button v-if="!formData.serialNumberUpload">导入序列号</el-button>
            <el-button v-else>{{ formData.serialNumber }}</el-button>
            <span v-if="formData.serialNumberUpload">{{ formData.sns.length }} 条</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js';
import { readWorkbookFromLocalFile } from '../../../../utils/xlsx.js';
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗
      formData: {
        skuId: '',
        skuInfo: {}, // 选择的sku信息
        num: '',
        sns: [],
        serialNumberUpload: false,
        serialNumber: ''
      },
      goods: [], // 可选商品列表
      formRule: {
        skuId: [{ required: true, message: '请选择商品', trigger: 'change' }],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              const znum = /^[1-9]\d*$/;
              if (!znum.test(value)) {
                callback(new Error('请填写正确的出库数量'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    // 搜索商品
    searchGoods(query) {
      if (query !== '') {
        const params = {
          keyWords: query,
          listQuery: { page: 1, pageSize: 10 }
        };
        goodsApi.goodsList(params).then(res => {
          if (res.code === 200 && res.data) {
            this.goods = [];
            res.data.list.map(spu => {
              spu.skuVOList.map(sku => {
                let name = spu.spuName;
                sku.detail ? (name += `  [${sku.detail}]`) : null;
                this.goods.push({ name: name, ...sku });
              });
            });
          }
        });
      } else {
        this.goods = [];
      }
    },
    // 选中商品
    chooseGood(id) {
      this.formData.skuInfo = this.goods.filter(item => {
        return item.id === id;
      })[0];
    },

    addSn() {
      this.formData.sns.push('');
      setTimeout(() => {
        this.$refs['sn' + (this.formData.sns.length - 1)][0].focus();
      }, 100);
    },
    removeSn(sn) {
      var index = this.formData.sns.indexOf(sn);
      if (index !== -1) {
        this.formData.sns.splice(index, 1);
      }
    },
    // 上传钩子
    beforeAvatarUpload(file) {
      const fileType = file.name.slice(
        ((file.name.lastIndexOf('.') - 1) >>> 0) + 2
      );
      if (fileType !== 'xlsx' && fileType !== 'xls') {
        return this.$message.error('请上传正确的文件类型');
      }
      this.formData.serialNumberUpload = true;
      this.formData.serialNumber = file.name;
      this.formData.sns = [];
      readWorkbookFromLocalFile(file, this.readWorkbook);
    },
    readWorkbook(workbook) {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      for (const key in sheet) {
        ((key + '').slice(0, 1) === 'C') && sheet[key].v ? this.formData.sns.push(sheet[key].v) : null;
      }
      this.formData.sns.shift();
      this.formData.sns = Array.from(new Set(this.formData.sns));
    },
    save() {
      this.formData.sns = this.formData.sns.filter(function(s) {
        return s && s + ''.trim();
      });
      this.formData.sns = Array.from(new Set(this.formData.sns));
      if (this.formData.sns.length === 0) {
        this.$message.error('请填写资产序列号');
        return false;
      }
      if( this.formData.num != this.formData.sns.length ) {
        this.$message.error('资产序列号数量与出库数量不同');
        return false;
      }
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$emit('handOk', { ...this.formData });
        }
      });
    },
    cancel() {
      this.$refs['formData'].clearValidate();
      this.$refs['formData'].resetFields();
      this.$emit('handClose', false);
    },
    // 重置表单
    resetForm() {
      this.formData.serialNumberUpload = false;
      this.formData.serialNumber = '';
      this.$refs['formData'].clearValidate();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-outstock-goods {
  .input-400 {
    width: 400px;
  }
  .modelDown {
    margin-bottom: 18px;
    a,
    a:hover,
    a:active,
    a:visited {
      color: #409eff;
    }
  }
  .add-sn-btn {
    margin-right: 6px;
  }
  .up-btn {
    display: inline-block;
  }
}
</style>
