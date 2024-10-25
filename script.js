// Elements !
const input = document.querySelector("#input");
const searchButton = document.querySelector("#search");
const deleteButton = document.querySelector("#delete");
const resultDiv = document.querySelector("#results");

// Key function !
document.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        searchButton.click();
    }
    if(event.key === 'Delete') {
        deleteButton.click();
    }
});

// Input codes ! 
input.addEventListener('input', function() {
    if(input.value.length != 0) {
        deleteButton.style.display = 'block';
    } else {
        deleteButton.style.display = 'none';
    }
});

// Delete Button codes !
deleteButton.addEventListener('click', function() {
    input.value = '';
    deleteButton.style.display = 'none';
});

// Server codes !
// Request to the server !
const SendRequest = async () => {
    const searchQuery = input.value.trim();
    if (!searchQuery) {
        console.log(`%cEmpty input !`, 'font-weight:bold;color:red;');
        resultDiv.innerHTML = `<li style="color:red;text-align:center;font-weight:700;background-color:white">No data !<br>Empty input !</li>`;
        return;
    }
    console.log(`You request send to the server : ${searchQuery} !`);
    const startTime = Date.now();

    try {
        const request = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchQuery}`);
        const endTime = Date.now();
        const resultTime = ((endTime - startTime) / 1000).toFixed(2);
        document.querySelector('p').innerHTML = `The server response is ${resultTime}s !`;

        setTimeout(function() {
            document.querySelector('p').style.display = 'none';
        }, 5000);

        console.log(`%cResponse send server to ${resultTime}s !`, 'font-weight:bold;color: rgb(36, 232, 36);');
        const response = await request.json();
        if (!request.ok) {
            console.log(`Malumotlar topilmadi !`);
            resultDiv.innerHTML = `<li style="color:red;background-color:white">Malumotlar topilmadi !</li>`;
            return;
        } else {
            const wordData = response[0];
            const wordText = wordData.word;
            const phoneticText = wordData.phonetics[0]?.text || "No phonetic available";
            const definition = wordData.meanings[0].definitions[0].definition;
            const synonyms = wordData.meanings[0].synonyms.join(", ") || "None";
            const antonyms = wordData.meanings[0].antonyms.join(", ") || "None";
            const audioSrc = wordData.phonetics[0]?.audio || "";

            // Display data
            resultDiv.innerHTML = `
                <li><strong>Word:</strong> ${wordText}</li>
                <li><strong>Phonetic:</strong> ${phoneticText}</li>
                <li><strong>Definition:</strong> ${definition}</li>
                <li><strong>Synonyms:</strong> ${synonyms}</li>
                <li><strong>Antonyms:</strong> ${antonyms}</li>
                ${audioSrc ? `<li><audio controls src="${audioSrc}">Your browser does not support the audio element.</audio></li>` : ""}
            `;
        }
        console.log(response);
        return response;
    } catch (err) {
        console.log(`Error data : `, err);
    }
};

// Search button codes !
searchButton.addEventListener('click', function() {
    SendRequest();
});
