var Collection = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    if (this.props.collection.active === true && this.props.collection.current === true && this.state.sourcePath !== undefined) {
      return (<div className="row">
         <h2 className="title">{this.state.sheetTitle}</h2>
          <div className="collection-item col-md-12 col-xs-12">
            <CollectionItem sourcePath={this.state.sourcePath} sheetTitle={this.state.sheetTitle} />
          </div>
        </div>);
    }
    else {
      return ( <div className="row">
        <h2 className="title">{this.state.sheetTitle}</h2>
        <div className="extras">{this.state.author_name}, {this.state.source_updated_at}</div>
      </div>
      );
    }
  },

  getSourceEditPath: function(collection) {
    return  "https://docs.google.com/spreadsheets/d/" + collection.key + "/edit";
  },

  getSourcePath: function(collection) {
    return "https://spreadsheets.google.com/feeds/cells/" + collection.key + "/default/public/full?min-row=1&min-col=1&alt=json-in-script";
  },

  // Get the title of the sheet. (Document title is apparently unavailable.)
  buildSheetMetadata: function(result) {
    return {
      sheetTitle: result.feed.title.$t,
      author_name: result.feed.author[0].name.$t,
      author_email: result.feed.author[0].email.$t,
      source_updated_at: result.feed.updated.$t,
      rowCount: result.feed.gs$rowCount.$t,
      colCount: result.feed.gs$colCount.$t,
    };
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



  // unload: function() {

  // },

  // copyLink: function() {

  // },

  // editSource: function() {

  // },

  // isValidSheet: function() {

  // },

  // getMetaData: function() {

  // },

  // store: function() {

  // },


});
