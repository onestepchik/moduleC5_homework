// Нод для вывода картинки
const resultNode = document.querySelector(".resultArea");
// Кнопку, по нажатии на которую будет выполнятся программа
const btnNode = document.querySelector(".form__submit");
// Функция, которая возвращаем fetch с запросом картинки, возвращает объект BLOB
const useRequest = (url) => {
    //Делаем доп параметр к запросу для борьбы с кешированием запросов для получения уникальной ссылки каждый раз при нажатии на кнопку
    let d = new Date();
    let dStr = d.toISOString();
    let fullUrlStr = `${url}?rqDateTime=${dStr}`;
    //console.log(fullUrlStr);
    return fetch(fullUrlStr)
        .then((response) => {
            //console.log(`RESPONSE CONTENT ${response.content}`);
            //Возвращаем Blob
            return response.blob();
        })
        .catch(() => {
            console.log("error");
        });
};

// Вешаем обработчик на кнопку для запроса
btnNode.addEventListener("click", async (event) => {
    console.log("CLICK");
    let imageWidth = document.querySelector(".imageWidth");
    let imageHeight = document.querySelector(".imageHeight");
    let isCorrect = true;
    //Проверяем данные на валидность
    if (
        Number.isInteger(Number(imageWidth.value)) &&
        Number.isInteger(Number(imageHeight.value))
    ) {
        if (
            imageWidth.value >= 100 &&
            imageWidth.value <= 300 &&
            imageHeight.value >= 100 &&
            imageHeight.value <= 300
        ) {
            //Формируем URL запроса с учетом обхода CORS через прокси
            let url = `https://api.codetabs.com/v1/proxy?quest=https://picsum.photos/${imageWidth.value}/${imageHeight.value}`;

            // Получаем ссылку на загруженную картинку
            let blobUrl = window.URL.createObjectURL(await useRequest(url));
            console.log(`imgURL = ${blobUrl}`);
            // Формируем нод с картинкой
            const imageBlock = `<img src="${blobUrl}" class="card-image" />`;
            resultNode.innerHTML = imageBlock;
        } else {
            isCorrect = false;
        }
    } else {
        isCorrect = false;
    }

    if (!isCorrect) {
        resultNode.innerHTML = "одно из чисел вне диапазона от 100 до 300";
        imageWidth.value = "";
        imageHeight.value = "";
    }
});