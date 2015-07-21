var Collections = React.createClass({
  getDefaultProps: function() {
    return {
      defaultCollections: [
        // {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
        {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', active: true, current: true, type: 'googleSheet'}
      ],
    };
  },

  propTypes: {
    count: function(props, propName) {
      if (typeof props[propName] !== number) {
        return new Error('Count property must be a number.')
      }
      if (props[propName] > 100 ) {
        return new Error('Limited to 100 records.')
      }
    }
  },

  // gdoc_link_google_sheet_key_value: 'https://docs.google.com/spreadsheets/d/114lrI12YPOnfix390rewcTFudfrsIvu4jmd9fk-v-uw/edit#gid=0'
  getInitialState: function () {
    // Set values for input fields.
    return {
      google_sheet_key_value: "1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII",
      pinboard_name_value: undefined,
      pinboard_username_value: undefined,
      storedCollections: [],
    };
  },

  render: function() {
    // Get current data object for collections.
    this.loadStoredCollections();

    if (this.state.storedCollections !== undefined && this.state.storedCollections.length > 0 &&  this.state.storedCollections !== null) {
      return (<div className="row">
          <div className="row">
            {this.state.storedCollections.map(this.eachCollection)}
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
// <button className="btn btn-xs" onClick={this.remove} ><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
  eachCollection: function(collection, i) {
    if (collection !== null) {
      return (<div className="collection panel panel-default col-md-12 col-xs-12">
          <Collection collection={collection} key={collection.key} index={i} />
         
      </div>);
    }
    else {
      return;
    }
  },

  remove: function(a,b,c,i) {
    console.log("remove");
    console.log (a, b, c, i);
    console.log(this);

    // this.onRemove(this.props.index);
    // var data = this.state.storedCollections;
    // console.log(data);
    // console.log(data.length);
    // data.splice(i,1);
    // console.log(data);
    // console.log(data.length);
    // this.forceUpdate();
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



  add: function(i) {
    console.log(i);
    console.log(this.refs);
    console.log("save");
    // this.props.onChange(this.refs.somevalue.getDOMNode().value, this.props.index);
    // @TODO change the way the keys are validated. Match hashes.
    if (this.state.pinboard_name_value !== undefined && this.state.pinboard_username_value !== undefined) {
      // var exists = this.keyExists(this.state.pinboard_name_value);
      // if (exists === false) {
        var newCollection = {key: {key: this.state.pinboard_name_value, username: this.state.pinboard_username_value, type: 'pinterest'}, current: true, active: true};
      // }
    }
    else if (this.state.google_sheet_key_value !== undefined) {
      var newCollection = {key: {key: this.state.google_sheet_key_value, type: 'googleSheet'}, current: true, active: true};
    }

    // Set up or update the data object.
    this.loadStoredCollections();
    // Add value to the data object.
    this.state.storedCollections.push(newCollection);
    this.setHTML5LocalStorage();

    // Make displays render again.
    this.forceUpdate();
  },



  loadStoredCollections: function() {
    // Get data from storage
    this.loadHTML5LocalStorage();
    
    // If data exists, use it for the main data object.
    if ( this.props.HTML5LocalStorage !== undefined && this.props.HTML5LocalStorage !== null) {
      this.state.storedCollections = this.props.HTML5LocalStorage;
    }
    else {
      // If not, use data from the defaults.
      this.state.storedCollections = this.props.defaultCollections;
    }

    // Update the localStorage setting.
    this.setHTML5LocalStorage();
    return;
  },

  loadHTML5LocalStorage: function() {
    // Access some stored data    
    var HTML5LocalStorage = localStorage.getItem("whatshould_local_paths");
    this.props.HTML5LocalStorage = JSON.parse(HTML5LocalStorage);
  },

  setHTML5LocalStorage: function() {
    // var storedCollections = [
    //     {key: {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', type: 'googleSheet'}, active: true, current: true},
    //     {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
    //     // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true, type: 'googleSheet'},
    //     // {key: '1E949ZFaBbQxiSxBBZMyAIw9KJtHolm0XNsnnQoMjuoM', active: true, current: true, type: 'googleSheet'},
    // ];

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

  handleChangeGoogleSheet: function(event) {
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
    this.state.storedCollections.map(function(sc){
      if (key == sc.key) {
        exists = true;
      }
    });
    return exists;
  },
}
);
