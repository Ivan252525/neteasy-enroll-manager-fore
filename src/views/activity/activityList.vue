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
        :rowHandle="rowHandle"
        @custom-emit-1="showEditActivity"
        @custom-emit-2="downloadExcel"
        @pagination-current-change="paginationCurrentChange"/>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="addOrUpdateVisible">
      <el-form ref="activityForm" :model="form" label-width="80px" label-position="top" :rules="rules">
        <!-- 商家 -->
        <el-form-item label="商家：" prop="businessId">
          <el-select v-model="form.businessId" filterable clearable placeholder="请选择商家">
            <el-option
              v-for="item in businessList"
              :key="item.id"
              :label="item.businessName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 标题 -->
        <el-form-item label="活动标题：" prop="title">
          <el-col span="11">
            <el-input v-model="form.title"/>
          </el-col>
        </el-form-item>
        <el-form-item label="橱窗图（显示在活动列表的图片，建议尺寸：345 x 200）：" prop="mainImage">
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
        <el-form-item label="banner（显示在活动详情的banner，建议尺寸：750 x 400）：" prop="banner">
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
        <el-form-item label="活动时间（开始时间和结束时间可相同）：" prop="activityTime">
          <el-date-picker
            v-model="form.activityTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名时间（开始时间和结束时间不可相同！）：" prop="enrollTime">
          <el-date-picker
            v-model="form.enrollTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地区：" prop="jmRegionId">
          <el-select v-model="form.jmRegionId" clearable placeholder="请选择地区">
            <el-option
              v-for="item in jmRegionList"
              :key="item.id"
              :label="item.jmRegionName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地址（可不填）：">
          <el-col span="11">
            <el-input v-model="form.address"/>
          </el-col>
        </el-form-item>
        <el-form-item label="活动联系电话（可不填）：">
          <el-col span="11">
            <el-input v-model="form.phone"/>
          </el-col>
        </el-form-item>
        <el-form-item label="活动详情图（可上传多张）：" prop="detailImage">
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
        <div v-for="(formItem, index) in form.formItems">
          <p>表单{{index + 1}}：</p>
          <el-row>
            <el-col span="3">
              <el-form-item label="是否必填：">
                <el-switch
                  v-model="formItem.must"
                  :disabled="!canEditFormItem"
                  active-color="#13ce66">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col span="4">
              <el-form-item label="表单类型：" :prop="'formItems.' + index + '.type'"
                            :rules="{ required: true, message: '请选择类型', trigger: 'blur' }">
                <el-select v-model="formItem.type" clearable placeholder="请选择" :disabled="!canEditFormItem">
                  <el-option
                    v-for="item in formType"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="4" style="margin-left: 15px">
              <el-form-item label="表单名：" :prop="'formItems.' + index + '.label'"
                            :rules="{ required: true, message: '请选择类型', trigger: 'blur' }">
                <el-input v-model="formItem.label" :disabled="!canEditFormItem"/>
              </el-form-item>
            </el-col>
            <el-col span="8" style="margin-left: 15px">
              <el-form-item label="选项(中竖线分割“ | ”)：" :prop="'formItems.' + index + '.options'"
                            :rules="formItem.type === 1 ? null : { required: true, message: '请选择类型', trigger: 'blur' }">
                <el-input v-model="formItem.options" :disabled="formItem.type === 1 || !canEditFormItem"/>
              </el-form-item>
            </el-col>
            <el-col span="2"  style="margin-left: 15px">
              <el-form-item label="-">
                <el-button @click="removeFormItems(index)" :disabled="!canEditFormItem">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormItems" :disabled="!canEditFormItem">新增表单</el-button>
        <el-button @click="addOrUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { ActivityListApi, ActivityAddApi, ActivityGetApi } from '@/api/activity.js'
