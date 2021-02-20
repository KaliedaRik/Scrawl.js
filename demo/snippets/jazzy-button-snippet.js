// # Demo Snippets 001
// Scrawl-canvas DOM element snippets
//
// Related files:
// + [DOM element snippets - main module](../snippets-001.html)
// + [Spotlight text snippet](./spotlight-text-snippet.html)
// + [Jazzy button snippet](./jazzy-button-snippet.html)
// + [Page performance snippet](./page-performance-snippet.html)
//
// ### 'Jazzy button' snippet
// __Purpose:__ display the number of times a user has clicked on a button element; animate the text and its line when the user clicks on the button.
// __Function input:__ a &lt;button> element, or any other block-displayed DOM element containing no child elements.
//
// __Function output:__ 
// ```
// {
//     element           // wrapper
//     canvas            // wrapper
//     animation         // object
//     demolish          // function
//
//     artefacts {
//         trackLine     // Shape entity
//         label         // Phrase entity
//     }
//
//     assets {
//         lineGradient  // Gradient wrapper
//     }
//
//     functions {
//         setClickText  // increase the number of clicks recorded on the button
//         textTween     // Tween animation function
//         gradientTween // Tween animation function
//     }
// }
// ```
// ##### Usage example:
// ```
// import { jazzyButton } from './relative/or/absolute/path/to/this/file.js';
//
// let myElements = document.querySelectorAll('.some-class');
//
// myElements.forEach(el => jazzyButton(el));
// ```

// Import the Scrawl-canvas object 
// + there's various ways to do this. See [Demo DOM-001](../dom-001.html) for more details
import scrawl from '../../source/scrawl.js';


// __Effects on the element:__ no additional effects.
export default function (el) {

    let snippet = scrawl.makeComponent({
        domElement: el,
    });

    if (snippet) {

        let canvas = snippet.canvas;
        canvas.setAsCurrentCanvas();

        canvas.set({
            backgroundColor: '#f2f2f2',
        })

        let wrapper = snippet.element;

        // define the text we'll be displaying in the button
        let counter = 0;
        let setClickText = () => (counter === 1) ? `${counter} click` : `${counter} clicks`;

        // A path for the text to animate along, together with a gradient for its strokeStyle
        let lineGradient = scrawl.makeGradient({
            name: `${wrapper.name}-gradient`,
            endX: '100%',
            cyclePalette: true
        })
        .updateColor(0, 'blue')
        .updateColor(650, 'green')
        .updateColor(700, 'gold')
        .updateColor(750, 'green')
        .updateColor(999, 'blue');

        let trackLine = scrawl.makeLine({

            name: `${wrapper.name}-line`,
            startX: 20,
            endX: '95%',
            startY: '70%',
            endY: '70%',

            lineWidth: 6,
            lineCap: 'round',
            method: 'draw',

            strokeStyle: lineGradient,
            lockStrokeStyleToEntity: true,

            globalAlpha: 0.5,

            useAsPath: true,
        });

        // The phrase entity that will display the text
        let label = scrawl.makePhrase({

            name: `${wrapper.name}-label`,

            text: `Hello - ${setClickText()}`,
            font: `20px sans-serif`,
            handleY: '68%',

            fillStyle: '#000080',

            textPath: `${wrapper.name}-line`,
            textPathPosition: 0,
            textPathLoop: false,
        });

        // Animate the phrase entity along the line when button element is clicked
        let textTween = scrawl.makeTween({
            name: `${wrapper.name}-textTween`,
            duration: 2500,
            targets: label,
            definitions: [
                {
                    attribute: 'textPathPosition',
                    start: 1,
                    end: 0,
                    engine: 'easeIn'
                },
                {
                    attribute: 'globalAlpha',
                    start: 0,
                    end: 1,
                    engine: 'easeIn'
                }
            ]
        });

        // Animate the gradient for the Line the text moves along
        let gradientTween = scrawl.makeTween({
            name: `${wrapper.name}-gradientTween`,
            targets: lineGradient,
            duration: 2500,
            definitions: [
                {
                    attribute: 'paletteStart',
                    integer: true,
                    start: 699,
                    end: 0,
                    engine: 'easeOut'
                }, {
                    attribute: 'paletteEnd',
                    integer: true,
                    start: 700,
                    end: 999,
                    engine: 'easeOut'
                }
            ]
        });

        let clickAction = (e) => {

            // Increase the local counter; update the Phrase entity with new text
            counter++;

            label.set({
                text: `Hello - ${setClickText()}`,
            });

            // Both tweens need to halt and restart if user clicks on them while they are running
            if (textTween.isRunning()) {
                textTween.halt();
                textTween.seekTo(0);
            }
            textTween.run();

            if (gradientTween.isRunning()) {
                gradientTween.halt();
                gradientTween.seekTo(0);
            }
            gradientTween.run();
        }
        scrawl.addNativeListener('click', clickAction, el);

        snippet.artefacts = {
            trackLine: trackLine,
            label: label,
        };

        snippet.assets = {
            lineGradient: lineGradient,
        };

        snippet.functions = {
            setClickText: setClickText,
            textTween: textTween,
            gradientTween: gradientTween,
        };
    }
    return snippet;
};