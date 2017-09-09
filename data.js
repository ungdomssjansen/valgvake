const http = require('http');
const vm = require('vm');

const data = exports.data = {};

exports.request = function request(repeat, delay) {
    //console.log('Called request...');
    http.request({
        protocol: 'http:',
        hostname: 'www.vg.no',
        port: 80,
        path: '/valgnatt/2017/valg/storting/',
        method: 'GET'
    }, (msg) => {
        //console.log('In request callback');
        msg.setEncoding('utf8');
        var raw = '';
        // remove error from data object
        delete data.error;
        msg.on('data', (chunk) => {
            //console.log('Got data...');
            raw += chunk;
        });
        msg.on('end', () => {
            // do the thing with the string
            try {
                //console.log('Extracting ', raw);
                extract(raw);
            } catch (e) {
                data.error = "There was an error in the parsing: " + e.message;
            }
        });
        msg.on('close', () => {
            repeat && setTimeout(() => request(repeat, delay), delay || 60000);
        });
        msg.on('error', (err) => {
            // add the error to the data object
            data.error = Error.message;
        });
    }).end();
}

const regex = /\<script\>\s*window\.__PRELOADED_STATE__ = (.*?)\;\s*\<\/script\>/;
function extract(raw) {
    var match = regex.exec(raw);
    if (match.length < 1) {
        data.error = 'Couldn\'t extract data from raw.';
        return;
    }
    var obj = match[1];
    parse(obj);
}

const mandates = [0, 9, 17, 19, 7, 7, 9, 7, 6, 4, 6, 14, 16, 0, 4, 9, 10, 5, 9, 6, 5];
function parse(obj) {
    obj = 'data = ' + obj;
    
    var ctx = vm.createContext();
    vm.runInContext(obj, ctx);
    
    obj = ctx.data.results;
    
    data.total = {
        attendance: obj.elections.parliament.stats.attendance.value || 0,
        //set this later
        counted: obj.elections.parliament.results.reduce((sum, e) => {
            sum.votes += e.counts.votes.value;
            sum.earlyVotes += e.counts.earlyVotes.value;
            return sum;
        }, {votes: 0, earlyVotes: 0}),
        counts: obj.elections.parliament.results.reduce((sum, e) => {
            if (e.code == 'LIBS') {
                return {
                    votes: e.counts.votes.value,
                    earlyVotes: e.counts.earlyVotes.value
                };
            }
            return sum;
        }, {votes: 0, earlyVotes: 0})
    };
    data.counties = obj.counties.map((f) => {
        var libs = f.parties['LIBS'];
        return {
            code: f.code,
            name: f.name,
            votes: libs.voteCount,
            percentage: libs.percentage.value || 0,
            counted: getCounted(f.parties),
            turnout: f.turnout || 0,
            mandate: 0,
            mandates: mandates[parseInt(f.code)]
        };
    });
    data.fetch = obj.elections.parliament.updatedAt;
}

function getCounted(parties) {
    return Object.keys(parties).reduce((sum, p) => {
        return sum + parties[p].voteCount;
    }, 0);
}

process.on('uncaughtException', (e) => {
    data.error = e;
    console.log(e);
});