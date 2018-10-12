var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

// PiecSettings.autoPlay = {
//     activateAfter: 4000,
// }

PiecSettings.timer = true;
PiecSettings.asoi = true;

PiecSettings.fontColor = "#ffffff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

PiecSettings.colorPalette = {
    default: "0xf6a200",
    correct: "0x44AD12",
    incorrect: "0xe3442d",
    repeated: "0xf6a200",
    wordBoxDefault: "0xEBEECC",
};                          //Used by the lines and box

PiecSettings.useAlternativeAssetForSolvedLetters = false; //Can use alternative asset for letters on the board (as opposed to letters on the pan). This will be the letter with "-2" behind
                                                        // E.g.: "a.png" alternative version would be "a-2.png".

// PiecSettings.tooltip = [
//     {
//         instructionsSrc: 'instructions1.png',
//         src: 'overlay1.png',
//     },
//     {
//         instructionsSrc: 'instructions2.png',
//         src: 'overlay1.png',
//     },
//     {
//         instructionsSrc: 'instructions3.png',
//         src: 'overlay2.png',
//     },
// ];

PiecSettings.autoPlay = true;
PiecSettings.autoPlayWord = "unwary";
PiecSettings.connectionLine = "line"; //"line"
PiecSettings.circleLetter = true;

PiecSettings.wordsGridWidth = 14;
PiecSettings.wordsGridHeight = 9;

PiecSettings.words = {
    down: [ [0,5,"raw"],
            [2,2,"yarn"],
            [4,0,"awry"],
            [7,2,"warn"],
            [8,5,"war"],
            [9,0,"wry"],
            [11,3,"ray"],
            [13,1,"urn"],
            ],
    accross: [  [7,0,"yawn"],
                [4,2,"runway"],
                [2,3,"any"],
                [11,3,"run"],
                [0,5,"ran"],
                [6,5,"unwary"],
                [0,7,"way"],
                [6,7,"wary"],
                ],

};

PiecSettings.preFilledWords = ["raw", "urn", "awry", "wary", "yarn", "any", "wry", "ran"]; //For full words
PiecSettings.preFilledLettersCoordinates = [ //For individual letters
    // [10,0],
    // [0,5],
    // [1,5],
    // [2,3],
    // [3,3],
    // [2,5],
    // [13,1],
    // [13,2],
    // [13,3],
];

PiecSettings.letterScaleInBoxCookie = 0.86; //How much of the width a letter takes inside the boxCookie

PiecSettings.panAnchor = [0.5,0.49]; //Anchor of circle where letters are positioned, as ratio of total width/height
PiecSettings.panRadius = 0.28;       //Specifies how big the radius of the circle where letters are positioned is
                                     //as a ratio of the total height of the pan background.
// PiecSettings.panAnchorLandscape = [0.5,0.49];
PiecSettings.panRadiusLandscape = 0.2;
PiecSettings.boardAnchor = [0.49,0.7];

/////// FINAL OVERLAY SCREEN SETTINGS ///////
// PiecSettings.finalOverlay = {
//     color: 0x281065,
//     alpha: 0.65,
//     delay: 3000,
// };

PiecSettings.pngAnimations = [
    // {
    //     src: 'burst_01.png',
    //     spriteWidth: 200,
    //     spriteHeight: 205,
    //     spriteNumber: 18,
    //     loops: 1,
    //     delay: 0,
    //     fps: 15,
    // },
    // {
    //     src: 'burst_02.png',
    //     spriteWidth: 240,
    //     spriteHeight: 240,
    //     spriteNumber: 19,
    //     loops: 1,
    //     delay: 0,
    //     fps: 10,
    // },
    // {
    //     src: 'burst_03.png',
    //     spriteWidth: 240,
    //     spriteHeight: 240,
    //     spriteNumber: 19,
    //     loops: 1,
    //     delay: 0,
    //     fps: 10,
    // },
];