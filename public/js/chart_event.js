
$(document).ready(function () {

    /**
     * 차트 초기화
     */
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // 0부터 시작하므로 1더함 더함
    var day = date.getDate();

    var solar_title = {
        'solar_value' : '발전량 (v)',
       
    }
    
    if (("" + month).length == 1) {
        month = "0" + month;
    }
    if (("" + day).length == 1) {
        day = "0" + day;
    }
    var getDate = year + "-" + month + "-" + day;
    $("#searchdate").val(getDate);


  
    
    function chartDraw(){
        
        // 그려진 그래프 삭제하고 새로운 영역 설정
        d3.select("svg").remove();
        var svg = d3.select('#chartArea')
                .append("svg").attr("width",
                        "1200").attr("height",
                        "500"), inner = svg
                .append("g");
        
        var svg = d3.select("svg"), margin = {
            top : 20,
            right : 80,
            bottom : 60,
            left : 50
        }, width = svg.attr("width") - margin.left - margin.right, 
            height = svg.attr("height") - margin.top - margin.bottom, 
            g = svg.append("g").attr("transform",   "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleTime().range([ 0, width ]), 
            y = d3.scaleLinear().range([ height, 0 ]), 
            z = d3.scaleOrdinal(d3.schemeCategory10);

        var line = d3.line().curve(d3.curveBasis)
                     .x(function(d) { return x(d.times); })
                     .y(function(d) { return y(d.solar_value);
        });

        

        // d3.json('/pm25/chart/2017-06-15',function(error,data){$('#msg').text(data.map(function(d){return d.PM25_TIME}))})
        d3.json('/solar/chart/'+$('#searchdate').val(), function(error, solar_result) {
            
            if (error) throw error;
            
            // json 에서 keys를 뽑아 id로 사용
            var solar_name = Object.keys(solar_title);
            
            // 3개의 그래프를 그리기 위한 데이터 구조 생성
            var solar_d3_data = solar_name.map(function(id) {
                // $('#msg').text($('#msg').text()+":"+pm25_title[id] )
                
                 return {
                      id: id,
                      title:solar_title[id],
                      values: solar_result.map(function(d) {
                          return {times:d.solar_time, solar_value: d[id]};
                      })
                 };
                
            });
            
            // $('#msg').text(d3.extent(pmdata,function(d) { return d.PM25_TIME }))
              
            // x 축에 표시할 데이터
            x.domain(d3.extent(solar_result, function(d) { return d.solar_time}));

            // y 축 최소값과 최대값 지정
//          y.domain(d3.extent(pmdata, function(d) { return d.PM25_01 }))

          y.domain([
            d3.min(solar_d3_data, function(c) { return d3.min(c.values, function(d) { return d.solar_value; }); }),
            d3.max(solar_d3_data, function(c) { return d3.max(c.values, function(d) { return d.solar_value; }); })
          ])
          z.domain(solar_d3_data.map(function(c) { return c.id; }));

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform","translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(function(d){
                    var date = new Date(d)
                    var hours = date.getHours();
                    hours = ((""+hours).length) < 2 ? "0" + hours : ""+hours
                    var minute = date.getMinutes();
                    minute = ((""+minute).length) < 2  ? "0" + minute : ""+minute
                    return hours +':'+ minute;
                }));
            
            svg.append("text")             
                      .attr("transform",
                            "translate(" + (width/2) + " ," + 
                                           (height + margin.top + 50) + ")")
                      .style("text-anchor", "middle")
                      .style("font","15px Gulim")
                      .text("측정시각");

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                
            svg.append("text")
                    .attr("transform",
                            "rotate(-90) translate(-150," + (20) + ")")
                    .attr("y", 6)
                    .style("font","15px sans-serif")
                    .text("발전량");

            var solarView = g.selectAll(".solar")
                        .data(solar_d3_data).enter().append("g")
                        .attr("class", "solar");

            solarView.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) {return line(d.values)})
                    .style("stroke", function(d) {return z(d.id)});
            
            solarView.append("text")
            .datum(function(d) { return {id: d.id,title:d.title, value: d.values[d.values.length - 1]}; })
            .attr("transform",function(d) {return "translate(" + x(d.value.times) + "," + y(d.value.solar_value) + ")"})
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font","12px sans-serif")
                .text(function(d) { return d.title});
            
        });
    }
    
    $("#searchBtn").click(function () {
        // 차트 다시 그리기
        chartDraw();
    });

    $("input[type='checkbox']").click(function () {
        
        let id = $(this).attr('id');
        
        if (id == 'solar_value') {
            if ($('#solar_value').is(":checked")){
                solar_title.solar_value = '발전량';
            }else{
                delete solar_title.solar_value;
            }
 
        }
      
    
        $("#searchBtn").click()
    })
    
    // 최초 차트 레이아웃 그리기
    $("#searchBtn").click()
})