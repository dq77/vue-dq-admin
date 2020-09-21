<template>
  <div class="banner-container">
    <div class="banner-search">
      <el-form label-width="100px">
        <el-form-item label="渠道">
          <el-radio-group v-model="channelCode" @change="search">
            <!-- <el-radio-button label="">全部</el-radio-button> -->
            <el-radio-button v-for="item in channelList" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <!-- <el-radio-group v-model="type" class="banner-type" @change="typeChange()"> -->
          <el-radio-group v-model="type" class="banner-type" @change="search">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="10">活动</el-radio-button>
            <el-radio-button :label="0">商品</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="status" class="banner-type" @change="search">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="20">已上架</el-radio-button>
            <el-radio-button :label="10">已下架</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键字搜索">
          <div class="search-key">
            <el-input v-model="searchKey" class="input-200" clearable placeholder="请输入关键字搜索"/>
            <div class="search-btn">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="search()">查询</el-button>
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="add()">新增</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>

    </div>
    <div class="banner-table">
      <!-- 表格 -->
      <div ref="tableContent" class="table-wrap">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          max-height="600">
          <el-table-column
            fixed
            label="序号"
            width="80"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            align="center"/>
          <el-table-column
            align="center"
            label="渠道">
            <template slot-scope="scope">
              <span>{{ scope.row.channelCode | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
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
            prop="type"
            label="类型"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type == 10"><el-tag>活动</el-tag></span>
              <span v-if="scope.row.type == 0"><el-tag type="success">商品</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 20"><el-tag type="success">上架</el-tag></span>
              <span v-if="scope.row.status == 10"><el-tag type="danger">下架</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="describe"
            label="描述"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="350"
            align="center"
            type="index">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 20" :disabled="scope.$index == 0" type="primary" icon="el-icon-sort" plain @click="handleTop(scope.row)">置顶</el-button>
              <el-button type="primary" plain icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
              <el-button type="info" icon="el-icon-edit" plain @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === 20" type="warning" icon="el-icon-error" plain @click="shelf(scope.row)">禁用</el-button>
              <el-button v-if="scope.row.status === 10" type="success" icon="el-icon-success" plain @click="shelf(scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList()"/>
    </div>
    <!-- 弹窗 -->
    <add-banner :dialog="dialogVisible" :data-source="obj" @addEvent="addEvent"/>
    <banner-detail :dialog="detailDialog" :form-obj="bannerObj" @viewDetail="viewDetail"/>
  </div>
</template>

<script>
import addBanner from './addBanner';
import bannerDetail from './bannerDetail';
import pagination from '@/components/Pagination'
import goodsApi from '@/api/goods.js'
import adverApi from '@/api/advertising'
import {
  getBannerList,
  getChannerlList,
  bannerTop,
  upStatus
} from '../../../api/advertising/index.js';
export default {
  components: {
    'add-banner': addBanner,
    'banner-detail': bannerDetail,
    pagination
  },
  data() {
    return {
      total: 0,
      height: null, // 表格最大高度
      channelCode: '',
      searchKey: '',
      searchData: {}, // 暂存选择的查询条件
      listQuery: {
        page: 1,
        pageSize: 10
      },
      channelList: [],
      type: '',
      status: '',
      dialogVisible: false,
      detailDialog: false,
      bannerObj: {},
      obj: {
        flag: '',
        channel: ''
      },
      tableData: []
    };
  },
  created() {
    this.getChannerlList();
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.height = this.$refs.tableContent.offsetHeight;
    // })
  },
  methods: {
    // 切换渠道
    channelClick(tab) {
      this.getList();
    },
    // 切换选项卡
    beforeLeave(activeName, oldActiveName) {},
    // 获取渠道列表
    getChannerlList() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          var arr = ['DingDing', 'FenXiao', 'HuaBei'];
          // var arr = ['ALIPAY_LIFE', 'APP', 'DingDing', 'FenXiao', 'HuaBei'];
          res.data.map(item => {
            if (arr.indexOf(item.code) === -1) {
              // 过滤掉暂时不需要的渠道
              this.channelList.push(item);
            }
          })
          this.channelCode = res.data[0].code;
          this.getList();
        }
      });
    },
    // 获取商品列表
    getList() {
      const data = {
        channelCode: this.channelCode,
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.searchData
      };
      adverApi.getBannerList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          console.log('数据', res.data);
          this.total = res.data.totalCount;
        }
      });
    },
    search() {
      this.searchData = {
        searchKey: this.searchKey,
        type: this.type,
        status: this.status,
        channelCode: this.channelCode
      };
      this.getList();
    },
    // 切换商品类型时
    typeChange(value) {
      this.getList();
    },
    // 切换商品状态
    statusChange() {
      this.getList();
    },
    // 点击新增按钮
    add() {
      this.obj = {
        type: 0,
        channelCode: this.channelCode,
        img: '',
        content: '',
        describe: ''
      };
      this.obj.flag = 1001;
      this.obj.channelCode = this.channelCode;
      this.dialogVisible = true;
    },
    // 点击编辑按钮
    edit(value) {
      this.obj = JSON.parse(JSON.stringify(value));
      this.dialogVisible = true;
      this.obj.flag = 1000;
    },
    // 关闭新增、编辑弹窗的自定义事件
    addEvent(value) {
      this.dialogVisible = false;
      if (value) {
        this.getList();
      }
    },
    // 置顶操作
    handleTop(value) {
      adverApi.toTop(value.id).then(res => {
        if (res.code === 200) {
          this.getList();
        }
      });
    },
    // 列表的查看详情
    handleView(value) {
      this.bannerObj = value;
      this.detailDialog = true;
    },
    // 关闭查看详情的自定义事件
    viewDetail() {
      this.detailDialog = false;
    },
    shelf(value) {
      if (value.status === 20) {
        this.offShelf(value.id);
      } else {
        this.onShelf(value.id);
      }
    },
    // 下架
    offShelf(id) {
      adverApi.offShelf(id).then(res => {
        if (res.code === 200) {
          this.getList();
        }
      });
    },
    // 上架
    onShelf(id) {
      adverApi.onShelf(id).then(res => {
        if (res.code === 200) {
          this.getList();
        }
      })
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.banner-container {
  padding: 15px;
  // height: calc(100vh - 50px);
  // display: flex;
  // flex-direction: column;
  .banner-search {
    padding: 16px;
    background-color: #fff;
    border: 1px solid #ebeef5;
    span {
      font-size: 14px;
    }
  }
  .banner-table {
    background-color: #fff;
    margin-top: 16px;
    // flex: 1;
    // display: flex;
    // flex-direction: column;
    .table-wrap{
      padding: 15px;
      // flex: 1
    }
  }
  .search-key {
    display: flex;
    justify-content: space-between;
  }
}
</style>
<style lang="scss">
.banner-container {
  // .el-tabs__nav {
  //   margin-left: 20px;
  // }
  .thumbnail {
    width: 60px;
  }
  .previewImage {
    width: 200px;
  }
}
</style>
