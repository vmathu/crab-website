function setCookie(name: string, value: string, time: number) {
    var expires = "";
    if (time) {
        var date = new Date();
        date.setTime(date.getTime() + (time * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name: string) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkCookie(name: string) {
    var cookie = getCookie(name);
    if (cookie != null) {
        return true;
    }
    return false;
}

export { setCookie, getCookie, eraseCookie, checkCookie };