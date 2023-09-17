export default class card {
  constructor(suit, value, imageFolder) {
    this.suit = suit;
    this.value = parseInt(value);
    this.imageFolder = "./public/images/front/" + imageFolder;
    this.imageName = this.suit + this.value + ".png";
    this.imagePath = this.getImagePath();
    this.points = this.assignPoints();
  }
  assignPoints() {
    switch (this.value) {
      case 1:
        return 11;
      case 3:
        return 10;
      case 10:
        return 3;
      case 11:
        return 2;
      case 12:
        return 4;
      default:
        return (10 - this.value) * -1;
    }
  }
  getValue() {
    return this.value;
  }
  getImageName() {
    return this.imageName;
  }
  getImagePath() {
    return `${this.imageFolder}/${this.imageName}`;
  }
  getSuit() {
    return this.suit;
  }
  getPoints() {
    return this.points;
  }
  updateImageFolder(newFolder) {
    this.imageFolder = newFolder;
    this.imagePath = this.getImagePath();
  }
}
