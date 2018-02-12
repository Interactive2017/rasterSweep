(function(){
    'use strict';
    angular
        .module('rasterSweep', [])
        .directive('rasterSweep', rasterSweep)
        .factory('rsHelper', rsHelper);
    
    rsHelper.$inject = [];
    function rsHelper(){
        var service = {
            recolorBorder: recolorBorder,
            clipOverlayImage: clipOverlayImage,
            moveSweeper: moveSweeper,
            checkBoundaries: checkBoundaries,
            getHSLColor: getHSLColor,
            getSingleColorPalette: getSingleColorPalette
        };

        return service;

        ////////

        function recolorBorder(glassDiffSum, sweeperWidth, sweeper){
            var borderColor = getSingleColorPalette(100, glassDiffSum, sweeperWidth);
            sweeper.css('border-color', borderColor);  
        }

        function clipOverlayImage(sweeperWidth, sweeperBorderWidth, img, mouseX, mouseY){
            var fromTop = mouseY;
            var fromRight = img[0].width - sweeperWidth - mouseX - sweeperBorderWidth;
            var fromBottom = img[0].height - sweeperWidth - mouseY - sweeperBorderWidth;
            var fromLeft = mouseX;
            img.css('clip-path', 'inset(' + fromTop + 'px ' + fromRight + 'px ' + fromBottom + 'px ' +  fromLeft + 'px)');
            img.css('opacity', '1');
        }

        function moveSweeper(sweeper, mouseX, mouseY){
            sweeper.css('left', mouseX + 'px');
            sweeper.css('top', mouseY + 'px');
        }
         // check if div would overlap image borders
        function checkBoundaries(img, sweeperWidth, mouseX, mouseY){
            if(mouseX > (img[0].width - sweeperWidth)) mouseX = img[0].width - sweeperWidth;
            if(mouseX < img[0].offsetLeft) mouseX = img[0].offsetLeft;
            if(mouseY > (img[0].height - sweeperWidth)) mouseY = img[0].height - sweeperWidth;
            if(mouseY < img[0].offsetTop) mouseY = img[0].offsetTop;
        }
        // inputs: glassContent is the difference , widthOfGlass
        // RED , YELLOW, GREEN, WHITE
        function getHSLColor(glassContent, sweeperWidth){
            var maxValueGlass = sweeperWidth * sweeperWidth;
            var normalizedColor = glassContent / maxValueGlass;
            // invert Color
            var hue = 120 - (normalizedColor * 120);
            // if color turns green, scale lightness so that it fades to white
            if(hue > 100){
                var index = hue - 100;
                var lightness = 50 + (index * 3)
                return 'hsl(' + hue +', 100%, '+ lightness + '%)';
            } 
            return 'hsl(' + hue +', 100%, '+ '50%)';
        }

        // get color palette depending on input hue value
        function getSingleColorPalette(hue, glassContent, sweeperWidth){
            var maxValueGlass = sweeperWidth * sweeperWidth;
            var normalizedColor = glassContent / maxValueGlass;
            var lightness = 100 - (normalizedColor * 100)
            if(lightness < 80){
                var lightness = 60 - ((60 - lightness)/4.5);
                return 'hsl(' + hue +', 100%, '+ lightness + '%)';
            }
            return 'hsl(' + hue +', 100%, '+ lightness + '%)';

        }

    }
    
    rasterSweep.$inject = ['rsHelper', '$timeout'];
    function rasterSweep(rsHelper, $timeout){
        return {
            restrict: 'E',
            // transclude: 'element',
            scope: {
                base: '@rsBase',
                overlay: '@rsOverlay'
            },
            // templateUrl: 'rasterSweep.template.html',
            template: '<div class="raster-wrapper">'
                           + '<canvas class="rs-canvas" id="rasterSweepCanvas" height="301px" width="450px"></canvas>'
                           + '<canvas class="rs-canvas" id="diffCanvas" height="301px" width="450px"></canvas>'
                           + '<canvas class="rs-canvas" id="rasterSweepCanvasBg" height="301px" width="450px"></canvas>'
                        
                        
                           + '<img id="rs-btn-image" ng-src="{{base}}" alt="original" />'
                           + '<img id="rs-top-image" ng-src="{{overlay}}" alt="original" />'
                           + '<div id="rs-glass"></div>'
                           + '<div id="rs-digitiser"></div>'
                        
                        + '</div>',
            link: link
        };
        
        function link(scope, element, attrs, ctrl, transclude){
            if(!scope.base) throw 'no base path defined';
            if(!scope.overlay) throw 'no overlay path defined';

            scope.$watch('overlay', function(newVal){
                console.log('changed overlay path to ' + newVal);
                
                var firstImgPath = scope.base;
                var secondImgPath = scope.overlay;            
                var canvas = element.find('#rasterSweepCanvas')[0];
                var context = canvas.getContext('2d');
                var canvasBg = element.find('#rasterSweepCanvasBg')[0];
                var contextBg = canvasBg.getContext('2d');
                var diffCanvas = element.find('#diffCanvas')[0];
                var diffCtx = diffCanvas.getContext('2d');
                var diff = diffCtx.createImageData(canvas.width, canvas.height);
                
                // loadImage(firstImgPath, canvas, context);
                // loadImage(secondImgPath, canvasBg, contextBg);
                
                
                // Dummy Data / Cors
                var centerX = canvas.width / 2;
                var centerY = canvas.height / 2;
                var radius = 70;
                
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                context.fillStyle = 'green';
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = '#003300';
                context.stroke();
                
                context.beginPath();
                context.lineWidth="4";
                context.fillStyle = 'red';
                context.fill();
                context.strokeStyle="green";
                context.fillRect(30,30,50,50);
                context.stroke();
                
                contextBg.beginPath();
                contextBg.arc(centerX, centerY, 40, 0, 2 * Math.PI, false);
                contextBg.fillStyle = 'green';
                contextBg.fill();
                contextBg.lineWidth = 1;
                contextBg.strokeStyle = '#003300';
                contextBg.stroke();
                
                // Dummy Data end / Cors
                
                setTimeout(function(){diffCtx.putImageData(calcDifferences(diff,context, contextBg), 0, 0); }, 300);
                
                function loadImage(imagePath, canvas, context){
                    var image = new Image();
                    image.src = imagePath;
                    image.onload = function(){
                        canvas.width = image.width;
                        canvas.height = image.height;
                        // context.drawImage(image, 0, 0);
                    }
                }
                        
                // Calculates the difference image from two images 
                // returns the difference image '(has to be put into canvas.context)
                // difference image: RGB image with black and white color.
                function calcDifferences(diff, imageA, imageB){  
                    var imgA = imageA.getImageData(0, 0, canvas.width, canvas.height),
                        imgB = imageB.getImageData(0, 0, canvas.width, canvas.height);
                
                    pixelmatch(imgA.data, imgB.data, diff.data, canvas.width, canvas.height, {threshold: 0.1});
                    return diff
                }
                
                // Calculates the sum of the differences for a rectangle
                function sumOfDifferencesRect(context, mouseX, mouseY, sweeperWidth){
                    var xEnd = mouseX + sweeperWidth;
                    var yEnd = mouseY + sweeperWidth;
                    var value = 0;
                    for(var x = mouseX; x < xEnd; x++){
                        for(var y = mouseY; y < yEnd; y++){
                            var pixelValue = context.getImageData(x,y,1,1).data[0];
                            if(pixelValue === 0){
                                value += 1;
                            }
                        }
                    }
                    return value;
                }


                // Display
                // get elements
                var img = element.find('#rs-top-image');
                var dig = element.find('#rs-digitiser');
                var sweeper = element.find('#rs-glass');
                var sweeperWidth;
                var sweeperBorderWidth;
                img.bind('load', function(){




                    function getOffset( el ) {
                        var _x = 0;
                        var _y = 0;
                        console.info(el);
                        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                            console.info('in while');
                            _x += el.offsetLeft - el.scrollLeft;
                            _y += el.offsetTop - el.scrollTop;
                            el = el.offsetParent;
                        }
                        return { top: _y, left: _x };
                    }
                    
                    
                    
                    
                    
                    
                    // set css of elements
                    dig.css('width', img[0].width + 'px'),
                    dig.css('height', img[0].height + 'px');
                    console.info('rasterSweep img height ' + img[0].height);
                    console.info('rasterSweeper', element[0].parentElement);
                    element[0].parentElement.style.height = img[0].height + 'px';
                    sweeperWidth = Math.floor(img[0].width/5);
                    sweeperBorderWidth = Math.floor(img[0].width/100);
                    sweeper.css('width', sweeperWidth + 'px');
                    sweeper.css('height', sweeperWidth + 'px');
                    sweeper.css('border-width', sweeperBorderWidth + 'px');
                    img.css('opacity', '0');
                    var offset = getOffset( dig[0] ); 
                    console.info('new offset left ' + offset.left + ", top "  + offset.top );
                    // Resize on alt + mousewheel
                    dig[0].onwheel = function(wheelevent){
                        wheelevent.preventDefault();
                        // Check if max size is reached 
                        if (sweeperWidth < img[0].height/2 && sweeperWidth < img[0].width/2 && wheelevent.deltaY > 0){
                            sweeperWidth = sweeperWidth +  wheelevent.deltaY;                     
                        }  else if (sweeperWidth > img[0].height/10 && sweeperWidth > img[0].width/10 && wheelevent.deltaY < 0){
                            sweeperWidth = sweeperWidth +  wheelevent.deltaY;
                        } 
                        sweeper.css('width', sweeperWidth + 'px');
                        sweeper.css('height', sweeperWidth + 'px');
                        
                        var mouseX = wheelevent.pageX - offset.left;
                        var mouseY = wheelevent.pageY - offset.top;
                        
                        rsHelper.clipOverlayImage(sweeperWidth, sweeperBorderWidth, img, mouseX, mouseY);
                        var sumOfDifferences =  sumOfDifferencesRect(diffCtx, mouseX , mouseY , sweeperWidth);
                        rsHelper.recolorBorder(sumOfDifferences, sweeperWidth, sweeper);
                    }
                    
                    // listen to move events
                    dig[0].onmousemove = function(moveevent){
                        // get mouse position within image
                        offset = getOffset(dig[0]);
                        var mouseX = moveevent.pageX - offset.left;
                        var mouseY = moveevent.pageY - offset.top;
                        
                        rsHelper.checkBoundaries(img, sweeperWidth, mouseX, mouseY);
                        
                        // set sweeper position
                        rsHelper.moveSweeper(sweeper, mouseX, mouseY);
                        
                        // clip overlay image
                        rsHelper.clipOverlayImage(sweeperWidth, sweeperBorderWidth, img, mouseX, mouseY);
                        
                        // get difference value
                        var rectGlassContent = sumOfDifferencesRect(diffCtx, mouseX , mouseY , sweeperWidth);
                        // console.log('Rect:', rectGlassContent);
                        // Circle test
                        // var circleGlassContent = sumOfDifferencesCircle(diffCtx, mouseX , mouseY , sweeperWidth, sweeper);
                        // console.log('Circle:', circleGlassContent);
                        // get the color of the border depending on the amount of differences
                        rsHelper.recolorBorder(rectGlassContent,sweeperWidth, sweeper);
                    };
                });

                
            });
        }
    }
})();