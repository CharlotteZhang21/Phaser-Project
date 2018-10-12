 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as Animations from '../animations.js';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //setup loading bar
         // this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
         // this.load.setPreloadSprite(this.asset);

         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
         CustomPngSequencesRenderer.preloadPngSequences(this.game);
     }

     update() {}

     loadResources() {

         this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');
         this.game.load.image('background', PiecSettings.assetsDir + 'bg.jpg');

         //Loading assets for cookie letters that are used inside the template! --------------------------------------------------
         // this.game.global.loadedLetters = "";
         // for (var i = 0; i < PiecSettings.words.accross.length; i++) {
         //     for (var j = 0; j < PiecSettings.words.accross[i][2].length; j++) { //Looping through letters
         //         var letter = PiecSettings.words.accross[i][2][j];
         //         if (this.game.global.loadedLetters.indexOf(letter) == -1) { //Not found yet! So let's load this letter!
         //             this.game.load.image(letter, PiecSettings.assetsDir + letter + '.png');
         //             this.game.global.loadedLetters += letter;
         //             console.log("Loaded asset for " + letter.toUpperCase());
         //             if (PiecSettings.useAlternativeAssetForSolvedLetters !== undefined && PiecSettings.useAlternativeAssetForSolvedLetters) {
         //                console.log("Loading alternative letter");
         //                 this.game.load.image(letter + "-2", PiecSettings.assetsDir + letter + '-2.png');
         //             }
         //         }
         //     }
         // }
         // for (var i = 0; i < PiecSettings.words.down.length; i++) {
         //     for (var j = 0; j < PiecSettings.words.down[i][2].length; j++) { //Looping through letters
         //         var letter = PiecSettings.words.down[i][2][j];
         //         if (this.game.global.loadedLetters.indexOf(letter) == -1) { //Not found yet! So let's load this letter!
         //             this.game.load.image(letter, PiecSettings.assetsDir + letter + '.png');
         //             this.game.global.loadedLetters += letter;
         //             console.log("Loaded asset for " + letter.toUpperCase());
         //             if (PiecSettings.useAlternativeAssetForSolvedLetters !== undefined && PiecSettings.useAlternativeAssetForSolvedLetters) {
         //                console.log("Loading alternative letter");
         //                 this.game.load.image(letter + "-2", PiecSettings.assetsDir + letter + '-2.png');
         //             }
         //         }
         //     }
         // }
         //End of loading letters ------------------------------------------------------------------------------------------------

         this.game.load.image('cta', PiecSettings.assetsDir + 'download.png');
         // this.game.load.image('cta-2', PiecSettings.assetsDir + 'download_2.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');

         this.game.load.image('letterBg', PiecSettings.assetsDir + 'letter-bg.png');

         this.game.load.image('letterHighlight', PiecSettings.assetsDir + 'letter-highlight.png');

         // this.game.load.image('letters-background', PiecSettings.assetsDir + "pan.png");
         // this.game.load.image('board-background', PiecSettings.assetsDir + "board.png");
         // this.game.load.image('board-background-landscape', PiecSettings.assetsDir + "board_landscape.png");

         // this.game.load.image('box-cookie-empty', PiecSettings.assetsDir + "boxcookie_empty.png");
         // this.game.load.image('box-cookie-full', PiecSettings.assetsDir + "boxcookie_full.png");
         // this.game.load.image('star-cookie', PiecSettings.assetsDir + "star_cookie.png");

         // this.game.load.image('hint-button', PiecSettings.assetsDir + "hint.png");

         // this.game.load.image('star-particle', PiecSettings.assetsDir + "star_particle.png");
         // this.game.load.image('spark-particle', PiecSettings.assetsDir + "spark_particle.png");
         // this.game.load.image('puzzle-solved', PiecSettings.assetsDir + "puzzle_solved.png");

         // this.game.load.image('deco1', PiecSettings.assetsDir + "deco01.png");
         // this.game.load.image('deco2', PiecSettings.assetsDir + "deco02.png");
         // this.game.load.image('deco3', PiecSettings.assetsDir + "deco03.png");

         this.game.global.animations = {};

         PiecSettings.animation = PiecSettings.animation || {};

         var defaultAnimation = {
             frameRate: 60,
             scale: 1
         };

     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;