//Provides save functionality
  $('#save').click(function(){
    $.ajax({
      url:'/save',
      method:"POST",
      dataType: 'json',
      data: $('#create').serialize(),
      success:function(data){
        console.log(data["success"]);
        //Makes save notification visible
        $('#savedNotification').attr('style', "display: inherit !important");
      }
    }); 
  });

//Provides load functionality to all the fields in the form
  $('#load').click(function(){
    $.ajax({
      url:'/load',
      method:"POST",
      dataType:"json",
      success:function(data){
        var json = data;
        $('#ClassName').val(json["ClassName"]);
        $('#CourseNumber').val(json["CourseNumber"]);
        $('#sectionNumber').val(json["sectionNumber"]);
        $('#department').val(json["department"]); 
        $('#classroom').val(json["classroom"]);
        $('#classrangeone').val(json["classrangeone"]);  
        $('#classrangetwo').val(json["classrangetwo"]);  
        $('#strt_time').val(json["startTime"]);
        $('#end_time').val(json["endTime"]);
         
        if(json.days === undefined){
          json.days = "";
        }

        for(var i = 0; i < json.days.length; i++){
          if(json["days"][i] === "Monday"){
            $("#MondayCheck").prop('checked', true);
          }else if(json["days"][i] === "Tuesday"){
            $("#TuesdayCheck").prop('checked', true);
          }else if(json["days"][i] === "Wednesday"){
            $("#WednesdayCheck").prop('checked', true);  
          }else if(json["days"][i] === "Thursday"){
            $("#ThursdayCheck").prop('checked', true);
          }else if(json["days"][i] === "Friday"){
            $("#FridayCheck").prop('checked', true);
          }
        }
         
        $(":radio[value=" + json["terms"] + "]").prop("checked", true);
         
        $('#holidays').val(json["holidays"]);
        $('#year').val(json["year"]);
         
        $('#InstructorName').val(json["InstructorName"]);
        $('#OfficeLocation').val(json["OfficeLocation"]);
        $('#Phone').val(json["Phone"]);
        $('#Email').val(json["Email"]);
        $('#WebAddress').val(json["WebAddress"]);
                  
        if(json.name  === undefined){
          json.name = "";
        }

        $(".addr").remove();
        if(json.name.length > 0 && $('#addr').length >= 0 && $.isArray(json.name)){    
          for(var j = 0; j < json.name.length; j++){
            $('#tab_logic').append("'<tr class = 'addr'><td><input name='name' type='text' placeholder='First Last' class='form-control input-md'  value = " + json['name'][j] + "> </td><td><input  name='office' type='text' placeholder='Hamilton 100'  class='form-control input-md' value = " + json['office'][j] + "></td><td><input  name='hours' type='text' placeholder='MW: 1-3 pm, F: 4-5 pm'  class='form-control input-md' value = " + json['hours'][j] + "></td><td><input  name='email' type='text' placeholder='someemail@gmail.com'  class='form-control input-md' value = " + json['email'][j] + "></td></tr>'");
          }
        }else if (!$.isArray(json.name)){
          $('#tab_logic').append("'<tr class = 'addr'><td><input name='name' type='text' placeholder='First Last' class='form-control input-md'  value = " + json['name'] + "> </td><td><input  name='office' type='text' placeholder='Hamilton 100'  class='form-control input-md' value = " + json['office'] + "></td><td><input  name='hours' type='text' placeholder='MW: 1-3 pm, F: 4-5 pm'  class='form-control input-md' value = " + json['hours'] + "></td><td><input  name='email' type='text' placeholder='someemail@gmail.com'  class='form-control input-md' value = " + json['email'] + "></td></tr>'");
        } 
          
        if(json.category === undefined){
          json.category = "";
        }

        $(".grade_addr").remove();
        $(".grade_addr_two").remove();
        if(json.category.length > 0 && $.isArray(json.category)){
          for(var y = 0; y < json.category.length; y++){
            console.log(json['gradingInfo'][y]);
            $('#tab_logic_two').append("'<tr class='grade_addr'><td><input type='text' name='category'  placeholder='Category' class='form-control' value = " + json['category'][y] + "></td><td><input type='text' name='weight' placeholder='Weight' class='form-control' value = " + json['weight'][y] + "></td></tr> <tr class='grade_addr_two'><td colspan = '2'><textarea class='form-control' rows='4' name='gradingInfo' placeholder='Additional Course Requirements and Policies'>" + json['gradingInfo'][y] + "</textarea></td></tr>'");
          }
        }else{
          $('#tab_logic_two').append("'<tr class='grade_addr'><td><input type='text' name='category'  placeholder='Category' class='form-control' value = " + json['category'] + "></td><td><input type='text' name='weight' placeholder='Weight' class='form-control' value = " + json['weight'] + "></td></tr> <tr class='grade_addr_two'><td colspan = '2'><textarea class='form-control' rows='4' name='gradingInfo' placeholder='Additional Course Requirements and Policies'>" + json['gradingInfo'] + "</textarea></td></tr>'");
        }
          $('#disclaimer').val(json["disclaimer"]);
          
        if(json["disclaimer"] === "standard"){
          $('#disclaimer').prop('checked', true);
        }
                  
        $('#customDisclaimer').val(json["customDisclaimer"]);
        $('#targetAudience').val(json["targetAudience"]);
        $('#coursePrereq').val(json["coursePrereq"]);
        $('#goalObjective').val(json["goalObjective"]);
        $('#requirements').val(json["requirements"]);
        $('#grading').val(json["grading"]);
        $('#examDates').val(json["examDates"]);
        $('#policies').val(json["policies"]);
        $('#resources').val(json["resources"]);
        $('#honorCode').val(json["honorCode"]);
        $('#change').val(json["change"]);
        $('#additional').val(json["additional"]);
         
      }
    });
  });

