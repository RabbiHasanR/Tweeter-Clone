
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function Lookup(method,endpoint,callback,data){
    let jsonData
    if(data){
        jsonData = JSON.stringify(data)
    }

    const xhr = new XMLHttpRequest()
    const url = `http://127.0.0.1:8000/api${endpoint}`
    xhr.responseType = 'json'
    const csrftoken = getCookie('csrftoken')
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if(csrftoken)
    {
    xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    }
    xhr.onload = function () {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = (e) => {
        console.log(e)
        callback({ 'message': 'The request was an error' }, 400)
    }
    console.log(jsonData)
    xhr.send(jsonData)
}

export function CreateTweet(newTweet,callback){
    Lookup('POST', '/tweets/create/', callback,{content:newTweet})
}
export function LoadTweets(callback) {

    Lookup('GET','/tweets/',callback)
}



