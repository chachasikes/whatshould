// Repeat Patterns: https://spreadsheets.google.com/feeds/cells/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/default/public/full?min-row=1&min-col=1&max-col=10&alt=json-in-script
// Kitchen Cards: 1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII

// var source = {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', cols: 2}; // Kitchen
var source = {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8}; // Repeat Patterns
var sourcePath = "https://spreadsheets.google.com/feeds/cells/" + source.key + "/default/public/full?min-row=1&min-col=1&max-col=" + source.cols + "&alt=json-in-script";
// source={sourcePath} 

// Load a Google Sheet and process results as a randomly selected item from a Collection.
var CollectionItem = React.createClass({

 // Depending on the type of display (grouped or ungrouped), provide markup.
  render: function() {

    // console.log(this.props.collection);

    // var results = this.state.displayItems;

    // if (this.state.groupColumns == true && results !== undefined && results[0] !== undefined) {
    //   return (
    //       <div className="row">
    //         // <h2 className="title">{this.props.collection.sheetTitle}</h2>
    //         {results[0]['values'].map(function(result) {
    //             // @TODO check props settings here for how to use React  -- type={result.label} 
    //             //  style={results[0]['hexColor']} how to do inline styles?
    //             // https://github.com/FormidableLabs/radium, https://github.com/js-next/react-style
    //             return <div className="record col-md-4 col-xs-12">
    //                 <div className="card">
    //                 <div className="card-label">{result.label}</div>
    //                 <div className="card-content">{result.content}</div>
    //                 </div>
    //               </div>; 
    //         })}
    //       </div>
    //   );
    // }
    // else if (this.state.groupColumns == false && results !== undefined && results['values'] !== undefined) {
    //     return (
    //         <div className="row">
    //           // <h2 className="title">{this.state.sheetTitle}</h2>
    //           {results['values'].map(function(result) {
    //               // @TODO check props settings here for how to use React  -- type={result.label} 

    //             return <div className="record col-md-4 col-xs-12">
    //               <div className="card">
    //                 <div className="card-label">{result.label}</div>
    //                 <div className="card-content">{result.content}</div>
    //                 </div>
    //               </div>;  
    //           })}
    //         </div>
    //       );
    // }
    // else {
    //       return (
    //         <div>
    //           No results yet... loading.
    //         </div>
    //       );
    // }
   
  },

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


  // If Google Sheet loads, process the results.
  componentDidMount: function() {
    // Load Google Sheet.
    $.ajax({
      url: this.props.collection.sourcePath,
      success: function(result) {

        if (this.isMounted()) {
          console.log("m");
          // Read column names to determine how to handle the Sheet.
          // titleState = this.readSheetTitle(result);
          // this.setState(titleState);
          
          columnState = this.readSheetHeaderColumns(result);
          this.setState(columnState);
          
          // If sheet should be grouped into rows, process as grouped.
          if (this.state.groupColumns == true) {
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
  // Return updated state settings based on information about the columns.
  readSheetHeaderColumns: function(result) {

    // Find the first column and first row data from Google Sheet JSON object. 
    // Get column header list as an array.
    // Evaluate columns for certain string matches (hex_color, multi_column)
    // Hexcolor can be a 6 string hex code, with or without a #.
    // multi_column doesn't need any values, just to be listed as a column name and the sheet will be interpreted as each column should be randomized.
    // @TODO Think of a better word than "multi_column."
    // Return some local state settings to be stored with the Class.

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
    
    if ( $.inArray('multi_column', columnNames) > -1 ) { 
      state.groupColumns = false;
    }
    
    return state;
  },

  // Process the feed from Google Sheets and cluster cells data into row objects.
  mapSheetColumnsGrouped: function(result) {
    lastSheet = [];
    displayItems = [];
    
    // Set local variable for data from Google Sheet.
    var lastSheetResults = result.feed.entry;
    var rows = [];
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

  // Process the feed from Google Sheets and cluster cell data into column objects.
  mapSheetColumnsUngrouped: function(result) {
    lastSheet = [];
    
    // Set local variable for data from Google Sheet.
    var lastSheetResults = result.feed.entry;
    var content = {
        type: 'ungrouped',
        values: [],
        hexColor: null // This is here for consistency, but hex_color won't be used. Remove.
      };

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
          var randomItem = this.getRandomColumnItem(columnKey, column);
          if (columnKey['content']['$t'] !== 'hex_color') {
            content['values'].push(randomItem);
          }
          
        }
      }
    }
    state = {
      sheetArray: lastSheet,
      displayItems: content
    }
    this.setState(state);
  },

  // Chose an item from a column list and format as a data object for display.
  getRandomColumnItem: function(columnKey, column) {
    var randomRowNumber = Math.floor(Math.random()*column.length);
    var randomItem = column[randomRowNumber]['content']['$t'];
    return {'content': randomItem, 'id': randomRowNumber, 'label': columnKey['content']['$t']};
  },

  // Chose an item from a row list and format as a data object for display.
  getRandomRowItem: function(columnHeaders, rows) {
    var randomRowNumber = Math.floor(Math.random()*rows.length);
    var randomItem = rows[randomRowNumber];
    
    content = {
      type: 'grouped',
      values: [],
      hexColor: null
    };

    for (var i=0; i< randomItem.length; i++) {
      var item = {};
      

      item['label'] = columnHeaders[i]['content']['$t'];
      item['content'] = randomItem[i]['content']['$t'];
      item['id'] = randomRowNumber;
      
      if (columnHeaders[i]['content']['$t'] === "hex_color") {
       content.hexColor = "#" + randomItem[i]['content']['$t']; // @TODO add cleanup hex value function.
      }
      else {
        content.values.push(item);      
      }
    }
    return content;
  },

  cardContent: function(result) {

  },

 
});