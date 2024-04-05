const https = require("https");
const url = "https://pokeapi.co/api/v2/pokemon";


const axios = require('axios');
// let data
// axios.get(url)
//   .then(response => {
//     data = response.data
//   })
//   .catch(error => {
//     console.error('Error fetching data:', error);
//   });

//   let numbers = []
//    data?.map((d) => {
//     axios.get(d.url)
//   .then(response => {
//     numbers.push(response.data.height)
//   })
//   .catch(error => {
//     console.error('Error fetching data:', error);
//   });
//   });

//   console.log(numbers , data);

async function getHeight() {
    const data = await axios.get(url).then(response => { return response.data });

    const heightPromises = data.results.map(async (data) => {
        const response = await axios.get(data.url);
        return response.data.height;
    });
    const height = await Promise.all(heightPromises);
    const biggestNumber = height.sort((a , b) => b - a)
    console.log(biggestNumber[biggestNumber.length - (biggestNumber.length-0)]);
}
// getHeight();


function generateSubstrings(components, minLength, maxLength, maxUnique) {
    const substrings = new Set();
    const n = components.length;

    // Generate all substrings
    for (let i = 0; i < n; i++) {
        for (let j = i + minLength; j <= Math.min(n, i + maxLength); j++) {
            const substring = components.substring(i, j);
            if (new Set(substring).size <= maxUnique) {
                substrings.add(substring);
            }
        }
    }

    return substrings;
}

function getMaxOccurrences(components, minLength, maxLength, maxUnique) {
    const substrings = generateSubstrings(components, minLength, maxLength, maxUnique);
    let maxFrequency = 0;

    substrings.forEach(substring => {
        let count = 0;
        let index = -1;
        while ((index = components.indexOf(substring, index + 1)) !== -1) {
            count++;
        }
        maxFrequency = Math.max(maxFrequency, count);
    });

    return maxFrequency;
}

// Example usage:
const components = "ababab";
const minLength = 2;
const maxLength = 3;
const maxUnique = 4;
console.log(getMaxOccurrences(components, minLength, maxLength, maxUnique)); // Output: 3
