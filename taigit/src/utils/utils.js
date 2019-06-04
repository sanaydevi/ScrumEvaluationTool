export function getLayoutFromLocalStorage(name, key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(name)) || {};
    } catch (e) {
      console.error(e);
    }
  }
  return ls[key];
}

export function saveLayoutToLocalStorage(name, key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      name,
      JSON.stringify({
        [key]: value
      })
    );
  }
}

export function saveToLocalStorage(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(key, value);
  }
}

export function getFromLocalStorage(key) {
  if (global.localStorage) {
    try {
      return global.localStorage.getItem(key) || "";
    } catch (e) {
      console.error(e);
    }
  }
}