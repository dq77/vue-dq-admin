<template>
  <div class="add-choice">
    <el-dialog :visible.sync="dialog" :title="dialogTitle" center width="700px" top="1vh" @close="close">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="渠道">
          <span>{{ formData.channelCode | channelFilter }}</span>
        </el-form-item>
        <el-form-item label="描述" prop="brief">
          <el-input v-model="formData.brief" class="input-200" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type" @change="radioChange">
            <el-radio-button :label="0">商品</el-radio-button>
            <el-radio-button :disabled="protection" :label="10">活动</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.type === 10" label="活动链接" prop="content">
          <el-input v-model="formData.content" placeholder="请填写活动的URl" maxlength="200"/>
        </el-form-item>
        <el-form-item v-if="formData.type === 0" label="活动商品" prop="content">
          <el-select
            v-if="formData.type === 0"
            v-model="bannerObj"
            :remote-method="remoteMethod"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称或编号搜索"
            value-key="no"
            clearable
            class="input-200"
            @change="bannerChange">
            <el-option
              v-for="item in bannerList"
              :key="item.no"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.type === 0 && bannerObj.headFigure" label="关联商品">
          <div>{{ bannerObj.name }}</div>
          <img :src="bannerObj.headFigure" :alt="bannerObj.name" style="width:100px;height:100px">
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <zwq-upload :data-source="fileList" :options="options" :class="{hidden: isHidden }" @onSuccess="handSuccess" @onRemove="handRemove"/>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        :max-height="height"
        border
        style="width: 100%">
        <el-table-column
          fixed
          label="序号"
          width="80">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="图片">
          <template slot-scope="scope">
            <el-popover
              ref="popover"
              placement="right"
              trigger="hover">
              <img :src="scope.row.basePictureUrl + scope.row.img" class="previewImage" style="width:300px">
              <img v-if="scope.row.img" slot="reference" :src="scope.row.basePictureUrl + scope.row.img" class="thumbnail">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 10"><el-tag>活动</el-tag></span>
            <span v-else><el-tag type="success">商品</el-tag></span>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content"/>
        <el-table-column label="位置" prop="position">
          <template slot-scope="scope">
            <span v-if="scope.row.position === 0">左边</span>
            <span v-if="scope.row.position === 10">右一</span>
            <span v-if="scope.row.position === 20">右二</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="brief"/>
        <el-table-column label="时间" prop="dateTime"/>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getHistory"/>
      <div slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submit('formData')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js'
import { imgBasePath } from '@/common/config.js'
import zwqUpload from '@/components/Upload/upload.vue'
import pagination from '@/components/Pagination/index.vue'
import choiceApi from '@/api/advertising/choice.js'
export default {
  components: {
    'zwq-upload': zwqUpload,
    pagination
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
    return {
      dialog: false,
      height: 400,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      tableData: [], // 历史数据
      protection: false,
      isHidden: false, // 成功上传一张图片之后隐藏上传按钮
      dialogTitle: '新增',
      channelList: [],
      bannerList: [], // 模糊商品下拉框
      bannerObj: {}, // 选择的商品的对象数据
      fileList: [], // 图片数组
      options: { // 上传组件的配置
        imgUrl: `${imgBasePath}/goods/recommendation/upload_img`,
        showFile: true,
        limit: 1,
        formatList: ['image/jpeg', 'image/jpg', 'image/png'],
        sizes: 5
      },
      formData: {
        channelCode: '',
        type: 0,
        position: 0
      },
      formRule: {
        channelCode: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ],
        content: [
          {
            required: true, message: '请选择活动内容', trigger: 'blur'
          }
        ],
        img: [
          {
            required: true, message: '请上传图片', trigger: 'change'
          }
        ],
        spuNo: [
          {
            required: true, message: '请选择商品', trigger: 'blur'
          }
        ],
        type: [
          {
            required: true, message: '请选择活动类型', trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.getChannel();
          this.formData = {
            ...this.dataSource
          };
          if (this.dataSource.id) {
            this.getHistory();
            this.dialogTitle = '修改';
            this.remoteMethod(this.dataSource.content);
            if (this.dataSource.type === 0) {
              this.$set(this.bannerObj, 'no', this.dataSource.content);
            }
            this.fileList.push({ url: this.dataSource.basePictureUrl + this.dataSource.img })
          }
          console.log('商品信息', this.formData);
        } else {
          this.clearForm();
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
        console.log('isHidden', this.isHidden);
      },
      deep: true
    }
  },
  methods: {
    getHistory() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        recommendationId: this.formData.id
      }
      choiceApi.historyList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 获取渠道列表
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 关闭弹窗
    close() {
      this.$emit('handCancel');
      this.dialog = false;
      this.$refs.formData.resetFields();
      this.$refs.formData.clearValidate();
    },
    // 类型切换时清空
    radioChange(val) {
      this.formData.content = '';
      this.bannerObj = {};
      console.log('切换数据', this.formData);
      // this.$refs.formData.clearValidate();
    },
    // 图片上传成功之后的回调
    handSuccess(file) {
      this.formData.img = file.data.imgRout;
    },
    // 删除图片回调
    handRemove(file) {
      this.formData.img = '';
    },
    // 模糊搜索商品
    remoteMethod(query) {
      if (query) {
        const data = {
          channels: [this.formData.channelCode],
          keyWords: query
        };
        goodsApi.CouponGoodsList(data).then(res => {
          if (res.code === 200) {
            this.bannerList = res.data;
          }
        })
      }
    },
    // 选择商品后将no值赋上去
    bannerChange(val) {
      console.log('选择的商品', val);
      this.$set(this.formData, 'content', val.no);
      // this.formData.spuNo = val.no;
    },
    // 提交
    submit(formData) {
      console.log('精选速递', this.formData);
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData);
        } else {
          return false;
        }
      })
    },
    // 关闭弹窗
    cancel() {
      this.$emit('handCancel');
      this.clearForm();
      this.dialog = false;
    },
    // 清除表单
    clearForm() {
      this.$refs.formData.clearValidate();
      this.$refs.formData.resetFields();
      this.bannerObj = {};
      this.formData.spuNo = '';
      this.fileList = [];
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
.add-choice {
  .hidden {
    .el-upload--picture-card {
      display: none;
    }
  }
  .thumbnail {
    height: 60px;
    width: 60px;
  }
}
</style>
