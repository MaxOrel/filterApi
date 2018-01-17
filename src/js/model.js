/**
 * Функция инициализации VK-приложения и авторизации пользователя
 *
 * @return Promise
 */
function auth() {
    return new Promise ((resolve, reject) => {
        VK.init({
            apiId: 6336255
        });
        VK.Auth.login((data) => {
            if (data.session) {
                resolve();
            } else {
                reject( new Error('Не удалось авторизоваться'));
            }
        });
    });
}

/**
 * Функция вызывает указанный метод VK API с определенными параметрами
 *
 * @param method - вызываемый метод
 * @param params - параметры, которые передаются
 * @return Promise
 */
function callAPI(method, params) {
    return new Promise ((resolve, reject) => {
        VK.api(method, params, (result) => {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
}

/**
 * Шаблон для Handlebars
 */
var template = `
<li class="friend__item" {{#if selected}}draggable="false"{{else}}draggable="true"{{/if}} >          
    <div class="friend__images">
        <img class="friend__photo" src="{{photo}}" draggable="false" alt="{{first_name}} {{last_name}}" />
    </div>
    <div class="friend__name">{{first_name}} {{last_name}}</div>
    {{#if selected}}            
    <div class="friend__remove js-remove-friend" data-id="{{id}}">Удалить из списка</div>
    {{else}}      
    <div class="friend__add js-add-friend" data-id="{{id}}">Добавить в список</div>
    {{/if}} 
</li>`;

export {
    auth,
    callAPI,
    template
}