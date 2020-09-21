<template>
  <div class="brand-container">
    <div class="query-block search-block">
      <el-row :gutter="20">
        <el-col :span="16">
          <span>{{ $t('good.brandName') }} </span>
          <el-input v-model="name" :placeholder="$t('good.iptbrandName')" class="input-160 mr-15" />
          <el-button icon="el-icon-search" type="primary" @click="search()">{{ $t('common.find') }}</el-button>
        </el-col>
        <el-col :span="8">
          <div class="right-block">
            <el-button icon="el-icon-plus" type="primary" @click="addNewCategory">{{ $t('good.addbrand') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="brand-content">
      <z-table
        :columns="columns"
        :data-source="tableData"
        :options="options"
        :pagination="pagination"
        :fetch="fetchTableData"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"/>
    </div>
    <el-dialog
      :visible.sync="dialgoVisible"
      :title="dialogTitle"
      width="300"
      top="0"
      center
      @close="cancel">
      <el-form ref="formData" :model="formData" :rules="rule" label-width="150px" status-icon>
        <el-form-item :label="$t('good.brandName')" prop="name">
          <el-input v-model="formData.name" :placeholder="$t('good.iptbrandName')" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('good.englishName')" prop="englishName">
          <el-input v-model="formData.englishName" :placeholder="$t('good.iptenglishName')" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('good.brandslogan')" prop="slogan">
          <el-input v-model="formData.slogan" :placeholder="$t('good.iptbrandslogan')" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('good.brandshow')" prop="status">
          <el-radio-group v-model="formData.status" @change="clearForm">
            <el-radio :label="10">{{ $t('common.no') }}</el-radio>
            <el-radio :label="20">{{ $t('common.yes') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('good.brandsort')" prop="sort">
          <el-input v-model="formData.sort" :placeholder="$t('good.iptbrandsort')" type="number" class="input-200"/>
        </el-form-item>
        <el-form-item :label="$t('good.brandlogo')" prop="logo">
          <upload v-model="formData.logo" :base="formData.baseImgUrl" @input="logoInput"/>
        </el-form-item>
        <el-form-item :label="$t('good.brandpic')" prop="picture">
          <upload v-model="formData.picture" :base="formData.baseImgUrl" @input="picInput"/>
        </el-form-item>
        <el-form-item :label="$t('good.brandstory')" prop="detail">
          <el-input v-model="formData.detail" :maxlength="200" :rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" plain @click="cancel()">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit('formData')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ZTable from '@/components/tableList/tableList.vue'
import Upload from '@/components/Upload/singleImage2.vue'
import goodsApi from '@/api/goods.js'
import { imgBasePath } from '@/common/config.js'
export default {
  components: {
    'z-table': ZTable,
    'upload': Upload
  },
  data() {
    return {
      dialgoVisible: false,
      flag: 1001, // 编辑和新增公用一个页面 1表示新增 0 编辑
      id: '', // 编辑页面需要
      dialogTitle: '',
      baseLogo: '', // logo的路径
      basePic: '', // 图片的路径
      formData: {
        name: '',
        status: 10,
        englishName: '',
        logo: '',
        picture: '',
        baseImgUrl: ''
      },
      name: '',
      columns: [
        {
          prop: 'id',
          label: this.$t('good.brandid')
        },
        {
          prop: 'name',
          label: this.$t('good.brandName')
        },
        {
          prop: 'englishName',
          label: this.$t('good.englishName')
        },
        {
          prop: 'slogan',
          label: this.$t('good.brandslogan')
        },
        {
          prop: 'logo',
          label: this.$t('good.brandlogo'),
          width: '120px',
          render: (row, index) => {
            if (row.logo) {
              return (
                <el-popover
                  placement='top-start'
                  trigger='hover'>
                  <img style='width:100px;' slot='reference' src={ row.baseImgUrl + row.logo } alt='logo'/>
                  <img style='width:200px; position: relative;' src={ row.baseImgUrl + row.logo } alt='logo'/>
                </el-popover>
              )
            }
          }
        },
        {
          prop: 'picture',
          label: this.$t('good.brandpic'),
          width: '120px',
          showTip: false,
          render: (row, index) => {
            if (row.picture) {
              return (
                <el-popover
                  placement='top-start'
                  trigger='hover'>
                  <img style='width:100px'slot='reference' src={row.baseImgUrl + row.picture}/>
                  <img style='width:200px;' src={ row.baseImgUrl + row.picture }/>
                </el-popover>
              )
            }
          }
        },
        {
          prop: 'detail',
          label: this.$t('good.brandstory'),
          showTip: false,
          render: (row, index) => {
            return (
              <el-popover
                placement='top-start'
                trigger='hover'
                width='400'>
                <span slot='reference' class='textOver'>{ row.detail }</span>
                <span class='textAlign'>{ row.detail }</span>
              </el-popover>
            )
          }
        },
        {
          button: true,
          label: this.$t('common.actions'),
          width: '200px',
          group: [
            {
              name: this.$t('common.edit'),
              type: 'info',
              plain: true,
              icon: 'el-icon-edit',
              onClick: (row, index) => {
                this.dialogTitle = this.$t('good.brandedit');
                this.dialgoVisible = true;
                this.flag = 1000;
                console.log('编辑', row);
                this.formData = {
                  ...row
                };
              }
            },
            {
              name: this.$t('common.delete'),
              type: 'danger',
              icon: 'el-icon-delete',
              plain: true,
              onClick: (row, index) => {
                console.log('品牌删除');
                this.$confirm(this.$t('good.delbrandtip'), this.$t('common.tips'), {
                  type: 'warning'
                }).then(() => {
                  this.delBrand(row.id);
                }).catch(() => {});
              }
            }
          ]
        }
      ],
      tableData: [],
      pagination: {
        total: 1,
        pageIndex: 1,
        pageSize: 10
      },
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      rule: {
        name: [
          { required: true, message: this.$t('good.iptbrandName'), trigger: 'blur' }
        ]
      },
      isNotShow: {
        name: [
          { required: true, message: this.$t('good.iptbrandName'), trigger: 'blur' }
        ]
      },
      isShow: {
        name: [
          { required: true, message: this.$t('good.iptbrandName'), trigger: 'blur' }
        ],
        englishName: [
          { required: true, message: this.$t('good.iptenglishName'), trigger: 'blur' }
        ],
        logo: [
          { required: true, message: this.$t('good.uplogotip'), trigger: 'change' }
        ],
        picture: [
          { required: true, message: this.$t('good.upbrandtip'), trigger: 'change' }
        ],
        detail: [
          { required: true, message: this.$t('good.iptbrandstory'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('good.iptsort'), trigger: 'blur' }
        ],
        slogan: [
          { required: true, message: this.$t('good.iptbrandslogan'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    name: {
      handler() {
        this.name = this.name.replace(/\s/g, '');
      }
    },
    formData: {
      handler(val) {
        this.rule = val.status === 20 ? this.isShow : this.isNotShow;
      },
      deep: true
    }
  },
  created() {
    this.fetchTableData();
    console.log('图片路径', imgBasePath);
  },
  methods: {
    // 清楚校验
    clearForm(val) {
      if (val === 10) {
        this.$refs['formData'].clearValidate();
      }
    },
    // 新增品牌属性
    addNewCategory() {
      this.dialogTitle = this.$t('good.addbrand');
      this.dialgoVisible = true;
      this.formData = {
        name: '',
        status: 10,
        englishName: '',
        logo: '',
        picture: '',
        baseImgUrl: ''
      }
      this.flag = 1001;
      console.log('新增品牌');
    },
    // 提交
    submit(formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.flag === 1001) {
          goodsApi.addBrand(this.formData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: this.$t('common.addSuccess'),
                type: 'success'
              })
              this.dialgoVisible = false;
              this.fetchTableData();
              this.$refs['formData'].clearValidate();
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else if (this.flag === 1000) {
          goodsApi.updateBrand(this.formData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: this.$t('common.editSuccess'),
                type: 'success'
              })
              this.$refs['formData'].clearValidate();
              this.fetchTableData();
              this.dialgoVisible = false;
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 上传logo成功后
    logoInput(value) {
      // 增加一层判断避免删除logo时，也把品牌图片展示不了。删除时实则value字段为空，则baseImgUrl字段为空,
      // 因为baseImgUrl是公用一个字段，不加判断则所有的图片基础路径丢失，不能展示了，所以删除时，只能删除图片路径，基础路径不能，否则其他图片不能展示，品牌图片逻辑也是
      if (value) {
        this.formData.logo = value.imgRout;
        this.formData.baseImgUrl = value.baseImgUrl;
      } else {
        this.formData.logo = '';
      }
    },
    // 上传成功后的图片
    picInput(value) {
      console.log('上传成功的图片', value);
      if (value) {
        this.formData.picture = value.imgRout;
        this.formData.baseImgUrl = value.baseImgUrl;
      } else {
        this.formData.picture = '';
      }
    },
    // 条件查询
    search() {
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = 10;
      const data = {
        keyWords: this.name || null
      }
      this.fetchTableData(data);
    },
    // 删除品牌
    delBrand(id) {
      goodsApi.deleteBrand(id).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.deleteSuccess'))
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
        this.fetchTableData();
      })
    },
    // 获取表格数据事件
    fetchTableData(query = {}) {
      const data = {
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        ...query
      }
      goodsApi.brandList(data).then(res => {
        if (res.code === 200 && res.data) {
          this.options.loading = false;
          this.tableData = res.data.list;
          this.pagination.total = res.data.totalCount;
        }
      })
    },
    // 点击行事件
    handleRowClick(value) {
      console.log(value);
    },
    // 选择数目发生变化
    handleSelectionChange(selection) {
      console.log(selection)
    },
    // 弹窗取消
    cancel() {
      this.dialgoVisible = false;
      this.$refs['formData'].clearValidate();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .brand-container {
    padding: 15px;
    font-size: 14px;
    // height: calc(100vh - 50px);
    // display: flex;
    // flex-direction: column;
    .brand-content {
      display: flex;
      // flex: 1;
      padding: 16px;
      background-color: #fff;
    }
    .input-300 {
      width: 300px;
    }
    .textOver {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .textAlign {
      font-size: 14px;
      line-height: 28px;
    }
  }
</style>
