React.render(
  <Collections />,
  document.getElementById('collections-list')
);
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
                      <div className="card-content">{result.content}</div>
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
                    <div className="card-content">{result.content}</div>
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
    // Evaluate columns for certain string matches (hex_color, multi_column)
    // Hexcolor can be a 6 string hex code, with or without a #.
    // multi_column doesn't need any values, just to be listed as a column name and the sheet will be interpreted as each column should be randomized.
    // @TODO Think of a better word than "multi_column."
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

      if ( $.inArray('multi_column', columnNames) > -1 ) {
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
    }
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
});
// Process metadata about a collection and render display of a collection. 
// If collection is set to active and current, trigger Collection Item to build and render.
var Collection = React.createClass({
  getInitialState: function() {
    return {};
  },
  
  componentDidMount: function() {
    if (this.props.collection.key !== undefined) {
      var sourcePath = this.getSourcePath(this.props.collection);
    }
    
    // Load Google Sheet.
    $.ajax({
      url: sourcePath,
      success: function(result) {
        if (this.isMounted()) {
          // Get sheet metadata.
          var metadata = this.buildSheetMetadata(result);
          this.setState(metadata);
          this.setState({sourcePath: sourcePath});
          this.forceUpdate();
        }
      }.bind(this),
      dataType: 'jsonp',
    });
  },

  render: function() {
    return this.renderDisplay();
  },

  renderDisplay: function() {
    if (this.props.collection.active === true && this.props.collection.current === true && this.state.sourcePath !== undefined) {
      var uniqueId = this.state.uniqueId;
      var headingId = "heading" + uniqueId;
      var anchorId = "#" + uniqueId;
      return (<div className="row panel-heading" role="tab" id={headingId}>
         <h2 className="title panel-title">
          <a role="button" data-toggle="collapse" data-parent="#collections" href={anchorId} aria-expanded="false" aria-controls={uniqueId}>
            {this.state.sheetTitle}
          </a>
         </h2>

          <div id={uniqueId} className="collection-item col-md-12 col-xs-12 panel-collapse collapse" role="tabpanel" aria-labelledby={headingId}>
            <CollectionItem sourcePath={this.state.sourcePath} sheetTitle={this.state.sheetTitle} />
          </div>
        </div>
        );
    }
    else {
      return ( <div className="row">
        <h2 className="title">{this.state.sheetTitle}</h2>
        <div className="extras">{this.state.author_name}, {this.state.source_updated_at}</div>
      </div>
      );
    }
  },

  // @TODO untested
  getSourceEditPath: function(collection) {
    if (collection.key.type == "googleSheet") {
      return  "https://docs.google.com/spreadsheets/d/" + collection.key.key + "/edit";
    }
    else if (collection.key.type == "pinterest") {
      return "https://api.pinterest.com/v3/pidgets/boards/" + + collection.key.username + "/" + collection.key.boardname + "/pins/";
    }
  },

  getSourcePath: function(collection) {
    if (collection.key.type === "googleSheet") {
      return "https://spreadsheets.google.com/feeds/cells/" + collection.key.key + "/default/public/full?min-row=1&min-col=1&alt=json-in-script";
    }
    else if (collection.key.type === "pinterest") {
      return "https://api.pinterest.com/v3/pidgets/boards/" + collection.key.username + "/" + collection.key.boardname + "/pins/";
    }
  },

  // Get the title of the sheet. (Document title is apparently unavailable.)
  buildSheetMetadata: function(result) {
    var uniqueId = this.generateShortGUID();

    if (result.data !== undefined && result.data !== null && result.data.board !== null) {
      return {
        sheetTitle: result.data.board.name,
        sheetDescription: result.data.board.description,
        author_name: result.data.user.full_name,
        rowCount: result.data.board.pin_count,
        uniqueId: uniqueId,
      };
    }
    else {
      return {
        sheetTitle: result.feed.title.$t,
        author_name: result.feed.author[0].name.$t,
        author_email: result.feed.author[0].email.$t,
        source_updated_at: result.feed.updated.$t,
        rowCount: result.feed.gs$rowCount.$t,
        colCount: result.feed.gs$colCount.$t,
        uniqueId: uniqueId,
      };
    }
  },

  generateShortGUID: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    // longGUID =  s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    var shortGUID =  s4() + s4() + s4() + s4();
    return shortGUID
  },
});

