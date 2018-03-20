var mongoose = require('mongoose');
mongoose.Promise= global.Promise;

var iotVO = mongoose.Schema({
	

	solar_no : String,
	solar_weather: String,
	solar_day: String,
	
	solar_date : String,
	solar_time : String,
	solar_value : Number
	
})

iotVO.statics.create = (vo)=>{
	let v= new this(vo);	//this = iotVO 와 같다
	return v.save();
}

module.exports = mongoose.model('iotData',iotVO);