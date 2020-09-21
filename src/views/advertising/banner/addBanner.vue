<template>
  <div class="addBanner-container">
    <el-dialog
      :visible.sync="addDialog"
      :title="title"
      center
      width="600px"
      top="5vh"
      @close="close">
      <el-form ref="formData" :model="formData" :rules="rule" label-width="150px" status-icon>
        <el-form-item label="渠道：">
          <el-select v-model="formData.channelCode" placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :value="item.code"
              :label="item.name"
              :key="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="formData.name" class="input-220" placeholder="请填写banner名称"/>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="formData.describe" :rows="3" type="textarea" class="input-220" placeholder="请填写banner描述"/>
        </el-form-item>
        <el-form-item label="类型：" prop="bannerType">
          <el-radio-group v-model="formData.type" @change="selectType">
            <el-radio-button :label="0">商品</el-radio-button>
            <el-radio-button :label="10">活动</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-if="formData.type === 10" v-model="formData.content" class="input-220" placeholder="请填写活动URl"/>
          <el-select
            v-if="formData.type == 0"
            v-model="bannerObj"
            :loading="loading"
            :remote-method="remoteMethod"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称或编号搜索"
            value-key="no"
            clearable
            @change="bannerChange">
            <el-option
              v-for="item in bannerList"
              :key="item.no"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <template v-if="formData.type === 0 && bannerObj.headFigure">
          <el-form-item label="关联商品">
            <div>{{ bannerObj.name }}</div>
            <img :src="bannerObj.headFigure" style="width:200px;height:200px">
          </el-form-item>
        </template>
        <el-form-item label="图片：" prop="img">
          <zwq-upload :data-source="coverList" :options="coverOption" :class="{'disabled': isHidden }" @onSuccess="onSuccess" @onRemove="remove"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submit('formData')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import adverApi from '@/api/advertising'
import goodsApi from '@/api/goods.js'
import { imgBasePath } from '@/common/config.js'
import zwqUpload from '@/components/Upload/upload.vue'
export default {
  components: {
    'zwq-upload': zwqUpload
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      coverList: [],
      isHidden: false,
      channelList: [], // 渠道下拉框
      baseImgUrl: '', // 保存上传时的基础路径，方便提交时截取
      coverOption: {
        imgUrl: `${imgBasePath}/goods/banner/upload_img`,
        showFile: true,
        limit: 1,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        sizes: 5
      },
      addDialog: false,
      title: ' 新增',
      formData: {
        type: 0,
        img: '',
        name: '',
        describe: ''
      },
      uploadDisabled: false,
      uploadUrl: `${imgBasePath}/goods/banner/upload_img`,
      imgDialog: false,
      dialogImageUrl: '',
      loading: false,
      bannerObj: {},
      bannerList: [],
      rule: {
        type: [
          { required: true, message: '请选择banner类型', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写banner内容', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传banner图', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    dialog: {
      handler(value) {
        console.log('弹窗标志', this.dataSource);
        this.addDialog = value;
        if (value) {
          goodsApi.getChannel().then(res => {
            if (res.code === 200) {
              this.channelList = res.data;
            } else {
              this.$message.info(res.msg);
            }
          })
          this.formData = {
            ...this.dataSource
          }
          if (this.dataSource.id) {
            this.title = '修改';
            this.baseImgUrl = this.dataSource.basePictureUrl
            if (this.dataSource.type === 0) {
              this.remoteMethod(this.dataSource.content).then(() => {
                this.bannerObj = {
                  no: this.dataSource.content
                }
              });
            }
          } else {
            this.title = '新增弹窗';
          }
          if (this.dataSource.img) {
            this.coverList.push({ url: this.dataSource.basePictureUrl + this.dataSource.img });
            console.log('图片存储', this.coverList);
          }
        }
      }
    },
    formData: {
      handler(val) {
        if (val.img) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      },
      deep: true
    }
  },
  // computed: {
  //   isHidden() {
  //     return this.coverList.length > 0;
  //   }
  // },
  methods: {
    // 清空表单
    reSet() {
      this.$refs['formData'].resetFields();
      this.$refs['formData'].clearValidate();
      this.bannerList = [];
      this.bannerObj = {};
      this.coverList = [];
      // this.addDialog = false;
    },
    cancel() {
      this.$emit('addEvent');
      this.reSet();
      console.log('关闭弹窗');
      this.addDialog = false;
      console.log('标志', this.addDialog);
    },
    close() {
      this.reSet();
      this.$emit('addEvent');
    },
    submit(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          const data = {
            channelCode: this.formData.channelCode,
            type: this.formData.type,
            content: this.formData.content,
            img: this.formData.img,
            name: this.formData.name,
            describe: this.formData.describe,
            id: this.formData.id || null
          }
          console.log('标志', this.formData);
          if (data.img.indexOf(this.baseImgUrl) > -1) {
            data.img = data.img.slice(this.baseImgUrl.length, data.img.length);
          }
          console.log('标志', this.formData.flag);
          if (this.formData.flag === 1001) {
            this.addBanner(data);
          } else if (this.formData.flag === 1000) {
            this.updateBanner(data);
            this.formData.bannerStatus = 0;
          }
        }
      })
    },
    // 编辑banner
    updateBanner(data) {
      adverApi.updateBanner(data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功');
          this.reSet();
          this.$emit('addEvent', true)
        } else {
          this.$message.info(res.msg);
          this.$emit('addEvent');
        }
      })
    },
    // 新增banner
    addBanner(data) {
      adverApi.addBanner(data).then(res => {
        if (res.code === 200) {
          this.reSet();
          this.$emit('addEvent', true);
        } else {
          this.$message.info(res.msg);
          this.$emit('addEvent');
        }
      });
    },
    selectType() {
      this.formData.content = '';
    },
    // 上传成功
    onSuccess(file) {
      this.$set(this.formData, 'img', file.data.baseImgUrl + file.data.imgRout);
      this.baseImgUrl = file.data.baseImgUrl;
      console.log('上传成功的文件', this.formData.img);
    },
    handlePictureCardPreview() {},
    remove(file) {
      console.log('删除的文件', file);
      this.formData.img = '';
    },
    // 模糊搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        const data = {
          channels: [this.formData.channelCode],
          keyWords: query
        };
        return new Promise((resolve, reject) => {
          goodsApi.CouponGoodsList(data).then(res => {
            if (res.code === 200) {
              this.loading = false;
              this.bannerList = res.data;
              resolve(res.data);
            } else {
              reject();
            }
          });
        })
      }
    },
    // 模糊查询商品
    bannerChange(value) {
      this.$set(this.formData, 'content', value.no);
      console.log('this.content', value);
      // this.formData.bannerContent = value.no;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
  .addBanner-container {
    .disabled {
      .el-upload--picture-card {
        display: none;
      }
    }
  }
</style>
