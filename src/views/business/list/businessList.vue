<template>
  <d2-container>
    <template slot="header">
      <el-row>
        <el-col :span="6" style="display: flex">
          <el-input v-model="businessName" placeholder="请输入商家名称..."/>
        </el-col>
        <el-button type="primary" style="margin-left: 5px" @click="searchList">搜索</el-button>
        <el-button type="success" @click="addBusiness">新增商家</el-button>
      </el-row>
    </template>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="showEditBusiness"
        @row-remove="removeBusiness"
        @dialog-cancel="handleDialogCancel"
        @pagination-current-change="paginationCurrentChange"/>
    </div>
    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="addOrUpdateVisible">
      <el-form :model="form" label-position="top">
        <el-form-item label="商家名称：" label-width="200">
          <el-input v-model="form.businessName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商家logo：" label-width="200">
          <el-upload
            class="avatar-uploader"
            action="https://www.weselfshop.cn/enroll-manager/manager/file/file/upload/multipart"
            :show-file-list="false"
            :headers="tokenHeaders"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.businessLogo" :src="form.businessLogo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商家介绍：" label-width="200">
          <el-input v-model="form.businessAbout" autocomplete="off" type="textarea"
                    :rows="5"></el-input>
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
import { BusinessListApi, BusinessAddApi, BusinessGetApi, BusinessEditApi, BusinessRemoveApi } from '@/api/business.js'
import util from '@/libs/util'
import BusinessListImage from './components/BusinessListImage'
// import AddOrUpdate from '../addOrUpdata/addOrUpdateBusiness'
export default {
  name: 'businessList',
  // components: {
  //   AddOrUpdate
  // },
  data () {
    return {
      businessName: '',
      form: {
        id: null,
        businessName: '',
        businessLogo: '',
        businessAbout: ''
      },
      dialogTitle: '',
      tokenHeaders: {
        token: util.cookies.get('token')
      },
      columns: [
        {
          title: 'logo',
          key: 'businessLogo',
          component: {
            name: BusinessListImage
          }
        },
        {
          title: '名称',
          key: 'businessName'
        },
        {
          title: '创建人',
          key: 'createManagerName'
        },
        {
          title: '创建时间',
          key: 'createTime'
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
          confirmText: '删除后该商家下所有活动将自动删除，确定删除商家？'
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
      },
      addOrUpdateVisible: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      BusinessListApi({
        businessName: this.businessName,
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
    addBusiness () {
      this.addOrUpdateVisible = true
      this.dialogTitle = '新增'
      this.form = {
        businessLogo: ''
      }
    },
    handleDialogCancel (done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
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
        this.form.businessLogo = res.data
      } else {
        this.$message.error('上传失败：' + res.desc)
      }
    },
    saveOrUpdate () {
      if (!this.form.id) {
        this.loading = true
        BusinessAddApi({
          businessName: this.form.businessName,
          businessLogo: this.form.businessLogo,
          businessAbout: this.form.businessAbout
        }).then(res => {
          this.loading = false
          this.addOrUpdateVisible = false
          this.pagination.currentPage = 1
          this.fetchData()
        }).catch(err => {
          console.log('err', err)
          this.loading = false
        })
      } else {
        BusinessEditApi({
          businessId: this.form.id,
          businessName: this.form.businessName,
          businessLogo: this.form.businessLogo,
          businessAbout: this.form.businessAbout
        }).then(res => {
          this.addOrUpdateVisible = false
          this.fetchData()
        }).catch(err => {
          console.log('err', err)
          this.loading = false
        })
      }
    },
    showEditBusiness ({ index, row }) {
      this.addOrUpdateVisible = true
      this.dialogTitle = '修改'
      let businessId = row.id
      BusinessGetApi(businessId)
        .then(res => {
          console.log(res)
          this.form.id = res.id
          this.form.businessName = res.businessName
          this.form.businessLogo = res.logo
          this.form.businessAbout = res.businessAbout
        }).catch(err => {
          console.log('err', err)
          this.loading = false
        })
    },
    removeBusiness ({ index, row }, done) {
      let businessId = row.id
      BusinessRemoveApi(businessId)
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
