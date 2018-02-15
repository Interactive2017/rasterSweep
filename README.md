# rasterSweep

include rasterSweep.min.js and rasterSweep.min.css into your html

```html
<script type="text/javascript" src="../raster-sweep/include/pixelmatch.js"></script>
<script type="text/javascript" src="../raster-sweep/rasterSweep.min.js"></script>
<link rel="stylesheet" type="text/css" href="../raster-sweep/rasterSweep.min.css" />
```

and include the rasterSweep directive into your app

```javascript
angular
    .module('yourAppName', [
        'raster-sweep'
    ]);
```

We use a browserified version of pixelmatch. Credits to [mapbox](https://github.com/mapbox/pixelmatch).
