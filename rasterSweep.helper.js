(function(){
    'use strict';

    angular
        .module('rasterSweep')
        .factory('rsHelper', rsHelper);
    
    rsHelper.$inject = [];
    function rsHelper(){
        var service = {
            recolorBorder: recolorBorder,
            clipOverlayImage: clipOverlayImage,
            moveSweeper: moveSweeper,
            checkBoundaries: checkBoundaries,
            getHSLColor: getHSLColor
        };

        return service;

        ////////

        function recolorBorder(glassDiffSum, sweeperWidth, sweeper){
            var borderColor = getHSLColor(glassDiffSum, sweeperWidth);
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
})();