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
            // console.log('width', element[0].css('width'));
            var img = element[0].children[1];
            var sweeper = element.find('#raster-glass');
            sweeper.css('width', img.width/10);
            sweeper.css('height', img.width/10);
            sweeper.css('border-width', img.width/100);
            console.log('element', element);
            img.onmousemove = function(moveevent){
                var mouseX = moveevent.pageX - img.offsetLeft;
                var mouseY = moveevent.pageY - img.offsetTop;
                sweeper.css('left', mouseX + 'px');
                sweeper.css('top', mouseY + 'px');
                element.find('#raster-sweeper-top-image').css('clip-path', 'polygon('+ mouseX + 'px ' + mouseY + 'px, ' + mouseX+img.width + 'px '+ mouseY + 'px, ' + mouseX+img.width + 'px ' + mouseY+img.height + 'px, '+ mouseX +'px ' + mouseY+img.height + 'px)');
            }
        }
    }
})();