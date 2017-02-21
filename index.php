<html>
 <head>
   <title>PHP Test</title>
 </head>
 <body>
 	result
   <?php echo $_POST["input"]; ?>
   <?php 
   		$command = escapeshellcmd('testingPythonDocX.py');
   		$output = shell_exec($command);
   		echo $output;
   ?>
 </body>
</html>
