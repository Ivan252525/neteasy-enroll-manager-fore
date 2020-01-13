<template>
  <d2-container>
    <template slot="header">
      <el-row>
        <el-col :span="3" style="display: flex">
          <el-input v-model="searchForm.activityName" placeholder="请输入活动名称..."/>
        </el-col>
        <el-select v-model="searchForm.businessId" filterable clearable placeholder="请选择商家" style="margin-left: 5px">
          <el-option
            v-for="item in businessList"
            :key="item.id"
            :label="item.businessName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchForm.jmRegionId" clearable placeholder="请选择地区" style="margin-left: 5px">
          <el-option
            v-for="item in jmRegionList"
            :key="item.id"
            :label="item.jmRegionName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 5px" @click="searchList">搜索</el-button>
      </el-row>
      <el-row>
        <el-button type="success" style="margin-top: 5px" @click="showAddActivity">新增活动</el-button>
      </el-row>
    </template>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"/>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="addOrUpdateVisible">
      <el-form :model="form" label-width="80px" label-position="top">
        <!-- 商家 -->
        <el-form-item label="商家：">
          <el-select v-model="form.businessId" filterable clearable placeholder="请选择商家" style="margin-left: 5px">
            <el-option
              v-for="item in businessList"
              :key="item.id"
              :label="item.businessName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 标题 -->
        <el-form-item label="活动标题：">
          <el-col span="11">
            <el-input v-model="form.title"/>
          </el-col>
        </el-form-item>
        <el-form-item label="橱窗图（显示在活动列表的图片，建议尺寸：345 x 200）：">
          <el-upload
            class="main-image-avatar-uploader"
            action="https://www.weselfshop.cn/enroll-manager/manager/file/file/upload/multipart"
            :show-file-list="false"
            :headers="tokenHeaders"
            :on-success="handleMainImageSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.mainImage" :src="form.mainImage" class="main-image-avatar">
            <i v-else class="el-icon-plus main-image-avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="banner（显示在活动详情的banner，建议尺寸：750 x 400）：">
          <el-upload
            class="banner-avatar-uploader"
            action="https://www.weselfshop.cn/enroll-manager/manager/file/file/upload/multipart"
            :show-file-list="false"
            :headers="tokenHeaders"
            :on-success="handleBannerSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.banner" :src="form.banner" class="banner-avatar">
            <i v-else class="el-icon-plus banner-avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动时间（开始时间和结束时间可相同）：">
          <el-date-picker
            v-model="form.activityTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名时间（开始时间和结束时间不可相同！）：">
          <el-date-picker
            v-model="form.enrollTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地区：">
          <el-select v-model="data.jmRegionId" clearable placeholder="请选择地区" style="margin-left: 5px">
            <el-option
              v-for="item in jmRegionList"
              :key="item.id"
              :label="item.jmRegionName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地址：">
          <el-col span="11">
            <el-input v-model="form.address"/>
          </el-col>
        </el-form-item>
        <el-form-item label="活动联系电话（可不填）：">
          <el-col span="11">
            <el-input v-model="form.phone"/>
          </el-col>
        </el-form-item>
        <el-form-item label="活动详情图（可上传多张）：">
          <el-upload
            action="https://www.weselfshop.cn/enroll-manager/manager/file/file/upload/multipart"
            list-type="picture-card"
            :headers="tokenHeaders"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleDetailImageSuccess"
            :file-list="form.detailImage">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { ActivityListApi } from '@/api/activity.js'
import { BusinessAllApi } from '@/api/business.js'
import ActivityMainImage from './components/ActivityMainImage'
import ActivityState from './components/ActivityState'
import util from '@/libs/util'
export default {
  name: 'activityList',
  data () {
    return {
      form: {
        id: null,
        businessId: null,
        title: '',
        mainImage: '',
        banner: '',
        activityTime: [],
        enrollTime: [],
        jmRegionId: null,
        address: '',
        phone: '',
        detailImage: [
        ]
      },
      tokenHeaders: {
        token: util.cookies.get('token')
      },
      searchForm: {
        activityName: '',
        businessId: null,
        jmRegionId: null
      },
      columns: [
        {
          title: '活动图片',
          key: 'mainImage',
          component: {
            name: ActivityMainImage
          }
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '商家名称',
          key: 'businessName'
        },
        {
          title: '地区',
          key: 'jmRegionName'
        },
        {
          title: '报名人数',
          key: 'enrollNum'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: 'state',
          component: {
            name: ActivityState
          }
        }
      ],
      data: [],
      options: {
        stripe: true
      },
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      businessList: [],
      jmRegionList: [
        {
          id: 1,
          jmRegionName: '蓬江区'
        },
        {
          id: 2,
          jmRegionName: '江海区'
        },
        {
          id: 3,
          jmRegionName: '新会区'
        },
        {
          id: 4,
          jmRegionName: '开平市'
        },
        {
          id: 5,
          jmRegionName: '恩平市'
        },
        {
          id: 6,
          jmRegionName: '台山市'
        },
        {
          id: 7,
          jmRegionName: '鹤山市'
        }
      ],
      dialogTitle: '',
      addOrUpdateVisible: false
    }
  },
  mounted () {
    this.fetchData()
    this.listBusiness()
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      ActivityListApi({
        title: this.searchForm.activityName,
        businessId: this.searchForm.businessId,
        jmRegionId: this.searchForm.jmRegionId,
        page: {
          page: this.pagination.currentPage,
          limit: this.pagination.pageSize
        }
      }).then(res => {
        console.log(res)
        this.data = res.list
        this.pagination.total = res.total
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    searchList () {
      this.fetchData()
    },
    listBusiness () {
      BusinessAllApi().then(res => {
        this.businessList = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    showAddActivity () {
      this.dialogTitle = '新增'
      this.addOrUpdateVisible = true
    },
    beforeAvatarUpload (file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传jpg或png格式的图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    handleMainImageSuccess (res, file) {
      if (res.code === 200) {
        console.log(res.data)
        this.form.mainImage = res.data
      } else {
        this.$message.error('上传失败：' + res.desc)
      }
    },
    handleBannerSuccess (res, file) {
      if (res.code === 200) {
        console.log(res.data)
        this.form.banner = res.data
      } else {
        this.$message.error('上传失败：' + res.desc)
      }
    },
    handleRemove (file, fileList) {
      let detailImageList = []
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].response.code === 200) {
          detailImageList.push({ url: fileList[i].response.data })
        }
      }
      this.form.detailImage = detailImageList
    },
    handleDetailImageSuccess (res, file) {
      if (res.code === 200) {
        console.log(res.data)
        this.form.detailImage.push(res.data)
      } else {
        this.$message.error('上传失败：' + res.desc)
      }
    },
    saveOrUpdate () {
      console.log(this.form)
    }
  }
}
</script>

<style>
  el-col {
    margin-right: 5px;
  }

  .main-image-avatar-uploader .el-upload {
     border: 1px dashed #d9d9d9;
     border-radius: 6px;
     cursor: pointer;
     position: relative;
     overflow: hidden;
   }
  .main-image-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .main-image-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 172.5px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .main-image-avatar {
    width: 172.5px;
    height: 100px;
    display: block;
  }

  .banner-avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .banner-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .banner-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 187.5px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .banner-avatar {
    width: 187.5px;
    height: 100px;
    display: block;
  }
</style>
