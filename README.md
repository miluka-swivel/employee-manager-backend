# An express js project that exposes APIs to manage employees.
The APIs adhere to Rest architecture and it expposes rest API endpoints.
The employee data is managed in MongoDB Atlas cloud cluster.

**Configurations**  
For application to work accordingly, a mongo db cluster should be created. 
Please follow bellow links instructions if you are not familiar with MongoDB clusters.

https://www.mongodb.com/docs/guides/atlas/cluster/
https://www.mongodb.com/resources/products/fundamentals/mongodb-cluster-setup

In additon below configuration changes should be done.  
* **PORT** - Port that needs to be use to run the application. Very useful when local development and debugging.   
* **MONGO_URL** - MongoDB Atlas connection string that connects to APIs to the MongoDB.  
            eg:- "mongodb+srv://{USER_NAME}:{PASSWORD}@{CLUSTER}.dmypze3.mongodb.net/{COLLECTION_NAME}"  
* **MONGO_COLLECTION_NAME** - MongoDB cluster collection name which stores employee data.  
* **ALLOWED_CORS_URL** - Url that allows to access APIs from outside of the hosted application. Usually front-end application.  
* **SWAGGER_SERVER_URL** - Url where express APIs can be found which is used for swagger document.
                      eg:- "http://localhost:{PORT}/api"  


**How to start the application in development environment**  
After following the steps and setting up configurations use
```
npm install
npm run dev
```
These commands will install relevant modules and get the application to running state on local machine.

## Deploy on Vercel

The easiest way to deploy your Express.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Express.js deployment documentation](https://vercel.com/guides/using-express-with-vercel) for more details.
