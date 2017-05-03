

var express = require('express');
var officegen = require('officegen');
var findRemove = require('find-remove');
var bodyParser = require('body-parser');
var jade = require('jade');
var fs = require('fs');
var calendar = require('./assets/js-css/js/main.js');

database = require('./mongo-db.js');
    //Call function to setup mongoDB 
database.setupMongoDB();

//mongo-db.js has two function calls associated with it. 
//setupMonDB and insert(json, collection)

var app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var middleware = {
  requireAuthentication: function (req, res, next) {
    console.log('private route hit');
    next();
  },
  logger: function (req, res, next) {
    console.log(req.method + ' '+ req.originalUrl + ' ' + new Date().toString());
    next();
  }
}


app.use(middleware.logger);
//direct's server to static files
app.use(express.static(__dirname + "/assets"));

//top level middleware calls to parse the form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//allows for the reading of jade files
app.set('views', __dirname + '/assets/views');
app.set('view engine', 'jade');
app.listen(port, ip, function(){
  console.log('server started at ' +  port);
});


//express post call to handle form data and document creation on server
app.post('/form', function(req, res){
    
    var docx = officegen ( {
      type: 'docx',
      orientation: 'portrait'
    } );
    var fileName = req.body.department+req.body.CourseNumber+'-syllabus'+'.docx';  //gets the file name from request body based on the department and course #
    //logging functions
    
    docx.on ( 'error', function ( err ) {
        console.log ( err );
    });

    //var classDateRange = req.body.classrange.split(",");
    var holidays = req.body.holidays.split(",");
    var examDates = req.body.examDates.split(",");


    //Document creation
    var pObj = docx.createP ();

    //Title and intro information
    pObj.options.align = 'center';

    if(req.body.ClassName.length != 0){
        pObj.addText (req.body.ClassName, {bold: true, font_size: 16});
        pObj.addLineBreak();
    }

    if(req.body.department.length != 0){
        pObj.addText (req.body.department + ' ' + req.body.CourseNumber + ', Section ' + req.body.sectionNumber);
        pObj.addLineBreak();
    }
    //TODO -- Days that Course meets goes here

    var dayString = "";
    //if undefined, donot add the days
    if(req.body.days === undefined){
    }else{
        for(var i = 0; i < req.body.days.length; i++){
            if(req.body.days[i] === "Monday"){
                dayString = dayString + "M";
            }else if(req.body.days[i] === "Tuesday"){
                dayString = dayString + "T";
            }else if(req.body.days[i] === "Wednesday"){
                dayString = dayString + "W";
            }else if(req.body.days[i] === "Thursday"){
                dayString = dayString + "TR";
            }else if(req.body.days[i] === "Friday"){
                dayString = dayString + "F";
            }
        }
    }

    //Adding start and end time to document
    if(req.body.startTime.length != 0 || req.body.endTime.length != 0){
        pObj.addText( dayString + ', ' +req.body.startTime + ' to ' + req.body.endTime);
        pObj.addLineBreak();
    }

    //Adding term to document
    if(req.body.terms != undefined){
        if(req.body.terms === 'Summer_1'){
            pObj.addText( 'Summer 1 ' + req.body.year );
            pObj.addLineBreak();
        }
        else if(req.body.terms === "Summer_2"){
            pObj.addText( 'Summer 2 ' + req.body.year );
            pObj.addLineBreak();
        }
        else{
            pObj.addText( req.body.terms + ' ' + req.body.year );
            pObj.addLineBreak();
        }

    }

    //Adding classroom to document
    if(req.body.classroom.length != 0){
        pObj.addText( req.body.classroom );
        pObj.addLineBreak();
    }

    var pObj_instructors = docx.createP ();

    //Instructor information
    if(req.body.InstructorName.length != 0){
        pObj_instructors.addText('INSTRUCTOR', {bold: true, font_size: 12, underline: true});
        pObj_instructors.addLineBreak();
        pObj_instructors.addText(req.body.InstructorName);
    }

    if(req.body.OfficeLocation.length != 0){
        var list = docx.createListOfDots();
        list.addText(req.body.OfficeLocation);
    }

    if(req.body.Phone.length != 0){
        var list = docx.createListOfDots();
        list.addText(req.body.Phone);
    }

    if(req.body.Email.length != 0){
        var list = docx.createListOfDots();
        list.addText(req.body.Email);
    }

    if(req.body.WebAddress.length != 0){
        var list = docx.createListOfDots();
        list.addText(req.body.WebAddress);
    }

    //TA information
    pObj_taInfo = docx.createP ();

    if(req.body.name.length != 0){
        pObj_taInfo.addText('TA Information', {bold: true, font_size: 12, underline: true});

        if(typeof req.body.name != "string"){
            for(var k = 0; k < req.body.name.length; k++){
                var pObj_instructors = docx.createP ();
                if(req.body.name[k].length != 0){
                    pObj_instructors.addText(req.body.name[k]);
                }
                if(req.body.office[k].length != 0){
                    var list = docx.createListOfDots();
                    list.addText('Office: ' + req.body.office[k]);
                }
                if(req.body.hours[k].length != 0){
                    var list = docx.createListOfDots();
                    list.addText('Hours: ' + req.body.hours[k]);
                }
                if(req.body.email[k].length != 0){
                    var list = docx.createListOfDots();
                    list.addText('Email: ' + req.body.email[k]);
                }
            }
        }
        else{
            var pObj_instructors = docx.createP ();
            if(req.body.name.length != 0){
                pObj_instructors.addText(req.body.name);
            }
            if(req.body.office.length != 0){
                var list = docx.createListOfDots();
                list.addText('Office: ' + req.body.office);
            }
            if(req.body.hours.length != 0){
                var list = docx.createListOfDots();
                list.addText('Hours: ' + req.body.hours);
            }
            if(req.body.email.length != 0){
                var list = docx.createListOfDots();
                list.addText('Email: ' + req.body.email);
            }
        }
    }

    //Other class Information
    var pObj_ClassInfo = docx.createP ();

    //Adding Target Audience 
    if(req.body.targetAudience.length != 0){
        pObj_ClassInfo.addText('Target Audience', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.targetAudience);
    }

    //Adding Course Prereq 
    if(req.body.coursePrereq != 0){
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText('Course Prerequisites', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.coursePrereq);
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
    }

    //Adding Course Goals and Objectives
    if(req.body.goalObjective != 0){
        pObj_ClassInfo.addText('Goals and Objectives', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.goalObjective);
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
    }

    //Adding Grading Distribution
    if(req.body.category.length != 0){
        pObj_ClassInfo.addText('Grading', {bold: true, font_size: 12});

        if(typeof req.body.category != "string"){
            for(var i = 0; i < req.body.category.length; i++){
                var grading_distribution = docx.createP ();
                if(req.body.category[i].length != 0 || req.body.weight[i].length != 0){
                    grading_distribution.addText(req.body.category[i] + ": " + req.body.weight[i]);
                }
                if(req.body.gradingInfo[i].length != 0){
                    var list = docx.createListOfDots();
                    list.addText(req.body.gradingInfo[i]);
                }
            }
        }
        else{
            var grading_distribution = docx.createP ();
            if(req.body.category.length != 0 || req.body.weight.length != 0){
                grading_distribution.addText(req.body.category + ": " + req.body.weight);
            }
            if(req.body.gradingInfo.length != 0){
                var list = docx.createListOfDots();
                list.addText(req.body.gradingInfo);
            }
        }
    }

    var pObj_ClassInfo = docx.createP ();

    //Adding Class Policies
    if(req.body.policies.length != 0){
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText('Exam Policies', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.policies);
    }

    //Adding Resources
    if(req.body.resources.length != 0){
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText('Resources', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.resources);
    }

    //Adding Honor Code
    if(req.body.honorCode.length != 0){
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText('Honor Code', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.honorCode);
    }

    //Adding Disclaimer 
    if(typeof req.body.disclaimer != 'undefined' || req.body.customDisclaimer.length != 0){
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText('Syllabus Change Disclaimer', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
    

        //if the checkbox isnt checked to include a custom disclaimer
        if(typeof req.body.disclaimer === 'undefined'){
            pObj_ClassInfo.addText(req.body.customDisclaimer);
        }else{
            pObj_ClassInfo.addText("The professor reserves the right to make changes to the syllabus, including project due dates and test dates. If such changes are necessary, they will be announced as early as possible.");
        }
    }

    //Adding Additional Information 
    if(req.body.additional.length != 0){
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText('Additional Information', {bold: true, font_size: 12});
        pObj_ClassInfo.addLineBreak();
        pObj_ClassInfo.addText(req.body.additional);
        pObj_ClassInfo.addLineBreak();
    }
    
    //Table variable
    var table = [
            [{
                val: "Schedule",
                opts: {
                    //cellColWidth: 4261,
                    b:true,
                    sz: '24',
                    fontFamily: "Times New Roman",
                    align: "center"
                }
            },{
                val: "Topic",
                opts: {
                    b:true,
                    sz: '24',
                    fontFamily: "Times New Roman",
                    align: "center"
                }
            },{
                val: "Assignment",
                opts: {
                    b:true,
                    sz: '24',
                    fontFamily: "Times New Roman",
                    align: "center"
                }
            }]    
        ];
    //For loop to add date entries to table

    

    if(req.body.days != null){

         var final = calendar.formatDate(new Date(Date.parse(req.body.finalExam)), holidays, examDates); 

         var dates = calendar.produceDates(req.body.classrangeone, req.body.classrangetwo, req.body.days);
    
    
        for(var i = 0; i < dates.length; i++){
            dates[i] = calendar.formatDate(dates[i], holidays, examDates);
        }
        for(var k = 0; k < dates.length; k++){
            var entry;
            if(dates[k]["holiday"] === true){
                //If the date is a holiday or a day with no class
                entry = [dates[k]["dayOfWeek"] + ', ' + dates[k]["month"] + '/' + dates[k]["day"] + '/' + dates[k]["year"], '', 'NO CLASS'];
            }else if(dates[k]["exam"] === true){
                //If the date is an exam date
                entry = [dates[k]["dayOfWeek"] + ', ' + dates[k]["month"] + '/' + dates[k]["day"] + '/' + dates[k]["year"], '', 'EXAM'];
            }else{
                //If the date is not a holiday
                entry = [dates[k]["dayOfWeek"] + ', ' + dates[k]["month"] + '/' + dates[k]["day"] + '/' + dates[k]["year"], '', ''];
            }
            table.push(entry);
        }
        table.push([final["dayOfWeek"] + ', ' + final["month"] + '/' + final["day"] + '/' + final["year"], '' , 'FINAL EXAM, ' + req.body.finalTime]);
    }
    

    //For table style options
    var tableStyle = {
            tableColWidth: 4261,
            tableSize: 24,
            //tableColor: "ada",
            tableAlign: "center",
            tableFontFamily: "Times New Roman",
            borders: true
    };
    //creates the table
    var pObj = docx.createTable (table, tableStyle);

    //remove's old files on server before creating a new one
    var result = findRemove('/assets/tmp', {extensions : ['.docx'], age : {seconds : 60}});

    //Creation of document and writing to tmp file on server
    var out = fs.createWriteStream('assets/tmp/'+fileName);

    out.on('close', function () {
       console.log( "Done" );
    });

    var file = '/tmp/'+fileName;

    //creates word document
    docx.generate( out );
    
    //render's the jade template to create a new html document with the href link to the word doc
    res.render('download', {path : '<p><a href = \"' + file + '\"">Click here to download your new Syllabus</a></p>'});
  
});

app.post('/save', function(req, res){
    //if you are on production
    if(process.env.PORT){
        req.body["_id"] = req.headers.uid;
    }else{
        req.body["_id"] = "test";
    }
    database.save(req.body, "forms");
    console.log(req.body);
    console.log("WELL THIS WORKED");
    res.json({success: 'true'});
});

app.post('/load', function(req, res){
   var json = null;
   /*calls if in production*/
   if(process.env.PORT){
        database.get(req.headers.uid, "forms", function(extractedJson){
             console.log("RETRIEVED: " + json);
            res.send(extractedJson);
        });
    }else{
        database.get("test", "forms", function(extractedJson){
             console.log("RETRIEVED: " + extractedJson.additional);
             //sends extracted JSON to page
            res.send(extractedJson);
        });
    } 
});


