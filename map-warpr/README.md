# Raster Foundry Map Warper

This is a mini app intended to demonstrate usage of [gdal.js](https://github.com/ddohler/gdal-js) and [loam](https://github.com/azavea/loam) to do the following:
- Upload non-georeferenced images
- Allow the user to warp them to match a particular area
- Export as geotiff

## Developing

Start a local dev server with it's root set to the `src` directory, optionally changing the default port:
```
cd src && python3 -m http.server 7777
# OR
cd src && python2 -m SimpleHTTPServer 7777
# OR
npm install -g http-server
http-server -p 7777 ./src
```

And then visit localhost with the specified port, e.g. http://localhost:7777

For simplicity the app has no build tooling. Just edit the source files and refresh your browser.
