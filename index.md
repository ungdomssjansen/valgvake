<!-- Author: Tor Valamo. -->
<!-- CC-BY-NC-4.0 -->

<!doctype html>
<html ng-app="resApp">
    <head>
        <title>Valgresultat 2017</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.5/angular.min.js"></script>
        <script src="/client/cookie.js"></script>
        <script src="/client/resultat.js"></script>
        <script>
            setTimeout(function() {
                location.reload();
            }, 600000);
        </script>
        <link href="/client/style.css" rel="stylesheet">
        <style>
            td.is-right {
                text-align: right;
            }
            td.is-center {
                text-align: center;
            }
            td.is-left {
                text-align: left;
            }
            tr.is-one-pst:not(.is-selected) td {
                font-weight: bold;
                /*background-color: rgba(74, 16, 74, 1);*/
                color: #4a164a;
                text-transform: uppercase;
            }
            tr.is-selected td {
                font-weight: bold;
                font-size: 120%;
                color: yellow !important;
                text-transform: uppercase;
            }
            .is-bold, .is-bold * {
                font-weight: bold;
            }
            progress {
                margin-top: 3px;
            }
            progress.is-context {
                margin-top: 6px;
                margin-bottom: 6px;
            }
            div.is-highlighted * {
                color: yellow; 
            }
            div.is-pinned {
                border: 2px solid yellow;
            }
            div.is-pinned:hover {
                cursor: zoom-out;
            }
            div.is-pinnable {
                border: 2px solid #4a164a;
            }
            div.is-pinnable {
                cursor: zoom-in;
            }
            div.is-clickable:hover {
                cursor: pointer;
            }
        </style>
    </head>
    <body ng-controller="ResultatCtr">
        <section class="hero">
            <div class="hero-body">
                <div class="container is-fluid">
                    <nav class="level">
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Forhåndstemmer</p>
                                <p class="title">{{ total.counts.earlyVotes | number }}</p>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Alle stemmer</p>
                                <p class="title is-1 is-bold">{{ total.counts.votes | number }}</p>
                            </div>
                        </div>
                        <div class="level-item has-text-centered is-clickable" 
                             ng-click="toggleContext()">
                            <img src="logo.png" alt="" style="height: 100px;">
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Oppslutning</p>
                                <p class="title is-1 is-bold">{{ total.counts.percentage | number : 1 }} %</p>
                            </div>
                        </div>
                        <div class="level-item has-text-centered">
                            <div>
                                <p class="heading">Opptalt</p>
                                <p class="title">{{ total.counted.percentage | number : 1 }} %</p>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </section>
        <div class="container is-fluid">
            <table class="table is-striped" ng-hide="context">
                <thead>
                    <tr>
                        <td width="5%">#</td>
                        <td>Fylke</td>
                        <td width="10%" class="is-right">Stemmer</td>
                        <td width="10%" class="is-right">Forh.stem.</td>
                        <td width="10%" class="is-right">Oppslutning</td>
                        <td width="10%" class="is-right">Mandater</td>
                        <td width="15%" class="is-right">Opptalt</td>
                        <td width="20%">Opptelling</td>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="county in counties | orderBy : 'name'" 
                        ng-class="{'is-selected': county.counts.mandates, 'is-one-pst': county.counts.percentage >= 1}">
                        <td>{{ county.code }}</td>
                        <td>{{ county.name }}</td>
                        <td class="is-right">{{ county.counts.votes | number}}</td>
                        <td class="is-right">{{ county.counts.earlyVotes | number}}</td>
                        <td class="is-right">{{ county.counts.percentage | number : 1 }} %</td>
                        <td class="is-right">{{ county.counts.mandates }} / {{ county.counted.mandates }}</td>
                        <td class="is-right">{{ county.counted.votes | number }}</td>
                        <td>
                            <progress class="progress" 
                                      value="{{ county.counted.percentage }}" max="100" 
                                      ng-class="{'is-primary': county.counts.percentage >= 1 && !county.counts.mandates, 'is-medium': !county.counts.mandates, 'is-large is-warning': county.counts.mandates}">
                                {{ county.counted.percentage | number : 1 }} %
                            </progress>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="tile is-ancestor" ng-show="context">
                <div class="tile is-vertical is-12">
                    <div class="tile is-parent">
                        <!-- selected top county -->
                        <div class="tile is-child notification is-primary" 
                             ng-repeat="county in counties | filter : {code: getTopCounty()}" 
                             ng-class="{'is-highlighted': county.counts.percentage >= 1, 'is-pinnable': !topCounty, 'is-pinned': topCounty}" 
                             ng-click="setTopCounty(topCounty ? null : county.code)">
                                <table>
                                    <tr class="is-bold">
                                        <td rowspan="2" width="30%" class="title is-1 is-center">{{ county.counts.votes | number }}</td>
                                        <td class="title is-3 is-center">{{ county.name }}</td>
                                        <td rowspan="2" width="30%" class="title is-1 is-center">{{ county.counts.percentage | number : 1 }} %</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <progress class="progress is-small is-context" 
                                                      value="{{ county.counted.percentage }}" max="100" 
                                                      ng-class="{'is-warning': county.counts.percentage >= 1}">
                                                {{ county.counted.percentage | number : 1 }} %
                                            </progress>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="title is-6 is-center">{{ county.counts.earlyVotes }} forhåndsstemmer</td>
                                        <td class="title is-6 is-center">{{ county.counted.votes }} stemmer opptalt</td>
                                        <td class="title is-6 is-center">{{ county.counts.mandates }} mandater av {{ county.counted.mandates }} mulige</td>
                                    </tr>
                                </table>
                        </div>
                    </div>
                    <!-- the rest -->
                    <div class="tile" ng-repeat="row in [0, 1, 2, 3, 4, 5]">
                        <div class="tile is-parent is-4" 
                             ng-repeat="county in counties | filter : {code: '!' + getTopCounty()} | orderBy : ['-votes', 'name'] | limitTo : 3 : (3 * row)">
                            <div class="tile is-child notification is-primary is-pinnable" 
                                 ng-class="{'is-highlighted': county.percentage >= 1}"
                                 ng-click="setTopCounty(county.code)">
                                <table>
                                    <tr class="is-bold">
                                        <td rowspan="2" width="30%" class="title is-2 is-center">{{ county.counts.votes | number }}</td>
                                        <td class="title is-4 is-center">{{ county.name }}</td>
                                        <td rowspan="2" width="30%" class="title is-2 is-center">{{ county.counts.percentage | number : 1 }} %</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <progress class="progress is-small is-context" 
                                                      value="{{ county.counted.percentage }}" max="100" 
                                                      ng-class="{'is-warning': county.percentage >= 1}">
                                                {{ county.counted.percentage | number : 1 }} %
                                            </progress>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="has-text-right" ng-switch on="fetch.status">
                <span class="tag is-error" ng-switch-when="-1">{{ error }}</span>
                <span class="tag is-warning" ng-switch-when="0">Oppdaterer ...</span>
                <span class="tag is-success" ng-switch-default>Oppdatert {{ fetch.time | date : 'd. MMM y kl. HH:mm:ss' }}</span>
            </div>
        </div>
    </body>
</html>
