# OSHViewer

## Working with the project locally
install Node.js and npm if you haven't already. You can download them from the [Node.js official website](https://nodejs.org/).
Install the Node.js dependencies:
```bash
npm install
```
Run the projet in development mode:
```bash
npm run dev
```

## Creating a reusable Docker Container
Build the project bundle:
```bash
npm run build
```
In the project root directory, run the following command to build the Docker image:
```bash
docker build --no-cache --pull -f server/Dockerfile -t osh-viewer-test /home/cr31/OSH/Projects/osh-viewer/
```
Then this command to save the image to a tar file:
```bash
docker save -o osh-viewer-test.tar osh-viewer-test
```
change the names as you see fit.

