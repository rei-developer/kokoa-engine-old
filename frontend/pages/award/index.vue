<template>
   <div v-if='$store.state.user.isLogged && $store.state.user.isAdmin'>
    <el-row>
      <el-col :xl='4' hidden-lg-and-down="hidden-lg-and-down">
        <div class='blank'/>
      </el-col>
      <el-col :xl='16'> 
       <div class='Container'>
         <div class='item'>
          <div class='content'>
            <div class='mobile'>
              <p>모바일에서는 지원하지 않는 페이지입니다. </p>
              <p>는 사실 제 머리속에서 나오는 눈이 썩어버릴것같은 디자인으로는 도저히 모바일까진 무리였습니다 봐주세요. </p>
            </div>
           <div class='bg'>
            <div class='logo'>
             <img src='/award.png'>
            </div>
            <div class='title'>
                <h2>2019년도 아이돌보드 어워드</h2>
            </div>
              <div class='mid'>
                <p>아이돌보드 어워드는 2019년도 한 해, 유저분들께서 아이돌보드에 가져주신 관심과 성원을 한자리에 모아 보여드리기 위함입니다.</p> 
                 <p> 아이돌보드의 여러 통계를 보시며 올해의 아이돌보드를 돌아보는 시간이 되시길 기원합니다. </p>
              </div>
              <div class='first'>
             <div class='chart1-detail'>
              <p> 가장 먼저 아이돌보드 사용자 통계입니다. </p>
              <p> 다만 사이트 엔진 교체 후 통계자료 수집이 늦게 시작되었기때문에 자료가 적은 점 양해바랍니다. </p>
              <p> 11월 한 달간 아이돌보드에 방문해주신 사용자분들과 페이지 뷰 수 입니다.</p>
              <p> 11월 한 달 간, <b>6625분</b>들이 <b>23만</b>정도의 페이지를 봐주셨습니다. </p>
              <p> 매일매일 새로운 유저분들이 사이트를 방문하셨고 그중 97%는 한국, 3%정도는 영어권 유저분이셨습니다. </p>
             </div>
             <div class='chart1'>
               <Chart1 />
             </div>
              </div>
            <div class='second'>
              <div class='chart2-detail'>
                <p> 만들면서 가장 충격적이였던 글, 댓글 수 TOP3입니다.</p>
                <p> 글 작성에서 1위를 차지했던 유저분은 6880 댓글로 4위입니다. 고이고 고인 연게...</p>
                <p> 글은 삭제한 글도 포함, 댓글은 삭제한 것을 제외한 갯 수입니다.</p>
                <p> 전부 다 공개하면 애매해질것같아서 1위만 공개하겠습니다. 글 작성 1위는 <b>이채영</b> 댓글 작성 1위는 <b>올리비아 혜</b> 입니다. </p>
            </div>
              <div class='chart2'>
                <Chart2 />
              </div>
            </div>
            <div class='third'>
              <div class='chart3-detail'>
                <p>이번은 데뷔, 탈락을 가장 많이 받은 글과 조회수가 가장 높은 글 TOP3입니다.</p>
                <p>데뷔글 결과는 마음씨 착한 아보 유저들의 성향이 확연히 드러난 결과같습니다 </p>
                <p> db에 남아있는 2019년 글 중 가장 많은 탈락을 받은 글은 <b>9개</b>, 가장 많은 데뷔를 받은 글은 <b>105개</b>였습니다. </p>
                <p> 특정 유저가 지속적으로 탈락을 박는다니 몰려들어 데뷔를 박아주는 마음씨 고운 아보 유저들... 인상적이였습니다. </p>
                <p style="text-decoration:line-through;">조회수는 정말 망령이라도 있는건가</p>
            </div>
            <div class='chart3'>
                <Chart3 />
           </div>
            </div>
            <div class='fourth'>
              <div class='chart4-detail'>
                <p>마지막은 데뷔와 탈락을 합쳐 가장 많은 exp를 얻은 유저와 포인트가 가장 많은 유저입니다. </p>
                <p>공교롭게도 같은 유저가 해당되는데요, 5레벨 2150exp와 78900포인트로 양손갈잡래이 유저가 모두 1위입니다. </p>
                <p style="text-decoration:line-through;">뉴비를 원해</p>
                <p>역으로 가장 적은 포인트를 가지고계신 유저분은 부엉이 유저로 -21635포인트를 보유(?)중이십니다. </p>
                <p>번외로 글, 댓글 상위권 유저들의 전체 글, 댓글 대비 비중을 나타낸 그래프로 이번 통계를 마치겠습니다. </p>
              </div>
            <div class='chart4'>
              <Chart4 />
            </div>
            </div>
            <div class='saigo'>
              <p> 하루가 멀다하고 하락장인 아이돌보드, 그저 고인 연게와 들어오는 뉴비마다 썩은내가 진동하는 애게,</p>
              <p> 매일매일 글리젠 걱정이 아닌 분탕과 싸움질로 골치아픈 운영을 해보고싶었습니다...</p>
              <p> 그냥 글로 정리해서 올리려던걸 시간도 좀 남아서 만들어본 어워드 페이지지만, 내가 나코보단 낫겠지 하는 생각은 흔적조차 남지않았습니다. </p>
              <p> 딴에 배경도 넣어보고 색도 맞춰보고 금손 중년 아저씨에게도 물어봤지만 제 디자인은 회생할 여지조차 없는 쓰레기였습니다. </p>
              <p> 단순한 게시판 디자인도 답이 없는데 뭔 배짱으로 이런걸 만드려고 했는지 과거의 저에게 다시 묻고싶습니다. </p>
            </div>
           </div>
         </div>
        </div>
       </div>
      </el-col>
       <el-col :xl='4' hidden-lg-and-down="hidden-lg-and-down">
        <div class='blank'/>
     </el-col>
    </el-row>
  </div>
