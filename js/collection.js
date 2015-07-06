var Collection = React.createClass({
  
  render: function() {

    console.log(this.props.collection);
    if (this.props.collection.key !== undefined && this.props.collection.cols !== undefined) {
      // this.setState(this.getSourcePath(this.props.collection));
    }

    // if (this.props.collection.active === true && this.props.collection.current === true) {
      
    //   return (<div className="row">
    //       <h2 className="title">Sheets</h2>
    //       {this.state.collection.sheetTitle}
    //       <div className="collection-item col-md-12 col-xs-12">
    //         <CollectionItem collection={this.state.collection} />
    //       </div>
    //     </div>);
    // }

    // else {
      return ( <div className="row">
        <h2 className="title">Sheets</h2>
        // {this.state.collection.sheetTitle}
      </div>
      );
    // }
  },

  getSourcePath: function(collection) {
    return {
      sourcePath: "https://spreadsheets.google.com/feeds/cells/" + collection.key + "/default/public/full?min-row=1&min-col=1&max-col=" + collection.cols + "&alt=json-in-script"
    };
  },

  // Get the title of the sheet. (Document title is apparently unavailable.)
  readSheetMetadata: function(result) {
    return {
      sheetTitle: result.feed.title.$t,
      // @TODO Map these to the feed.
      creator: 'name',
      creator_email: 'email',
      source_updated_at: 'date',
      source_created_at: 'date',
      updated_at: 'date',
      created_at: 'date',
      numberItems: 1,
      type: 'ungrouped',
      source_edit_path: '',
    };

  },

  componentDidMount: function() {
    // Load Google Sheet.
    $.ajax({
      url: collection.sourcePath,
      success: function(result) {

        if (this.isMounted()) {
          console.log("mount collection");
          // Get sheet metadata.
          var metadata = this.readSheetMetadata(result);
          this.state.collection = this.props.collection;
          this.state.collection.metadata = metadata;
        }

      }.bind(this),
      dataType: 'jsonp',
    });
  },


  // createForm: function() {

  // },

  // renderForm: function() {

  // },

  // validateForm: function() {

  // },

  // save: function() {

  // },

  // edit: function() {

  // },

  // trash: function() {

  // },

  // add: function() {

  // },

  // remove: function() {

  // },

  // updateDisplay: function() {

  // },

  // validate: function() {

  // },

  // setActive: function() {

  // },

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
