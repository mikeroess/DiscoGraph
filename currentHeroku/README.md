# DiscoGraph

<a href="https://discograph7.herokuapp.com/">DiscoGraph</a>

DiscoGraph is a light weight graphing application designed to illustrate changes in genre popularity across time.  It is built with <a href="d3js.org">d3</a>, pulls its data from the <a href="https://www.discogs.com/developers/">discogs API</a>, and uses Express.js to handle the API calls.

![DiscoGraph](public/images/discograph.png)

# Current Features & Implementation Details

## Genre selection and style search
Discogs classifies music according to genre, of which is has 15, and style, of which there are nearly 2,000.  The graph allows users to display data for the 7 most popular genres (excluding "Folk, World & Country", which felt too mixed to be useful) with a simple button-click, and search for any style.

## Adjustable timescale and dynamic rendering
As the user adjusts the timescale or removes data from the graph, the graph is automatically re-rendered with adjusted x and
y axes.  

## Data fetching and storage
The Discogs API can only return the results of 1 genre or style per year per request and throttles restricts their API to 240 requests per minute.  To avoid slow loading times or user-noticable throttling data is pre-fetched on an schedule as soon as the page is loaded.  Fetched data is stored in the client's localstorage.  This enables data to persist on the client's browser without traversing the wire, and the restriction of new queries to only those not currently stored.  

# Data discussion
All data is pulled from a user generated dataset.  This leads to a number of advantages (more democratic, captures smaller releases that might go un-recorded), as well as a few possible disadvantages (the over-representation of electronic music).  Caveats aside, there is some very cool data to be found in this graph.  
  * in 1978 more music was released in the Funk/Soul genres than in Pop.  
  * The rise and fall of Disco tracks that of Funk/Soul quite closely.  

# Features In the Making
In the future I plan to:
- [ ] Switch from Bottleneck to Limiter for better API request throttling
- [ ] Enable the Addition of multiple styles and the selection of each style's color
- [ ] Automatically generate pie charts (of genre data only) for each year displayed
- [ ] Throw in a nice disco easter egg
