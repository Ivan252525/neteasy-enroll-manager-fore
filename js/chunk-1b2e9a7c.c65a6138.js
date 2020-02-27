(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1b2e9a7c","chunk-2d0dd852"],{8279:function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("el-image",{staticStyle:{width:"50px",height:"50px"},attrs:{src:e.scope.row.userLogo}})},i=[],r={props:{value:{type:Boolean,require:!0},scope:{default:null},myProps:{default:null}},computed:{},mounted:function(){},methods:{}},a=r,s=o("2877"),c=function(e){e.options.__source="src/views/activity/check/components/checkUserLogo.vue"},l=c,u=Object(s["a"])(a,n,i,!1,null,null,null);"function"===typeof l&&l(u);t["default"]=u.exports},b496:function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("d2-container",[o("template",{slot:"header"},[o("p",[e._v("【"+e._s(this.title)+"】核销人列表")]),o("el-button",{attrs:{type:"success"},on:{click:e.showAddCheckUser}},[e._v("新增核销人")])],1),o("div",[o("d2-crud",{ref:"d2Crud",attrs:{columns:e.columns,data:e.data,loading:e.loading,pagination:e.pagination,rowHandle:e.rowHandle},on:{"row-remove":e.removeCheckUser,"pagination-current-change":e.paginationCurrentChange}})],1),o("el-dialog",{attrs:{title:"添加核销人",visible:e.addOrUpdateVisible},on:{"update:visible":function(t){e.addOrUpdateVisible=t}}},[o("el-form",{ref:"addCheckUserForm",attrs:{inline:!0,model:e.form,rules:e.rules}},[o("el-form-item",{attrs:{label:"用户ID",prop:"userCode"}},[o("el-input",{attrs:{placeholder:"请输入用户ID"},model:{value:e.form.userCode,callback:function(t){e.$set(e.form,"userCode",t)},expression:"form.userCode"}})],1),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:e.searchUser}},[e._v("查询")])],1)],1),e.userInfo.id?o("div",[o("el-image",{attrs:{src:e.userInfo.userLogo}}),o("p",[e._v(e._s(e.userInfo.nickname))])],1):e._e(),o("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.addOrUpdateVisible=!1}}},[e._v("取 消")]),o("el-button",{attrs:{type:"primary"},on:{click:e.addCheckUser}},[e._v("确 定")])],1)],1)],2)},i=[],r=o("8279"),a=o("9bd2"),s=o("c276");function c(e){return Object(a["a"])({url:"/manager/activity/check/list",method:"post",headers:{token:s["a"].cookies.get("token")},data:e})}function l(e){return Object(a["a"])({url:"/manager/activity/check/remove/"+e,method:"post",headers:{token:s["a"].cookies.get("token")}})}function u(e){return Object(a["a"])({url:"/manager/activity/check/search/"+e,method:"post",headers:{token:s["a"].cookies.get("token")}})}function d(e){return Object(a["a"])({url:"/manager/activity/check/add",method:"post",headers:{token:s["a"].cookies.get("token")},data:e})}var h={name:"checkUser",data:function(){return{addOrUpdateVisible:!1,activityId:null,title:null,form:{userCode:""},rules:{userCode:[{required:!0,message:"请输入用户ID",trigger:"blur"}]},userInfo:{id:null,nickname:"",userLogo:""},columns:[{title:"头像",key:"userLogo",component:{name:r["default"]}},{title:"昵称",key:"nickname"}],rowHandle:{remove:{icon:"el-icon-delete",size:"small",fixed:"right",confirm:!0,confirmTitle:"提示",confirmText:"确定删除吗？"}},data:[],options:{stripe:!0},loading:!1,pagination:{currentPage:1,pageSize:5,total:0}}},mounted:function(){this.activityId=this.$route.query.activityId,this.title=this.$route.query.title,this.fetchData()},methods:{paginationCurrentChange:function(e){this.pagination.currentPage=e,this.fetchData()},fetchData:function(){var e=this;this.loading=!0,c({activityId:this.activityId,page:{page:this.pagination.currentPage,limit:this.pagination.pageSize}}).then((function(t){console.log(t),e.data=t.list,e.pagination.total=t.total,e.loading=!1})).catch((function(t){console.log("err",t),e.loading=!1}))},removeCheckUser:function(e,t){var o=this,n=(e.index,e.row),i=n.id;l(i).then((function(e){o.$message({message:"删除成功",type:"success"}),t()})).catch((function(e){console.log("err",e),o.loading=!1}))},showAddCheckUser:function(){this.addOrUpdateVisible=!0,this.form={userCode:""},this.userInfo={id:null,nickname:"",userLogo:""}},searchUser:function(){var e=this;this.$refs["addCheckUserForm"].validate((function(t){if(!t)return console.log("还有必填信息没有填写"),!1;u(e.form.userCode).then((function(t){t?e.userInfo=t:e.$message.error("用户不存在，请检查ID是否填写正确")})).catch((function(t){console.log("err",t),e.loading=!1}))}))},addCheckUser:function(){var e=this;if(this.userInfo.id){var t=this.userInfo.id,o=this.activityId;d({userId:t,activityId:o}).then((function(t){e.addOrUpdateVisible=!1,e.fetchData()})).catch((function(e){console.log("err",e)}))}else this.$message.error("请先查询用户")}}},f=h,m=o("2877"),p=function(e){e.options.__source="src/views/activity/check/checkUser.vue"},g=p,v=Object(m["a"])(f,n,i,!1,null,null,null);"function"===typeof g&&g(v);t["default"]=v.exports}}]);