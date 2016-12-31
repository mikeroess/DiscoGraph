# DiscoGraph

## Description

An interactive timeline to visualize genre popularity.  Data is pulled from the Discogs API, hence the name.

## Functionality & MVP

Users will be able to:
- [ ] input years to graph (between 1950 and present)
- [ ] click buttons representing a genre to graph along that timeline (by # of releases)
- [ ] view multiple genres on the same graph
- [ ] search for any sub-genre (style) in the Discogs and graph it along the same timeline

In addition this app will have a
- [ ] production README

## Wireframes

This app will consist of a single screen with inputs for start and end years, buttons for popular genres, and a search field for sub-genres

![wireframe](wireframe.JPG)

## Architecture and Technologies

This project will be implemented with the following technologies:

* D3 for the visualization of the data
* JQuery, Vanilla JavaScript, and Discogs API for the data gathering and shaping

## Implementation Timeline

**Day 1:**
- [ ] Setups Discogs API account and learn syntax for API calls and searches.
- [ ] Write javascript forms to collect API call parameters for start/end and primary genres
- [ ] Write functions to construct & execute API calls from collected parameters and receive results.

Goal for the day: have UI for API call construction complete

**Day 2:**
- [ ] Learn enough D3 to create graph of timelines
- [ ] Learn enough D3 to plot single genre on graph

Goal for the day: User should be able to input start & end years, click on buttons, and see a chart for a single genre

**Day 3:**
- [ ] Learn enough D3 to superimpose multiple datasets on single graph
- [ ] write javascript functions for sub-genre (style) search and superimpose results onto same graph.
- [ ] add cool transitions to graph as data is updated.
- [ ] style, polish, and professionalize appearance.  
- [ ] If time permits, allow user to select color for each input

## Bonus Features
There are many additional visualizations I would like to implement including:
- [ ] Display detailed data about releases on mouseover of datapoint.
- [ ] Allow user to input a single year, and generate a pie chart of genre representation for that year (including specified sup-genres)
- [ ] Allow user to search by label and create a 'node' whose child nodes are artists represented by that label.  Artists can have multiple parent nodes if on multiple labels.  
- [ ] Allow user to search for artists and obtain same results as above.
