module.exports=(app, iotDTO)=>{
	
	
	
	/*
	 * 아두이노에서 서버에 데이터 insert 요청 solar_no : String, solar_date : String,
	 * solar_time : String, solar_value : Number, PM25_10 : Number, PM25_25 :
	 * Number
	 */
	app.get("/solar/:solar_no/:solar_weather/:solar_day/:solar_date/:solar_time/:solar_value",(req,res)=>{
		
		var solar_value = parseInt(req.params.solar_value)
	
		
		// req 로 부터 접속자 IP 주소를 가져온다
		var req_ip = req.headers['x-forwarded-for']
					|| req.connection.remoteAddress || req.socket.remoteAddress
					|| req.connection.socket.remoteAddress;

		
		if(solar_value >= 0 ) {
			var vo = new iotDTO(req.params);
			vo.save(function(err,data){
				res.status(200);
				res.send('ok');
			});
		}
	});
		
	
	
	    
	

	
	app.get("/solar/:solar_no/:solar_weather/:solar_day/:solar_date/:solar_time/:solar_value",(req,res)=>{
		
		// 빈 vo 객체 생성
	
		let vo =new iotDTO(req.params)
		
		vo.solar_no = req.params.solar_no;
		vo.solar_weather = req.params.solar_weather;
		vo.solar_day = req.params.solar_day;
		
		
		vo.solar_date= req.params.solar_date;
		vo.solar_time= req.params.solar_time;
		vo.solar_value= req.params.solar_value;
		
		vo.save((err,data)=>{
		
				res.json(vo);
		})
		
		
		
// let vo = new iotDTO(req.params);
// vo.save();
		
	})
	

  

	
	
	
	
	

	


	
	
app.get("/solar/solarlist",(req,res)=>{
	     res.render("list");
 });
	    
	    // 라인 그래프
 app.get('/solar/linechart',(req,res)=>{
	   res.render('line_chart')
 })

	
	
	
 
 
	
	 app.get('/solar/chart/:getDate',(req,res)=>{
	    	var searchdate = req.params.getDate; // ajax에서 넘긴 데이터는 query로 받는다
	    	
	    	iotDTO.find({solar_date:searchdate})
	    	.exec((err,data)=>{
	    		
	    			/**
					 * javaScript의 filter Method를 이용해서 1분 단위로 데이터를 필터링한다.
					 */
	    			var oldTime = '';
	    			var newData = data.filter(function(item){
	    				var newTime =  item.solar_time.substring(0,2)+item.solar_time.substring(3,4)
	    				console.log(newTime)
	    				if(oldTime != newTime) {
	    					oldTime = newTime;
	    					item.solar_time = new Date(item.solar_date +' ' + item.solar_time).getTime()
	    					console.log(new Date('시간값'+item.solar_time))
	    					
// item.solar_time = item.solar_time
	    					return item;	
	    				}
	    				
	    			});  
// console.log(newArr);
// var a1 = [1, 2, 3, 4, 5, 6]
// newData.slice(3).map(function(id){console.log(id)})
	    			res.json(newData)
	    		
	    	})
	    })
 
 
 
	
	
	
	  app.post("/solar/getlist",(req,res)=>{
	    	
	    	console.log(req.body.getDate);
	    	var searchdate = req.body.getDate; // ajax에서 넘긴 데이터는 query로 받는다
	        iotDTO
	                .find({solar_date:searchdate})
	                .sort({solar_date:-1})
	                .sort({solar_time:-1})
	                .exec(function(err,data){
	        			var oldTime = '';
	        			var newData = data.filter(function(item){
	        				if(oldTime != item.solar_time.substring(0,5)) {
	        					console.log(oldTime)
	        					oldTime = item.solar_time.substring(0,5);
	        					return item;	
	        				}
	        			});  

	                	
	                	res.render("listbody",{list:newData,title:"/solar/list"});
	                });
	    });
	
	
	
	
 app.get("/solar/dashboard",(req,res)=>{
     res.render("dashboard");
     
 	
 	
});
 
 
	

	app.get("/solar/getlast",(req,res)=>{

		Date.prototype.yyyymmdd = function(){
		    var yyyy = this.getFullYear().toString();
		    var mm = (this.getMonth() + 1).toString();
		    var dd = this.getDate().toString();
		    return yyyy +"-"+(mm[1] ? mm : '0'+mm[0])+"-"+(dd[1] ? dd : '0'+dd[0]);
		};
		 
		var nowDate = (new Date).yyyymmdd();
		console.log(nowDate);

				// nowDate = '2017-06-15'
				// iotDTO.find({solar_date:nowDate})

		// 가장 마지막에 insert된 데이터 1개만 find()
		iotDTO.findOne()
			.sort({solar_date:-1})
			.sort({solar_time: -1})
		
			.exec((err,data)=>{
				res.json(data);
			});
	})

	
	
	

	
app.post("/solar/getlast",(req,res)=>{
		iotDTO.findOne()
		.sort({solar_date:-1})
		.sort({solar_time: -1})
		.exec((err,data)=>{
			res.status(200);
			res.json(data);
	});
})



//
//	app.get("/solar/allist",(req,res)=>{
//		iotDTO.find((err,data)=>{
//		res.json(data);
//		console.log(req.body.getDate);
//	})
//})
	
	




//app.get('/solar/getControl',(req,res)=>{
//	
//	
//	if(string == 'on'){
//		res.send('LED_OFF');
//	}
//	
//	else if(string == 'off'){
//		res.send('LED_OFF');
//	}
//	else {
//		res.send('error');
//	}
// })








/*
$(document).ready(function() {
  $('#LED_ON').click(function() {
    $('#dictionary').load("load.html");
    return false;
  });
});
*/
/*

app.get('/solar/getControl',(req,res)=>{
	
	

	$(document).ready(function() {
	  $('#LED_ON').click(function() {
		  res.send('LED_ON');
	    return false;
	  });
	});
	
	
	$(document).ready(function() {
		  $('#LED_OFF').click(function() {
			  res.send('LED_OFF');
		    return false;
		  });
		});
		
	
 })

*/



	
	
	app.get('/solar/getControl',(req,res)=>{
		
		//res.send('LED_OFF');
		
	})
	 
	
}