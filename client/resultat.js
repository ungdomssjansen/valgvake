angular
    .module('resApp', [])
    .controller('ResultatCtr', ['$scope', '$http',
                                function($scope, $http) {
        $scope.total = {
            'talte': 0,
            'taltepst': 0,
            'lib': 0,
            'libpst': 0
        };
        $scope.fylker = [
            'Østfold', 'Akershus', 'Oslo', 'Hedmark', 'Oppland', 
            'Buskerud', 'Vestfold', 'Telemark', 'Aust-Agder', 
            'Vest-Agder', 'Rogaland', 'Hordaland', '', 'Sogn og Fjordane', 
            'Møre og Romsdal', 'Sør-Trøndelag', 'Nord-Trøndelag', 
            'Nordland', 'Troms', 'Finnmark'
        ].map((f, i) => {
            return {
                'nr': i + 1,
                'navn': f,
                'talte': 0,
                'taltepst': Math.random() * 100,
                'mandater': 0,
                'lib': 0,
                'libpst': Math.random() * 2,
                'libmand': Math.random() > 0.9 ? 1 : 0
            };
        }).filter((f) => {
            return f.navn != '';
        });
        $scope.fetch = {
            'status': 1,
            'time': Date.now()
        };
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