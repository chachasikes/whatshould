// Load a Google Sheet and process results as a randomly selected item from a Collection.
var CollectionItem = React.createClass({
  // Depending on the type of display (grouped or ungrouped), provide markup.
  // Establish initial state settings for this class.
  getInitialState: function() {
    return {
      sheetArray: [],
      displayItems: [],
      hasHexColor: false,
      groupColumns: true,
      maxColumns: 11,
      columnHeaders: [],
      isPinterestBoard: false,
    };
  },
  
  // componentWillMount: function() {
  //   this.style = {
  //     backgroundColor: 'blue',
  //   };

  // },

  // If Google Sheet loads, process the results.
  componentDidMount: function() {
    // Load Google Sheet.

    $.ajax({
      url: this.props.sourcePath,
      success: function(result) {

        if (this.isMounted()) {

          // Read column names to determine how to handle the Sheet.
          columnState = this.readSheetHeaderColumns(result);
          this.setState(columnState);

          // If sheet should be grouped into rows, process as grouped.
          if (this.state.isPinterestBoard === false ) {
            if (this.state.groupColumns == true) {
              dataState = this.mapSheetColumnsGrouped(result);
              this.setState(dataState);
            }
            else {
              this.mapSheetColumnsUngrouped(result);
            }
          }
          else {
            dataState = this.mapPinterestBoard(result);
            this.setState(dataState);
          }
        }

      }.bind(this),
      dataType: 'jsonp',
    });
  },

  render: function() {
    var results = this.state.displayItems;
    if (this.state.groupColumns == true && results !== undefined && results[0] !== undefined && this.state.isPinterestBoard == false) {
      return (
          <div className="row">

            {results[0]['values'].map(function(result) {
                // @TODO check props settings here for how to use React  -- type={result.label}
                //  style={results[0]['hexColor']} how to do inline styles?
                // https://github.com/FormidableLabs/radium, https://github.com/js-next/react-style
                return <div className="record col-md-4 col-xs-12">
                    <div className="card">
                      <div className="card-label">{result.label}</div>
                      <div className="card-content" dangerouslySetInnerHTML={{__html: result.content}}></div>
                    </div>
                  </div>;
            })}
          </div>
      );
    }
    else if (this.state.groupColumns == false && results !== undefined && results['values'] !== undefined) {


        return (
            <div className="row">

              {results['values'].map(function(result) {
                  // @TODO check props settings here for how to use React  -- type={result.label}

                return <div className="record col-md-4 col-xs-12">
                  <div className="card">
                    <div className="card-label">{result.label}</div>
                    <div className="card-content" dangerouslySetInnerHTML={{__html: result.content}}></div>
                    </div>
                  </div>;
              })}
            </div>
          );
    }
    else if (this.state.isPinterestBoard === true && results !== undefined && results[0] !== undefined ) {

        return (
            <div className="row">

              {results.map(function(result) {
                  // @TODO check props settings here for how to use React  -- type={result.label}

                return <div className="record col-md-4 col-xs-12">
                  <div className="card">
                      <div className="card-content"><a href={result['link']}>  <img src={result['image']['url']} /> </a></div>
                      <div className="card-label">{result['content']}</div>
                    </div>
                  </div>;
              })}
            </div>
          );
    }
    else {
      return (
        <div>
          No results yet... loading.
        </div>
      );
    }
  },

  // Find the first column and first row data from Google Sheet JSON object.
  // Return updated state settings based on information about the columns.
  readSheetHeaderColumns: function(result) {

    // Find the first column and first row data from Google Sheet JSON object.
    // Get column header list as an array.
    // Evaluate columns for certain string matches (hex_color, use_columns)
    // Hexcolor can be a 6 string hex code, with or without a #.
    // use_columns doesn't need any values, just to be listed as a column name and the sheet will be interpreted as each column should be randomized.
    // @TODO Think of a better word than "use_columns."
    // Return some local state settings to be stored with the Class.

    var state = {};
    // Set local variable for data from Google Sheet.
    if (result.data !== undefined && result.data !== null && result.data.board !== null) {
        state.hasHexColor = false;
        state.groupColumns = false;
        state.isPinterestBoard = true;
        return state;
    }
    else {
      var lastSheetResults = result.feed.entry;

      var columnNames = $.map( lastSheetResults, function( n ) {
        return (n['gs$cell']['col'] < 11 && n['gs$cell']['row'] == 1) ? n['gs$cell']['$t'] : null;
      });


      // If hasColor, get the hex Color for this row and store it with this value.
      if ( $.inArray('hex_color', columnNames)  > -1 ){
        state.hasHexColor = true;
      }

      if ( $.inArray('use_columns', columnNames) > -1 ) {
        state.groupColumns = false;
      }

      return state;
    }
  },

  // Process the random pin item;
  mapPinterestBoard: function(result) {
    lastSheet = [];
    displayItems = [];

    // Set local variable for data from Google Sheet.
    var pinResults = result.data.pins;


    lastSheet = pinResults;
    var pinCount = 3;


    for (var i=0;i<pinCount;i++){
      randomItem = this.getRandomPinItem(pinResults);
      displayItems.push(randomItem);
    }

    state = {
      sheetArray: lastSheet,
      displayItems: displayItems
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
    };

    this.setState(state);
  },

  getRandomPinItem: function(pins) {
    var randomRowNumber = Math.floor(Math.random()*pins.length);
    randomPin = pins[randomRowNumber];
    console.log(randomPin);
    return {'content': randomPin.description, 'id': randomPin.id, 'label': 'label', 'link': randomPin.link, 'image': randomPin.images['237x'] };
  },

  // Chose an item from a column list and format as a data object for display.
  getRandomColumnItem: function(columnKey, column) {
    var randomRowNumber = Math.floor(Math.random()*column.length);
    console.log(randomRowNumber);
    var randomItem = column[randomRowNumber]['content']['$t'];
    console.log(randomItem);

    // randomItem is an image: 
    if (randomItem.match( /\.(gif|jpg|jpeg|tiff|png)$/i) ) {
      randomItem = '<img class="image" src="' + randomItem + '" />';
    }

    return {'content': randomItem, 'id': randomRowNumber, 'label': columnKey['content']['$t']};
  },

  // Chose an item from a row list and format as a data object for display.
  getRandomRowItem: function(columnHeaders, rows) {
    var randomRowNumber = Math.floor(Math.random()*rows.length);
    var randomItem = rows[randomRowNumber];
    console.log(randomItem);
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

      if (item['content'].match( /\.(gif|jpg|jpeg|tiff|png)$/i) ) {
        item['content'] = '<img class="image" src="' + item['content'] + '" />';
      }


      if (columnHeaders[i]['content']['$t'] === "hex_color") {
       content.hexColor =  randomItem[i]['content']['$t']; // @TODO add cleanup hex value function.
       console.log(content.hexColor);
      }
      else {
        content.values.push(item);
      }
    }
    return content;
  },
});