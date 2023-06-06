const proxyURL = "https://api.codetabs.com/v1/proxy?quest=";
// Нод для вывода картинки
const resultNode = document.querySelector(".resultArea");
// Кнопку, по нажатии на которую будет выполнятся программа
const btnNode = document.querySelector(".form__submit");
// Кнопка для очистки кеша localStorage
const clearBtn = document.querySelector(".clearStorage");

// Запрос данных
function useRequest(url, callback) {
    console.log(url);
    console.log(
        "На данном сайте почему-то игнорируется второй гет параметр, если первый page, то лимит не срабатывает и наоборот."
    );
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log("Статус ответа: ", xhr.status);
        } else {
            const result = JSON.parse(xhr.response);
            console.log(`RESPONSE TYPE IS ${typeof xhr.response}`);
            localStorage.setItem("userData", JSON.stringify(result));
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

// Отображение картинок
function displayResult(apiData) {
    let cards = "";
    console.log(apiData);

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

clearBtn.addEventListener("click", () => {
    localStorage.clear();
});

// Вешаем обработчик на кнопку для запроса
btnNode.addEventListener("click", () => {
    // console.log("CLICK");
    let page = document.querySelector(".page");
    let limit = document.querySelector(".limit");

    let isPageRange = false;
    if (page.value >= 1 && page.value <= 10) {
        isPageRange = true;
    } else {
        isPageRange = false;
    }

    let isPageInteger = Number.isInteger(Number(page.value));

    let isLimitRange = false;
    if (limit.value >= 1 && limit.value <= 10) {
        isLimitRange = true;
    } else {
        isLimitRange = false;
    }

    let isLimitInteger = Number.isInteger(Number(limit.value));

    //Проверяем данные на валидность
    if (!isPageRange || !isPageInteger) {
        // Номер страницы вне диапазона от 1 до 10
        resultNode.innerHTML = "Номер страницы вне диапазона от 1 до 10";
        page.value = "";
        limit.value = "";
    } else if (!isLimitRange || !isLimitInteger) {
        // Лимит вне диапазона от 1 до 10
        resultNode.innerHTML = "Лимит вне диапазона от 1 до 10";
        page.value = "";
        limit.value = "";
    } else if (
        !(isPageRange && isLimitRange) ||
        !(isPageInteger && isLimitInteger)
    ) {
        // Номер страницы и лимит вне диапазона от 1 до 10
        resultNode.innerHTML =
            "Номер страницы и лимит вне диапазона от 1 до 10";
        page.value = "";
        limit.value = "";
    } else {
        // Тут делаем запрос
        // Формируем URL запроса с учетом обхода CORS через прокси
        let url = `${proxyURL}https://picsum.photos/v2/list?limit=${limit.value}&page=${page.value}`;

        // Добавляем в запрос уникальный гет параметр с датой для защиты от кеширования запросов
        let d = new Date();
        let dStr = d.toISOString();
        let fullUrlStr = `${url}&rqDateTime=${dStr}`;
        let userData = localStorage.getItem("userData");
        let jsonData = JSON.parse(userData);

        if (localStorage.getItem("userData")) {
            let a = localStorage.getItem("userData");
            console.log("USE LOCAL STORAGE");
            //console.log(a);
            //console.log(`TYPE A = ${typeof a}`);
            const b = JSON.parse(a);
            //console.log(`TYPE B = ${typeof b}`);
            //console.log(`2 USE LOCAL STORAGE`);
            //console.log(b);
            displayResult(b);
        } else {
            console.log("USE REQUEST");
            useRequest(fullUrlStr, displayResult);
        }
    }
});