import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CookiePan extends Phaser.Group {
    constructor(game, cookieWord) {
        super(game);
        // this.cookieWord = cookieWord;
        
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
                    // blockY = panelY + i * blockHeight; // i is the row
                // console.log(i + ",,," + j + ",,,," + wordArray[i][j]);
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
            
            blockLayerGrp.add(letterText);

            blockLayerGrp.key = letter;
            blockLayerGrp.used = false;
            
            blockLayerGrp.x = blockX;
            blockLayerGrp.y = blockY;

            blockLayerGrp.row = blockRow;
            blockLayerGrp.column = blockColumn;

            // console.log(letter + i + j);
            
            // the white background is clickable
            block.inputEnabled = true;
            block.events.onInputDown.add(this.onInputDownLetter, this);
                
        }

        return blockLayerGrp;

    }

    // hands up when Word finished!
    onUp() {
        this.moveStart = false;
 
        for (var i = 0; i < this.tempSelectedBlocksCoordinates.length; i++) {
            
            var coordinate = this.tempSelectedBlocksCoordinates[i];

            // reset every thing
            this.blockArray[coordinate.row][coordinate.column].used = false;
            this.blockArray[coordinate.row][coordinate.column].children[1].alpha = 1;
        }
        this.letters = '';
        this.tempSelectedBlocksCoordinates = [];
    }

    onUpTutorial() {
        this.wordStarted = false;
        if (this.letters != "") {
            this.game.onWordComplete.dispatch(this.letters);
            this.inputLocked = true;
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

            if(block != null) {

                var coordinate = {
                    row: block.row,
                    column: block.column
                }
                this.tempSelectedBlocksCoordinates.push(coordinate); 

                block.children[1].alpha = 0;

                this.letters += block.key;
                
            }
        }
        
    }

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