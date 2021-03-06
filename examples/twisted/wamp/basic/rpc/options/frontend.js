try {
   var autobahn = require('autobahn');
   var when = require('when');
} catch (e) {
   // When running in browser, AutobahnJS will
   // be included without a module system
   var when = autobahn.when;
}

var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:9000/',
   realm: 'realm1'}
);

connection.onopen = function (session) {

   function on_event(val) {
      console.log("Someone requested to square non-negative:", val);
   }

   session.subscribe(on_event, 'com.myapp.square_on_nonpositive');

   var dl = [];

   var vals = [2, 0, -2];
   for (var i = 0; i < vals.length; ++i) {

      dl.push(session.call('com.myapp.square', [vals[i]], {}, {discloseme: true}).then(
         function (res) {
            console.log("Squared", res);
         },
         function (error) {
            console.log("Call failed:", error);
         }
      ));
   }

   when.all(dl).then(function () {
      console.log("All finished.");
      connection.close();
   });
};

connection.open();
