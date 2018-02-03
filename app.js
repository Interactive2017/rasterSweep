(function(){
    'use strict';

    angular
        .module('app', ['rasterSweep'])
        .controller('myCtrl', ['$scope', '$timeout', function($scope, $timeout){
            $scope.test = 'hello world';
            $scope.path1 = "test/original.png";
            $scope.path2 = "test/original.png";
            $scope.conf = {
                base: $scope.path1,
                overlay: $scope.path2
            };
            $timeout(function(){
                $scope.path2 = "test/modified.png";
            }, 5000);
        }]);
})();