// Uvoz potrebnih knjižnic
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Funkcija za pridobitev koordinat z Nominatim API-ja
const getCoordinates = async (placeName) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: placeName,
                format: 'json',
                limit: 1 // Omeji na en rezultat
            }
        });
        if (response.data.length > 0) {
            const data = response.data[0];
            return {
                lat: data.lat,
                lon: data.lon
            };
        } else {
            return null; // Ni najdenih rezultatov
        }
    } catch (error) {
        console.error(`Napaka pri pridobivanju koordinat za ${placeName}:`, error);
        return null;
    }
};

// Preberi jsonl datoteko in dodaj koordinate
const processFile = async (inputFile, outputFile) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(inputFile),
        output: process.stdout,
        terminal: false
    });

    const results = [];

    for await (const line of rl) {
        const place = JSON.parse(line);
        const placeName = place.names.sl; // Uporabi slovensko ime kraja
        console.log(placeName)
        const coordinates = await getCoordinates(placeName);
        console.log(coordinates)

        if (coordinates) {
            place.coordinates = coordinates;
        } else {
            place.coordinates = { lat: null, lon: null };
        }

        results.push(place);
    }

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Koordinate so bile shranjene v datoteko ${outputFile}`);
};

const inputFile = '../../public/krajevna_imena.jsonl';
const outputFile = '../../public/krajevna_imena.json';

processFile(inputFile, outputFile);