import { BusinessAllApi } from '@/api/business.js'
import ActivityMainImage from './components/ActivityMainImage'
import ActivityState from './components/ActivityState'
import util from '@/libs/util'
export default {
  name: 'activityList',
  data () {
    return {
      canEditFormItem: true,
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
        ],
        formItems: [
          {
            must: true,
            label: '',
            type: 1,
            options: ''
          }
        ]
      },
      rules: {
        businessId: [
          { required: true, message: '请选择商家', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入活动标题', trigger: 'blur' }
        ],
        mainImage: [
          { required: true, message: '请上传活动橱窗图', trigger: 'blur' }
        ],
        banner: [
          { required: true, message: '请上传活动banner', trigger: 'blur' }
        ],
        activityTime: [
          { required: true, message: '请选择活动时间', trigger: 'blur' }
        ],
        enrollTime: [
          { required: true, message: '请选择报名时间', trigger: 'blur' }
        ],
        jmRegionId: [
          { required: true, message: '请选择活动地区', trigger: 'blur' }
        ],
        detailImage: [
          { required: true, message: '请上传活动详情图', trigger: 'blur' }
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
        // {
        //   title: '创建时间',
        //   key: 'createTime'
        // },
        {
          title: '状态',
          key: 'state',
          component: {
            name: ActivityState
          }
        }
      ],
      rowHandle: {
        custom: [
          {
            text: '修改',
            icon: 'el-icon-edit',
            type: 'info',
            size: 'small',
            emit: 'custom-emit-1'
          },
          {
            text: '下载报名名单',
            type: 'info',
            size: 'small',
            emit: 'custom-emit-2'
          }
        ]
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
      addOrUpdateVisible: false,
      formType: [
        {
          value: 1,
          name: '文本输入'
        },
        {
          value: 2,
          name: '单选按钮'
        },
        {
          value: 3,
          name: '单选下拉框'
        },
        {
          value: 4,
          name: '多选'
        }
      ]
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
      this.canEditFormItem = true
      this.form = {
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
        ],
        formItems: [
          {
            must: true,
            label: '',
            type: 1,
            options: ''
          }
        ]
      }
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
      console.log(fileList)
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
        this.form.detailImage.push({ url: res.data })
      } else {
        this.$message.error('上传失败：' + res.desc)
      }
    },
    addFormItems () {
      this.form.formItems.push({
        must: true,
        label: '',
        type: 1,
        options: ''
      })
    },
    removeFormItems (index) {
      if (this.form.formItems.length === 1) {
        this.$message.error('大哥不能再删了~')
        return
      }
      let formItems = []
      for (let i = 0; i < this.form.formItems.length; i++) {
        if (i !== index) {
          formItems.push(this.form.formItems[i])
        }
      }
      this.form.formItems = formItems
    },
    saveOrUpdate () {
      console.log(this.form)
      this.$refs['activityForm'].validate((valid) => {
        if (valid) {
          let detailImage = []
          for (let i = 0; i < this.form.detailImage.length; i++) {
            detailImage.push(this.form.detailImage[i].url)
          }
          let formItems = []
          for (let i = 0; i < this.form.formItems.length; i++) {
            formItems.push({
              must: this.form.formItems[i].must ? 1 : 0,
              label: this.form.formItems[i].label,
              type: this.form.formItems[i].type,
              options: this.form.formItems[i].options ? this.form.formItems[i].options.split('|') : null
            })
          }
          let data = {
            businessId: this.form.businessId,
            title: this.form.title,
            mainImage: this.form.mainImage,
            banner: this.form.banner,
            activityStartTime: this.dateFormat(this.form.activityTime[0]),
            activityEndTime: this.dateFormat(this.form.activityTime[1]),
            enrollStartTime: this.dateFormat(this.form.enrollTime[0]),
            enrollEndTime: this.dateFormat(this.form.enrollTime[1]),
            jmRegionId: this.form.jmRegionId,
            address: this.form.address ? this.form.address : null,
            phone: this.form.phone ? this.form.phone : null,
            detailImage: detailImage,
            formItems: formItems
          }
          console.log(data)
          ActivityAddApi(data).then(res => {
            console.log(res)
            this.addOrUpdateVisible = false
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
    dateFormat: function (time) {
      let t = time // row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
    },
    toDateObject: function (str) {
      str = str.substring(0, 19)
      str = str.replace(/-/g, '/')
      return new Date(str)
    },
    showEditActivity ({ index, row }) {
      let activityId = row.id
      ActivityGetApi(activityId).then(res => {
        console.log(res)
        this.form = res
        this.form.activityTime = [this.toDateObject(res.activityStartTime), this.toDateObject(res.activityEndTime)]
        this.form.enrollTime = [this.toDateObject(res.enrollStartTime), this.toDateObject(res.enrollEndTime)]
        for (let i = 0; i < this.form.formItems.length; i++) {
          if (this.form.formItems[i].must === 1) {
            this.form.formItems[i].must = true
          } else {
            this.form.formItems[i].must = false
          }
        }
        let detailImages = []
        for (let i = 0; i < res.detailImage.length; i++) {
          detailImages.push({
            url: res.detailImage[i]
          })
        }
        this.form.detailImage = detailImages
        this.addOrUpdateVisible = true
        this.canEditFormItem = false
        this.dialogTitle = '修改'
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    downloadExcel () {
      console.log('sdfhlisufliuwehfiuewhfoi')
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
