<template>
<div class="example2">
  <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="series"></apexchart>
</div>
</template>

<script>
export default {
  name: 'ColumnExample',
  data: function() {
    return {
       chartOptions: {
        
        theme: {
          palette: 'palette10' 
               },
        plotOptions: {
          bar: {
            horizontal: true,
            endingShape: 'rounded',
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          show: true,
          width: 7,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['글', '댓글']
        },
        yaxis: {
          // title: {
          //   text: '개'
          // }
        },
        fill: {
          opacity: 0.85
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + "개"
            }
          }
        }
      },
      series: [{
        name: '상위 3명',
        data: [13466, 23878]
      }, {
        name: '전체',
        data: [72799, 100773]
      }]
    }
  }
}

</script>

<style>

.example2 {
  width:100%;
  height: 100%;
}
</style>