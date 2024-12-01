let countries = [];
let currentCountry = null;
let score = 0;
let remainingGuesses = 3;
let hintUsed = false;

// Elements
const factElement = document.getElementById('fact');
const guessInput = document.getElementById('guess');
const submitButton = document.getElementById('submit-button');
const hintButton = document.getElementById('hint-button');
const resultElement = document.getElementById('result');
const hintElement = document.getElementById('hint');
const scoreElement = document.getElementById('score');
const nextButton = document.getElementById('next-button');

// Fetch country data and initialize the game
async function initGame() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    // Prepare country data
    countries = data.map(country => ({
        name: country.name.common,
        capital: country.capital ? country.capital[0] : 'Unknown',
        region: country.region,
        population: country.population,
        languages: country.languages ? Object.values(country.languages).join(', ') : 'Various',
        currencies: country.currencies ? Object.keys(country.currencies).join(', ') : 'Multiple',
        flag: country.flag
    }));

    nextFact();
}

// Generate a random fact for the current country
function generateFact(country) {
    const facts = [
        `This country is located in ${country.region}.`,
        `The capital city is ${country.capital}.`,
        `The population is approximately ${formatNumber(country.population)} people.`,
        `Languages spoken include: ${country.languages}.`,
        `The currency used is ${country.currencies}.`,
        `Its flag looks like this: ${country.flag}`
    ];

    // Randomly select a fact
    return facts[Math.floor(Math.random() * facts.length)];
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Load the next fact
function nextFact() {
    // Clear previous results
    resultElement.textContent = '';
    hintElement.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    submitButton.disabled = false;
    hintButton.disabled = false;
    nextButton.style.display = 'none';
    hintUsed = false;

    // Reset chances
    remainingGuesses = 3;

    // Select a random country
    currentCountry = countries[Math.floor(Math.random() * countries.length)];

    // Display a random fact
    factElement.textContent = generateFact(currentCountry);
}

// Check the player's guess
function checkGuess() {
    const guess = guessInput.value.trim().toLowerCase();
    const correctAnswer = currentCountry.name.toLowerCase();

    if (guess === correctAnswer) {
        score++;
        resultElement.textContent = `Correct! 🎉 The country was ${currentCountry.name}.`;
        resultElement.style.color = 'green';
        guessInput.disabled = true;
        submitButton.disabled = true;
        hintButton.disabled = true;
        nextButton.style.display = 'inline-block';
    } else {
        remainingGuesses--;
        if (remainingGuesses > 0) {
            resultElement.textContent = `Wrong! ❌ You have ${remainingGuesses} chance(s) left.`;
            resultElement.style.color = 'red';
        } else {
            resultElement.textContent = `No more chances! ❌ The correct answer was ${currentCountry.name}.`;
            resultElement.style.color = 'orange';
            guessInput.disabled = true;
            submitButton.disabled = true;
            hintButton.disabled = true;
            nextButton.style.display = 'inline-block';
        }
    }

    scoreElement.textContent = `Score: ${score}`;
}

// Show a hint
function showHint() {
    if (!hintUsed) {
        hintUsed = true;
        hintButton.disabled = true; // Disable hint button after use

        // Generate and display a hint
        const hints = [
            `The capital of this country is ${currentCountry.capital}.`,
            `This country is in the ${currentCountry.region} region.`,
            `One of its official languages is ${currentCountry.languages.split(',')[0]}.`,
            `Its currency is ${currentCountry.currencies.split(',')[0]}.`
        ];

        hintElement.textContent = hints[Math.floor(Math.random() * hints.length)];
    }
}

// Event listeners
submitButton.addEventListener('click', checkGuess);

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

hintButton.addEventListener('click', showHint);

nextButton.addEventListener('click', nextFact);

// Initialize the game
initGame();
