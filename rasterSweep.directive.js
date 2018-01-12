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
            console.log('width', element.next());
            var img = element[0].children[0];
            // var sweepDiv = element[0].innerHTML += '<div id="raster-glass"></div>';

            var sweeper = element.find('#raster-glass');
            console.log('sweeper', sweeper);
            sweeper.css('width', img.width/5);
            sweeper.css('height', img.width/5);
            sweeper.css('border-width', img.width/100);
            console.log('img width', img.width);
            console.log('element', element);
            img.onmousemove = function(moveevent){
                console.log('mouseevent)');
                var mouseX = moveevent.pageX - img.offsetLeft;
                var mouseY = moveevent.pageY - img.offsetTop;
                if(mouseX > img.width - (img.width/5)) mouseX = img.width - (img.width/5);
                if(mouseX < img.offsetLeft) mouseX = img.offsetLeft;
                if(mouseY > img.height - (img.width/5)) mouseY = img.height - (img.width/5);
                if(mouseY < img.offsetTop) mouseY = img.offsetTop;
                sweeper.css('left', mouseX + 'px');
                sweeper.css('top', mouseY + 'px');
                // sweeper.css('transform', 'translateY('+ mouseY + 'px) translateX('+ mouseX + 'px)');
                
                // sweeper.style.transform = 'translateY('+ mouseY+'px)';
                // sweeper.style.transform += 'translateX('+mouseX+'px)';
                // element.find('#raster-sweeper-top-image').css('clip-path', 'polygon('+ mouseX + 'px ' + mouseY + 'px, ' + mouseX+img.width + 'px '+ mouseY + 'px, ' + mouseX+img.width + 'px ' + mouseY+img.height + 'px, '+ mouseX +'px ' + mouseY+img.height + 'px)');
            }
        }
    }
})();