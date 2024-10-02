export function fetchSubjectsData() {
    return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            return data.map((user, index) => ({
                name: `Asignatura ${index + 1}`,
                professor: user.name
            }));
        })
        .catch(error => {
            console.error('Error al obtener los datos de las asignaturas:', error);
            return [];
        });
}

export function fetchMotivationalQuote() {
    return fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .catch(error => {
            console.error('Error al obtener la cita motivacional:', error);
            return { content: 'Sigue trabajando duro y serás recompensado.', author: 'Desconocido' };
        });
}