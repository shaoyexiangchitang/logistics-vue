<template>
  <div>
    <a-button size="large" class="editable-add-btn" @click="companyVisible = true">
        <a-icon type="plus"/>
        新增公司
      </a-button>
    <a-input-search
        placeholder="请输入公司名"
        enter-button="搜索来往公司"
        style="width: 400px;margin-bottom: 20px"
        size="large"
        @search="onSearch"
    />
    <a-button style="margin-left: 10px" size="large" type="danger" @click="loadTableData">
      重置
    </a-button>
    <a-table :loading="loading" :columns="columns" :data-source="data" rowKey="id">
      <a slot="company" slot-scope="company">{{ company }}</a>
      <span slot="customTitle"><a-icon type="bank"/> 公司名称</span>
      <span slot="action" slot-scope="text, record, index">
        <a-button @click="handleUpdate(record)" type="link"><a-icon type="edit"/> Update</a-button>
      <a-divider type="vertical"/>
         <a-button @click="handleDelete(record,index)" type="link"><a-icon type="delete"/> Delete</a-button>
      </span>
    </a-table>
    <a-modal
            title="公司信息"
            :closable="false"
            :visible="companyVisible"
        >
          <a-form-model ref="ruleForm" :model="company">
            <a-form-model-item ref="name" label="公司名称" prop="name">
              <a-input v-model="company.name"/>
            </a-form-model-item>
            <a-form-model-item label="预留电话" prop="phone">
              <a-input v-model="company.phone"/>
            </a-form-model-item>
            <a-form-model-item label="打款账号" prop="number">
              <a-input v-model="company.number" />
            </a-form-model-item>
            <a-form-model-item label="描述信息" prop="description">
              <a-input v-model="company.description" type="textarea"/>
            </a-form-model-item>
          </a-form-model>
          <template slot="footer">
            <a-button key="back" @click="companyVisible = false">
              Return
            </a-button>
            <a-button key="submit" type="primary" :loading="modalLoading" @click="submitCompany">
              Submit
            </a-button>
          </template>
    </a-modal>
  </div>
</template>

<script>
import {FindAllCompany, SearchCompany,SaveCompany,DeleteCompanyById} from "../../api/company";

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: {title: 'customTitle'},
    scopedSlots: {customRender: 'company'},
  },
  {
    title: '预留电话',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: '打款账号',
    key: 'number',
    dataIndex: 'number',
  },
  {
    title: '公司简介',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: '时间',
    dataIndex: 'createAt',
    key: 'createAt',
  },
  {
    title: '更多操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];

const data = [];

export default {

  data() {
    return {
      company: {
        name: '',
        description: '公司简介',
        phone: '',
        number: '',
      },
      modalLoading: false,
      companyVisible: false,
      loading: false,
      data: [],
      columns,
    };
  },

  mounted() {
    this.loadTableData()
  },

  methods: {

    onSearch(value) {
      if (value) {
        this.loading = true
        SearchCompany(value).then((res) => {
          console.log(res)
          if (res.data.length === 0) {
            this.$message.warn("未搜索到任何数据")
            setTimeout(() => {
              this.loading = false
              this.data = res.data
            }, 600)
          } else {
            setTimeout(() => {
              this.$message.success("搜索到" + res.data.length + "个公司")
              this.loading = false
              this.data = res.data
            }, 600)
          }
        })
      } else {
        this.$message.warn("请输入搜索内容")
      }
    },

    loadTableData() {
      this.loading = true
      FindAllCompany().then((res) => {
        setTimeout(() => {
          this.loading = false
          this.data = res.data
        }, 600)
      })
    },

    submitCompany() {
      this.modalLoading = true
      SaveCompany(this.company).then((res) => {
        if (res.status) {
          setTimeout(() => {
            this.modalLoading = false
            this.companyVisible = false
            this.$message.success('商品信息提交成功');
            this.loadTableData()
          }, 600)
        } else {
          setTimeout(() => {
            this.modalLoading = false
          }, 600)
        }
      })
    },

    handleDelete(r, index) {
      DeleteCompanyById(r.id).then((res) => {
        if (res.status) this.$message.success('商品信息删除成功');
        this.loadTableData()
      })
      console.log(index)
    },

    handleUpdate(r) {
      this.company = r
      this.companyVisible = true
    },

  },

};
</script>

<style scoped>
.editable-add-btn {
  margin-bottom: 15px;
}
</style>
