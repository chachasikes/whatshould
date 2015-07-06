var Collections = React.createClass({
  getDefaultProps: function() {
    return {
      defaultCollections: [
        {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8, active: true, current: true},
        // {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', cols: 2, active: true, current: true}
      ],
      storedCollections: []
    };
  },

  render: function() {
    this.setHTML5LocalStorage();
    this.loadHTML5LocalStorage();
    this.props.storedCollections = this.loadStoredCollections();

    return (
      <div className="row">
        <h2 className="title">Lists</h2>
        {this.props.storedCollections.map(function(collection) {

          return <div className="collection col-md-12 col-xs-12">
              <Collection collection={collection} />
          </div>;  
        })}
      </div>
    );
  },

// safari error: http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
  
  

  setHTML5LocalStorage: function() {
    var storedCollections = [
        {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8, active: true, current: true},
        {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', cols: 2, active: true, current: true},
        {key: '1E949ZFaBbQxiSxBBZMyAIw9KJtHolm0XNsnnQoMjuoM', cols: 7, active: true, current: true},
    ];

    sessionStorage.removeItem('whatshould_local_paths');
    
    // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
    // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
    // to avoid the entire page breaking, without having to do a check at each usage of Storage.
    // if (typeof localStorage === 'object') {
    //     try {
    //         sessionStorage.removeItem('whatshould_local_paths');
    //         sessionStorage.setItem("whatshould_local_paths", JSON.stringify(storedCollections));
            
    //     } catch (e) {
    //         Storage.prototype._setItem = Storage.prototype.setItem;
    //         Storage.prototype.setItem = function() {};
    //         alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
    //     }
    // }
  },

  loadHTML5LocalStorage: function() {
    // Access some stored data    
    var HTML5LocalStorage = sessionStorage.getItem("whatshould_local_paths");
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

  // updateDisplay: function() {

  // },

  // loadCollectionItem: function() {

  // },

  // list: function() {

  // },

  // addControls: function() {

  // },

  // formatList: function() {

  // },

  // unloadAll: function() {

  // },

  // deleteAll: function() {

  // },

  // updateAll: function() {

  // },

  // setActiveList: function() {

  // },

  // sheetFormattingGuidelines: function() {

  // },

  // showAbout: function() {

  // },

  // toggleMenu: function() {

  // },

}
);
