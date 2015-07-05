// Interpret and validate URL for google doc.
// @TODO - rig up input box, store values
// Handle hex_color (because I can.)
//---------
// gdocURL example
// https://docs.google.com/spreadsheets/d/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/pub?gid=0&single=true&output=csv

// @TODO make reactclasses work. install LESS/SASS

// TEST: gdoc loads or fails - good gdoc/bad gdoc (no data, bad url, 20 cols, 1 row, no rows, ajax fails)

// Load gdoc via ajax or fail.
// Parse gdoc or fail. (can be read, can't be read as array, not enough data, errors (content))
// Use first row as a label if more than one column or fail. 
// Collect remaining rows as an array or fail.

// Set localdata store.
// Choose a random item.
// Update display. // TEST values exist for each column.

// Iterate through other rows until no results. (limited by column)
// @TODO see if gdoc will allow for 1 data retreival or if multiple ajax calls for columns is the easiest way to get the data.
// @TODO render jsx via react-tools once npm isn't broken locally. (running through python server)


var Sheet = React.createClass({

  // Establish initial state settings for this class.
  getInitialState: function() {
    return {
      sheetArray: [],
      displayItems: [],
      hasHexColor: false,
      groupColumns: true,
      maxColumns: 11,
      columnHeaders: []
    };
  },

  componentDidMount: function() {
    // Load Google Sheet.
    $.ajax({
      url: this.props.source,
      success: function(result) {

        if (this.isMounted()) {
          // Read column names to determine how to handle the Sheet.
          columnState = this.readSheetHeaderColumns(result);
          this.setState(columnState);
          
          // If sheet should be grouped into rows, process as grouped.
          if (columnState.groupColumns == true) {
            dataState = this.mapSheetColumnsGrouped(result);
            this.setState(dataState);
          }
          else {
            this.mapSheetColumnsUngrouped(result);
          }
        }

      }.bind(this),
      dataType: 'jsonp',
    });
  },


  // Find the first column and first row data from Google Sheet JSON object. 
  // Get column header list as an array.
  // Evaluate columns for certain string matches (hex_color, multi_random)
  // Hexcolor can be a 6 string hex code, with or without a #.
  // multi_random doesn't need any values, just to be listed as a column name and the sheet will be interpreted as each column should be randomized.
  // @TODO Think of a better word than "multi_random."
  // Return some local state settings to be stored with the Class.
  readSheetHeaderColumns: function(result) {
    // Set local variable for data from Google Sheet.
    var lastSheetResults = result.feed.entry;

    var columnNames = $.map( lastSheetResults, function( n ) {
      return (n['gs$cell']['col'] < 11 && n['gs$cell']['row'] == 1) ? n['gs$cell']['$t'] : null;
    });

    var state = {};

    // If hasColor, get the hex Color for this row and store it with this value.
    if ( $.inArray('hex_color', columnNames)  > -1 ){ 
      state.hasHexColor = true;
    }
    console.log(columnNames);
    console.log($.inArray('multi_random', columnNames))
    if ( $.inArray('multi_random', columnNames) > -1 ){ 
      state.groupColumns = false;
    }
    console.log(state);
    return state;
  },

  mapSheetColumnsGrouped: function(result) {
    console.log("Grouped");
    lastSheet = [];
    displayItems = [];
    
    // Set local variable for data from Google Sheet.
    var lastSheetResults = result.feed.entry;
    var rows = []
    // For the length of the Sheet, group data by row.
    for (var i = 1; i < lastSheetResults.length; i++) {
      var row = $.map( lastSheetResults, function( n ) {
        return n['gs$cell']['row'] == i ? n : null;
      });

      if (row.length > 0) {
        rows.push(row);
      }
    }

    columnHeaders = rows.shift();
    lastSheet.push(rows);

    randomItem = this.getRandomRowItem(columnHeaders, rows);

    displayItems.push(randomItem);

    state = {
      columnHeaders: columnHeaders,
      sheetArray: lastSheet,
      displayItems: displayItems
    }
    
    return state;
  },

  mapSheetColumnsUngrouped: function(result) {
    console.log("UnGrouped");
    lastSheet = [];
    displayItems = [];
    
    // Set local variable for data from Google Sheet.
    var lastSheetResults = result.feed.entry;

    // Map reduce here is slow, could it be faster?
    // Limited to 10 columns.
    for (var i = 0; i < 11; i++) {

      // Map Sheet results into locally usable hash object, organized by column
      var column = $.map( lastSheetResults, function( n ) {
        // If hasColor, get the hex Color for this row and store it with this value.
        return n['gs$cell']['col'] == i  ? n : null;
      });

      if (column.length > 0) {
        columnKey = column.shift();
        if (column.length > 0) {
          lastSheet.push(column);
          randomItem = this.getRandomColumnItem(column);

          if (columnKey['content']['$t'] !== 'hex_color') {
            var item = {'label': columnKey['content']['$t'], 'content': randomItem['content'], 'id': randomItem['id']};
            displayItems.push(item);
          }
          
        }
      }
    }

    state = {
      sheetArray: lastSheet,
      displayItems: displayItems
    }
    this.setState(state);
  },

  getRandomColumnItem: function(column) {
    var randomRowNumber = Math.floor(Math.random()*column.length);
    var randomItem = column[randomRowNumber]['content']['$t'];

    // if (columnHeaders[i]['content']['$t'] === "hex_color") {
    //   item['hexColor'] = "#" + randomItem[i]['content']['$t']; // @TODO add cleanup hex value function.
    // }

    //// if (columnHeaders[i]['content']['$t'] !== "hex_color") {
    return {'content': randomItem, 'id': randomRowNumber};

  },

  getRandomRowItem: function(columnHeaders, rows) {
    
    var randomRowNumber = Math.floor(Math.random()*rows.length);
    var randomItem = rows[randomRowNumber];
    content = []

    for (var i=0; i< randomItem.length; i++) {
      var item = {};
      
      if (columnHeaders[i]['content']['$t'] !== "hex_color") {
        item['label'] = columnHeaders[i]['content']['$t'];
        item['content'] = randomItem[i]['content']['$t'];
        item['id'] = randomRowNumber;
      } 
      
      // if (columnHeaders[i]['content']['$t'] === "hex_color") {
      //   item['hexColor'] = "#" + randomItem[i]['content']['$t']; // @TODO add cleanup hex value function.
      // }

      if (columnHeaders[i]['content']['$t'] !== "hex_color") {
        content.push(item);
      }
      
    }
    return content;
  },

  render: function() {
    var results = this.state.displayItems;

    if (this.state.groupColumns == false && results !== undefined && results[0] !== undefined) {
      console.log(results);
      return (

          <div>
            {results.map(function(result) {

                // @TODO check props settings here for how to use React  -- type={result.label} 
                console.log(result);
                return <div className="card">{result.label}: {result.content}</div>;  

            })}
          </div>
      );
    }
    else {
      return (
          <div>
            {results.map(function(result) {

                // @TODO check props settings here for how to use React  -- type={result.label} 
                return <div className="card">{result.content}</div>;  

            })}
          </div>
        );
    }

  }
});
// Demo: https://spreadsheets.google.com/feeds/cells/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/default/public/full?min-row=1&min-col=1&max-col=10&alt=json-in-script
// Kitchen Cards: 1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII
var source = {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', cols: 2}; // Kitchen
// var source = {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8}; // list

var sourcePath = "https://spreadsheets.google.com/feeds/cells/" + source.key + "/default/public/full?min-row=1&min-col=1&max-col=" + source.cols + "&alt=json-in-script";
React.render(
  <Sheet source={sourcePath} />,
  document.getElementById('theme')
);