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