var Collections = React.createClass({
  getDefaultProps: function() {

    // Get htmlstorage as props.
    var HTML5LocalStorage = localStorage.getItem("whatshould_local_paths");

    // var storedCollections = [
    //     {key: {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', type: 'googleSheet'}, active: true, current: true},
    //     {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
    //     // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true, type: 'googleSheet'},
    //     // {key: '1E949ZFaBbQxiSxBBZMyAIw9KJtHolm0XNsnnQoMjuoM', active: true, current: true, type: 'googleSheet'},
    // ];

    return {
      defaultCollections: [
        {key: {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', type: 'googleSheet'}, active: true, current: true},
        {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
        {key: {key: '1FPefy-GxbVtD9osXviZTudATTYwNW0QCOI0CWApGEpw', type: 'googleSheet'}, active: true, current: true}
        // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true, type: 'googleSheet'}
      ],
      HTML5LocalStorage: JSON.parse(HTML5LocalStorage)
    };
  },

  // gdoc_link_google_sheet_key_value: 'https://docs.google.com/spreadsheets/d/114lrI12YPOnfix390rewcTFudfrsIvu4jmd9fk-v-uw/edit#gid=0'
  getInitialState: function () {
    // Get current data object for collections.
    var storedCollection = this.loadStoredCollections();

    // Set values for input fields.
    return {
      google_sheet_key_value: undefined,
      pinboard_name_value: undefined,
      pinboard_username_value: undefined,
      storedCollections: storedCollection,
    };
  },

  loadStoredCollections: function() {
    // Get data from storage. If data exists, use it for the main data object, otherwise use defaults for demo-purposes.
    // if ( this.props.HTML5LocalStorage !== undefined && this.props.HTML5LocalStorage !== null && (this.state === null || this.state.storedCollections.length == 0)) {
    //   return this.props.HTML5LocalStorage;
    // }
    // else if (this.state.storedCollections.length > 0) {
    //   return this.state.storedCollections;
    // }
    // else {
      // If not, use data from the defaults.
      return this.props.defaultCollections;
    // }
  },

  setHTML5LocalStorage: function() {
    // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
    // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
    // to avoid the entire page breaking, without having to do a check at each usage of Storage.
    if (typeof localStorage === 'object') {
      try {
        // sessionStorage.removeItem('whatshould_local_paths');
        localStorage.setItem("whatshould_local_paths", JSON.stringify(this.state.storedCollections));
      } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
        alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
      }
    }
  },

  render: function() {

    if (this.state.storedCollections !== undefined && this.state.storedCollections.length > 0 &&  this.state.storedCollections !== null) {
      return (<div className="row">
          <div className="row">
            {this.state.storedCollections.map(this.eachCollection)}
          </div>
          <div className="row">
            {this.createForm()}
          </div>
        </div>
      );
    }
    else {
        return (<div className="row">
          <h2 className="title">What Should I ____ ?</h2>
          Add some Google Sheets or Pinterest boards.

          {this.createForm()}

        </div>
      ); 
    }
  },

  // {this.getComponent.bind(this, 1)}
  // {this.editCollectionForm(collection, i)}
  eachCollection: function(collection, i) {
    if (collection !== null) {
      return (<div className="collection panel panel-default col-md-12 col-xs-12">
          <Collection collection={collection} key={i} key2={collection.key} index={i} />

      </div>);
    }
    else {
      return;
    }
  },
  

  createForm: function() {
    return (<div id="collections-add" className="col-md-12 col-xs-12">
      <div className="add-google-sheet">
        Add Google Sheet<br />
        <input className="collection-add-google" google_sheet_key_value={this.state.google_sheet_key_value} onChange={this.handleChangeGoogleSheet} />
      </div>

      <div className="add-pinboard">
        Add Pinboard <br />
        
        name:
        <input className="collection-add-pinboard-name" pinboard_name_value={this.state.pinboard_name_value} onChange={this.handleChangePinboard} />
        
        username:
        <input className="collection-add-pinboard-username" pinboard_username_value={this.state.pinboard_username_value} onChange={this.handleChangePinboard} />
      
        {this.addControls()}
      </div>

    </div>);
  },

  addControls: function() {
    return (<div><button className="btn btn-group glyphicon glyphicon-ok" onClick={this.add} /></div>);
  },

  editCollectionForm: function(collection, i) {
    return (<div><button className="btn btn-xs" collection={collection} index={i} onClick={this.remove.bind(null, i)}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button></div>);
  },

  add: function(i) {
    console.log("save");
    console.log(this.state);
    
      // google_sheet_key_value: undefined,
      // pinboard_name_value: undefined,
      // pinboard_username_value: undefined,

    var newCollection = this.buildCollection();
    this.storedCollection(newCollection);

    // Make displays render again.
    this.forceUpdate();
  },

  buildCollection: function() {
    // this.props.onChange(this.refs.somevalue.getDOMNode().value, this.props.index);
    // @TODO change the way the keys are validated. Match hashes.
    if (this.state.pinboard_name_value !== undefined && this.state.pinboard_username_value !== undefined) {
      var exists = this.keyExists(this.state.pinboard_name_value);
      if (exists === false) {
        var newCollection = {key: {key: this.state.pinboard_name_value, username: this.state.pinboard_username_value, type: 'pinterest'}, current: true, active: true};
      }
    }
    else if (this.state.google_sheet_key_value !== undefined) {
      var exists = this.keyExists(this.state.google_sheet_key_value);
      if (exists === false) {
        var newCollection = {key: {key: this.state.google_sheet_key_value, type: 'googleSheet'}, current: true, active: true};
      }
    }
    return newCollection;
  },

  storeCollection: function(newCollection) {
    // Set up or update the data object.
    var storedCollections = this.loadStoredCollections();
    // Add value to the data object.
    storedCollections.push(newCollection);
    this.setState({storedCollections: storedCollections});
    this.setHTML5LocalStorage();
  },

  remove: function(i) {
    console.log(i);

    // lookup the key/
    // var data = this.state.storedCollections
    // data.splice(i, 1);
    // console.log(data);
    // console.log(data.length);
    // this.setState({storedCollections: data});
    // this.setHTML5LocalStorage();

    // Make displays render again.
    this.forceUpdate();
  },


  //     google_sheet_key_value: undefined,
  // pinboard_name_value: undefined,
  // pinboard_username_value: undefined,

  handleChangeGoogleSheet: function(event) {
    console.log("gs");
    console.log(event);
    console.log(event.target);
    this.setState({
      google_sheet_key_value: event.target.google_sheet_key_value,
      
    });
  },

  handleChangePinboard: function(event) {
    this.setState({
      pinboard_name_value: event.target.pinboard_name_value,
      pinboard_username_value: event.target.pinboard_username_value,
    });
  },

  keyExists: function(key) {
    var exists = false;
    console.log(key);
    this.state.storedCollections.map(function(sc){
      if (key == sc.key) {
        exists = true;
      }
    });
    return exists;
  },

});
