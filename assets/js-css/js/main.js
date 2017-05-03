//For main javascript function 

//Function to produce table inputs and dates
exports.produceDates = function(start, end, days){
	var i, j;
	start = Date.parse(start);
	end = Date.parse(end);

	//TODO - sanitization for date inputs; IE end date is greater than start date, correct format, etc.
	var startDate = new Date(start);
	var endDate = new Date(end);
	var current = startDate;

	//array to hold date objects for the table
	var dates = [];
	//array to hold number values corresponding to the selected days of the week
	var daysOfWeek = []

	for(i = 0; i < days.length; i++){
		if(days[i] === "Monday"){
			daysOfWeek.push(1);
		}else if(days[i] === "Tuesday"){
			daysOfWeek.push(2);
		}else if(days[i] === "Wednesday"){
			daysOfWeek.push(3);
		}else if(days[i] === "Thursday"){
			daysOfWeek.push(4);
		}else if(days[i] === "Friday"){
			daysOfWeek.push(5);
		}
	}

	while(current.valueOf() <= endDate.valueOf()){
		for(j = 0; j < daysOfWeek.length; j++){
			if(daysOfWeek[j] === current.getDay()){
				dates.push(new Date(current));
				break;
			}
		}
		//adds a new day in miliseconds to previous date	
		current.setDate(current.getDate() + 1);
	}
	return dates;
};

//Method to format dates to retrieve the appropriate information for the table
exports.formatDate = function(date, holidays, examDates){
	var formattedDate, day, holiday;
	if(date.getDay() === 1){
		day = "Monday";
	}else if(date.getDay() === 2){
		day = "Tuesday";
	}else if(date.getDay() === 3){
		day = "Wednesday";
	}else if(date.getDay() === 4){
		day = "Thursday";
	}else if(date.getDay() === 5){
		day = "Friday";
	}
	
	for(var k = 0; k < holidays.length; k++){
		holidays[k] = new Date(Date.parse(holidays[k]));
		if(date.valueOf() === holidays[k].valueOf()){
			formattedDate = {dayOfWeek:day, year: date.getFullYear(), month: (date.getMonth()+1), day: date.getDate(), holiday: true, exam: false};
			return formattedDate;
		}
	}
	for(var k = 0; k < examDates.length; k++){
		examDates[k] = new Date(Date.parse(examDates[k]));
		if(date.valueOf() === examDates[k].valueOf()){
			formattedDate = {dayOfWeek:day, year: date.getFullYear(), month: (date.getMonth()+1), day: date.getDate(), holiday: false, exam: true};
			return formattedDate;
		}
	}


	formattedDate = {dayOfWeek:day, year: date.getFullYear(), month: (date.getMonth()+1), day: date.getDate(), holiday: false, exam: false};
	return formattedDate
};

