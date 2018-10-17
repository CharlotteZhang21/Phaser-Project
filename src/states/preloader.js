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

         this.game.load.image('cta', PiecSettings.assetsDir + 'download.png');
         this.game.load.image('cta-2', PiecSettings.assetsDir + 'download-2.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');
         this.game.load.image('hint-button', PiecSettings.assetsDir + 'hint.png');

         this.game.load.image('letterBg', PiecSettings.assetsDir + 'letter-bg.png');

         this.game.load.image('letterHighlight', PiecSettings.assetsDir + 'letter-highlight.png');

         this.game.load.image('callout_amazing', PiecSettings.assetsDir + 'callout_amazing.png');
         this.game.load.image('callout_spectacular', PiecSettings.assetsDir + 'callout_spectacular.png');
         this.game.load.image('callout_bg', PiecSettings.assetsDir + 'callout_bg.png');

         this.game.load.image('wordGrid-bg', PiecSettings.assetsDir + 'wordGrid-bg.png');
         this.game.load.image('star-particle', PiecSettings.assetsDir + "star_particle.png");
         this.game.load.image('spark-particle', PiecSettings.assetsDir + "spark_particle.png");
         

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