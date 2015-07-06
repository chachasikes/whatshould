# What should I ___?

This is a simple app for artists and other creatives. 
The web app present random items from a published Google Sheet.
You can set up a list of ideas, subject matter, quotes, concepts, and other playful ideas.
The app will let you view items from these lists, randomly, and with pretty formatting.


### Why?
There is an abundance of inspiration. How do we pick what to doodle or draw when we actually have time to do so? 

Some people use google docs as a way to keep an ongoing list of ideas to remember when they feel like being creative. This might be a list of motifs, kinds of animals, quotes, or techniques to try. It's hard to pick a random item from a Google Doc, and also the google doc spreadsheet format isn't very pretty or calmly inspiring looking. Plus, if you are using google docs, it's very likely that (if you are anything like me!) you will start surfing the Internet instead of drawing. This app aims to maximize creative time by limiting the distracting part of the internet while keeping the information part that is helpful for having reminders and playing creative games with ideas.

There also is a cool game my friend told me about, which involves generating ideas for making repeat patterns. This game requires 5+ column types, so that's the real motivation behind this app. I orginally wrote eveything on little paper cards and put them in cups, but the cups were taking up a lot of space and still required a good 30 minutes of visual research on the internet. So eventually the goal will be to include visual material from pre-selected Pinboards, so that most of the work can be done from a phone and from wherever.


-Chacha @chachasikes

### Designs
[img]  [img]  [img]


### Spreadsheet formatting.

[Soon you will be able to enter in your own Google Spreets URLS]

This app is DEFINITELY for artists who also love spreadsheets, and especially collaborative spreadsheets.

For this to work:
1. You must use Google Sheets.
2. You need a single-sheet spreadsheet.
3. You need column headers. For now, avoid spaces and use alphanumeric characters with underscores if you need a bunch of words. Ex. color_complexity. 
4. You need to set your spreadsheet to public. So select "Publish to the Web" and grab the URL.
5. Paste into the app [EVENTUALLY, not done yet.]
6. Refresh as desired.
7. You can edit your Google Doc and make sure the published version is updated. Sometimes you have to go back to the Publish to Web button and re-publish it.
8. I recommend making a copy of an existing spreadsheet you might use, and adjusting it for use with this app.
9. You can keep your spreadsheet editable by others if you like, and ask friends to add more suggestions. 
10. The app uses the name your Sheet rather than the name of the file, so rename it if you are feeling so inclined.

You can have two kinds of spreadsheets:
1. Single Record: Where all of the items are for one record (for example, a quote with an author name). This is the default behavior.
  * These can be color coded. To color code these records, add a column that is called "hex_color", and include the 6 character HEX string (ex. 000000, FFCC00)
  
  Here are some links to examples:

  KitchenCardsDemo
  * https://docs.google.com/spreadsheets/d/1voa_8uGY_kGOkenOq3pkkK6zVBQEVmpVhv3KGF9UYII/edit#gid=0

2. Multiple Column: Where you have a bunch of columns with different lists that should each be presented, but selected from at random (For example, for choosing criteria for planning ideas for designing repeat patterns.) 
  * To make this work, just add a column header that says "multi_column." You do not need to add any other information to the file.

  Here are some links to examples: 

  PatternPickerPublicDemo
  * https://docs.google.com/spreadsheets/d/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/edit#gid=0


#### Completed Features
- Read from a Google Sheet
- Be able to randomly choose values from multiple columns or randomly from a row.
- Find Google Sheets API documentation and figure out API params to get the data we want.
- Find Pinterest API and figure out API params to get the data we want.
- Set a hex_color value for the grouped rows.

#### Features in progress
- Create form element to load google sheet path
- Parse google sheet path to get the key
- Deal with unknown column length
- Figure out best way to process form data in ReactJS
- Decide on the most basic editing features for google sheet path
- See about storing and clearing a history
- Think about how authorization and updating refreshing the list of published spreadsheets would work
- Think about curated lists
- Handle bad links to invalid files
- Add a test framework
- Write out what the tests are for what already exists
- Mockup the layout and features.
- Write out what the data model is for rendering display data (ex. label, content, id, hex_color, image, sheet title, date updated, row_date added (?), type, hashexcolor) 
- figure out where to put a string processing function to clean up hex values.
- figure out how to make React interpret inline styles.

#### Future Features
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

### Technology
The purpose of the technology choices for this app will be to play with some new JS frameworks. 
* ReactJS
* Other technologies as they appear.



## Start the app
1. Navigate to folder.
2. Run simple webserver: python -m SimpleHTTPServer
3. Default, visit: http://localhost:8000
