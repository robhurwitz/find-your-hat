const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.location = this.coordinates(pathCharacter);
    this.exit = false;
  }

  // prints field
  print() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
  }

  // returns location of item
  coordinates(item) {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === item) {
          return [i, j];
        }
      }
    }
    console.log(`The ${item} doesn't exist`);
  }

  // Returns coordinates of hat
  findHat() {
    return this.coordinates(hat);
  }

  //moves character based on u, r, d, l inputs
  moveCharacter(direction) {
    if (direction == "u") {
      this.location[0] -= 1;
    } else if (direction == "r") {
      this.location[1] += 1;
    } else if (direction == "d") {
      this.location[0] += 1;
    } else if (direction == "l") {
      this.location[1] -= 1;
    } else {
      console.log("Not a valid input");
    }
  }

  //returns what is at an x,y 2d array input
  atLocation(coordinates) {
    return this.field[coordinates[0]][coordinates[1]];
  }

  checkDestination() {
    let moveAttempt = this.atLocation(this.location);
    if (moveAttempt === hat) {
      console.log("Congratulations, you found the hat");
      this.exit = true;
    } else if (moveAttempt === hole) {
      console.log("Sorry, you fell in a hole");
      this.exit = true;
    } else if (moveAttempt === pathCharacter) {
      console.log("You can't go back the way you came");
      this.exit = true;
    } else if (moveAttempt === fieldCharacter) {
      this.field[this.location[0]][this.location[1]] = pathCharacter;
    } else {
      console.log("Out of bounds");
      this.exit = true;
    }
  }

  static generateField(height, width, percentage = 10) {
    percentage *= 0.01;
    //newField will be the final 2d board that is returned.
    let newField = [];
    //Total pieces on board will equal height times width
    let totalPieces = height * width;
    //Array containing all available pieces.
    let piecesArray = [pathCharacter, hat];
    let numHoles = Math.round(totalPieces * percentage);
    let numFieldCharacter = totalPieces - 2 - numHoles;
    // Add holes to array containing all available pieces
    for (let i = 0; i < numHoles; i++) {
      piecesArray.push(hole);
    }
    // Add fieldCharacters to array containing all available pieces
    for (let i = 0; i < numFieldCharacter; i++) {
      piecesArray.push(fieldCharacter);
    }
    //Add random piece from piecesArray to 2d board. Then, remove that piece.
    for (let i = 0; i < height; i++) {
      newField.push([]);
      for (let j = 0; j < width; j++) {
        let randomPiece =
          piecesArray[Math.floor(Math.random() * piecesArray.length)];
        newField[i][j] = randomPiece;
        piecesArray.splice(piecesArray.indexOf(randomPiece), 1);
      }
    }
    return newField;
  }

  static generateRandomField() {
    let width = Math.floor(Math.random() * 10);
    while (width < 2) {
      width = Math.floor(Math.random() * 10);
    }
    let height = Math.floor(Math.random() * 10);
    while (height < 2) {
      height = Math.floor(Math.random() * 10);
    }
    let percentage = Math.floor(Math.random() * 40);
    return this.generateField(width, height, percentage);
  }
}

// code to run game.
let myField = new Field(Field.generateRandomField());
const buildOwn = prompt("Would you like to build your own field? (y/n): ");
if (buildOwn === "y" || buildOwn === "Y") {
  const height = prompt("Height: ");
  const width = prompt("Width: ");
  const percentage = prompt("Percentage of holes: ");
  const userField = Field.generateField(height, width, percentage);
  myField = new Field(userField);
}
while (myField.exit === false) {
  myField.print();
  let movement = prompt("Which way? ");
  myField.moveCharacter(movement);
  myField.checkDestination();
}
