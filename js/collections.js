var Collections = React.createClass({
  getDefaultProps: function() {
    return {
      collections: [],
      storedCollections: []
    };
  },

  render: function() {
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

  loadStoredCollections: function() {
    // from local store or cookie;
    // @TODO change data
    
    var storedCollections =[
      {key: '17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU', cols: 8, active: true, current: true},
      {key: '1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII', cols: 2, active: true, current: false}
    ];
    return storedCollections;
  },

  // loadCurrentActiveCollection: function() {
  //   var currentCollection = _.select(this.props.collections, function(c) {return c.active === true && c.current === true});
  //   console.log(currentCollection);
  // },

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
