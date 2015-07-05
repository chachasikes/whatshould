// Interpret and validate URL for google doc.
// @TODO - rig up input box, store values
//---------
// gdocURL example
// https://docs.google.com/spreadsheets/d/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/pub?gid=0&single=true&output=csv


// @TODO make reactclasses work. install LESS/SASS

// TEST: gdoc loads or fails - good gdoc/bad gdoc (no data, bad url, 20 cols, 1 row, no rows, ajax fails)

// Load gdoc via ajax or fail.
// Parse gdoc or fail. (can be read, can't be read as array, not enough data, errors (content))
// Use first row as a label if more than one column or fail. 
// Collect remaining rows as an array or fail.

// Set localdata store.
// Choose a random item.
// Update display. // TEST values exist for each column.

// Iterate through other rows until no results. (limited by column)
// @TODO see if gdoc will allow for 1 data retreival or if multiple ajax calls for columns is the easiest way to get the data.
// @TODO render jsx via react-tools once npm isn't broken locally. (running through python server)


var Gdoc = React.createClass({
  getInitialState: function() {
    return {
      lastGdocArray: [],
      randomItems: [],
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.source,
      success: function(result) {
        var lastGdocResults = result.feed.entry;

        lastGdoc = [];
        randomItems = [];
        
        // Map reduce here is slow, could it be faster?
        // Limited to 5 columns.
        for (var i = 0; i < 11; i++) {

          var column = $.map( lastGdocResults, function( n ) {
            return n['gs$cell']['col'] == i  ? n : null;
          });

          if (column.length > 0) {
            columnKey = column.shift();
            lastGdoc.push(column);
            randomItem = this.getRandomItem(column);
            randomItems.push({'label': columnKey['content']['$t'], 'content': randomItem})
          }

        }

        if (this.isMounted()) {
          
          
          if (lastGdoc.length > 0 && randomItem.length > 0) {
            this.setState({
              lastGdocArray: lastGdoc,
              randomItems: randomItems
            });
          }

        }
      }.bind(this),
      dataType: 'jsonp',
    });
  },

  getRandomItem: function(column) {
    var randomItem = column[Math.floor(Math.random()*column.length)]['content']['$t'];
    return randomItem;
  },

  render: function() {
    var results = this.state.randomItems;
    return (
      <ul>
        {results.map(function(result) {
          return <li>{result.label}: {result.content}</li>;
        })}
      </ul>
    );
  }
});

React.render(
  <Gdoc source="https://spreadsheets.google.com/feeds/cells/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/default/public/full?min-row=1&min-col=1&max-col=10&alt=json-in-script" />,
  document.getElementById('theme')
);