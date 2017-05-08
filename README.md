# AutoSyllabus

AutoSyllabus is a Carolina CloudApps based web application for easy construction of faculty syllabi. The application includes features such as the ability to generate a table for the class schedule, adding and deleting TA and Grade distribution information, a load and save feature and several others. The generated Syllabi is formatted as a .docx document so the user can easily save the syllabus locally. 

### To setup this application for local development:
1. Clone this repo onto your local machine.
2. Install node.js: https://nodejs.org/en/download/
3. Install mongodb on your computer.
4. Run ./pathtoMongo/bin/mongod  this will cause mongodb to start (This is the main step to start the mongodb database once you have it setup. Steps 5-7 are for the initial setup of the database on your machine)
4. Next we need to add a user. The hardcoded username is "sampledb", and password is "password". Run: ./pathtoMongo/bin/mongo to start the mongo shell.
4. Once in the mongo shell, type "use sampledb" to switch to sampledb database

5. Google the syntax to create a user. Add "sampledb" as user and "password" as password. 

db.createUser( { user: "sampledb",
                 pwd: "password",
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } )
5. CD back to pathtoMongo/bin/ and use the command ./mongod to start the database         
5. To start the application locally, type in the command "node server.js" to start the server.
6. Open a web browser and go to "localhost:8080", the application should load and appear in your browser from here. 


As this is a Carolina CloudApps web application, it should be used under this platform. As such there are a few main components that need to be implemented on the Carolina CloudApps console.

### CloudApps Components:
1. MongoDB 
  * To store saved user information.
2. Node.js
  * For the general architecture and setup of the program.
3. UNC Single Sign On Proxy
  * For authentication with UNC onyen services. 
  
Further instructions on setting up the cloudapps console can be found on the Carolina CloudApps website and ITS Documentation page. 

Link to current build of CloudApps instance: https://autosyllabus.cloudapps.unc.edu
(You must be a unc student and thus have a UNC onyen to log in to the program)




