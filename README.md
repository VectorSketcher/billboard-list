## billboard-list-code-test
small code test
##### Made With
1. Typescript (4.4.4)
2. Node.js (14)
3. Express (4.17.1)
4. Docker
5. Swagger Docs
6. Mocha/Chai Testing
7. Postgres DB
    1. uses https://api.elephantsql.com/ 
### I. Prerequisites
1. Node 14 or later installed
2. [ESLint](https://eslint.org/)
3. [Typescript 4](https://www.typescriptlang.org/docs/) 
4. [Docker](https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/)
    1. Only needed if you plan to run the api with docker.

### II. Few Ways to Get Running
#### running endpoint 
###### Be sure your running node 14, you can check by this command: node -v
1. clone project ' git clone https://github.com/VectorSketcher/billboard-list.git ' , cd into cloned project
2. npm install dependencies ' npm install '
3. 'npm run build', makes sure things are built
4. 'npm start', starts project
5. swagger doc can be viewed at http://localhost:2000/api-docs/
    1. A 'GET', 'PUT', 'POST' call will be visible in the swagger doc
    2. If swagger doc is collapsed, click the blue header to open it
    3. Click the 'Try it Out' button
    4. Click 'Execute' button to see results returned 
    5. The GET call has filters to filter through the data
    6. POST to add a new song if needed
    7. PUT to favorite/de-favorite songs
6. can also be access through Postman using: 
    1. GET http://localhost:2000/toponehundred
    2. POST http://localhost:2000/toponehundred
        1. Added this post so i could get data inside the db
    3. PUT http://localhost:2000/toponehundred/favorite/{id}?topOneHundredId=15
        1. (side note: there's a bug here I need to fix with the request url)
#### running endpoint with docker 
1. clone project, cd into cloned project, npm install dependencies
2. make sure docker is installed instructions found here: https://hub.docker.com/
3. make sure docker is running
4. build image first, run this **" docker build --tag { name your image } . "**
5. you can find image, **" docker image ls"**
6. run your docker container, **" docker run --publish 2000:2000 { name of your image } "**
7. view swagger doc at http://localhost:2000/api-docs/ 
8. ctrl c to stop container or through docker desktop
    1. docker desktop can be found here: https://www.docker.com/products/docker-desktop

### III. Running Tests
Just has one small test, tests to make sure the response returns a '200'
1. in order to run test use this command, **" npm run test "**
    1. side note: the unit tests have a broken one and one working, sorry about that

