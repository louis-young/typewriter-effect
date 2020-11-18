"use strict";

import {Screen} from "./screen.js";
// ! [[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]
//https://stackoverflow.com/questions/44958216/how-to-minify-es6-functions-with-gulp-uglify
// rename main.js to app.js
// npm tasks
// npm list tasks
//https://stackoverflow.com/questions/31593694/do-i-need-require-js-when-i-use-babel
//https://github.com/wbkd/webpack-starter

/**
 * Fluid Typewriter.
 *
 * A lightweight native JavaScript library for typewriter effects.
 *
 * @author Louis Young
 * @licence MIT
 * @version 0.1.0
 */

/**
 * TypeWriter class.
 *
 * @extends Screen
 */

class TypeWriter extends Screen {
    constructor(props) {
        super();

        /**
         * Default configuration values.
         */

        this.config = {
            delay: 1500,
            empty: "",
            loop: false,
            speeds: {
                fast: 125,
                medium: 200,
                slow: 1000
            }
        };

        if (props) {
            this.props = props;
            this.element = document.querySelector(props.selector) || null;
            this.words = props.words || JSON.parse(this.element.getAttribute("data-typewriter-words")) || null;
            this.delay = props.delay || Number(this.element.getAttribute("data-typewriter-delay")) || this.config.delay;
            this.loop = props.loop || JSON.parse(this.element.getAttribute("data-typewriter-loop")) || this.config.loop;
            this.speeds = (props.speeds || this.config.speeds) || null;
            Object.assign(this, {
                fast: this.speeds.fast,
                medium: this.speeds.medium,
                slow: this.speeds.slow
            });
            this.text = this.config.empty;
            this.speed = this.medium;
            this.index = 0;
            this.deleting = false;
            this.totalWords = this.words.length - 1;

            this.initialize();
        }

    }

    /**
     * Initialzie method.
     */

    initialize() {
        // Begin the type loop.
        setTimeout(() => {
            this.write();
        }, this.delay);
    }

    /**
     * Next word method.
     * 
     */

    nextWord() {
        if (this.index < this.totalWords) {
            this.index++;
        } else {
            this.index = 0;
        }
        this.deleting = false;
        this.text = this.config.empty;
        this.speed = this.medium;
    }

    /**
     * Stroke method.
     * 
     * @param state 
     */

    stroke(state) {
        let length;
        if (state === 'remove') {
            length = this.text.length - 1;
        } else if (state === 'add') {
            length = this.text.length + 1;
        }

        this.text = this.word.substring(0, length);
        this.speed = this.fast;
    }

    /**
     * Write method.
     *
     * Compare the current data and decide what to do with it.
     */

    write() {

        if (this.words[this.index]) {
            this.word = this.words[this.index];
        }

        if (this.text === this.word && this.deleting === false) {
            // Start deleting.
            if (this.loop === false && this.index === this.totalWords) {
                return;
            } else {
                this.deleting = true;
                this.speed = this.slow;
            }
        } else if (this.deleting && this.text === this.config.empty) {
            this.nextWord();
        } else if (this.deleting) {
            this.stroke('remove');
        } else if (this.deleting === false) {
            this.stroke('add');
        }

        // Recall the type method to continue typing at the given speed.
        setTimeout(() => {
            this.write();
        }, this.speed);

        // Render the new value.
        Screen.render(this.text);

        // console.log(`
        // Variables from the 'write' method scope:
        //
        // this.deleting: ${this.deleting} 
        // this.index: ${this.index} 
        // this.word: ${word} 
        // this.text: ${this.text} 
        // this.delay: ${this.delay} 
        // this.speed: ${this.speed}`);
    }
}

// Instantiate the TypeWriter object.
document.addEventListener('DOMContentLoaded', () => {
    new TypeWriter({
        selector: ".element"
    });
})

// new TypeWriter({
//   selector: ".element",
//   words: ["PROP", "WORDS"],
//   delay: 0,
//   loop: true,
//   speed: {
//     fast: 100,
//     medium: 200,
//     slow: 300,
//   }
// });
