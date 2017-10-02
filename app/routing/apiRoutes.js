// Dependencies
var characters = require("../data/characters.js");

//This function will loop through your submitted score data and ensure it is formatted as a number
function stringToNum(newCharacter) {
	newCharacter.scores.forEach(function(element, index, array) {
		array[index] = parseInt(element);
	});
	return newCharacter;
}

function compareScores(newCharacter, characters) {
	//Create copy so that splice does not modify original array
	var charactersCopy = [];
	Object.assign(charactersCopy, characters);

	//Set a starting score to compare against each potential character
	var score = 100;
	var tempScore = 0;

	//These will hold the match to be returned
	var match = {};
	var tempMatch = {};

	//Remove last index of copy array so we won't compare against ourselves
	var charactersTruncated = charactersCopy.splice(0, charactersCopy.length - 1);

	//Pull out the scores, we only need those to compare
	var newCharacterArray = newCharacter.scores;

	charactersTruncated.forEach(function(element) {
		//Each index of array, we want to hold an object as a potential match
		tempMatch = element;

		//If any of the scores do not much, we take the difference in absolute value
		element.scores.forEach(function(element, index, array) {
			if(array[index] !== newCharacterArray[index]) {
				tempScore += Math.abs(array[index] - newCharacterArray[index]);
			}
		});

		//If the score is better than our current score, replace it as the new score to beat and make the temp match our
		//permanent match
		if(tempScore < score){
			score = tempScore;
			match = tempMatch;
		}

		//Make sure temp score is 0 again for a fresh comparison
		tempScore = 0;

	});

	return match;
}

module.exports = function(app){
	//Return the json data of our characters array
	app.get("/api/characters", function(req, res) {
		res.json(characters);
	});

	//Pull data from front end, push it to characters, run through compareScores, and send back result
	app.post("/api/characters", function(req, res) {
		var newCharacter = req.body;
		var toNum = stringToNum(newCharacter);

		characters.push(toNum);

		var response = compareScores(toNum, characters);

		res.json(response);
	});
};
