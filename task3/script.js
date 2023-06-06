const proxyURL = "https://api.codetabs.com/v1/proxy?quest=";
/**
 * Функция-обертка над XMLHttpRequest, осуществляющая запрос
 * url - урл, по которому будет осуществляться запрос
 * callback - функция, которая вызовется при успешном выполнении
 * и первым параметром получит объект-результат запроса
 */
function useRequest(url, callback) {
    //ОБХОД CORS С ПОМОЩЬЮ PROXY
    url = `${proxyURL}${url}`;
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log("Статус ответа: ", xhr.status);
        } else {
            const result = JSON.parse(xhr.response);
            if (callback) {
                callback(result);
            }
        }
    };

    xhr.onerror = function () {
        console.log("Ошибка! Статус ответа: ", xhr.status);
    };

    xhr.send();
}

// Ищем ноду для вставки результата запроса
const resultNode = document.querySelector(".resultArea");
// Ищем кнопку, по нажатии на которую будет запрос
const btnNode = document.querySelector(".form__submit");

/**
 * Функция обработки полученного результата
 * apiData - объект с результатом запроса
 */
function displayResult(apiData) {
    let cards = "";

    apiData.forEach((item) => {
        const cardBlock = `
      <div class="card">
        <img
          src="${proxyURL}${item.download_url}"
          class="card-image"
        />
        <p>${item.author}</p>
      </div>
    `;
        cards = cards + cardBlock;
    });

    resultNode.innerHTML = cards;
}

// Вешаем обработчик на кнопку для запроса
btnNode.addEventListener("click", () => {
    let numImagesLimit = document.querySelector(".numImagesLimit");
    let isCorrect = true;

    if (Number.isInteger(Number(numImagesLimit.value))) {
        if (numImagesLimit.value > 0 && numImagesLimit.value <= 10) {
            useRequest(
                `https://picsum.photos/v2/list/?limit=${numImagesLimit.value}`,
                displayResult
            );
        } else {
            isCorrect = false;
        }
    } else {
        isCorrect = false;
    }

    if (!isCorrect) {
        resultNode.innerHTML = "Число вне диапазона от 1 до 10";
        numImagesLimit.value = "";
    }
});