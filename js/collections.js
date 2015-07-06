var Collections = React.createClass({
  getDefaultProps: function() {
    return {
      defaultCollections: [
        {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8, active: true, current: false},
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

  setHTML5LocalStorage: function() {
    var storedCollections = [
        {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8, active: true, current: true},
        {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', cols: 2, active: true, current: true},
        {key: '1E949ZFaBbQxiSxBBZMyAIw9KJtHolm0XNsnnQoMjuoM', cols: 7, active: true, current: true},
    ];

    sessionStorage.setItem("whatshould_local_paths", JSON.stringify(storedCollections));
  },

  loadHTML5LocalStorage: function() {
    // Access some stored data    
    var HTML5LocalStorage = sessionStorage.getItem("whatshould_local_paths");
    console.log(HTML5LocalStorage);
    this.props.HTML5LocalStorage = JSON.parse(HTML5LocalStorage);
  },

  loadStoredCollections: function() {
    if ( this.props.HTML5LocalStorage !== undefined && this.props.HTML5LocalStorage.length > 0) {
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
