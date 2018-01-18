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
            console.log('width', element.next());
            var img = element.find('#raster-sweeper-top-image');
            var dig = element.find('#digitiser');
            dig.css('width', img[0].width + 'px'),
            dig.css('height', img[0].height + 'px');
            var sweeper = element.find('#raster-glass');
            var sweeperWidth = Math.floor(img[0].width/5);
            var sweeperBorderWidth = Math.floor(img[0].width/100);
            sweeper.css('width', sweeperWidth + 'px');
            sweeper.css('height', sweeperWidth + 'px');
            sweeper.css('border-width', sweeperBorderWidth + 'px');
            img.css('opacity', '0');
            dig[0].onmousemove = function(moveevent){
                var mouseX = moveevent.pageX - img[0].offsetLeft;
                var mouseY = moveevent.pageY - img[0].offsetTop;
                if(mouseX > (img[0].width - sweeperWidth)) mouseX = img[0].width - sweeperWidth;
                if(mouseX < img[0].offsetLeft) mouseX = img[0].offsetLeft;
                if(mouseY > (img[0].height - sweeperWidth)) mouseY = img[0].height - sweeperWidth;
                if(mouseY < img[0].offsetTop) mouseY = img[0].offsetTop;
                sweeper.css('left', mouseX + 'px');
                sweeper.css('top', mouseY + 'px');
                var fromTop = mouseY;
                var fromRight = img[0].width - sweeperWidth - mouseX - sweeperBorderWidth;
                var fromBottom = img[0].height - sweeperWidth - mouseY - sweeperBorderWidth;
                var fromLeft = mouseX;
                img.css('clip-path', 'inset(' + fromTop + 'px ' + fromRight + 'px ' + fromBottom + 'px ' +  fromLeft + 'px)');
                img.css('opacity', '1');
            }
        }
    }
})();