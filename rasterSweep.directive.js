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
            console.log('element', element);
            var img = element[0].children[1];
            img.onmouseover = function(event){
                // console.log('hovering...', event);
                // console.log('layerX', JSON.stringify(event.layerX));
                // console.log('pageX', JSON.stringify(event.pageX));
                // console.log('clientX', JSON.stringify(event.clientX));
                // console.log('screenX', JSON.stringify(event.screenX));
                img.onmousemove = function(moveevent){
                    var mouseX = moveevent.pageX - img.offsetLeft;
                    var mouseY = moveevent.pageY - img.offsetTop;
                    element[0].children[2].style.left = mouseX + 'px';
                    element[0].children[2].style.top = mouseY + 'px';
                }

                
            }
            console.log('hello world');
        }
    }
})();