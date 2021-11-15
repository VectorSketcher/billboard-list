## datasite-code-test
small code test
##### Made With
1. Typescript (4.4.4)
2. Node.js (14)
3. Express (4.17.1)
4. Docker
5. Swagger Docs
6. Mocha/Chai Testing
### I. Prerequisites
1. Node 14 or later installed
2. [ESLint](https://eslint.org/)
3. [Typescript 4](https://www.typescriptlang.org/docs/) 
4. [Docker](https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/)

### II. Few Ways to Get Running
#### running endpoint 
1. clone project ' git clone https://github.com/VectorSketcher/datasite-code-test.git ' , cd into cloned project
2. npm install dependencies ' npm install '
3. 'npm run build', makes sure things are built
4. 'npm start', starts project
5. swagger doc can be viewed at http://localhost:2000/api-docs/
    1. A 'GET' call will be visible in the swagger doc
    2. If swagger doc is collapsed, click the blue header to open it
    3. Click the 'Try it Out' button
    4. Click 'Execute' button to see results returned 
6. can also be access through Postman using: GET http://localhost:2000/getusers
#### running endpoint with docker 
1. clone project, cd into cloned project, npm install dependencies
1. make sure docker is installed instructions found here: https://hub.docker.com/
2. build image first, run this **" docker build --tag { name your image } . "**
3. you can find image, **" docker image ls"**
4. run your docker container, **" docker run --publish 2000:2000 { name of your image } "**
5. view swagger doc at http://localhost:2000/api-docs/ 
4. ctrl c to stop container or through docker desktop

###Running Tests
Just has one small test, tests to make sure the response returns a '200'
1. in order to run test use this command, **" npm run test "**

