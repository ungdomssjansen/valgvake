angular
    .module('resApp', [])
    .controller('ResultatCtr', ['$scope', '$http',
                                function($scope, $http) {
        $scope.fetch = {};
        $scope.counties = [];
        $scope.total = {};
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
                /* test data
                $scope.counties[3].votes = 32400;
                $scope.counties[3].percentage = 43.124;
                $scope.total.counts = {
                    votes: 32400,
                    earlyVotes: 1829
                };
                $scope.total.attendance = 2171682;
                $scope.total.counted.votes = 812792;
                */
                    $scope.mostVotes = getMostVotes();
            });
            setTimeout(fetch, 60000);
        };
        fetch();
                                    
        function getMostVotes() {
            var sorted = $scope.counties.sort((a, b) => {
                var v = b.counts.votes - a.counts.votes;
                if (v == 0) return a.name.localeCompare(b.name);
                else return v;
            });
            if (sorted.length) return sorted[0].code;
            else return null;
        }
                                    
        function getTopCounty() {
            if ($scope.topCounty) return $scope.topCounty;
            else return $scope.mostVotes;
        }
        $scope.getTopCounty = getTopCounty;
        function setTopCounty(code) {
            console.log('setting top county', code)
            $scope.topCounty = code;
            cookie('topCounty', code);
        }
        $scope.setTopCounty = setTopCounty;
        setTopCounty(cookie('topCounty'));
                                    
        function toggleContext() {
            console.log('toggling context', $scope.context);
            $scope.context = !$scope.context;
            cookie('context', $scope.context ? 1 : null)
            console.log('new context', $scope.context, cookie('context'));
        }
        $scope.toggleContext = toggleContext;
        console.log('setting context', !!cookie('context'));
        $scope.context = !!cookie('context');
    }]);