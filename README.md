# rasterSweep

include rasterSweep.min.js and rasterSweep.min.css into your html

```html
<script type="text/javascript" src="../rasterSweep/include/pixelmatch.js"></script>
<script type="text/javascript" src="../rasterSweep/rasterSweep.min.js"></script>
<link rel="stylesheet" type="text/css" href="../rasterSweep/rasterSweep.min.css" />
```

and include the rasterSweep directive into your app

```javascript
angular
    .module('yourAppName', [
        'rasterSweep'
    ]);
```

We use a browserified version of pixelmatch. Credits to [mapbox](https://github.com/mapbox/pixelmatch).
