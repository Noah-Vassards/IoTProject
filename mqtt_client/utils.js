async function sendRequest(url, method, body = {}) {
    console.log(body)
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            ...(method !== 'GET' && { body: JSON.stringify(body) })
        })
        const data = await response.json()
        if (response.ok) {
            console.log('ok')
            return data
        } else {
            throw new Error(`${data.statusCode}: ${data.message}`)
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

function getFormattedDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

module.exports = { sendRequest, getFormattedDate }