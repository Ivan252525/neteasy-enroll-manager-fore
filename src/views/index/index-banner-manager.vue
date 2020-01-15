<template>
  <d2-container>
    <template slot="header">
      <el-button type="success" @click="showAddBanner">新增banner</el-button>
    </template>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="showEditBanner"
        @row-remove="removeBanner"
        @pagination-current-change="paginationCurrentChange"/>
    </div>
    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="addOrUpdateVisible">
      <el-form ref="indexBannerForm" :model="form" label-position="top" :rules="rules">
        <el-form-item label="banner：" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="https://www.weselfshop.cn/enroll-manager/manager/file/file/upload/multipart"
            :show-file-list="false"
            :headers="tokenHeaders"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="序号（序号越小越靠前）：" prop="seq">
          <el-col :span="3">
            <el-input v-model="form.seq" autocomplete="off"/>
          </el-col>
        </el-form-item>
        <el-form-item label="跳转类型：">
          <el-radio v-model="form.type" :label="1">活动</el-radio>
          <el-radio v-model="form.type" :label="2">网页</el-radio>
        </el-form-item>
        <el-form-item label="活动：" prop="activityId" :rules="form.type === 1 ? { required: true, message: '请选择活动', trigger: 'blur' } : null">
          <el-select v-model="form.activityId" filterable clearable placeholder="请选择活动" :disabled="form.type !== 1">
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网页地址：" prop="webUrl" :rules="form.type === 2 ? { required: true, message: '请输入网址', trigger: 'blur' } : null">
          <el-col :span="11">
            <el-input v-model="form.webUrl" autocomplete="off" type="textarea"
                      :rows="3" :disabled="form.type !== 2" />
          </el-col>
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
import util from '@/libs/util'
import { ActivityAllApi } from '@/api/activity.js'
import { BannerListApi, BannerGetApi, BannerAddOrUpdateApi, BannerRemoveApi } from '@/api/index.banner.js'
import IndexBannerImage from './components/IndexBannerImage'
export default {
  name: 'index-banner-manager',
  data () {
    return {
      dialogTitle: '',
      addOrUpdateVisible: false,
      form: {
        id: null,
        imageUrl: '',
        type: 1,
        activityId: null,
        webUrl: '',
        seq: ''
      },
      rules: {
        imageUrl: [
          { required: true, message: '请上传banner', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      },
      tokenHeaders: {
        token: util.cookies.get('token')
      },
      activityList: [],
      columns: [
        {
          title: 'banner',
          key: 'imageUrl',
          component: {
            name: IndexBannerImage
          }
        },
        {
          title: '序号',
          key: 'seq'
        },
        {
          title: '跳转类型',
          key: 'type'
        },
        {
          title: '活动标题',
          key: 'activityTitle'
        },
        {
          title: '网页地址',
          key: 'webUrl'
        }
      ],
      rowHandle: {
        custom: [
          {
            text: '修改',
            icon: 'el-icon-edit',
            type: 'primary',
            size: 'small',
            emit: 'custom-emit-1'
          }
        ],
        remove: {
          icon: 'el-icon-delete',
          size: 'small',
          fixed: 'right',
          confirm: true,
          confirmTitle: '提示',
          confirmText: '确定删除吗？'
        }
      },
      data: [],
      options: {
        stripe: true
      },
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      }
    }
  },
  mounted () {
    this.fetchData()
    this.getActivityList()
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      BannerListApi({
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize
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
    showAddBanner () {
      this.form = {
        id: null,
        imageUrl: '',
        type: 1,
        activityId: null,
        webUrl: '',
        seq: ''
      }
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
    handleAvatarSuccess (res, file) {
      if (res.code === 200) {
        console.log(res.data)
        this.form.imageUrl = res.data
      } else {
        this.$message.error('上传失败：' + res.desc)
      }
    },
    getActivityList () {
      ActivityAllApi().then(res => {
        this.activityList = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    showEditBanner ({ index, row }) {
      let indexBannerId = row.id
      this.dialogTitle = '修改'
      this.addOrUpdateVisible = true
      BannerGetApi(indexBannerId).then(res => {
        this.form = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    saveOrUpdate () {
      console.log(this.form)
      this.$refs['indexBannerForm'].validate((valid) => {
        if (valid) {
          BannerAddOrUpdateApi(this.form).then(res => {
            console.log(res)
            this.addOrUpdateVisible = false
            this.pagination.currentPage = 1
            this.fetchData()
          }).catch(err => {
            console.log('err', err)
            this.loading = false
          })
        } else {
          console.log('还有必填信息没有填写')
          return false
        }
      })
    },
    removeBanner ({ index, row }, done) {
      let indexBannerIndex = row.id
      BannerRemoveApi(indexBannerIndex)
        .then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          done()
        }).catch(err => {
          console.log('err', err)
          this.loading = false
        })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 75px;
    line-height: 75px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 75px;
    display: block;
  }
</style>
