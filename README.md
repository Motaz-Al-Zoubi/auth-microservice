# Authentication Microservice

## Running locally
- Copy `.env-example` to `.env` and set the needed env variables.
- Run `npm run docker`wait until the docker build process let you inside the container
- Run the test cases `npm run test`
- Run the test coverage `npm run coverage`
- Run dev server with hot reload `npm run dev`
- Run the production bundle `npm start`

## Running the container in production
- Run `docker-build` that is going to build the docker image tagged with the repository name
- Run `docker-run` that is going to run the image built in the previous step

## Linting

- Run `npm run lint`

## Check if the dependencies are up to date
- Run `npm run depcheck`
