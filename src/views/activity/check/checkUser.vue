<template>
  <d2-container>
    <template slot="header">
      <p>【{{this.title}}】核销人列表</p>
      <el-button type="success" @click="showAddCheckUser">新增核销人</el-button>
    </template>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @row-remove="removeCheckUser"
        @pagination-current-change="paginationCurrentChange"/>
    </div>

    <!--  弹窗  -->
    <el-dialog :title="'添加核销人'" :visible.sync="addOrUpdateVisible">
      <el-form ref="addCheckUserForm" :inline="true" :model="form" :rules="rules">
        <el-form-item label="用户ID" prop="userCode">
          <el-input v-model="form.userCode" placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">查询</el-button>
        </el-form-item>
      </el-form>
      <div v-if="userInfo.id">
        <el-image :src="userInfo.userLogo" />
        <p>{{userInfo.nickname}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCheckUser">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import checkUserLogo from './components/checkUserLogo'
import { CheckUserListApi, CheckUserRemoveApi, SearchUserApi, CheckUserAddApi } from '@/api/activity.check.js'
export default {
  name: 'checkUser',
  data () {
    return {
      addOrUpdateVisible: false,
      activityId: null,
      title: null,
      form: {
        userCode: ''
      },
      rules: {
        userCode: [
          { required: true, message: '请输入用户ID', trigger: 'blur' }
        ]
      },
      userInfo: {
        id: null,
        nickname: '',
        userLogo: ''
      },
      columns: [
        {
          title: '头像',
          key: 'userLogo',
          component: {
            name: checkUserLogo
          }
        },
        {
          title: '昵称',
          key: 'nickname'
        }
      ],
      rowHandle: {
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
    this.activityId = this.$route.query.activityId
    this.title = this.$route.query.title
    this.fetchData()
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      CheckUserListApi({
        activityId: this.activityId,
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
    removeCheckUser ({ index, row }, done) {
      let id = row.id
      CheckUserRemoveApi(id)
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
    },
    showAddCheckUser () {
      this.addOrUpdateVisible = true
      this.form = {
        userCode: ''
      }
      this.userInfo = {
        id: null,
        nickname: '',
        userLogo: ''
      }
    },
    searchUser () {
      this.$refs['addCheckUserForm'].validate((valid) => {
        if (valid) {
          SearchUserApi(this.form.userCode).then(res => {
            if (!res) {
              this.$message.error('用户不存在，请检查ID是否填写正确')
            } else {
              this.userInfo = res
            }
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
    addCheckUser () {
      if (!this.userInfo.id) {
        this.$message.error('请先查询用户')
      } else {
        let userId = this.userInfo.id
        let activityId = this.activityId
        CheckUserAddApi({
          userId: userId,
          activityId: activityId
        }).then(res => {
          this.addOrUpdateVisible = false
          this.fetchData()
        }).catch(err => {
          console.log('err', err)
        })
      }
    }
  }
}
</script>
