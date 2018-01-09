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
            console.log('hello world');
        }
    }
})();