import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CookiePan extends Phaser.Group {
    constructor(game, cookieWord) {
        super(game);
        this.cookieWord = cookieWord;
        
        this.game.input.onUp.add(this.onUp, this);
        
        this.letters = "";
        this.moveStart = false


        this.containerName = 'board-background';

        this.blockArray = [];
        this.tempSelectedBlocksCoordinates = [];

        this.createStacks();
    }

    createStacks(){

        var wordArray = PiecSettings.words;

        var row = wordArray.length, column = wordArray[0].length;

        var blockWidth = ContainerUtil.getContainerWidth(this.containerName)/column,
            blockHeight = 0;


        var panelX = ContainerUtil.getContainerX(this.containerName),
            panelY = ContainerUtil.getContainerY(this.containerName);


        for (var i = 0; i < row; i++) {
            var blockY = panelY + i * blockHeight * 0.9;
            
            var columnArray = [];
            for (var j = 0; j < column; j++) {
                var blockX = panelX + j * blockWidth; // j is the coloumn
                var block = this.createLetters(wordArray[i][j], blockWidth, blockX, blockY, i, j);
                if(blockHeight == 0){
                    blockHeight = block.height;
                }

                columnArray.push(block)
                this.game.world.sendToBack(block);

            }

            this.blockArray.push(columnArray);

        }
    }


    createLetters(letter, blockWidth, blockX, blockY, blockRow, blockColumn) {

        var blockLayerGrp = new Phaser.Group(this.game);
        
        //create letter

        if(letter == '-'){
            var block = new Phaser.Sprite(this.game, 0, 0, 'letterBg');
            blockLayerGrp.add(block);
            blockLayerGrp.key = '-';
            blockLayerGrp.used = false;
            blockLayerGrp.row = blockRow;
            blockLayerGrp.column = blockColumn;
            block.scale.x = blockWidth / block.width;
            block.scale.y =  block.scale.x;
            blockLayerGrp.alpha = 0;
        }else{
            //create highlight
            var letterHighlight = new Phaser.Sprite(this.game, 0, 0, 'letterHighlight');
            blockLayerGrp.add(letterHighlight);
            letterHighlight.scale.x = blockWidth / letterHighlight.width;
            letterHighlight.scale.y =  letterHighlight.scale.x;

            //create background,
            var block = new Phaser.Sprite(this.game, 0, 0, 'letterBg');
            blockLayerGrp.add(block);
            block.scale.x = blockWidth / block.width;
            block.scale.y =  block.scale.x;

            //create font
            var letterText = this.createLetterText(block, letter);
            
            blockLayerGrp.add(letterText);

            blockLayerGrp.key = letter;
            blockLayerGrp.used = false;
            
            blockLayerGrp.x = blockX;
            blockLayerGrp.y = blockY;

            blockLayerGrp.row = blockRow;
            blockLayerGrp.column = blockColumn;

            // the white background is clickable
            block.inputEnabled = true;
            block.events.onInputDown.add(this.onInputDownLetter, this);
                
        }

        return blockLayerGrp;

    }

    createLetterText(block, letter) {

        var fontWeight = 'bold',
            fontSize,
            fontFamily = PiecSettings.fontFamily,
            fontColor = [PiecSettings.fontColor],
            fontStroke = null,
            strokeThickness = null,
            fontShadow = null,
            anchorX = 0.5,
            anchorY = 0.5;

        var fontStyle =  PiecSettings.stackLetterStyle;

        fontWeight = fontStyle.fontWeight;
        fontSize = block.height * 0.5;
        fontFamily = fontStyle.fontFamily;
        fontColor = fontStyle.color;
        fontStroke = fontStyle.stroke || null;
        strokeThickness = fontStyle.strokeThickness || null;
        fontShadow = fontStyle.shadow || null;
        anchorX = fontStyle.anchor.x || .5;
        anchorY = fontStyle.anchor.y || .5;

    

        var style = {
            font: fontWeight + " " + fontSize + "px " + fontFamily,
        };

        var letterText = new Phaser.Text(this.game, 0, 0, letter, style);
        letterText.anchor.set(0.5);
        letterText.x = block.width * 0.5 ;
        letterText.y = block.height * 0.6;


        var gradient = letterText.context.createLinearGradient(0, 0, 0, letterText.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }
        letterText.fill = gradient;
        
        return letterText;
    }

    checkWordIsCorrect(){
        var flag = false;
        var goals = PiecSettings.goals;

        for (var i = 0; i < goals.length; i++) {
            if(goals[i] == this.letters){
                flag = true;
            }
        }
        return flag;
    }


    // hands up when Word finished!
    onUp() {
        this.moveStart = false;

        //if word is correct fly the word to the goal
        //repostion the other blocks
        if(this.checkWordIsCorrect()){
            this.wordFlyToGoal();
            this.callOut();

        }else{
            for (var i = 0; i < this.tempSelectedBlocksCoordinates.length; i++) {
            
                var coordinate = this.tempSelectedBlocksCoordinates[i];

                // reset every thing
                this.blockArray[coordinate.row][coordinate.column].used = false;
                this.blockArray[coordinate.row][coordinate.column].children[1].alpha = 1;
            }    
        }
        
        this.letters = '';
        this.cookieWord.clearLetters();
        this.tempSelectedBlocksCoordinates = [];
    }

    reposition() {

    }

    onUpTutorial() {
        this.wordStarted = false;
        if (this.letters != "") {
            this.game.onWordComplete.dispatch(this.letters);
            this.inputLocked = true;
        }
    }

    callOut() {
        var spriteName = 'callout_amazing';
        if( this.wordSelectionDirection == "downToUp" || this.wordSelectionDirection == "leftToRight") {
            spriteName = 'callout_spectacular';
            console.log('hello');
        } 

        console.log(spriteName);
        var callOutBg = new Phaser.Sprite(this.game, 0, 0, 'callout_bg');
        ContainerUtil.fitInContainer(callOutBg, 'win-message', 0.5, 0.5);
        var callOut = new Phaser.Sprite(this.game, 0, 0, spriteName);
        ContainerUtil.fitInContainer(callOut, 'win-message', 0.5, 0.5);
        this.game.add.existing(callOutBg);
        this.game.add.existing(callOut);

        var bgScale = callOutBg.scale.x;
        callOutBg.scale.x = 0;

        var callOutScale = callOut.scale.x;
        callOut.scale.x = 0;
        callOut.scale.y = 0; 

        this.game.add.tween(callOutBg.scale).to({x: [0, bgScale]}, 500, Phaser.Easing.Quadratic.InOut, true, 0)
        .onComplete.add(function(){
            this.game.add.tween(callOutBg).to({alpha: 0}, 500, Phaser.Easing.Linear.Out, true, 0)
                                        .onComplete.add(function(){
                                            callOutBg.destroy();
                                        },this)
        },this);
        this.game.add.tween(callOut.scale).to({x: callOutScale, y: callOutScale}, 500, Phaser.Easing.Quadratic.InOut, true, 300).onComplete.add(function(){
            this.game.add.tween(callOut).to({alpha: 0}, 500, Phaser.Easing.Linear.Out, true, 0)
                                        .onComplete.add(function(){
                                            callOut.destroy();
                                        },this)

        },this);

    }

    wordFlyToGoal(){
        //destroy, get the holes and move other blocks
        var flyingLetters = []; // for animation purpose

            

        for (var i = this.tempSelectedBlocksCoordinates.length - 1; i >= 0; i--) {

            var coordinate = this.tempSelectedBlocksCoordinates[i];
            var block = this.blockArray[coordinate.row][coordinate.column]; // get the block from block array using the temp coordinates

            /*==== animate, expand and fly to goal === */
            var clone = this.createLetterText(block.children[0], block.key);

            clone.x = block.x + block.width/2;
            clone.y = block.y + block.height/2;
            this.game.add.existing(clone);
            
            var blockInitScale = clone.scale.x;
            clone.scale.x = 0;
            clone.scale.y = 0;
            this.game.add.tween(clone.scale).to({
                    x: [blockInitScale * 1.25],
                    y: [blockInitScale * 1.25],
                }, 300, Phaser.Easing.Quadratic.InOut, true, 0);
            
            this.game.add.tween(clone).to({
                y: -100,
            }, 600, Phaser.Easing.Quadratic.InOut, true, 500 + 50 * i);
            
            this.game.add.tween(block).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0);
            /*==== end of animation === */

            /*==== move the blocks === */
            var topBlock = null;
            var leftBlock = null;
            if(coordinate.row != 0){
                topBlock = this.blockArray[coordinate.row-1][coordinate.column];
            
                console.log(topBlock.key + "" + topBlock.used);
            }
            if(coordinate.column != 0){
                leftBlock = this.blockArray[coordinate.row][coordinate.column-1];
            }

            if(topBlock != null && !topBlock.used){
                var currentRow = block.row;

                var currentColumn = block.column;
                for(var r = currentRow; r >= 1; r-- ){
                    var lastMovingBlock = this.blockArray[r][currentColumn];
                    var movingBlock = this.blockArray[r-1][currentColumn];

                    movingBlock.row = r;

                    this.game.add.tween(movingBlock).to({y: lastMovingBlock.y}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
                    this.blockArray[r][currentColumn] = this.blockArray[r-1][currentColumn];               
                }

                this.blockArray[0][currentColumn] = this.createLetters("-", block.width, block.x, block.Y, currentRow, 0);
                
                Util.printTwoLevelArray(this.blockArray);

            }else if(leftBlock != null && !leftBlock.used){
                //if there's no top block, move left

                /*==== move all to the right and create an empty '-' block === */
                var currentRow = block.row;
                var currentColumn = block.column;
                for(var c = currentColumn; c >= 1; c-- ){
                    var lastMovingBlock = this.blockArray[currentRow][c];
                    var movingBlock = this.blockArray[currentRow][c-1];
                    
                    movingBlock.column = c;
                    

                    this.game.add.tween(movingBlock).to({x: lastMovingBlock.x}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
                    this.blockArray[currentRow][c] = this.blockArray[currentRow][c-1];
                    
                }

                this.blockArray[currentRow][0] = this.createLetters("-", block.width, block.x, block.Y, currentRow, 0);
                
                Util.printTwoLevelArray(this.blockArray);
            }

            block.destroy();

        }

    }

    isInputOverLetter(mouseX, mouseY) {
        for (var i = 0; i < this.blockArray.length; i++) {
            for(var j = 0; j < this.blockArray[i].length; j++) {
                var block = this.blockArray[i][j];
                if(!block.used && this.isBetweenValues(mouseX, block.x, block.x + block.width) && this.isBetweenValues(mouseY, block.y, block.y + block.height)){
                    block.used = true;
                    return block;
                }
            }
        }
        return null;
    }

    isBetweenValues(value, min, max) {
        if (value > min && value < max) {
            return true;
        }
        return false;
    }

    scaleLetterUp(letter) {
        var initialScale = letter.initialScale;
        this.game.add.tween(letter.scale).to({
            x: initialScale * 1.05,
            y: initialScale * 1.05,
        }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
    }
 
    //Word started
    onInputDownLetter(letter) {
        
        this.moveStart = true;

    }

    update() {
        if(this.moveStart){
            this.mouseX = (this.game.input.x - this.x) / this.scale.x;
            this.mouseY = (this.game.input.y - this.y) / this.scale.y;
           
            var block = this.isInputOverLetter(this.mouseX, this.mouseY);

            var canPushToTempArray = false;
            
            if(block != null) {

                var coordinate = {
                    row: block.row,
                    column: block.column
                }

                if( this.tempSelectedBlocksCoordinates.length == 0) {

                    canPushToTempArray = true;

                }else if( this.tempSelectedBlocksCoordinates.length == 1) {

                    var length = this.tempSelectedBlocksCoordinates.length;
                    var lastTempBlock = this.tempSelectedBlocksCoordinates[length - 1];

                    if(coordinate.row == lastTempBlock.row){
                        
                        canPushToTempArray = true;
                        
                        if( coordinate.column == (lastTempBlock.column-1) ){
                            this.wordSelectionDirection = 'leftToRight';
                        }else if (coordinate.column == (lastTempBlock.column+1) ){
                            this.wordSelectionDirection = 'rightToLeft';
                        }
                    }else if(coordinate.column == lastTempBlock.column) {
                        canPushToTempArray = true;
                        if( coordinate.row == (lastTempBlock.row +1 )){
                            this.wordSelectionDirection = 'upToDown';
                        }else if( coordinate.row == (lastTempBlock.row +1 )){
                            this.wordSelectionDirection = 'downToUp';
                        }
                    }

                }else if ( this.tempSelectedBlocksCoordinates.length >= 2) {
                    var firstTempBlock = this.tempSelectedBlocksCoordinates[0];

                    var length = this.tempSelectedBlocksCoordinates.length;
                    
                    var lastTempBlock = this.tempSelectedBlocksCoordinates[length - 1];

                    switch(this.wordSelectionDirection) {
                        case 'leftToRight': 
                            if (coordinate.column == (lastTempBlock.column-1)){
                                block.used = false; // first reset the choosen block
                                block = this.blockArray[lastTempBlock.row][lastTempBlock.column-1];
                                block.used = true;
                                coordinate = {
                                    row: block.row,
                                    column: block.column
                                }
                                canPushToTempArray = true;
                            }
                            // if (coordinate.row == firstTempBlock.row && coordinate.column == (lastTempBlock.column-1)) {
                            //     canPushToTempArray = true;
                            // }
                            break;
                        case 'rightToLeft':

                            if (coordinate.column == (lastTempBlock.column+1)){
                                block.used = false;
                                block = this.blockArray[lastTempBlock.row][lastTempBlock.column+1];
                                block.used = true;
                                coordinate = {
                                    row: block.row,
                                    column: block.column
                                }
                                canPushToTempArray = true;
                            } 
                            // if (coordinate.row == firstTempBlock.row && coordinate.column == (lastTempBlock.column+1)) {
                            //     canPushToTempArray = true;
                            // }
                            break;
                        case 'upToDown':

                            if (coordinate.row == (lastTempBlock.row+1)){
                                block.used = false;
                                block = this.blockArray[lastTempBlock.row+1][lastTempBlock.column];
                                block.used = true;
                                coordinate = {
                                    row: block.row,
                                    column: block.column
                                }
                                canPushToTempArray = true;
                            }
                            // if (coordinate.row == (lastTempBlock.row + 1 ) && coordinate.column == firstTempBlock.column) {
                            //     canPushToTempArray = true;
                            // }
                            break;
                        case 'downToUp':

                            if (coordinate.row == (lastTempBlock.row-1)){
                                block.used = false;
                                block = this.blockArray[lastTempBlock.row-1][lastTempBlock.column];
                                block.used = true;
                                coordinate = {
                                    row: block.row,
                                    column: block.column
                                }
                                canPushToTempArray = true;
                            }
                            // if (coordinate.row == (lastTempBlock.row - 1 ) && coordinate.column == firstTempBlock.column) {
                            //     canPushToTempArray = true;
                            // }
                            break;

                        default:
                            console.log('noDirection');
                    }
                      
                }

                if(canPushToTempArray){

                    this.tempSelectedBlocksCoordinates.push(coordinate); 

                    block.children[1].alpha = 0;

                    this.letters += block.key;
                    console.log(this.letters);
                    this.cookieWord.updateBox(this.letters);
                }

                console.log(this.tempSelectedBlocksCoordinates);                
            }
        }
        
    }

    //TODO animating the block falling down
    // animate() {
    //     this.inputLocked = true;
    //     if (this.game.global.windowHeight > this.game.global.windowWidth) {
    //         this.game.add.tween(this).to({
    //             x: [-this.width],
    //         }, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
    //     } else {
    //         this.game.add.tween(this).to({
    //             x: [this.game.global.windowWidth * window.devicePixelRatio + this.width],
    //         }, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
    //     }

    // }
}

export default CookiePan;