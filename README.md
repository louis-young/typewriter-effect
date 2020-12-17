# Truncate

A lightweight (~1kb) vanilla JavaScript library for producing typewriter effects.

## Usage

### Setup

#### Data Attributes

You can either configure the library by setting data attributes on the element you want to target or by passing in parameters when you instantiate the library.

See the configuration section for more details.

#### JavaScript

Simply instantiate a new instance of the Truncate object:

`const typewriter = new TypeWriter({selector: ".element"});`

You can also pass in configuration options via data attributes below.

### Configuration 

#### Options

- String length (the amount of characters in the truncated string) - `data-truncate-length` 

- Words to type - `data-typewriter-words` 
- Delay between each simulated keystroke - `data-typewriter-delay`
- Loop the effect - `data-typewriter-loop`
