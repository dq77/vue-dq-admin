<template>
  <div class="add-attribute">
    <el-dialog
      :visible.sync="dialog"
      :title="$t('good.addprop')"
      width="300"
      center
      @close="cancel()">
      <el-form ref="formData" :model="formData" :rules="formDataRule" label-width="180px" >
        <el-form-item :label="$t('good.propName')" prop="specificationKeyVO.name">
          <el-input v-model="formData.specificationKeyVO.name" :placeholder="$t('good.iptpropName')" class="input-200"/>
        </el-form-item>
        <el-form-item :label="$t('good.propValue')" prop="specificationValueVOList">
          <template v-if="formData.specificationValueVOList && formData.specificationValueVOList.length>0">
            <el-tag
              v-for="(tag, index) in formData.specificationValueVOList"
              :key="index"
              :disable-transitions="false"
              size="small"
              closable
              @close="handleClose(tag)">
              {{ tag.name }}
            </el-tag>
          </template>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"/>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{ $t('good.addpropValue') }}</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button plain size="small" @click="cancel()">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="submit('formData')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js'
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputVisible: false,
      dialog: false,
      inputValue: '',
      formData: {
        specificationKeyVO: {
          name: ''
        },
        specificationValueVOList: []
      },
      formDataRule: {
        'specificationKeyVO.name': [
          { required: true, message: this.$t('good.iptpropName'), trigger: 'blur' }
        ],
        specificationValueVOList: [
          { type: 'array', required: true, message: this.$t('good.addpropplz'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
      }
    },
    formData: {
      deep: true,
      handler() {
        console.log('this.formData', this.formData);
        // this.formData.specificationKeyVO.name = this.formData.specificationKeyVo.name.replace(/\s/g,'');
      }
    },
    inputValue: {
      handler() {
        this.inputValue = this.inputValue.replace(/\s/g, '');
      }
    }
  },
  methods: {
    // 关闭属性标签
    handleClose(tag) {
      this.formData.specificationValueVOList.splice(this.formData.specificationValueVOList.indexOf(tag), 1);
    },
    // 显示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 输入框失去焦点
    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        var isRepeat = false;
        this.formData.specificationValueVOList.map(item => {
          if (item.name === inputValue) {
            this.$message.error(this.$t('good.propnotrepeat'));
            isRepeat = true;
          }
        })
        if (!isRepeat) {
          this.formData.specificationValueVOList.push({ name: inputValue });
        }
      }
      console.log('属性值', inputValue);
      this.inputVisible = false;
      this.inputValue = '';
    },
    cancel() {
      this.dialog = false;
      this.$emit('handCancel');
      this.$refs['formData'].resetFields();
    },
    // 新增和编辑提交
    submit(formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
          return
        }
        goodsApi.customProperty(this.formData).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: this.$t('common.addSuccess')
            })
            this.$emit('handOk', res.data);
            this.$refs[formData].resetFields();
            this.dialog = false;
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
