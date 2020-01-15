<template>
  <d2-container>
    <template slot="header">
      <el-button type="success" @click="showAddIndexActivity">新增首页活动</el-button>
    </template>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="showEditIndexActivity"
        @row-remove="removeIndexActivity"
        @pagination-current-change="paginationCurrentChange"/>
    </div>
    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="addOrUpdateVisible">
      <el-form ref="indexActivityForm" :model="form" label-position="top" :rules="rules">
        <el-form-item label="活动：" prop="activityId">
          <el-select v-model="form.activityId" filterable clearable placeholder="请选择活动">
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号（序号越小越靠前）：" prop="seq">
          <el-col :span="3">
            <el-input v-model="form.seq" autocomplete="off"/>
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
import { IndexActivityListApi, IndexActivityGetApi, IndexActivityAddOrUpdateApi, IndexActivityRemoveApi } from '@/api/index.activity.js'
import ActivityMainImage from '../activity/components/ActivityMainImage'
export default {
  name: 'index-activity-manager',
  data () {
    return {
      dialogTitle: '',
      addOrUpdateVisible: false,
      form: {
        id: null,
        activityId: null,
        seq: ''
      },
      rules: {
        activityId: [
          { required: true, message: '请选择活动', trigger: 'blur' }
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
          title: '活动图片',
          key: 'mainImage',
          component: {
            name: ActivityMainImage
          }
        },
        {
          title: '活动标题',
          key: 'title'
        },
        {
          title: '序号',
          key: 'seq'
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
      IndexActivityListApi({
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
    showAddIndexActivity () {
      this.form = {
        id: null,
        activityId: null,
        seq: ''
      }
      this.dialogTitle = '新增'
      this.addOrUpdateVisible = true
    },
    getActivityList () {
      ActivityAllApi().then(res => {
        this.activityList = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    showEditIndexActivity ({ index, row }) {
      let indexActivityId = row.id
      this.dialogTitle = '修改'
      this.addOrUpdateVisible = true
      IndexActivityGetApi(indexActivityId).then(res => {
        this.form = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    saveOrUpdate () {
      console.log(this.form)
      this.$refs['indexActivityForm'].validate((valid) => {
        if (valid) {
          IndexActivityAddOrUpdateApi(this.form).then(res => {
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
    removeIndexActivity ({ index, row }, done) {
      let indexActivityId = row.id
      IndexActivityRemoveApi(indexActivityId)
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
