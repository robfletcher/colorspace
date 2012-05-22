'use strict';

function GridCtrl($scope, $rootScope) {

  $scope.baseColors = [
    { color: '#ffaa66' },
    { color: '#f900f9' }
  ];

  $rootScope.$on('base-color-change', function(event) {
  	$scope.baseColors[0].color = event.targetScope.color;
  });

}

function BaseColorFormCtrl($scope) {
	$scope.color = '#ffaa66';
	$scope.changeColor = function() {
		console.log('new color', $scope.color, $scope);
		$scope.$emit('base-color-change', $scope.color);
	}
}
