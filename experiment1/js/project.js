// project.js - purpose and description here
// Author: Dale Spence
// Date: 4/7/24

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
    

  }
}

function main() {
  const fillers = {
    Num: ["1", "2", "3", "4", "5", "6", "7"],
    Channel: ["CSN", "CBS", "FOX", "Boogaloo", "NBC", "ABC", "CNN", "Slippy Buddy"],
    adjective: ["intense", "exciting", "nerve-wracking", "thrilling", "dramatic", "captivating", "unpredictable"],
    team: ["Los Angeles Lakers", "Boston Celtics", "Golden State Warriors", "Chicago Bulls", "Miami Heat", "San Antonio Spurs", "Toronto Raptors"],
    score: ["101-100", "85-82", "110-108", "92-89", "117-114", "99-97", "120-118"],
    player: ["LeBron James", "Stephen Curry", "Kevin Durant", "Kobe Bryant", "Michael Jordan", "Magic Johnson", "Larry Bird", "George Bush", "Aunt Jemima", "Amelia Earhart", "Scooby-Doo", "Super Wario", "Albert Einstein"],
    adjective2: ["remarkable", "exceptional", "unbelievable", "astonishing", "extraordinary", "mind-blowing", "incredible"],
    trophy: ["Larry O'Brien Championship Trophy", "NBA Finals MVP Trophy", "Bill Russell NBA Finals Most Valuable Player Award"],
    adjective3: ['historic', 'memorable', 'unforgettable', 'remarkable', 'monumental', 'epic']
  };
  
  const template = `Breaking News! 
  This is Channel $Num $Channel Sports reporting live on an $adjective Intergalactic NBA Finals match! 
  The game between the $team and the $team has just concluded with a final score of $score! 
  The MVP of the game was $player, whose performance was truly $adjective2. 
  The $trophy has been awarded to the winning team, marking a $adjective3 moment in NBA history!` 
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    //box.innerText = story;
    $("#box").text(story);

  }
  
  /* global clicker */
  //clicker.onclick = generate;
  $("#clicker").click(generate);

  generate();
}

main();