angular
    .module('resApp', [])
    .controller('ResultatCtr', ['$scope', '$http',
                                function($scope, $http) {
        $scope.fetch = {};
        function fetch() {
            console.log('Fetching data.json...');
            $scope.fetch.status = 0;
            $http
                .get('data.json')
                .then(function(res) {
                    console.log('Data received: ', res.data);
                    $scope.total = res.data.total;
                    $scope.counties = res.data.counties;
                    var d = new Date();
                    d.setTime(Date.parse(res.data.fetch));
                    $scope.fetch = {
                        time: d,
                        status: 1
                    };
                    $scope.error = res.data.error;
                    if ($scope.error) {
                        $scope.fetch.status = -1;
                    }
            });
            setTimeout(fetch, 60000);
        };
        fetch();
    }]);