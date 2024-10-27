// Элементы
const input = document.querySelector("#input");
const searchButton = document.querySelector("#search");
const deleteButton = document.querySelector("#delete");
const resultDiv = document.querySelector("#results");

// Ключевые функции
document.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        searchButton.click();
    }
    if(event.key === 'Delete') {
        deleteButton.click();
    }
});

input.addEventListener('input', function() {
    deleteButton.style.display = input.value.length !== 0 ? 'block' : 'none';
});

deleteButton.addEventListener('click', function() {
    input.value = '';
    deleteButton.style.display = 'none';
});

// Основная функция запроса на сервер
const SendRequest = async () => {
    const searchQuery = input.value.trim();
    if (!searchQuery) {
        resultDiv.innerHTML = `<li style="color:red;text-align:center;font-weight:700;background-color:white">Нет данных! Пустой ввод!</li>`;
        return;
    }

    try {
        // Определяем язык слова
        const language = await detectLanguage(searchQuery);

        // Переводим слово и получаем его определение
        let wordData, translatedWord;
        if (language === "en") {
            wordData = await fetchWordData(searchQuery, "en");
            translatedWord = await translateWord(searchQuery, "en", "ru");
        } else if (language === "ru") {
            wordData = await fetchWordData(searchQuery, "ru");
            translatedWord = await translateWord(searchQuery, "ru", "en");
        }

        // Проверка и вывод данных на экран
        if (wordData) {
            const wordText = wordData.word || searchQuery;
            const phoneticText = wordData.phonetics[0]?.text || "Нет фонетики";
            const definition = wordData.meanings[0]?.definitions[0]?.definition || "Определение отсутствует";
            const synonyms = wordData.meanings[0]?.synonyms.join(", ") || "Нет";
            const antonyms = wordData.meanings[0]?.antonyms.join(", ") || "Нет";
            const audioSrc = wordData.phonetics[0]?.audio || "";

            resultDiv.innerHTML = `
                <li><strong>Слово (${language === "en" ? "англ" : "рус"}):</strong> ${wordText}</li>
                <li><strong>Перевод:</strong> ${translatedWord}</li>
                <li><strong>Фонетика:</strong> ${phoneticText}</li>
                <li><strong>Определение:</strong> ${definition}</li>
                <li><strong>Синонимы:</strong> ${synonyms}</li>
                <li><strong>Антонимы:</strong> ${antonyms}</li>
                ${audioSrc ? `<li><audio controls src="${audioSrc}">Ваш браузер не поддерживает аудио элемент.</audio></li>` : ""}
            `;
        } else {
            resultDiv.innerHTML = `<li style="color:red;background-color:white">Данные не найдены!</li>`;
        }

    } catch (err) {
        console.log("Ошибка данных:", err);
    }
};

// Функция для определения языка введенного слова
const detectLanguage = async (text) => {
    // Используем регулярное выражение для проверки языка: если кириллица - русский, иначе - английский
    const cyrillicPattern = /[а-яА-ЯёЁ]/;
    return cyrillicPattern.test(text) ? "ru" : "en";
};

// Функция для перевода слова
const translateWord = async (word, from, to) => {
    try {
        const response = await fetch(`https://libretranslate.de/translate`, {
            method: "POST",
            body: JSON.stringify({
                q: word,
                source: from,
                target: to,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error("Ошибка перевода:", error);
        return "Перевод недоступен";
    }
};

// Функция для получения данных о слове (запрос к словарю)
const fetchWordData = async (word, lang) => {
    try {
        const apiURL = lang === "en" 
            ? `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            : `https://api.dictionaryapi.dev/api/v2/entries/ru/${word}`;
        const request = await fetch(apiURL);
        const response = await request.json();
        return response[0];
    } catch (error) {
        console.error("Ошибка получения данных о слове:", error);
        return null;
    }
};

// Обработчик кнопки поиска
searchButton.addEventListener('click', function() {
    SendRequest();
});
