export const setCookie = (name, value, day) => {
  var date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = name + '=' + value + ';expires=' + date;
};

export const getCookie = name => {
  var reg = RegExp(name + '=([^;]+)');
  var arr = document.cookie.match(reg);
  if (arr) {
    return arr[1];
  } else {
    return '';
  }
};

export const delCookie = name => {
  setCookie(name, null, -1);
};
