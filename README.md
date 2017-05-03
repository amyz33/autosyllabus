CHANGE LOG 

-------Mar 14--------

Updated master branch, to deploy use nodejs-persistant template. Import JSON/YAML. 


-------Feb 26--------
The mondo-db.js node file is now persistant available. It will work with mongodb
on your localhost, but you need to setup mongodb on your localhost in order
to get it working. 

Steps to take:

1. Install mongodb on your computer 

2. Run ./pathtoMongo/bin/mongod  this will cause mongodb to start

3. Next we need to add a user. The hardcoded username is "sampledb", and
password is "password". Run: ./pathtoMongo/bin/mongo to start the mongo shell. 

4. Once in the mongo shell, type "use sampledb" to switch to sampledb database

5. Google the syntax to create a user. Add "sampledb" as user and "password"
as password. 

db.createUser( { user: "sampledb",
                 pwd: "password",
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } )

6. Now you are good to go. Fortunately the deployment server and mongo-db.js 
has all of the usernames, and credentials hardcoded as an environment variable. 


