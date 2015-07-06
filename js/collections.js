var Collections = React.createClass({
  getDefaultProps: function() {
    return {
      defaultCollections: [
        {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', active: true, current: true},
        // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true}
      ],
      storedCollections: [],
    };
  },

  getInitialState: function () {
    return {
      value: '114lrI12YPOnfix390rewcTFudfrsIvu4jmd9fk-v-uw',
      // gdoc_link_value: 'https://docs.google.com/spreadsheets/d/114lrI12YPOnfix390rewcTFudfrsIvu4jmd9fk-v-uw/edit#gid=0'
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
    //     {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', active: true, current: true},
    //     // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true},
    //     // {key: '1E949ZFaBbQxiSxBBZMyAIw9KJtHolm0XNsnnQoMjuoM', active: true, current: true},
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
    return (<div><input className="collection-add" value={this.state.value} onChange={this.handleChange} /></div>);
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

    var exists = this.keyExists(this.state.value);


    if (exists === false) {
      var newCollection = {key: this.state.value, current: true, active: true};
      console.log(newCollection);
      this.props.storedCollections.push(newCollection);
      console.log(this.props.storedCollections);
      this.setHTML5LocalStorage();
    }
    this.forceUpdate();
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
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
