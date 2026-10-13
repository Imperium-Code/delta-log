// Saving and Loading browser data

export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadData(key) {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
        return null;
    }

    return JSON.parse(savedData);
}