</template>

    <script>
    import Chart1 from '~/components/award/chart1.vue'
    import Chart2 from '~/components/award/chart2.vue'
    import Chart3 from '~/components/award/chart3.vue'
    import Chart4 from '~/components/award/chart4.vue'
        export default {
      components: { Chart1, Chart2, Chart3, Chart4 }
      
   }
    </script>

    <style>
      @import url('https://fonts.googleapis.com/css?family=Gamja+Flower&display=swap&subset=korean');
        
         @media(min-width:1151px){
          .content {
            font-family: 'Gamja Flower', cursive;
            font-size: 21px;
            word-break : keep-all;
          }
        .bg {
            background-image: url("/leaves-pattern.png");
            margin: 0 8%;
            word-break: keep-all;

        }
        .bg .logo {
            width: 35%;
            height: auto;
            position: relative;
            left: 32%;
        }
        .bg .title {
            position: relative;
            padding: 0 5%;
            color: rgb(104, 20, 201); 
        }

        .bg .mid {
            position: relative;
            width: 82%;
            padding: 1.5% 3%;
            margin: 4% 0 0 8%;
            line-height: 1em;
            background-color: rgba(54, 39, 39, 0.7);
            border-radius: 7px;
            color: white;
        }
        .bg .first {
          width: 100%;
          height: 450px;
          margin: 40px 0 0 0;
        }

        .bg .chart1 {
           position: relative;
           width:50%;
           height:100%;
           margin:  10% 0 0 45%;
           background-color: rgba(138, 114, 114, 0.574);
           border-radius: 15px;
           
        }
 
        .bg .chart1-detail {
          position: relative;
          float: left;
          width: 38%;
          margin: 2% 0 0 5%;
          padding: 1em;
          background-color: rgba(54, 39, 39, 0.7);
          border-radius: 15px;
          color: white;
        }

        .bg .second {
          width: 100%;
          height: 500px;
        }
        
        .bg .chart2 {
          position: relative;
          width: 50%;
          height: 90%;
          margin:  15% 0 0 45%;
          background-color: rgb(132, 132, 150, 0.574);
          border-radius: 15px;
          opacity: 90%;
        }

        .bg .chart2-detail {
          position: relative;
          float: left;
          width: 38%;
          margin: 5% 0 0 5%;
          padding: 1em;
          background-color: rgba(54, 39, 39, 0.7);
          border-radius: 15px;
          color: white;
        }

        .bg .third {
          
          width: 100%;
          height: 500px;
        }
        
        .bg .chart3 {
          position: relative;
          width: 50%;
         height: 30%;
          margin:  10% 0 0 47%;
          border-radius: 15px;
          opacity: 90%;
        }

        .bg .chart3-detail {
          position: relative;
          float: left;
          width: 38%;
          margin: 0 0 0 5%;
          padding: 1em;
          background-color: rgba(54, 39, 39, 0.7);
          border-radius: 15px;
          color: white;
        }

        .bg .fourth {
          
          width: 100%;
          height: 500px;
        }
        
        .bg .chart4 {
          position: relative;
          width: 50%;
          height: 80%;
          margin:  10% 0 0 47%;
          background-color: rgb(132, 132, 150, 0.574);
          border-radius: 15px;  
          opacity: 90%;
        }

        .bg .chart4-detail {
          position: relative;
          float: left;
          width: 38%;
          margin: 0 0 0 5%;
          padding: 1em;
          background-color: rgba(54, 39, 39, 0.7);
          border-radius: 15px;
          color: white;
        }

        .bg .saigo {
          position: relative;
            width: 82%;
            padding: 1.5% 3%;
            margin: 4% 0 10% 8%;
            line-height: 1em;
            background-color: rgba(54, 39, 39, 0.7);
            border-radius: 7px;
            color: white;
            
        }
         .mobile {
          display: none;
        } 
         }
        
        @media(max-width: 1150px) {
          .bg {
            display: none;
          }
        }
         
        
    </style>