<template>
  <d2-container>
    <template slot="header">
      <el-button type="success" @click="showAddIndexBusiness">新增首页商家</el-button>
    </template>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="showEditIndexBusiness"
        @row-remove="removeIndexBusiness"
        @pagination-current-change="paginationCurrentChange"/>
    </div>
    <!--  弹窗  -->
    <el-dialog :title="dialogTitle" :visible.sync="addOrUpdateVisible">
      <el-form ref="indexBusinessForm" :model="form" label-position="top" :rules="rules">
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
import { BusinessAllApi } from '@/api/business.js'
import { IndexBusinessListApi, IndexBusinessGetApi, IndexBusinessAddOrUpdateApi, IndexBusinessRemoveApi } from '@/api/index.business.js'
import BusinessListImage from '../business/list/components/BusinessListImage'
export default {
  name: 'index-business-manager',
  data () {
    return {
      dialogTitle: '',
      addOrUpdateVisible: false,
      form: {
        id: null,
        businessId: null,
        seq: ''
      },
      rules: {
        businessId: [
          { required: true, message: '请选择商家', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      },
      tokenHeaders: {
        token: util.cookies.get('token')
      },
      businessList: [],
      columns: [
        {
          title: '商家logo',
          key: 'businessLogo',
          component: {
            name: BusinessListImage
          }
        },
        {
          title: '商家名',
          key: 'businessName'
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
    this.getBusinessList()
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      IndexBusinessListApi({
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
    showAddIndexBusiness () {
      this.form = {
        id: null,
        businessId: null,
        seq: ''
      }
      this.dialogTitle = '新增'
      this.addOrUpdateVisible = true
    },
    getBusinessList () {
      BusinessAllApi().then(res => {
        this.businessList = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    showEditIndexBusiness ({ index, row }) {
      let indexBusinessId = row.id
      this.dialogTitle = '修改'
      this.addOrUpdateVisible = true
      IndexBusinessGetApi(indexBusinessId).then(res => {
        this.form = res
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    saveOrUpdate () {
      console.log(this.form)
      this.$refs['indexBusinessForm'].validate((valid) => {
        if (valid) {
          IndexBusinessAddOrUpdateApi(this.form).then(res => {
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
    removeIndexBusiness ({ index, row }, done) {
      let indexBusinessId = row.id
      IndexBusinessRemoveApi(indexBusinessId)
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
