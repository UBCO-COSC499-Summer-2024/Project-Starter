# Backend Setup

## src
The src folder contains index.js, server.js, and database.js

### Index.js
Index.js is a server.js wrapper that controls when Docker is quit to provide a 'graceful' shutdown. This has not been changed by me. It came with the awesome-compose template I chose.

### Server.js
Server.js is our webserver. It handles routing through some basic routes like '/'. This is the base directory ex. 'http://localhost', where you will find a basic message to show that the server is running.
Aside from these basic routes, it uses the Express Router to offload some of our backend routing to authRoutes.js and userRoutes.js in our 'routes' folder. These handle the routing for user information and authentication.

### Database.js
Database.js is just a simple database connection that will connect to the PostgreSQL database at port 5432.

## routes

### authRoutes.js
authRoutes.js contains the routing for authentication. It is set to a base of 'http://localhost/api/auth', and then the routes in the authRoutes.js file will add onto that. For example: 'http://localhost/api/auth/authenticate/token' will run the authenticate function with whatever token is passed in for the last part of that URL.

### userRoutes.js
userRoutes.js contains the routing for user data (grades, courses, exams, etc.). It is set to a bse of 'http://localhost/api/users', and then the routes in the userRoutes file will add onto that. For example: 'http://localhost/api/users/courses/id' will fetch the data for the user whose ID is provided in the last part of that URL.

## controllers
The controllers store all of the functions that get called by the routes. So when you go to 'http://localhost/api/users/courses/1', the route uses a function from the userController.js to fetch the data for the courses that user 1 is enrolled in. This then gets returned first by the function, then by the route, to deliver the data to whatever has used a fetch on this URL. You can also navigate to this and see it work if you go to the URL with the backend and database running.
 
### Docker Stuff

If this was your Node.js app, to start local development you would:

 - Running `docker-compose up` is all you need. It will:
 - Build custom local image enabled for development (nodemon, `NODE_ENV=development`).
 - Start container from that image with ports 80 and 9229 open (on localhost).
 - Starts with `nodemon` to restart node on file change in host pwd.
 - Mounts the pwd to the app dir in container.
 - If you need other services like databases, just add to compose file and they'll be added to the custom Docker network for this app on `up`.
 - Compose should detect if you need to rebuild due to changed package.json or Dockerfile, but `docker-compose build` works for manually building.
 - Be sure to use `docker-compose down` to cleanup after your done dev'ing.

If you wanted to add a package while docker compose was running your app:
 - `docker-compose exec node npm install --save <package name>`
 - This installs it inside the running container.
 - Nodemon will detect the change and restart.
 - `--save` will add it to the package.json for next `docker-compose build`

To execute the unit-tests, you would:
 - Execute `docker-compose exec node npm test`, It will:
 - Run a process `npm test` in the container node.
 - You can use the *vscode* to debug unit-tests with config `Docker Test (Attach 9230 --inspect)`, It will:
   - Start a debugging process in the container and wait-for-debugger, this is done by *vscode tasks*
   - It will also kill previous debugging process if existing.

### Other Resources

 - https://blog.hasura.io/an-exhaustive-guide-to-writing-dockerfiles-for-node-js-web-apps-bbee6bd2f3c4

MIT License, 

Copyright (c) 2015-2018 Bret Fisher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
