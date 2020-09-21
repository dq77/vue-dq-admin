<template>
  <el-popover v-model="showpopover" placement="bottom-start" trigger="click">
    <el-select v-for="(arrItem,key) in selectList" :key="key" v-model="selectArr[key]" filterable value-key="id" class="categories-slct-item" @change="selected" @focus="position=key">
      <!-- <el-option label="全部" value=""/> -->
      <el-option v-for="item in arrItem" :key="item.id" :label="item.name" :value="item"/>
    </el-select>
    <!-- <p>选中项：{{ chooseCate }}</p> -->
    <div>
      <el-button @click="clearselect">清空</el-button>
      <el-button type="primary" @click="pushAddress">确认</el-button>
    </div>
    <el-input slot="reference" v-model="chooseCate" :style="{width: width}" class="select-cate" placeholder="请选择" disabled/>
  </el-popover>
</template>

<script>
import goodsApi from '@/api/goods.js';

export default {
  props: {
    width: {
      type: String,
      default: '200px'
    },
    categoryId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      showpopover: false,
      chooseCate: '', // 选择的显示文本
      position: 0,
      selectArr: [],
      selectList: []
    }
  },
  watch: {
    categoryId(newval, oldval) {
      if (newval !== '0') {
        // this.categoryFunction()
      } else {
        this.chooseCate = ''
      }
    }
  },
  mounted() {
    this.categoryFunction().then(res => {
      if (this.categoryId && this.categoryId !== '0') {
        this.initCategory(this.fromartExpand(this.categoryId, JSON.parse(JSON.stringify(this.selectList[0]))), 0)
      }
    })
  },
  methods: {
    // 获取类目下拉框
    categoryFunction(item) {
      const params = {
        page: 1,
        pageSize: 1000,
        parentId: 0
      }
      if (item) {
        params.parentId = item.id
      }
      return new Promise((resolve, reject) => {
        goodsApi.getCategories({ ...params }).then(res => {
          if (res.code === 200) {
            this.selectList.splice(this.position + 1, this.selectList.length, res.data.list);
            resolve(true)
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    selected(item) {
      this.selectArr.splice(this.position + 1, this.selectArr.length);
      if (item && item.children) {
        this.categoryFunction(item)
      } else {
        this.selectList.splice(this.position + 1, this.selectList.length);
      }
    },
    initCategory(tree, node) {
      node !== 0 ? this.selectList[node] = tree : ''
      this.selectArr[node] = tree[0]
      this.chooseCate += (node === 0 ? '' : ' > ') + tree[0].name
      if (tree[0].children) {
        this.initCategory(tree[0].children, node + 1)
      }
    },
    // 数据筛选
    fromartExpand(id, arr) {
      return arr.filter(item => {
        if (item.id === id) {
          return true
        } else if (item.children) {
          item.children = this.fromartExpand(id, item.children)
          if (item.children.length > 0) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
    },
    clearselect() {
      this.position = 0
      this.selectArr = []
      this.selectList.splice(1, this.selectList.length);
    },
    pushAddress(res) {
      this.chooseCate = ''
      this.selectArr.map((item, index) => {
        this.chooseCate += item.name + ' > '
        if (index === this.selectArr.length - 1) {
          this.chooseCate = this.chooseCate.slice(0, -3)
          console.log(this.chooseCate);
        }
      })
      this.showpopover = false;
      this.$emit('select', JSON.parse(JSON.stringify(this.selectArr)));
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.categories-slct-item{
  margin: 4px;
  width: 150px;
}
.select-cate.el-input.is-disabled{
  .el-input__inner{
    background-color: #FFF;
    border-color: #DCDFE6;
    cursor: pointer;
    color: #606266;
  }
}
.is-error .select-cate.el-input.is-disabled .el-input__inner{
  border-color: #F56C6C;
}
</style>
