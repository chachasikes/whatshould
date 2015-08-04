# What should I ___?

This is a simple app for artists and other creatives. 
The web app present random items from a published Google Sheet.
You can set up a list of ideas, subject matter, quotes, concepts, and other playful ideas.
The app will let you view items from these lists, randomly, and with pretty formatting.


### Why?
There is an abundance of inspiration. How do we pick what to doodle or draw when we actually have time to do so? 

Some people use google docs as a way to keep an ongoing list of ideas to remember when they feel like being creative. This might be a list of motifs, kinds of animals, quotes, or techniques to try. It's hard to pick a random item from a Google Doc, and also the google doc spreadsheet format isn't very pretty or calmly inspiring looking. Plus, if you are using google docs, it's very likely that (if you are anything like me!) you will start surfing the Internet instead of drawing. This app aims to maximize creative time by limiting the distracting part of the internet while keeping the information part that is helpful for having reminders and playing creative games with ideas.

There also is a cool game my friend told me about, which involves generating ideas for making repeat patterns. This game requires 5+ column types, so that's the real motivation behind this app. I orginally wrote eveything on little paper cards and put them in cups, but the cups were taking up a lot of space and still required a good 30 minutes of visual research on the internet. So eventually the goal will be to include visual material from pre-selected Pinboards, so that most of the work can be done from a phone and from wherever.


https://docs.google.com/spreadsheets/d/1FPefy-GxbVtD9osXviZTudATTYwNW0QCOI0CWApGEpw/pub?output=csv

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
  * To make this work, just add a column header that says "use_columns." You do not need to add any other information to the file.

  Here are some links to examples: 

  PatternPickerPublicDemo
  * https://docs.google.com/spreadsheets/d/17FBVvem0oo_nj3KuwsoUeDJmJ0yuibtkJMkR7-vCEFU/edit#gid=0



### Technology
The purpose of the technology choices for this app will be to play with some new JS frameworks. 
* ReactJS
* Other technologies as they appear.



## Start the app
1. Navigate to folder.
2. Run simple webserver: python -m SimpleHTTPServer
3. Default, visit: http://localhost:8000

## Run tests
Requires jasmine, request

npm install jasmine-node
npm install request
run tests: jasmine-node spec

