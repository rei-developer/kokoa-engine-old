<template>
<div class="example">
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
        name: '1위',
        data: [4765,8642]
      }, {
        name: '2위',
        data: [4528,7633]
      }, {
        name: '3위',
        data: [4176,7603]
      }],
    }
  }
}

</script>

<style>

.example {
  width:100%;
  height: 100%;
}
</style>


