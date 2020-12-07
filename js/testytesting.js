// Example GET method implementation:
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

getData('http://gist.github.com/robynitp/3ee8f3708d86dcde2e61#file-movie-json')
    .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
    });

//
//
// fetch('http://example.com/movies.json')
//     .then(response => response.json())
//     .then(data => console.log(data));
//
// fetch('http://example.com/movies.xml')
//     .then(response => response.json())
//     .then(data => console.log(data));