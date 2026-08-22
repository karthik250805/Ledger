export const getCache = (key) => {

    const data = sessionStorage.getItem(key);

    return data
        ? JSON.parse(data)
        : null;

};


export const setCache = (key, data) => {

    sessionStorage.setItem(
        key,
        JSON.stringify(data)
    );

};


export const removeCache = (key) => {

    sessionStorage.removeItem(key);

};