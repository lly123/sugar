// var context = require.context('./spec', true, /[sS]pec\.js/);
var context = require.context('./spec/web/frameworks/', true, /angularSpec\.js/);
// var context = require.context('./spec/core/room/', true, /localTalkSpec\.js/);
context.keys().forEach(context);
