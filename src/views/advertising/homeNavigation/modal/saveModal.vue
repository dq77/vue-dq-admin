<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    :title="title"
    width="520px"
    center
  >
    <div>
      <el-form ref="navForm" :model="navForm" :rules="rules" status-icon label-width="35%">
        <el-form-item label="链接名称:" prop="name">
          <el-input v-model.number="navForm.name" :maxlength="20" class="input-220" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="链接类型:" prop="type">
          <el-select v-model="navForm.type" placeholder="请选择业务类型" class="input-220">
            <el-option label="内部链接" value="0" />
            <el-option label="外部链接" value="10"/>
          </el-select>
        </el-form-item>
        <el-form-item label="链接渠道:" prop="type">
          <el-select v-model="navForm.channel" placeholder="请选择业务类型" class="input-220">
            <el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="导航链接:" prop="webRoutePath">
          <transition name="fade-transform" mode="out-in">
            <el-select v-if="navForm.type==='0'" v-model="navForm.webRoutePath" class="input-220" placeholder="请选择导航链接">
              <el-option v-for="item in webRoutePathList" :key="item.id" :label="item.name" :value="item.routePath"/>
            </el-select>
            <el-input v-else v-model.number="navForm.webRoutePath" class="input-220" placeholder="请输入导航链接" />
          </transition>
        </el-form-item>
        <transition name="fade-transform" mode="out-in">
          <el-form-item v-if="navForm.type==='0'" label="链接参数:" prop="parameter">
            <el-input v-model="navForm.parameter" class="input-220" placeholder="请输入商品类目参数" />
          </el-form-item>
        </transition>
        <el-form-item label="导航图标:" prop="img">
          <Imgupload :data-source="imgList" :options="options" :class="{hidden: isHidden }" @onSuccess="handSuccess" @onRemove="handleRemove"/>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="handleClose('cacel')">取 消</el-button>
      <el-button type="primary" @click="handleClose('ok')" >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'
import Imgupload from '@/components/Upload/upload.vue'
import { imgBasePath } from '@/common/config.js'
import { deepClone } from '@/utils/index.js'
import { addnav, updatenav, getWebRouteList } from '@/api/advertising/homeNav.js'

export default {
  directives: { elDragDialog },
  components: {
    'Imgupload': Imgupload
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    channelList: {
      type: Array,
      default: []
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      title: '',
      visible: this.show,
      imgList: [],
      webRoutePathList: [],
      isHidden: false,
      navForm: {
        name: '',
        channel: '',
        webRoutePath: '',
        type: '0',
        parameter: '',
        img: ''
      },
      options: {
        limit: 1,
        imgUrl: `${imgBasePath}/goods/nav/upload_img`,
        showFile: true,
        formatList: ['image/jpeg', 'image/png', 'image/jpg'],
        sizes: 5
      },
      rules: {
        name: [
          { required: true, message: '请输入导航标题', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请选择导航图标', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择导航类型', trigger: 'blur' }
        ],
        webRoutePath: [
          { required: true, message: '请输入导航路由/链接', trigger: 'blur' }
        ],
        parameter: [
          { required: false, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    show: function(newval, oldval) {
      if (newval && this.dataSource.id) {
        this.title = '编辑导航'
        const imgURl = this.dataSource.baseImgUrl + this.dataSource.img
        this.imgList.push({ url: imgURl });
        this.navForm = deepClone(this.dataSource)
        this.initNavform(this.dataSource)
      } else {
        this.title = '新增导航'
        this.navForm = {
          name: '',
          channel: '',
          webRoutePath: '',
          type: '0',
          parameter: '',
          img: ''
        }
      }
      this.visible = this.show;
    },
    navForm: {
      handler(val) {
        console.log(val)
        if (val.img) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      },
      deep: true
    }
  },
  created() {
    this.getWebRouteList()
  },
  methods: {

    initNavform(data) {
      this.navForm = {
        ...data
      }
    },

    // 获取路由列表
    getWebRouteList() {
      getWebRouteList().then(res => {
        if (res.code === 200) {
          this.webRoutePathList = res.data
        }
      })
    },

    // 图片上传成功
    handSuccess(file) {
      this.navForm.img = file.data.fileUrl;
      this.isHidden = true
    },

    // 删除图片
    handleRemove(file) {
      this.navForm.img = '';
      this.isHidden = false
    },

    // 弹窗关闭
    handleClose(val) {
      if (val === 'ok') {
        this.addNav().then(() => {
          this.$refs['navForm'].clearValidate()
          this.$refs['navForm'].resetFields();
          this.imgList = []
        })
      } else if (val === 'cacel') {
        this.$emit('handCancel')
        this.$refs['navForm'].clearValidate()
        this.$refs['navForm'].resetFields();
        this.imgList = []
      } else {
        this.$emit('handCancel')
        this.$refs['navForm'].clearValidate()
        this.$refs['navForm'].resetFields();
        this.imgList = []
      }
    },

    // 新增导航
    async addNav() {
      const params = {
        ...this.navForm,
        id: this.dataSource.id
      }
      console.log(params, 'params');
      await new Promise(resolve => {
        this.$refs['navForm'].validate((valid) => {
          if (!valid) return
          if (this.title === '新增导航') {
            addnav({ ...params }).then(res => {
              if (res.code === 200) {
                this.$message.success('添加成功')
                this.$emit('handOk')
                resolve()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else if (this.title === '编辑导航') {
            updatenav({ ...params }).then(res => {
              if (res.code === 200) {
                this.$message.success('更新成功')
                this.$emit('handOk')
                resolve()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .hidden {
    .el-upload--picture-card {
      display: none
    }
  }
</style>
