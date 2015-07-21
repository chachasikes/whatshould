// npm install jasmine-node
// run tests: jasmine-node spec

  // - app page loads at all
  // - page markup renders
  // - user can save a path to an api resource
  // - when user saves a path, it only saves one record
  // - app can tell what kind of resource it is
  //   - app can extract name and pinboard name
  //   - app can parse google key and get path of certain length
  // - app can store path in localstorage
  // - app can retreive path from localstorage
  // - app adds one unique path to stored collections
  // - app can delete a selected stored collection 
  // - app can set localstorage
  // - app can clear localstorage
  // - entering input field triggers app to add a new collection
  // - when app loads, it reads from localstorage if set
  // - when app loads, it displays default collection if none are set
  // - when app loads with loaded from localstorage data, new entries add and update the right number of records
  // - when app loads, a path is rendered as a new collection item
  // - when app loads a new collection item, it displays the new item in the right format (google vs pinterest)
  // - buttom click handler triggers saving
  // - buttom click handler triggers deletion


  
var request = require("request");
var base_url = "http://localhost:8000/"

describe("Server is working.", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns part of Title", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toMatch("Creative Reminder");
        done();
      });
    });

    // it("returns part of Body copy", function(done) {
    //   request.get(base_url, function(error, response, body) {
    //     expect(body).toMatch("HI");
    //     done();
    //   });
    // });


  });
});
