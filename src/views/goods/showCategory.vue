<template>
  <div class="showCategory-container">
    <div class="showCategory-content">
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column :label="$t('good.channel')" width="200px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.channelVO.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good.showcategoryName')" prop="categoryName" align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.channelCategoryShowVOList" :key="index">{{ item.showCategoryName + '、' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="150px" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="info" plain @click="edit(scope.row)">{{ $t('common.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="dialgoVisible"
      :title="$t('good.editshowprop')"
      width="800px"
      center>
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="150px" >
        <el-form-item :label="$t('good.propname')">
          <span>{{ formData.channel | channelFilter }}</span>
        </el-form-item>
        <el-form-item :label="$t('good.showcategory')">
          <el-button type="text" @click="addCategory(formData.channel)">{{ $t('common.add') }}</el-button>
          <el-table :data="formData.categoryData" border >
            <el-table-column :label="$t('good.showcategoryName')">
              <template slot-scope="scope">
                <span v-show="isEdit!==scope.$index">{{ scope.row.name }}</span>
                <el-input v-show="isEdit===scope.$index" v-model="scope.row.name" size="small" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('good.latcategory')" prop="name">
              <template slot-scope="scope">
                <!-- <el-select v-show="isEdit===scope.$index" v-model="scope.row.category" value-key="id">
                  <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :value="item"
                    :label="item.name"/>
                </el-select> -->
                <select-category v-show="isEdit===scope.$index" :category-id="scope.row.categoryId+''" @select="confirmCategory"/>
                <span v-show="isEdit!==scope.$index">{{ scope.row.category.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.actions')" width="280px">
              <template slot-scope="scope">
                <el-button v-show="isEdit!==scope.$index" type="info" size="mini" icon="el-icon-edit" plain @click="isEdit = scope.$index">{{ $t('common.edit') }}</el-button>
                <el-button v-show="isEdit===scope.$index" type="success" size="mini" icon="el-icon-check" plain @click="submit(scope.row)">{{ $t('common.submit') }}</el-button>
                <el-button v-if="scope.$index !== 0" icon="el-icon-sort" size="mini" type="success" plain @click="top(scope.row.id)">{{ $t('good.totop') }}</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="del(scope.row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="small" @click="cancel()">{{ $t('common.finish') }}</el-button>
        <!-- <el-button type="primary" size="small" @click="submit()">提交</el-button> -->
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="addDialog"
      :title="$t('good.addshowcategory')"
      width="500px"
      center>
      <el-form ref="formObj" :model="formObj" :rules="formRule" label-width="150px">
        <el-form-item :label="$t('good.showcategoryName')" prop="name">
          <el-input v-model="formObj.name" :placeholder="$t('good.iptCategoryName')" class="input-200"/>
        </el-form-item>
        <el-form-item :label="$t('good.latcategory')" prop="categoryId">
          <!-- <el-select v-model="formObj.category" value-key="id" placeholder="请选择关联类目" class="input-200" >
            <el-option v-for="item in categoryList" :key="item.id" :value="item" :label="item.name"/>
          </el-select> -->
          <select-category :category-id="formObj.categoryId" @select="confirmAddCategory"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button plain @click="cancelAdd('formObj')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitCategory('formObj')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ZTable from '@/components/tableList/tableList.vue'
import selectCategory from '@/components/selectCategory/index'
import goodsApi from '@/api/goods.js'
import { channelFilter } from '@/filters/index.js'
export default {
  components: {
    selectCategory,
    'z-table': ZTable
  },
  data() {
    return {
      dialgoVisible: false, // 编辑弹窗
      loading: true,
      addDialog: false, // 新增弹窗
      categoryList: [], // 后台配置类目集合
      formData: { // 编辑页面的数据对象
        channel: '',
        categoryData: []
      },
      isEdit: -1,
      channelList: [], // 渠道下拉框
      formObj: { // 添加前台、后台类目映射的数据对象
        categoryId: '',
        categoryName: '',
        name: ''
      },
      tableData: [],
      formRule: {
        name: [
          { required: true, message: this.$t('good.iptshowcategoryName'), trigger: 'blur' }
        ],
        categoryId: [
          { required: false, message: this.$t('good.selectcategory'), trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    formObj: {
      deep: true,
      handler() {
        this.formObj.name = this.formObj.name.replace(/\s/g, '');
      }
    }
  },
  created() {
    this.getCategory();
    this.fetchTableData();
  },
  methods: {
    edit(row) {
      this.dialgoVisible = true;
      this.formData = {
        channel: row.channelVO.code,
        categoryData: []
      }
      this.slctrow = row
      this.getChannel();
      this.categoryMappe(row.channelVO.code);
    },
    // 获取表格数据事件
    fetchTableData() {
      goodsApi.showCategory().then(res => {
        if (res.code === 200) {
          console.log('展示列表', res);
          this.tableData = res.data;
          this.loading = false;
        }
      })
    },
    // 获取渠道列表
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
          console.log('渠道列表', res);
        }
      })
    },
    // 编辑时查询前台类目和后台类目映射信息
    categoryMappe(code) {
      console.log('code', code);
      const data = {
        channelCode: code
      }
      goodsApi.categoryMapping(data).then(res => {
        console.log('更新隐射表格数据', res);
        if (res.code === 200) {
          this.$set(this.formData, 'categoryData', res.data);
          this.formData.categoryData = res.data;
          this.formData.categoryData.map(item => {
            var { categoryName: name, categoryId: id } = item;
            this.$set(item, 'category', { name, id })
          })
          this.isEdit = -1; // 只要是刷新表格，就将编辑状态清除
          console.log('前台映射信息', this.formData.categoryData);
        }
      })
    },
    // 确认类目下拉框
    confirmCategory(item) {
      if (item.length) {
        this.slctrow.category = { name: item[item.length - 1].name, id: item[item.length - 1].id }
      } else {
        this.slctrow.category = { name: '', id: '' }
      }
    },
    confirmAddCategory(item) {
      if (item.length) {
        this.formObj.categoryId = item[item.length - 1].id
        this.formObj.categoryName = item[item.length - 1].name
      } else {
        this.formObj.categoryId = ''
      }
    },
    // 置顶操作
    top(id) {
      goodsApi.toTop(id).then(res => {
        if (res.code === 200) {
          this.categoryMappe(this.formData.channel);
        }
      })
    },
    // 删除映射表中的数据
    del(row) {
      this.$confirm(this.$t('good.deltip'), this.$t('common.tips'), {
        type: 'warning'
      }).then(() => {
        console.log('删除操作');
        this.deleteShow(row);
        // this.formData.categoryData.splice(row, 1);
        // console.log('this.formData', this.formData);
      }).catch(() => {});
    },
    // 点击行事件
    handleRowClick(value) {
      console.log(value);
    },
    // 选择数目发生变化
    handleSelectionChange(selection) {
      console.log(selection)
    },
    // 新增类目
    addCategory(channel) {
      this.addDialog = true;
      this.formObj = {
        name: '',
        channelCode: channel,
        category: {},
        categoryId: '',
        categoryName: ''
      }
    },
    // 获取类目下拉框
    getCategory() {
      goodsApi.getCategoryDrop().then(res => {
        console.log('类目下拉框', res);
        if (res.code === 200 && res.data) {
          this.categoryList = res.data;
        }
      })
    },
    // 添加类目映射之后的
    submitCategory(formObj) {
      this.$refs[formObj].validate((valid) => {
        if (valid) {
          if (!this.formObj.categoryId) {
            this.$message.error('类目不能为空')
            return false
          }
          console.log('添加的数据', this.formObj);
          const data = {
            categoryId: this.formObj.categoryId,
            categoryName: this.formObj.categoryName,
            channelCode: this.formObj.channelCode,
            name: this.formObj.name
          }
          goodsApi.addShowCategory(data).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('common.addSuccess'));
              this.categoryMappe(this.formData.channel);
              console.log('添加后的数据', this.formData);
              this.addDialog = false;
              this.$set(this.formObj, 'categoryId', '0')
            } else {
              this.$message.info(res.msg)
            }
          })
          // this.formData.categoryData.push(
          //   {
          //     name: this.formObj.name,
          //     category: { ...this.formObj.category }
          //   }
          // );
          // this.$refs[formObj].resetField();
        }
      })
    },
    deleteShow(row) {
      console.log('删除的id', row);
      goodsApi.delShowCategory(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.deleteSuccess'))
          this.categoryMappe(row.channelCode);
        }
      })
    },
    // 编辑后的整体提交
    submit(row) {
      if (!row.name) {
        this.$message.error('展示类目不能为空！');
        return;
      }
      console.log('row', row);
      var data = {
        channelCode: this.formData.channel,
        name: row.name,
        categoryName: this.slctrow.category ? this.slctrow.category.name : row.categoryName,
        categoryId: this.slctrow.category ? this.slctrow.category.id : row.categoryId,
        sort: row.sort,
        id: row.id,
        status: row.status
      }
      goodsApi.updateShowCategory(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: this.$t('common.editSuccess')
          });
          this.categoryMappe(this.formData.channel);
          this.isEdit = -1;
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    // 弹窗取消
    cancel() {
      this.dialgoVisible = false;
      this.fetchTableData();
    },
    // 新增展示类目关闭
    cancelAdd(formObj) {
      this.addDialog = false;
      // this.$refs[formObj].resetField();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .showCategory-container {
    margin: 15px;
    // height: calc(100vh - 80px);
    background-color: #fff;
    // display: flex;
    // flex-direction: column;
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
    .showCategory-content {
      background-color: #fff;
      padding: 20px;
      // display: flex;
      // flex: 1;
    }
  }
</style>
