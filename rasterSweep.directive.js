(function(){
    'use strict';
    angular
        .module('rasterSweep')
        .directive('rasterSweep', rasterSweep);
    
    rasterSweep.$inject = [];
    function rasterSweep(){
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
            
            // loadImage(firstImgPath, canvas, context);
            // loadImage(secondImgPath, canvasBg, contextBg);
            
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

            contextBg.beginPath();
            contextBg.arc(centerX, centerY, 40, 0, 2 * Math.PI, false);
            contextBg.fillStyle = 'green';
            contextBg.fill();
            contextBg.lineWidth = 1;
            contextBg.strokeStyle = '#003300';
            contextBg.stroke();

            setTimeout(function(){ calcDifferences(); }, 300);
            
            function loadImage(imagePath, canvas, context){
                var image = new Image();
                image.src = imagePath;
                image.onload = function(){
                    canvas.width = image.width;
                    canvas.height = image.height;
                    // context.drawImage(image, 0, 0);
                }
            }

            function calcDifferences(){
                var diffCanvas = document.getElementById('diffCanvas');
                var diffCtx = diffCanvas.getContext('2d');
    
                var img1 = context.getImageData(0, 0, canvas.width, canvas.height),
                    img2 = contextBg.getImageData(0, 0, canvas.width, canvas.height),
                    diff = diffCtx.createImageData(canvas.width, canvas.height);
    
                pixelmatch(img1.data, img2.data, diff.data, canvas.width, canvas.height, {threshold: 0.1});
                diffCtx.putImageData(diff, 0, 0);
                console.log(img1);
                console.log("Differences calculated");
                setTimeout(function(){ calcIntegralImage(diffCtx,50,50,100,100); }, 500);
            }

            function calcIntegralImage(context, xStart, yStart, xEnd, yEnd){
                var value = 0;
                for(var x = xStart; x < xEnd; x++){
                    for(var y = yStart; y < yEnd; y++){
                        var pixelValue = context.getImageData(x,y,1,1).data[0];
                        // console.log(pixelValue);
                        // console.log('x:',x,' y: ', y)
                        if(pixelValue === 0){
                            value += 1;
                        }
                    }
                }
                console.log(value)
            }
        }
    }
})();

