# Skills Used

[HTML Data Attributes](#HTML-Data-Attributes) [Building SVGs with Javascript](#Building-SVGs-with-Javascript) [IIFE](#iife) [Drag and Drop](#drag-and-drop) [DOM Manipulation](#dom-manipulation) [Refactoring](#refactoring)

## HTML Data Attributes
### What
HTML data attributes store a string as data in the HTML. This app uses data attributes to store a representation of the music on each card (the measure), and to store information about what happens if a user clicks on a particular part of a card.

### Why
Since each card in the HTML knows about itself, the app can ask cards for information.
- It's an idiomatic way for HTML and javascript to communicate.
- Accessing data attributes suits built in drag and drop operations. The data is stored in each event target's data attribute. Easy.
- Each card needs only one click event handler to manage five interactions, since a click returns data on which interaction applies.

### How 
First, each card is written to the DOM based on an array of measure strings. 
```js
// displays list of cards to choose from
function showAllCards () {
  const cardDisplay = document.getElementById('cardlist')

  measures.forEach(measure => {
    const id = `${measure}-example`
    const newCard = createCard(measure, id)
    newCard.addEventListener('dragstart', dragStartHandler)
    newCard.dataset.measure = measure
    cardDisplay.appendChild(newCard)
  })
}
showAllCards()
```
The data attribute is set in the fourth line of the forEach loop. 

When a drag event fires, the drag event handler saves the measure string from the dragged element to the event's dataTransfer object, which shares it with the drop target accessable from a drop handler.
```js
function dragStartHandler (event) {
  event.dataTransfer.setData('measure', event.target.dataset.measure)
  ...
}
```

Let's look at what happens when a user plays a card's music.
First, they click on the play button, triggering the cardClickHandler function. First, this function sets constants based on where the user clicked.
```js
  const cardTarget = event.target.parentElement.parentElement
  const operation = event.target.dataset.op
  const measure = cardTarget.dataset.measure
```
The operation data determines what should happen to the measure data. The flipv method returns a new measure with the notes reversed on the staff vertically, and fliph does the same horizontally.
```js
  if (operation === 'play') {
    play(measureInterpreter.getNotes(measure))
    return
  } else if (operation === 'flipv') {
    newMeasure = measureInterpreter.flipv(measure)
  } else if (operation === 'fliph') {
    newMeasure = measureInterpreter.fliph(measure)
  } 
```
measureInterpreter.getNotes converts the measure into an object, which the play function uses to play music.


## DOM Manipulation 
### What
This project writes to and reads from the HTML document using the Document Object Model, and also navigates the DOM to make sense of events during user interactions. 

### Why
- Code generated cards only appear after being added to the document.
- Handling events on cards made up of layers of elements requires using information about parent elements.

### How 
Here's an example of a card's HTML. The div with class 'card' holds all the information about the card. The card-control div divides the card into sections which, when clicked, either flip the card or play its music.
```js
<div id="6q2q3h-example" class="card" draggable="true" data-measure="6q2q3h">
  <div class="card-control">
    <div class="top" data-op="flipv"></div>
    <div class="right" data-op="fliph"></div>
    <div class="bottom" data-op="flipv"></div>
    <div class="left" data-op="fliph"></div>
    <div class="center" data-op="play"></div>
  </div>
  <svg viewBox="0 0 300 200">...</svg>
</div>
```
Given this structure, if this card is clicked in the center, the app should play the card's music. The click event knows it was triggered by the div with class center, and where this appears in the HTML document. Finding out which music to play requires navigating to this div's parent div's parent, where the measure code used to play the music is stored in the HTML data attribute data-measures.

So let's take a look at how the app handles this kind of click.
```js
function cardClickHandler (event) {
  const cardTarget = event.target.parentElement.parentElement
  const operation = event.target.dataset.op
  const measure = cardTarget.dataset.measure
  if (operation === 'play') {
    play(measureInterpreter.getNotes(measure))
    return
  } // continues for the other operations
}
```
First, cardTarget identifies which card was clicked, the target's parent's parent. The click target has an op data attribute, and the cardTarget has a measure data attribute, which are used to identify which operation comes next (play) and what measure needs to be converted into the correct format and sent to the play function.


## Building SVGs with Javascript 
### What
This app displays cards with musical notes in any number of orientations. I chose to draw these notes by using javascript to generate SVG images and add them to the DOM.

### Why
Managing static image assets for this purpose sounds like a nightmare. Creating SVGs with Javascript and displaying them properly took some research, but it let me focus on development skills and provided direct control over the final image.
- SVG, Javascript, HTML, and CSS work well together.
- Coding SVGs based on a card's measure data means the app can create a card showing any sequence of notes.
- Provides a high degree of control over the final appearance.
### How 
To figure this out I needed to do broader research and much more extrapolating from limited examples than I had up to this point. 

When it's time to draw a card to the DOM, the app calls the drawCard IIFE and appends the SVG it returns to a new div called card.
```js
  card.appendChild(drawCard(measure, measureInterpreter.getNotes(measure)))
```
This IIFE starts with sanity-saving constants, mostly to set the sizes of elements within the SVG. Changing these constants would modify the default dimensions of the svg image and the relative sizes and locations of elements within it.

```  const COLOR = 'thistle'
  const CARD_WIDTH = '300'
  const CARD_HEIGHT = '200'
  const BLACK_NOTE_RADIUS = '9'
  const HALF_NOTE_RADIUS = '7'
  const CIRCLE_STROKE_WIDTH = STEM_STROKE_WIDTH = '4'
  const X_AXES = [60, 120, 180, 240]
  const X_AXIS_E_OFFSET = 15 // distance eighth note pairs shift from center.
  const STEM_LENGTH = 65
  const NOTE_SIDE = 7
  const COLUMNS = ['30', '90', '150', '210', '270']
  const STAFF_LINES = ['40', '70', '100', '130', '160']
  const STAFF_STROKE_WIDTH = '3'
  // the VISUAL_STAFF represents the y axes of notes.
  const VISUAL_STAFF = [160, 145, 130, 115, 100, 85, 70, 55, 40]
```

The function executed by the IIFE, which serves as a gateway to drawing music cards in svg, looks like this: 
```return (cardNotes) => {
    const svg = makeSvgWithAttributes(
      'svg',
      {
        'viewBox': `0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`
      }
    )
    const svgComponents = [
      drawCardOutline(),
      drawColumns(),
      drawStaff(),
      drawAllNotes(cardNotes)
    ].flat()
    svgComponents.forEach(item => svg.appendChild(item))
    return svg
  }
```  
It starts by creating an empty svg with dimensions taken from the constants declared earlier, then executes functions for drawing a card and all its contents in sequence. These functions return either a single svg or an array of svgs, each of which can be added to the base svg to create a single final image. This function takes all of these steps and returns the finished svg.

The first function called, drawCardOutline, creates the card the notes appear on:
```  function drawCardOutline () {
    return makeSvgWithAttributes(
      'rect',
      {
        'width': CARD_WIDTH,
        'height': CARD_HEIGHT,
        'fill': 'white',
        'stroke': COLOR,
        'stroke-width': '5',
        'rx': '15',
      }
    )
  }
```
drawCardOutline is very simple, making it a good example of the process used to draw svgs. I chose to abstract away the process of making svgs into a function, with the parameters `type and `attributes`. In this example, the type is `'rect'` and the attributes are the object defining the rectangle's dimensions and appearance. 

makeSvgWithAttributes is the function to streamline building SVGs:
```js
  // a function to set attributes of an svg component.
  // the attributes parameter expects an object
  function makeSvgWithAttributes (type, attributes) {
    newSvgElement = document.createElementNS('http://www.w3.org/2000/svg', type)
    Object.keys(attributes).forEach(key => newSvgElement.setAttribute(key, attributes[key]))
    return newSvgElement
  }
```
See what's going on there? It creates an SVG element of the requested type, and sets its attributes one by one.
Without abstracting away the svg construction, drawCardOutline would look very different:
```  function drawCardOutline () {
  newCard = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  newCard.setAttribute('width', CARD_WIDTH)
  newCard.setAttribute('height': CARD_HEIGHT)
  newCard.setAttribute('fill': 'white')
  newCard.setAttribute('stroke': COLOR)
  newCard.setAttribute('stroke-width': '5')
  newCard.setAttribute('rx': '15')
```
This code is denser and harder to read at a glance, even though it follows the same steps to achieve the same outcome. The makeSvgWithAttributes function shifts the focus of each draw function from interacting with the DOM to defining the desired svg element.

Once the card's backdrop is complete drawAllNotes does the heavy lifting. It iterates through the notes and does the necessary calculations to draw them to svg. 
Let's look at what happens with half notes.

```js
      const currentNote = cardNotes[noteCount]
      let xAxis = X_AXES[i]
      const yAxis = VISUAL_STAFF[currentNote.pitch]
      let stemUp = currentNote.pitch < 4 // boolean- false for notes on top of staff
      const duration = currentNote.duration
```
A measure can show anywhere from four to eight notes, but drawAllNotes only iterates four times. The xAxis to be applied to the current note is set to the value in the current iteration count's place in the X_AXES array constant. The note's pitch also determines which item in an the VISUAL_STAFF array is set as the yAxis. Both of these axes are assigned numerical values, which will be converted to strings before drawing the note. Using a numerical type here allows the x-Axis to be modified according to a constant when drawing eighth note pairs, which have two notes and two x-axes.

So let's draw the note.
```js
        drawHalfOrQuarterNote({
          x: xAxis.toString(),
          y: yAxis.toString()
        }, duration, stemUp)
```
And what does that function look like?
```js
  function drawHalfOrQuarterNote (loc, type, stemUp) {
    const notehead = drawNotehead(loc.x, loc.y, type)
    // moves stem to the side of the note
    loc.x = stemAdjustX(loc.x, stemUp)
    const stem = drawStem(loc.x, loc.y, stemUp)
    return [notehead, stem]
  }
```
After drawing the notehead, the ball on the end of the note, this function redefines the x coordinate to place the stem, the note's vertical line, on the correct side of the note. It draws the notehead, moves to the correct side of the note, and draws a vertical line, returning both to be added to the final svg.

Noteheads are traditionally oblong, but, as a stylistic choice, this program draws them as a circle. The function for drawing noteheads is more complex than the function for drawing cards, because cards always look the same, but half-notes are drawn as open circles, while quarter notes and eighth notes are filled in.

```
  function drawNotehead (x, y, type) {
    const coords = {'cx': x, 'cy': y}
    if (type === 'h') {
      return makeSvgWithAttributes(
        'circle',
        {
          'r': HALF_NOTE_RADIUS,
          'fill': 'transparent',
          'stroke': 'black',
          'stroke-width': CIRCLE_STROKE_WIDTH,
          ...coords
        }
      )
    } else {
      return makeSvgWithAttributes(
        'circle',
        {
          'r': BLACK_NOTE_RADIUS,
          'fill': 'black',
          ...coords
        }
      )
    }
  }
```
Each note's coordinates, `'cx'` in the SVG code, are measured from the center of the notehead. Because the width of the line around the note is added to the radius in SVG, the half note needs a different radius and stroke width to appear the same size as eighth notes and quarter notes.

This is the stemAdjust function:
```  function stemAdjustX (x, stemUp) {
    if (stemUp) {
      return (parseFloat(x) + NOTE_SIDE).toString()
    } else {
      return (parseFloat(x) - NOTE_SIDE).toString()
    }
  }
```
It only ads or subtracts the correct amount from the x coordinate. This requires converting the x coordinate value, a string, back to a numerical value, executing the change, and converting the value back. Since SVG is made up of strings, I chose to keep the coordinate numbers in string form and convert them briefly to numbers only when computations were necessary, immediately converting them back.

All that's left to finish the half note is drawing the stem. This is a multi step process as well, identifying the y coordinate for the top of the stem, and calling makeSVGWithAttributes to create a line with the needed attributes.

Ultimately, each component of each note is created using the makeSvgWithAttributes function and added to the SVG.

## Drag and Drop 
### What
I based this project on a piece of discontinued software that didn't, as far as I know, feature drag and drop functionality. Cards, though, are moved around, and drag and drop works for moving elements around a screen.
I could have implemented a tool to execute drag and drop for me, but I wanted to learn how it works.

### Why
- I wanted to encourage creative interaction and play.
- Drag and drop functionality is built in to HTML and Javascript.
- I thought it would be easy.  

### How 
Implementing drag and drop is not easy. The HTML drag and drop API provides relevant event types and a dataTransfer object to hold data between events, but does not move HTML elements. This makes sense, because that isn't always the desired outcome.

Each card drawn to the DOM gets an event listener, which triggers dragStartHandler after detecting a dragstart event, one of the events from the drag and drop API.
```js
  card.addEventListener('dragstart', dragStartHandler)
```
This handler uses the event's dataTransfer object to store data that may be needed later, and to set the effectAllowed property, to track how an element can move.
This is how my dragStartHandler sets the effectAllowed:
```js
  const sourceId = event.currentTarget.parentElement.id
  event.dataTransfer.setData('sourceId', sourceId)
  event.dataTransfer.effectAllowed = (sourceId === 'cardlist') ? 'copy'
    : (sourceId === 'workspace') ? 'move'
      : 'copyMove'
```
The effect depends on where the dragged element originates. Cards from cardlist can only be copied, since it functions as a deck of options that are always available. The workspace holds cards until they move somewhere else. For cards from other locations, the effect depends on where the card is dropped.

Setting the effectAllowed property isn't quite enough. During dragover events, the API uses dropEffect to change the cursor to reflect what happens if a dragged element is dropped in various locations. 
```js

    if (event.dataTransfer.effectAllowed === 'copyMove' && event.currentTarget.id.startsWith('card')) {
      event.dataTransfer.dropEffect = 'move'
    } else if (event.dataTransfer.effectAllowed === 'move') {
      event.dataTransfer.dropEffect = 'move'
    } else {
      event.dataTransfer.dropEffect = 'copy'
    }
```
If an element allows copy and move, the dragOverHandler differentiates which applies, and sets the dropEffect accordingly.

The phrase element's dropHandler uses data from the dataTransfer object and information about the event's target to execute what happens with the dragged content. 
```js
if (source === 'phrase' && event.currentTarget.parentElement.id == 'phrase') {
    moveInPhrase(getIndexInDom(draggedItemId), getIndexInDom(event.currentTarget.id))
  } else {
    moveCardToPhrase(event.dataTransfer.getData('measure'), event, draggedItemId)
  }
```
If a card element was dragged from the phrase to a card which is a child of the phrase, the cards are made to change location by executing the moveInPhrase function. Otherwise, the relevant card is moved to the phrase. The moveCardToPhrase manages all the work of determining whether to move or re-draw a card, and whether to remove the dragged element from its original location.


## IIFE 
### What
Uses an immediately invoked function expression (IIFE) to draw svgs which appear as cards in the DOM. An IIFE is a function that runs as soon as it is defined. This means that when I call the IIFE, it returns a function and runs that function, which returns an SVG.
### Why
Originally, this project drew svgs with a function in a document full of other functions and constants, which worked. However, I was advised to wrap the document's code in an IIFE by a seasoned developer when I asked for advice about modularizing my SVG creation document.
- The IIFE contains the many constants required for drawing SVGs.
- It ultimately returns the same value.
### How 
The IIFE contains constants and functions used to draw a card. After being called, it returns an anonymous function which is immediately invoked. This anonymous function uses the constants and functions within the IIFE to draw and return an SVG image.
```js
const drawCard = (function () {

  // constants go here, including CARD_WIDTH and CARD_HEIGHT
  // functions go here, including makeSvgWithAttributes, drawCardOutline, and the rest

  return (cardNotes) => {
    const svg = makeSvgWithAttributes(
      'svg',
      {
        'width': CARD_WIDTH,
        'height': CARD_HEIGHT,
        'viewBox': `0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`
      }
    )
    const svgComponents = [
      drawCardOutline(),
      drawColumns(),
      drawStaff(),
      drawAllNotes(cardNotes)
    ].flat()
    svgComponents.forEach(item => svg.appendChild(item))
    return svg
  }
})()
```
The arrow function has one parameter, which is provided in the function call to the IIFE.

## Refactoring 
### What
When I first created this project, each measure was an object. Then I implemented a drag and drop interface. Data attributes seemed ideal to keep track of which notes were on which card, so I came up with a way of encoding the measure in a string. Using strings in place of objects made the entire project simpler to execute and understand. This justified refactoring the project to store data in a simpler way. However, I saved myself a little work by converting the string into an object instead of rewriting the functions for playing music and creating SVGs.
### Why
- Constraints that shaped my choices early in the project became irrelevant when I made some design changes.
- The core functionality made more sense with a change in approach.
- The objects representing music on cards tracked their orientation and stored methods to return different results depending on how the cards were turned. Measure strings, however, can be changed to represent the outcome of a turn without tracking their orientation.
### How 
Here are two measure strings. The code stores a sequence of notes. The first character of a note places it on an array of locations on a musical staff, the second specifies whether it is an eighth, quarter, or half note.
```js
  '5q4e6e6e3e4e3e',
  '5e3e5h5q',
```
I made an object called measureInterpreter with methods to transform the measure strings, to replicate the behavior of methods from the objects I started with. Here's an example.

```js
  // flips the measure horizontally
  fliph: function (measure) {
    const lastNoteCodeIndex = -1 * 2
    let hFlippedMeasure = ''
    while (measure) {
      hFlippedMeasure = hFlippedMeasure.concat(measure.slice(lastNoteCodeIndex))
      measure = measure.substring(0, measure.length - 2)
    }
    return hFlippedMeasure
  },
```
Noting that notes were also objects, the measure strings and the method for flipping them horizontally replace the following:
```js
// Card objects model the cards used for music composition
// cards are always instatiated with a three number code, used to identify the card,
// as well as an array of notes objects for the card as they appear in orientation 1.
// the card has two other essential attributes, number and orientation. the orientation
// is set based on user input, and the number adds the orientation to the three number code.
function Measure (firstThreeNumbers, notes1) {
  // all of the numbers mentioned here are strings of numbers used as reference codes. rename?
  this.firstThreeNumbers = firstThreeNumbers
  this.notes1 = notes1 // array of the notes in orientation 1
  this.setOrientation = function (orientation) {
    this.orientation = orientation
    this.numbers = firstThreeNumbers + orientation
  }
  ...
  // flipH flips the card horizontally by changing the orientation
  this.flipH = function () {
    switch (this.orientation) {
      case '1': this.orientation = '3'; break
      case '3': this.orientation = '1'; break
      case '2': this.orientation = '4'; break
      case '4': this.orientation = '2'; break
      default: throw new Error('invalid orientation')
    }
  }
  ...
}
```
Two separate methods returned the notes in a specific orientation to be played or drawn. The method for a vertical flip required a method in the notes object to execute the flip for each note.
When I decided to use drag and drop, that meant I had no use for an easy to read number code to differentiate between cards, and I needed a shorthand to easily pass with event.dataTransfer.
