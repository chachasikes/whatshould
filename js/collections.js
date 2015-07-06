var Collections = React.createClass({
  getDefaultProps: function() {
    return {
      defaultCollections: [
        {key: {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', type: 'googleSheet'}, active: true, current: true},
        {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
        // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true, type: 'googleSheet'}
      ],
      storedCollections: [],
    };
  },

  getInitialState: function () {
    return {
      google_sheet_key_value: undefined,
      pinboard_name_value: undefined,
      pinboard_username_value: undefined
      // gdoc_link_google_sheet_key_value: 'https://docs.google.com/spreadsheets/d/114lrI12YPOnfix390rewcTFudfrsIvu4jmd9fk-v-uw/edit#gid=0'
    };
  },

  render: function() {
    this.loadHTML5LocalStorage();
    
    this.props.storedCollections = this.loadStoredCollections();

    this.setHTML5LocalStorage();
    
    return (<div className="row">
        <h2 className="title">Lists</h2>
        {this.props.storedCollections.map(this.eachCollection)}

        {this.addControls()}
        {this.createForm()}
      </div>
    );
  },

  eachCollection: function(collection, i) {
    return (<div className="collection col-md-12 col-xs-12">
        <Collection collection={collection} key={collection.key} onChange={this.update} index={i} onRemove={this.remove} />
    </div>);
  },

  setHTML5LocalStorage: function() {
    //https://remotestorage.io/doc/code/files/remotestorage-js.html
    // var remoteStorage = new RemoteStorage({
    //   logging: true  // defaults to false
    // });

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
            localStorage.setItem("whatshould_local_paths", JSON.stringify(this.props.storedCollections));
            
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
        }
    }
  },

  loadHTML5LocalStorage: function() {
    // Access some stored data    
    var HTML5LocalStorage = localStorage.getItem("whatshould_local_paths");
    this.props.HTML5LocalStorage = JSON.parse(HTML5LocalStorage);
  },

  loadStoredCollections: function() {
    if ( this.props.HTML5LocalStorage !== undefined && this.props.HTML5LocalStorage !== null) {
      return this.props.HTML5LocalStorage;
    }
    else {
      return this.props.defaultCollections;
    }
  },

  addControls: function() {
    return (<div><button className="btn btn-group glyphicon glyphicon-save" onClick={this.save} /></div>);
  },

  deleteAll: function() {
    alert('This will delete all your saved paths.');
    // Add cancel or back out-go through.
    // sessionStorage.removeItem('whatshould_local_paths');
    // localStorage.removeItem('whatshould_local_paths');
  },

  updateDisplay: function() {
    this.forceUpdate(); // dunno if this will work.
  },

  createForm: function() {
    return (<div>
      <div>Add Google Sheet
        <input className="collection-add-google" google_sheet_key_value={this.state.google_sheet_key_value} onChange={this.handleChangeGoogleSheet} />
      </div>

      <div>Add Pinboard
        name:
        <input className="collection-add-pinboard-name" pinboard_name_value={this.state.pinboard_name_value} onChange={this.handleChangePinboard} />
        
        username:
        <input className="collection-add-pinboard-username" pinboard_username_value={this.state.pinboard_username_value} onChange={this.handleChangePinboard} />
      </div>

    </div>);
  },

  keyExists: function(key) {
    var exists = false;
    this.props.storedCollections.map(function(sc){
      if (key == sc.key) {
        exists = true;
      }
    });
    return exists;
  },

  save: function() {
    console.log("save");
    console.log(this.props.storedCollections);
    this.setHTML5LocalStorage();

    

    // @TODO fix save for either type of key

      if (this.state.pinboard_name_value !== undefined && this.state.pinboard_username_value !== undefined) {
        // var exists = this.keyExists(this.state.pinboard_name_value);
        // if (exists === false) {
          var newCollection = {key: {key: this.state.pinboard_name_value, username: this.state.pinboard_username_value, type: 'pinterest'}, current: true, active: true};
        // }
      }
      else if (this.state.google_sheet_key_value !== undefined) {

        var newCollection = {key: {key: this.state.google_sheet_key_value, type: 'googleSheet'}, current: true, active: true};
      }

      this.props.storedCollections.push(newCollection);

      this.setHTML5LocalStorage();

    this.forceUpdate();
  },

  handleChangeGoogleSheet: function(event) {
    this.setState({
      google_sheet_key_value: event.target.google_sheet_key_value,
      
    });
    // unset save
  },

  handleChangePinboard: function(event) {
    this.setState({
      
      pinboard_name_value: event.target.pinboard_name_value,
      pinboard_username_value: event.target.pinboard_username_value,
    });
    // unset save
  },

  update: function() {

  },

  remove: function() {

  },

  // edit: function() {

  // },

  // trash: function() {

  // },

  // add: function() {

  // },

  // setActive: function() {

  // },

  sheetFormattingGuidelines: function() {

  },

  showAbout: function() {

  },

  toggleMenu: function() {

  },

}
);
