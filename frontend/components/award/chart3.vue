<template>
 <el-table
    :data="tableData"
    stripe
    style="width: 90%">
    <el-table-column
      prop="date"
      label="Date"
      width="110">
    </el-table-column>
    <el-table-column
      prop="name"
      label="데뷔&탈락&조회"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="Address">
    </el-table-column>
  </el-table>
</template>
95047 77970 95037 93360 90246 85696 620 405 620
<script>
export default {
  data() {
      return {
        tableData: [{
          date: '2019-06-19',
          name: '데뷔 0 탈락 9',
          address: 'idolboard.com/b/girl/94907'
        }, {
          date: '2019-3-25',
          name: '데뷔 0 탈락 9',
          address: 'idolboard.com/b/girl/74714'
        }, {
          date: '2019-11-17',
          name: '데뷔 105 탈락 4',
          address: 'idolboard.com/b/girl/123406'
        }, {
          date: '2019-06-20',
          name: '조회수 93360',
          address: 'idolboard.com/b/girl/95047'
        }, {
          date: '2019-04-05',
          name: '조회수 90246',
          address: 'idolboard.com/b/girl/77970'
        }, {
          date: '2019-06-20',
          name: '조회수 85696',
          address: 'idolboard.com/b/girl/95037'
        }]
      }
    }
}

</script>

<style>
.el-table {
  border-radius: 15px;
}
.example {
  width:100%;
  height: 100%;
}
</style>