(function(){
    'use strict';
    angular
        .module('rasterSweep')
        .directive('rasterSweep', rasterSweep);
    
    rasterSweep.$inject = ['$timeout'];
    function rasterSweep($timeout){
        return {
            restrict: 'E',
            link: link
        };
        
        function link(scope, element, attrs){
            var firstImgPath = 'test/original.png';
            var secondImgPath = 'test/modified.png';            
            var canvas = document.getElementById('rasterSweepCanvas');
            var context = canvas.getContext('2d');
            var canvasBg = document.getElementById('rasterSweepCanvasBg');
            var contextBg = canvasBg.getContext('2d');
            var diffCanvas = document.getElementById('diffCanvas');
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

            // contextBg.beginPath();
            // contextBg.arc(centerX, centerY, 40, 0, 2 * Math.PI, false);
            // contextBg.fillStyle = 'green';
            // contextBg.fill();
            // contextBg.lineWidth = 1;
            // contextBg.strokeStyle = '#003300';
            // contextBg.stroke();

            // Dummy Data end / Cors
            
            setTimeout(function(){diffCtx.putImageData(calcDifferences(diff,context, contextBg), 0, 0); }, 300);

            // function loadImage(imagePath, canvas, context){
            //     var image = new Image();
            //     image.src = imagePath;
            //     image.onload = function(){
            //         canvas.width = image.width;
            //         canvas.height = image.height;
            //         // context.drawImage(image, 0, 0);
            //     }
            // }

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

            // Calculates the sum of the differences for a circle (currently more a square turned by 45 degrees)
            // Inputs: context is the difference Canvas, mouseX and mouseY are the X and Y coordinates from the sweeper
            function sumOfDifferencesCircle(context, mouseX, mouseY, sweeperWidth, sweeper){
                // Mouse position
                var x = mouseX;
                var y = mouseY;

                // X and Y coordinates for the center of glass
                var xCenter = mouseX + (sweeperWidth/2);
                var yCenter = mouseY + (sweeperWidth/2);

                // Lower right corner of the glass
                var xEnd = mouseX + sweeperWidth;
                var yEnd = mouseY + sweeperWidth;

                // LL = lowerLeft
                // LR = lowerRight
                // UL = upperLeft
                // UR = upperRight

                // LOWER LEFT QUARTER
                var xLL = mouseX;
                var yLL = mouseY + (sweeperWidth/2);
                var circleValueLL = 0;
                while (xLL < xCenter) {
                    circleValueLL = circleValueLL + SumRowLeftHalfOfImage(context, xLL, yLL, xCenter);
                    xLL++;
                    yLL++;
                }
                // console.log('Lower Left:', circleValueLL);

                // LOWER RIGHT QUARTER
                var xLR = mouseX + sweeperWidth;
                var yLR = mouseY + (sweeperWidth/2);
                var circleValueLR = 0;
                while(xLR > xCenter){
                    circleValueLR = circleValueLR + SumRowRightHalfOfImage(context,xLR, yLR, xCenter);
                    xLR--;
                    yLR++;
                }
                // console.log('Lower Right',circleValueLR);
                
                // UPPER LEFT QUARTER
                var xUL = mouseX;
                var yUL = mouseY + (sweeperWidth/2);
                var circleValueUL = 0;
                while(xUL < xCenter){
                    circleValueUL = circleValueUL + SumRowLeftHalfOfImage(context, xUL, yUL, xCenter);
                    xUL++;
                    yUL--;
                }
                // console.log('Upper Left', circleValueUL);

                // UPPER RIGHT QUARTER
                var xUR = mouseX + sweeperWidth;
                var yUR = mouseY + (sweeperWidth/2);
                var circleValueUR = 0;
                while(xUR > xCenter){
                    circleValueUR = circleValueUR + SumRowRightHalfOfImage(context, xUR, yUR, xCenter);
                    xUR--;
                    yUR--;
                }
                // console.log('Upper Right', circleValueUR);
                // Styling Borders depending on the distribution of the values
                // if((circleValueLL + circleValueUL) < (circleValueLR + circleValueUR)){
                //     sweeper.css('border-left-style', 'dashed');
                //     sweeper.css('border-right-style', 'solid');                                                       
                // } else {
                //     sweeper.css('border-left-style', 'solid');
                //     sweeper.css('border-right-style', 'dashed');                                                         
                // }
                // if((circleValueUL + circleValueUR) < (circleValueLL + circleValueLR)){
                //     sweeper.css('border-top-style', 'dashed');
                //     sweeper.css('border-bottom-style', 'solid');                           
                // } else {
                //     sweeper.css('border-top-style', 'solid');
                //     sweeper.css('border-bottom-style', 'dashed');                                                        
                // }

                // Return the 4 halves of the circle
                return circleValueLL + circleValueLR + circleValueUR + circleValueLL;
            }

            // Sums up the rows, when the rows are on the left half of the image
            // Inputs: context is the difference Canvas
            function SumRowLeftHalfOfImage(context, x, y, xEnd){
                var rowValue = 0;
                while(x < xEnd){
                    var pixelValue = context.getImageData(x,y,1,1).data[0];
                    if(pixelValue === 0){
                        rowValue ++;
                    }
                    x++;
                }
                return rowValue
            }
            // Sums up the rows, when the rows are on the right half of the image
            // Inputs: context is the difference Canvas
            function SumRowRightHalfOfImage(context, x, y, xEnd){
                var rowValue = 0;
                while(x > xEnd){
                    var pixelValue = context.getImageData(x,y,1,1).data[0];

                    if(pixelValue === 0){
                        rowValue++;
                    }
                    x--;
                }
                return rowValue
            }


            // Display
            // get elements
            var img = element.find('#raster-sweeper-top-image');
            var dig = element.find('#digitiser');
            var sweeper = element.find('#raster-glass');

            // set css of elements
            dig.css('width', img[0].width + 'px'),
            dig.css('height', img[0].height + 'px');
            var sweeperWidth = Math.floor(img[0].width/5);
            var sweeperBorderWidth = Math.floor(img[0].width/100);
            sweeper.css('width', sweeperWidth + 'px');
            sweeper.css('height', sweeperWidth + 'px');
            sweeper.css('border-width', sweeperBorderWidth + 'px');
            img.css('opacity', '0');

            // listen to move events
            dig[0].onmousemove = function(moveevent){
                // get mouse position within image
                var mouseX = moveevent.pageX - img[0].offsetLeft;
                var mouseY = moveevent.pageY - img[0].offsetTop;

                // check if div would overlap image borders
                if(mouseX > (img[0].width - sweeperWidth)) mouseX = img[0].width - sweeperWidth;
                if(mouseX < img[0].offsetLeft) mouseX = img[0].offsetLeft;
                if(mouseY > (img[0].height - sweeperWidth)) mouseY = img[0].height - sweeperWidth;
                if(mouseY < img[0].offsetTop) mouseY = img[0].offsetTop;
                
                // set sweeper position
                sweeper.css('left', mouseX + 'px');
                sweeper.css('top', mouseY + 'px');

                // clip overlay image
                var fromTop = mouseY;
                var fromRight = img[0].width - sweeperWidth - mouseX - sweeperBorderWidth;
                var fromBottom = img[0].height - sweeperWidth - mouseY - sweeperBorderWidth;
                var fromLeft = mouseX;
                img.css('clip-path', 'inset(' + fromTop + 'px ' + fromRight + 'px ' + fromBottom + 'px ' +  fromLeft + 'px)');
                img.css('opacity', '1');
                // get difference value
                var rectGlassContent = sumOfDifferencesRect(diffCtx, mouseX , mouseY , sweeperWidth);
                console.log('Rect:', rectGlassContent);
                // Circle test
                var circleGlassContent = sumOfDifferencesCircle(diffCtx, mouseX , mouseY , sweeperWidth, sweeper);
                console.log('Circle:', circleGlassContent);
                // get the color of the border depending on the amount of differences
                var borderColor = getHSLColor(rectGlassContent, sweeperWidth);
                sweeper.css('border-color', borderColor);

                // inputs: glassContent is the difference , widthOfGlass
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
            }
        }
    }
})();

