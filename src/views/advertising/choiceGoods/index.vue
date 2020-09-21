<template>
  <div class="choice-goods">
    <div class="popup-table">
      <div class="btn-container">
        <el-radio-group v-model="channel" @change="changeChannel">
          <el-radio-button v-for="item in channelList" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
        </el-radio-group>
        <!-- <el-button type="primary" @click="add">新增</el-button> -->
      </div>
      <div ref="tableContent" class="table-height">
        <el-table
          :data="tableData"
          :max-height="600"
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
            label="渠道">
            <template slot-scope="scope">
              <span>{{ scope.row.channelCode | channelFilter }}</span>
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
          <el-table-column label="位置" prop="position">
            <template slot-scope="scope">
              <span v-if="scope.row.position === 0">左边</span>
              <span v-if="scope.row.position === 10">右一</span>
              <span v-if="scope.row.position === 20">右二</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 20"><el-tag type="success">启用</el-tag></span>
              <span v-if="scope.row.status == 10"><el-tag type="warning">禁用</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="350">
            <template slot-scope="scope">
              <!-- <el-button :disabled="scope.$index === 0" type="success" plain icon="el-icon-arrow-up" @click="toTop(scope.row)">置顶</el-button> -->
              <el-button type="primary" plain icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
              <el-button type="info" plain icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status == 20" type="danger" plain icon="el-icon-error" @click="off(scope.row)">禁用</el-button>
              <el-button v-if="scope.row.status == 10" type="success" plain icon="el-icon-success" @click="off(scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-choice :show="dialogVisible" :data-source="obj" @submit="handOk" @handCancel="cancel"/>
    <detail :show="detailDialog" :data-source="obj" @viewDetail="closeDetail"/>
  </div>
</template>

<script>
import addChoice from './addChoice'
import choiceApi from '@/api/advertising/choice.js'
import detail from './detail'
import goodsApi from '@/api/goods.js'
export default {
  components: {
    'add-choice': addChoice,
    detail
    // pagination
  },
  data() {
    return {
      height: 400,
      channel: 'JDBT',
      channelList: [], // 渠道下拉框
      dialogVisible: false,
      tableData: [],
      obj: {},
      detailDialog: false,
      total: 0
      // tempData: [
      //   {
      //     channelCode: '',
      //     position: 0
      //   },
      //   {
      //     channelCode: '',
      //     position: 10
      //   },
      //   {
      //     channelCode: '',
      //     position: 20
      //   }
      // ]
    }
  },
  created() {
    this.getChannelList();
    this.getList();
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.height = this.$refs.tableContent.offsetHeight - 10;
    //   console.log('height',this.height);
    // })
  },
  methods: {
    // 切换渠道
    changeChannel() {
      this.getList();
    },
    // 获取渠道下拉框
    getChannelList() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    getList() {
      const data = {
        page: 1,
        pageSize: 10,
        channel: this.channel
      }
      choiceApi.getList(data).then(res => {
        if (res.code === 200) {
          // if (res.data.list.length > 0) {
          this.tableData = res.data.list
          // } else {
          // this.tableData = this.tempData.map(item => {
          //   item.channelCode = this.channel;
          //   return item;
          // });
          // }
          this.total = res.data.totalCount;
          console.log('表格数据', this.tableData);
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    add() {
      this.dialogVisible = true;
      this.obj = {
        channelCode: '',
        content: '',
        type: 0,
        img: '',
        brief: ''
      }
    },
    edit(row) {
      this.dialogVisible = true;
      this.obj = row;
    },
    addEvent() {
      this.dialogVisible = false;
    },
    // 置顶
    toTop(row) {
      choiceApi.toTop(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('已置顶！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    handOk(val) {
      if (val.id) {
        choiceApi.updateChoice(val).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功！');
            this.dialogVisible = false;
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        })
      } else {
        choiceApi.addChoice(val).then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功！');
            this.dialogVisible = false;
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        })
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
    handleView(row) {
      this.detailDialog = true;
      this.obj = row;
    },
    closeDetail() {
      this.detailDialog = false;
    },
    off(row) {
      if (row.status === 10) {
        this.onShelf(row.id);
      } else if (row.status === 20) {
        this.offShelf(row.id);
      }
    },
    // 上架
    onShelf(id) {
      choiceApi.onShelf(id).then(res => {
        if (res.code === 200) {
          this.$message.success('已启用！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 下架
    offShelf(id) {
      choiceApi.offShelf(id).then(res => {
        if (res.code === 200) {
          this.$message.success('已禁用！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.choice-goods {
  margin: 15px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  .popup-table {
    padding: 15px;
    background-color: #fff;
    flex: 1;
    .btn-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .thumbnail {
      height: 60px;
    }
  }
}
</style>
