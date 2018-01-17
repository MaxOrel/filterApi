import { auth, callAPI, template } from './js/model';

/**
 * Global
 *
 * @param [friends] - массив из друзей
 * @param filterLeft - строка, левый инпут для фильтра друзей
 * @param filterRight - строка, правый инпут для фильтра друзей
 * @param leftList - строка, блок куда вставлять всех друзей
 * @param rightList - строка, блок с отфильтрованными друзьями
 */
var friends = [],
    filterLeft = document.getElementById('filter-left'),
    filterRight = document.getElementById('filter-right'),
    rightList = document.getElementById('rightList'),
    countFriend = document.querySelector('.filter__title'),
    save_button = document.getElementById('save');
/**
 * Handlebars data compile template
 */

var itemHTML = Handlebars.compile(template);

/**
 * Если прошли авторизацию берем инофрмацию из localStorage или, если не сохраняли создаем новый список друзей с расширенным свойством selected = false 
 */
(async () => {
    await auth();
    try {
        var getFrieds = await callAPI('friends.get', { v: 5.62, fields: ['first_name', 'last_name', 'photo_100'] });
    } catch (e) {
        console.error('Произошла ошибка!')
    }
    if (getFrieds.count) {
        countFriend.innerHTML = `Выберите друзей которых вы позовете на вечеринку. Всего ${getFrieds.count}.`
    }
    if (localStorage.saveFriends) { // если сохраняди то достаем из localStorage
        friends = JSON.parse(localStorage.saveFriends);
    } else {
        friends = getFrieds.items.map((friend) => {
            return {
                id: friend.id,
                first_name: friend.first_name,
                last_name: friend.last_name,
                photo: friend.photo_100,
                selected: false //служебная переменная, метка для друга которого выбрали
            }
        });
    }
    loadFriends(friends);
    setUpListeners();
})();

/**
 * Функция добавляет друга в список справа
 *
 * @param id - идентификатор друга полученный с сервера vk
 */
function friendAdd(id) {
    friends.forEach((friend) => {
        if (friend.id == id) {
            friend.selected = true;
        }
    });
    loadFriends(friends); //обновляем оба списока друзей
}

/**
 * Функция удаляет друга из списка справа
 *
 * @param id - идентификатор друга полученный с сервера vk
 */
function friendRemove(id) {
    friends.forEach((friend) => {
        if (friend.id == id) {
            friend.selected = false;
        }
    });
    loadFriends(friends);
}

/**
 * Служебная функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0) {
        return true;
    }

    return false;
}
/**
 * Функция выводит друзей и добавляет их в колонки
 *
 * @param [friends] - массив из друзей
 */
function loadFriends(friends) {
    var leftItemsHTML = '',
        rightItemsHTML = '',
        fullName = '';
    friends.forEach((friend) => {
        fullName = `${friend.first_name} ${friend.last_name}`;
        if (friend.selected) {
            if (isMatching(fullName, filterRight.value)) {
                rightItemsHTML = rightItemsHTML + itemHTML(friend);
            }
        } else {
            if (isMatching(fullName, filterLeft.value)) {
                leftItemsHTML = leftItemsHTML + itemHTML(friend);
            }
        }

    });

    leftList.innerHTML = leftItemsHTML;
    rightList.innerHTML = rightItemsHTML;
}

/**
 * Функция сохраняет друзей в local storage
 *
 */
function saveFriends() {
    localStorage.clear(); //очищаем localStorage на всякий пожарный =)
    localStorage.saveFriends = JSON.stringify(friends); //превращаем объект в строку
    alert('Не забудьте позвонить и сказать где встречаемся!');
}

function setUpListeners() {
    
    filterLeft.addEventListener('keyup', () => {
        loadFriends(friends);
    });
    filterRight.addEventListener('keyup', () => {
        loadFriends(friends);
    });
    leftList.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-add-friend')) {
            friendAdd(e.target.dataset.id);
        }
    });
    rightList.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-remove-friend')) {
            friendRemove(+e.target.dataset.id);
        }
    });

    /*DND HTML5*/
    function dragStart(e){
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("Text", e.target.querySelector('.friend__add').dataset.id);
        return true;
    }
    function dragDrop(e) {
        var userId = e.dataTransfer.getData("Text");
        friendAdd(userId);
        return false;
     }

    leftList.addEventListener('dragstart', (e) => {
        dragStart(e);
    });
    rightList.addEventListener('drop', (e) => {
        dragDrop(e);
    });
    rightList.addEventListener('dragenter', (e) => {
        e.preventDefault();
    });
    rightList.addEventListener('dragleave', (e) => {
        e.preventDefault();
    });
    rightList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    rightList.addEventListener('dragend', (e) => {
        e.preventDefault();
    });

    /*Сохраняем в localStorage*/
    save_button.addEventListener('click', (e) => {
        saveFriends();
    });

}