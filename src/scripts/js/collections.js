var Collections = React.createClass({
  getDefaultProps: function() {

    // Get htmlstorage as props.
    var HTML5LocalStorage = localStorage.getItem("whatshould_local_paths");

    function getURLParameter(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }



    var googleDocHash = getURLParameter('gdoc');
    var pinterest_username = getURLParameter('pinterest_username');
    var pinterest_board = getURLParameter('pinboard');

    
//http://localhost:7033/?gdoc=1Zjt-QADqUh_uALkR8fNUfyahaVIGw8mTmxDxFG3WMSo&pinterest_user=chachasikes&pinboard=patterns
    // var storedCollections = [
    //     {key: {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', type: 'googleSheet'}, active: true, current: true},
    //     {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
    //     // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', active: true, current: true, type: 'googleSheet'},
    //     // {key: '1E949ZFaBbQxiSxBBZMyAIw9KJtHolm0XNsnnQoMjuoM', active: true, current: true, type: 'googleSheet'},
    // ];

    // 1Zjt-QADqUh_uALkR8fNUfyahaVIGw8mTmxDxFG3WMSo

      if (googleDocHash != undefined) {
        var gdoc = {key: {key: googleDocHash, type: 'googleSheet'}, active: true, current: true};
      }
      else {
        var gdoc = {key: {key: '1-4Tl0L9OHCU0mFRn_8RJd9PlAMPKP3wMy8GSmvu1X7w', type: 'googleSheet'}, active: true, current: true};
      }

      if (pinterest_username != undefined && pinterest_board != undefined) {
        var pinboard = {key: {boardname: pinterest_board, username: pinterest_username, type: 'pinterest'}, active: true, current: true}
      }
      else {
        pinboard = {key: {boardname: 'patterns', username: 'chachasikes', type: 'pinterest'}, active: true, current: true};
      }



    return {
      defaultCollections: [
        // {key: {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', type: 'googleSheet'}, active: true, current: true},
        // {key: {boardname: 'silver', username: 'chachasikes', type: 'pinterest'}, active: true, current: true},
        pinboard,
        // {key: {key: '1FPefy-GxbVtD9osXviZTudATTYwNW0QCOI0CWApGEpw', type: 'googleSheet'}, active: true, current: true},
        gdoc
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
    // If we have data for the collections
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
  // {this.editCollectionForm(collection, i)}
  eachCollection: function(collection, i) {
    if (collection !== null) {
      return (<div className="collection panel panel-default col-md-12 col-xs-12">
          <Collection collection={collection} key={i} data={collection.key} />
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
