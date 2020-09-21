<template>
  <div class="add-app">
    <el-dialog
      :visible.sync="dialog"
      :title="title"
      center
      top="5vh"
      @close="cancel"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="formRule"
        label-width="150px"
        status-icon
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            class="input-200"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item
          label="图片"
          prop="content"
        >
          <zwq-upload
            :data-source="fileList"
            :options="options"
            :class="{ zwqUpload: hidden }"
            @onRemove="remove"
            @onSuccess="onSuccess"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="info"
          @click="cancel('formData')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handOk('formData')"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import zwqUpload from '@/components/Upload/upload.vue';
import { deepClone } from '@/utils/index.js';
import { imgBasePath } from '@/common/config.js';
export default {
  components: {
    'zwq-upload': zwqUpload
  },
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    console.log('data', this.show);
    return {
      fileList: [],
      options: {
        imgUrl: `${imgBasePath}/goods/app_welcome_page/upload_img`,
        showFile: true,
        limit: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        sizes: 5
      },
      dialog: this.show,
      title: '新增欢迎页',
      formData: {
        name: '',
        content: ''
      },
      formRule: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        content: [{ required: true, message: '请上传图片', trigger: 'change' }]
      },
      hidden: false
    };
  },
  watch: {
    show: {
      handler(val) {
        console.log('watch', val, this.show);
        this.dialog = this.show;
        if (val) {
          console.log('this.dataSource', this.dataSource);
          if (this.dataSource.id) {
            this.formData = deepClone(this.dataSource);
            this.title = '编辑欢迎页';
            this.fileList.push({
              url: this.dataSource.basePictureUrl + this.dataSource.content
            });
          } else {
            this.title = '新增欢迎页';
          }
        } else {
          this.clearForm();
        }
      }
    },
    formData: {
      deep: true,
      handler(val) {
        console.log(this.formData);
        if (val.content) {
          this.hidden = true;
        } else {
          this.hidden = false;
        }
      }
    }
  },
  methods: {
    remove(file) {
      this.formData.content = '';
      console.log('删除图片', file);
    },
    onSuccess(file) {
      console.log('上传成功', file);
      const imgRout = file.data.fileUrl;
      this.formData.content = imgRout;
    },
    cancel(formData) {
      this.clearForm();
      this.dialog = false;
      this.$emit('handCancel');
    },
    handOk(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.$emit('handSuccess', this.formData);
        } else {
          return false;
        }
      });
    },
    clearForm() {
      this.$refs['formData'].clearValidate();
      this.$refs['formData'].resetFields();
      this.fileList = [];
      this.formData = {
        name: '',
        content: ''
      };
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.add-app {
  .zwqUpload {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
