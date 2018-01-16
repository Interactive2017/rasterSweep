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
            // console.log('canvas:', canvas)
            var context = canvas.getContext('2d');
            // console.log('context:', context)
            loadImage(firstImgPath, context);
            // loadImage(secondImgPath, context);

            function loadImage(imagePath){
                var image = new Image();
                image.src = imagePath;
                image.onload = function(){
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);
                    readAllPixels();
                }
            }
            function readAllPixels(){
                for (var x = 0; x < canvas.width; x++) {
                    for (var y = 0; y < canvas.height; y++) {  
                        readRGBValue(x,y);
                    }
                }
            }
            function readRGBValue(x,y){
                var rgbValue = context.getImageData(x,y,1,1).data;
                var red = rgbValue[0];
                // var green = rgbValue[1];
                // var blue = rgbValue[2];
                console.log(rgbValue);
                if(red > 0){
                    console.log(red);
                }
            }
        }
        
        function createDiffMap(firstImage, secondImage){

        }
    }
})();

// Read RGB Color Inputs: Image, x, y Returns: RGB color string
// retrieveRGB(image,x,y):
//  red = image[x][y].[0]
//  blue = image[x][y].[1]
//  green = image[x][y].[2]
//  alpha ? needed?
// return red + " " + blue + " " + green

// Diffmap function Inputs: Two Images Returns: Difference matrix
// for loop x rows of images
//  for loop y rows of images
//     firstImageVal = retrieveRGB(firstImage,x,y);
//     secondImageVal = retrieveRGB(firstImage,x,y);
//     if(firstImageVal === secondImageVal){
//         comparisonMatrix[x][y] = 0
//      }  else {
//     comparisonMatrix[x][y] = 1
//  }
// }





// calculateIntegralImage Inputs: Difference Matrix from Diffmap function
//value = 0
//for loop x rows of image
//  for loop y rows of image
//   value = comparisonMatrix[x][y] + value
//   IntegralImage[x][y] = value
//  }
// }
    

