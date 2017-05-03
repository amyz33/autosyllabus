
           //bootstrap date selector
             $(function() {
                 var i = 1;
                 $("#add_row").click(function() {
                     

                     $('#tab_logic').append("'<tr class = 'addr'><td><input name='name' type='text' placeholder='First Last' class='form-control input-md'  /> </td><td><input  name='office' type='text' placeholder='Hamilton 100'  class='form-control input-md'></td><td><input  name='hours' type='text' placeholder='MW: 1-3 pm, F: 4-5 pm'  class='form-control input-md'></td><td><input  name='email' type='text' placeholder='someemail@gmail.com'  class='form-control input-md'></td></tr>'");
                 });
                 $("#delete_row").click(function() {
                     $('#tab_logic tbody tr:last').remove();
                 });

                 $("#add_grade_row").click(function() {
                     $('#tab_logic_two').append("'<tr class='grade_addr'><td><input type='text' name='category'  placeholder='Category (e.g. Tests)' class='form-control'/></td><td><input type='text' name='weight' placeholder='Weight (e.g. 90%)' class='form-control'/></td></tr><tr><td colspan = '2'><textarea class='form-control' rows='4' name='gradingInfo' placeholder='Additional Course Requirements and Policies' id='gradingInfo'></textarea></td></tr>'");});

                 $("#delete_grade_row").click(function() {
                     $('#tab_logic_two tbody tr:last').remove();
                     $('#tab_logic_two tbody tr:last').remove();
                 });


                 $('#datetimepicker1').datepicker({
                     multidate: false
                 });

                 $('#datetimepicker2').datepicker({
                     multidate: true
                 });

                 $('#datetimepicker3').datetimepicker({
                     format: 'LT'
                 });

                 $('#datetimepicker4').datetimepicker({
                     format: 'LT'
                 });

                 $('#datetimepicker5').datepicker({
                     multidate: true
                 });
                 $('#datetimepicker6').datepicker({
                     multidate: false
                 });
                 $('#datetimepicker7').datepicker({
                     multidate: false
                 });
                 $('#datetimepicker8').datetimepicker({
                     format: 'LT'
                 });
             });