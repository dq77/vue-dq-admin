<template>
  <div class="attributes-container pageContent">
    <div class="query-block search-block">
      <el-row :gutter="20">
        <el-col :span="16">
          <span>{{ $t('good.propName') }} </span>
          <el-input
            v-model="queryForm.keyWords"
            :placeholder="$t('good.iptpropName')"
            class="input-160 mr-15"
          />
          <!-- <span>属性值：</span>
          <el-input v-model="queryForm.propertyValue" class="input-160 mr-15"/> -->
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search()"
          >{{ $t('common.find') }}</el-button>
        </el-col>
        <el-col :span="8">
          <div class="right-block">
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="addNewCategory"
            >{{ $t('good.addprop') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="attributes-content">
      <z-table
        :columns="columns"
        :pagination="pagination"
        :data-source="tableData"
        :options="options"
        :fetch="fetchTableData"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      />
    </div>
    <el-dialog
      :visible.sync="dialgoVisible"
      :title="dialogTitle"
      width="300"
      center
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="formDataRule"
        label-width="180px"
        status-icon
      >
        <el-form-item
          :label="$t('good.propName')"
          prop="specificationKeyVO.name"
        >
          <el-input
            v-model="formData.specificationKeyVO.name"
            :placeholder="$t('good.iptpropName')"
            class="input-200"
          />
        </el-form-item>
        <el-form-item
          :label="$t('good.propValue')"
          prop="specificationValueVOList"
        >
          <template v-if="formData.specificationValueVOList && formData.specificationValueVOList.length>0">
            <el-tag
              v-for="(tag, index) in formData.specificationValueVOList"
              :key="index"
              :disable-transitions="false"
              size="small"
              closable
              @close="handleClose(tag)"
            >
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
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >+ {{ $t('good.addpropValue') }}</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="info"
          plain
          @click="cancel()"
        >{{ $t('common.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="submit('formData')"
        >{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ZTable from '@/components/tableList/tableList.vue'
import goodsApi from '@/api/goods.js'
export default {
  components: {
    'z-table': ZTable
  },
  data() {
    return {
      dialgoVisible: false,
      id: '', // 编辑时需要的id
      flag: 1, // 1新增  0编辑
      dialogTitle: '',
      dynamicTags: [], // 属性集合
      inputVisible: false, // 属性输入框
      inputValue: '',
      formData: {
        specificationKeyVO: {
          name: ''
        },
        specificationValueVOList: []
      },
      queryForm: {
        keyWord: ''
      },
      columns: [
        {
          prop: 'id',
          label: 'ID',
          render: (row, index) => {
            if (row.specificationKeyVO) {
              return (
                <span>{ row.specificationKeyVO.id }</span>
              )
            }
          }
        }, {
          prop: 'specificationKeyVO',
          label: this.$t('good.propName'),
          render: (row, index) => {
            if (row.specificationKeyVO && row.specificationKeyVO) {
              console.log('name', row.specificationKeyVO.name);
              return (
                <span>{ row.specificationKeyVO.name }</span>
              )
            }
          }
        }, {
          prop: 'specificationValueVOList',
          label: this.$t('good.propValue'),
          render: (row, index) => {
            if (row.specificationValueVOList && row.specificationValueVOList.length > 0) {
              var nameList = row.specificationValueVOList.map(item => {
                return item.name;
              });
              var element = nameList.join('、');
              console.log('element', element);
            }
            return (
              <div>{ element }</div>
            )
          }
        }, {
          button: true,
          label: this.$t('common.actions'),
          group: [
            {
              name: this.$t('common.edit'),
              type: 'info',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => {
                this.dialogTitle = this.$t('good.editprop');
                this.dialgoVisible = true;
                this.formData = {
                  specificationKeyVO: { ...row.specificationKeyVO },
                  specificationValueVOList: row.specificationValueVOList.map(item => {
                    return { ...item }
                  }) || []
                }
                this.flag = 1000;
                // this.id = row.specificationKeyVO.id;
              }
            }, {
              name: this.$t('common.delete'),
              type: 'danger',
              plain: true,
              icon: 'el-icon-delete',
              onClick: (row, index) => {
                console.log('属性删除');
                this.$confirm(this.$t('good.delproptips'), this.$t('common.tips'), {
                  type: 'warning'
                }).then(() => {
                  console.log('row.id', row);
                  this.delAttr(row.specificationKeyVO.id);
                }).catch(() => {});
              }
            }
          ]
        }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        initTable: true, // 是否一挂载就加载数据
        maxHeight: 800
      },
      tableData: [],
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
    queryForm: {
      deep: true,
      handler() {
        this.queryForm.keyWords = this.queryForm.keyWords.replace(/\s/g, '');
      }
    }
  },
  created() {
    this.fetchTableData();
  },
  methods: {
    // 新增属性
    addNewCategory() {
      this.dialogTitle = this.$t('good.addprop');
      this.dialgoVisible = true;
      this.formData = {
        specificationKeyVO: {
          name: ''
        },
        specificationValueVOList: []
      }
      this.flag = 1001;
      console.log('新增属性');
    },
    // 条件查询属性
    search() {
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = 10;
      const data = {
        keyWords: this.queryForm.keyWords || null
      }
      this.fetchTableData(data);
    },
    // 获取表格数据事件
    fetchTableData(queryObj = {}) {
      const data = {
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        ...queryObj
      }
      goodsApi.attributeList(data).then(res => {
        if (res.code === 200) {
          this.options.loading = false;
          this.tableData = res.data.list;
          this.pagination.total = res.data.totalCount;
        }
      })
    },
    // 新增和编辑提交
    submit(formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.flag === 1001) {
          goodsApi.addAtrribute(this.formData).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('common.addSuccess')
              })
              this.$refs['formData'].clearValidate();
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
            this.dialgoVisible = false;
            this.fetchTableData();
          })
        } else if (this.flag === 1000) {
          goodsApi.updateAtrribute(this.formData).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('common.editSuccess')
              })
              this.$refs['formData'].clearValidate();
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
            this.fetchTableData();
            this.dialgoVisible = false;
          })
        }
      })
    },
    // 删除属性
    delAttr(id) {
      id = parseInt(id);
      goodsApi.deleteAtrribute(id).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: this.$t('common.deleteSuccess')
          })
          this.fetchTableData();
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
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
    // 关闭属性标签
    handleClose(tag) {
      this.formData.specificationValueVOList.splice(this.formData.specificationValueVOList.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const inputValue = this.inputValue.replace(/\s/g, '');
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
    // 关闭弹窗
    cancel() {
      this.dialgoVisible = false;
      this.$refs['formData'].clearValidate();
    }
  }
}
</script>

<style lang="scss" scope>
.attributes-container {
  padding: 15px;
  font-size: 14px;
  .search-block {
    padding: 15px 20px;
  }
  .attributes-content {
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex: 1;
  }
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
}
</style>
