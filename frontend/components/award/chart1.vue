<template>
  <div class="example">
    <apexchart width="100%" height="100%" type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      chartOptions: {
        stroke: {
            curve: 'straight'
          },
          markers: {
             size: 2
          },
        theme: {
         palette: 'palette7' 
        },
        xaxis: {
          //type: 'datetime',
          categories: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
        },
        yaxis: [{
            title: {
              text: '페이지뷰',
            },

          }, {
            opposite: true,
            title: {
              text: '사용자수'
            }
          }],
        stroke: {
            width: [0, 4]
          },
      },
      series: [{
        name: '페이지 뷰',
        type: 'column',
        data: [6895,4686,8346,6886,6138,5040,10095,9692,7700,7424,8207,6367,7538,6853,6140,6553,7362,8163,7342,6785,7643,6186,8343,10307,8939,9997,8512,6999,9615,8634]
      }, {
        name: '사용자 수',
        type: 'line',
        data: [195,208,231,225,223,240,286,284,330,374,288,284,261,262,246,304,366,380,340,321,257,284,326,336,287,290,284,286,308,376]
      }]
    }
  },
  methods: {
      generateDayWiseTimeSeries(baseval, count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
          var x = baseval;
          var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
          series.push([x, y]);
          baseval += 86400000;
          i++;
        }
        return series;
      },
  }
}
</script>

<style>

.example {
  width:100%;
  height: 100%;
}
</style>