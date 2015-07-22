- implement bower correctly
- do new wireframes in Sketch
- redo main app markup
- switch to TDD
- make it possible to easily add a new data type: ex. favorited tweets
- trigger SEO capabilities for reactjs app



























-------------------------------------------------------------------------------

#### Completed Features
- Read from a Google Sheet
- Be able to randomly choose values from multiple columns or randomly from a row.
- Find Google Sheets API documentation and figure out API params to get the data we want.
- Find Pinterest API and figure out API params to get the data we want.
- Set a hex_color value for the grouped rows.
- Installed grunt, bower, qunit and jasmine... probably are all close to being functional.
- Stubbed out functions for collections manager.
- Add a test framework
- Add bootstrap for basic formatting and layout


#### Features Next
- issue with setState and mutability, also issue with this.setState not setting. (http://stackoverflow.com/questions/24718709/reactjs-does-render-get-called-any-time-setstate-is-called, http://jaketrent.com/post/set-state-in-callbacks-in-react/)
- is it possible to load a public folder of google sheets? (has to use google drive: https://docs.google.com/document/d/1WgI8GMo47XU-RWgkDf4_m7P5hiTkiTCc4t06V9WIK2E/edit, )
- will shortened urls to google docs load via ajax?
- prioritize most basic editing features for google sheet path
- Create form element to load google sheet path
- Parse google sheet path to get the key
- Deal with unknown column length
- Figure out best way to process form data in ReactJS
- See about storing and clearing a history
- Think about how authorization and updating refreshing the list of published spreadsheets would work
- Think about curated lists
- Handle bad links to invalid files
- Write out what the tests are for what already exists
- Mockup the layout and features.
- Write out what the data model is for rendering display data (ex. label, content, id, hex_color, image, sheet title, date updated, row_date added (?), type, hashexcolor) 
- figure out where to put a string processing function to clean up hex values.
- figure out how to make React interpret inline styles.

#### Future Features/Ideas/Requests
Eventually, you will be able to have:
- a bunch of lists of lists to choose from (probably)
- See the hex_color value for a row (eventually)
- Not have to say how many columns to read in the Google doc (eventually)
- to be able to use a Pinterest pinboard and see images. (probably)
- access to some pre-curated lists/games that other people have shared. (food, lemonopoly, & general art motifs) (probably)
- to use a pinboard as the source of inspirational (probably)
- save a bunch of different links to google docs or pinboards (probably)
- to list several pinboards and choose randomly from all of them (maybe)
- to list several pinboards and pair 2 or 3 random images (maybe)
- maybe later use authorization to use private google docs on one's phone so they don't have to be published (maybe)
- allow images from full links via google doc (maybe)
- add a button that reloads the whole google doc
- way later: add in-app content entry (no google docs) (maybe)
- twitter favorites
- liked pins
- idea: make the frontend easily themeable if forked
