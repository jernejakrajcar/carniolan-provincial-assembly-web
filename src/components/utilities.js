import * as fs from "fs";

export function countOccurrences(properNouns, places) {
    // Create a dictionary to hold the counts
    const placeCounts = {};

    // Initialize counts to 0
    places.forEach(place => {
        placeCounts[place] = 0;
    });

    // Count occurrences
    properNouns.forEach(entry => {
        const word = entry[0]; // The word is the first element of the entry
        if (places.includes(word)) {
            placeCounts[word]++;
        }
    });

    return placeCounts;
}

//NOVA PRILAGOJENA FUNKCIJA ZA ISKANJE Z LEVENSHTAINOVO RAZDALJO:
import leven from 'leven';

export function countOccurrencesLeven(properNouns, places, maxDistance = 1) {
    // Create a dictionary to hold the counts
    const placeCounts = {};

    // Initialize counts to 0
    places.forEach(place => {
        placeCounts[place] = 0;
    });

    // Count occurrences with fuzzy matching
    properNouns.forEach(entry => {
        const word = entry[0]; // The word is the first element of the entry

        // Find the best match for the word in the places list
        let bestMatch = null;
        let bestDistance = maxDistance + 1; // Initialize with a value larger than maxDistance

        places.forEach(place => {
            const distance = leven(word, place);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = place;
            }
        });

        // If a match within the maxDistance is found, count it
        if (bestMatch !== null && bestDistance <= maxDistance) {
            placeCounts[bestMatch]++;
        }
    });

    return placeCounts;
}

//štetje z iskanjem približnih ujemanj in shranjevanjem lokalno
import Fuse from 'fuse.js';

export function countOccurrencesLocal(properNouns, places, maxDistance = 2) {
    const placeCounts = {};

    places.forEach(place => {
        placeCounts[place] = 0;
    });

    const options = {
        includeScore: true,
        threshold: maxDistance / Math.max(...places.map(place => place.length)),
        keys: ['name']
    };

    const fuse = new Fuse(places.map(place => ({ name: place })), options);

    properNouns.forEach(entry => {
        const word = entry[0];
        const result = fuse.search(word);
        if (result.length > 0) {
            const bestMatch = result[0].item.name;
            placeCounts[bestMatch]++;
        }
    });

    return placeCounts;
}

export function saveOccurrencesToLocalStorage(properNouns, places) {
    const placeCounts = countOccurrences(properNouns, places);
    localStorage.setItem('placeCounts', JSON.stringify(placeCounts));
}

export function getOccurrencesFromLocalStorage() {
    const placeCounts = localStorage.getItem('placeCounts');
    return placeCounts ? JSON.parse(placeCounts) : null;
}


