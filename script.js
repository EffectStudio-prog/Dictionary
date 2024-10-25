// Elements !

const input = document.querySelector("#input");
const searchButton = document.querySelector("#search")
const deleteButton = document.querySelector("#delete")
const resultDiv = document.querySelector("#results")

// Codes !

// Key function !
document.addEventListener('keydown',function(event){
    if(event.key === 'Enter'){
        searchButton.click();
    }
    if(event.key === 'Delete'){
        deleteButton.click()
    }
})

// Input codes ! 

input.addEventListener('input',function(){
    if(input.value.length != 0){
        deleteButton.style.display = 'block'
    }
    else{
        deleteButton.style.display = 'none'
    }
})

// Delete Button codes !

deleteButton.addEventListener('click',function(){
    input.value = ''
    deleteButton.style.display = 'none'
})

// Server codes !

// Request to the server !

const SendRequest = async() => {
    const searchQuery = input.value.trim();
    if(!searchQuery){
        console.log(`%cEmpty input !`,'font-weight:bold;color:red;')
        resultDiv.innerHTML = `<li style="color:red;text-align:center;font-weight:700;background-color:white">No data !<br>Empty input !</li>`
    }
    console.log(`You request send to the server : ${searchQuery} !`)
    const startTime = Date.now()

    try{
    const request = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchQuery}`);
    const endTime = Date.now()
    const resultTime = ((endTime-startTime)/1000).toFixed(2)
    document.querySelector('p').innerHTML = `The server response is ${resultTime}s !`

    setTimeout(function(){
        document.querySelector('p').style.display='none'
    },5000)

    console.log(`%cResponse send server to ${resultTime}s !`,'font-weight:bold;color: rgb(36, 232, 36);')
    const response = await request.json()
    if(!request.ok){
        console.log(`Malumotlar topilmadi !`)
        resultDiv.innerHTML = `<li style="color:red;background-color:white">Malumotlar topilmadi !</li>`
        return
    }
    else {
        // Ma'lumotlarni chiqarish:
        const meanings = response[0].meanings.map(meaning => {
            const definition = meaning.definitions[0].definition;
            return `<li><strong>${meaning.partOfSpeech}:</strong> ${definition}</li>`;
        }).join("");
        
        resultDiv.innerHTML = meanings;
    }
    console.log(response)
    return response
    }
    catch(err){
        console.log(`Error data : ` , err);
    }
}

// Search button codes !

searchButton.addEventListener('click',function(){
    SendRequest()
})
