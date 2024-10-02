import { fetchSubjectsData, fetchMotivationalQuote } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const gradeForm = document.getElementById('gradeForm');
    const generateFieldsButton = document.getElementById('generateFields');
    const notesInputsDiv = document.getElementById('notesInputs');
    const resultDiv = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');
    const quoteDiv = document.getElementById('quote');

    let subjectsData = await fetchSubjectsData();
    const initialQuote = await fetchMotivationalQuote();

    // Mostrar la cita motivacional inicial
    quoteDiv.innerHTML = `
        <p>"${initialQuote.content}" - ${initialQuote.author}</p>
    `;

    let animationActive = false;

    document.getElementById('btn-interact').addEventListener('click', function() {
        const splineEmbed = document.getElementById('spline-embed');
        if (!animationActive) {
            splineEmbed.style.animation = 'animacion 2s infinite';
            animationActive = true;
        } else {
            splineEmbed.style.animation = '';
            animationActive = false;
        }
    });

   

    // Event listener para generar campos de notas
generateFieldsButton.addEventListener('click', () => {
    notesInputsDiv.innerHTML = ''; // Limpiar cualquier campo existente
    const subjectCount = parseInt(document.getElementById('subjectCount').value, 10);

    if (isNaN(subjectCount) || subjectCount < 1) {
        alert('Por favor, ingrese un número válido de asignaturas.');
        return;
    }

    for (let i = 1; i <= subjectCount; i++) {
        const subjectLabel = document.createElement('label');
        subjectLabel.setAttribute('for', `note${i}`);
        subjectLabel.textContent = `Nota de la Asignatura ${i} (${subjectsData[i - 1].name} - ${subjectsData[i - 1].professor}):`;

        const noteInput = document.createElement('input');
        noteInput.setAttribute('type', 'number');
        noteInput.setAttribute('id', `note${i}`);
        noteInput.setAttribute('name', `note${i}`);
        noteInput.setAttribute('min', '0');
        noteInput.setAttribute('max', '10');
        noteInput.setAttribute('required', 'required');
        generateFieldsButton.addEventListener('click', () => {
            console.log('Se hizo clic en el botón');
            // ...
        });

        // Agregar elementos al DOM
        notesInputsDiv.appendChild(subjectLabel);
        notesInputsDiv.appendChild(noteInput);
    }
});

    // Event listener para el formulario
    gradeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const subjectCount = parseInt(document.getElementById('subjectCount').value, 10);
        let notes = [];

        for (let i = 1; i <= subjectCount; i++) {
            const note = parseFloat(document.getElementById(`note${i}`).value);
            if (isNaN(note)) {
                alert(`Por favor, ingrese una nota válida para la Asignatura ${i}.`);
                return;
            }
            notes.push(note);
        }

        // Calcular el promedio
        const average = calculateAverage(notes);

        // Almacenar los datos en localStorage
        const data = {
            subjectCount: subjectCount,
            notes: notes,
            average: average
        };
        localStorage.setItem('gradeData', JSON.stringify(data));

        // Mostrar el resultado en el DOM
        displayResult(average, notes);
    });

    // Obtener una nueva cita motivacional
    fetchMotivationalQuote().then(quote => {
        quoteDiv.innerHTML = `
            <p>"${quote.content}" - ${quote.author}</p>
        `;
    });
});

// Función para calcular el promedio
function calculateAverage(notes) {
    const sum = notes.reduce((acc, curr) => acc + curr, 0);
    return sum / notes.length;
}

// Función para mostrar el resultado en el DOM
function displayResult(average, notes) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Promedio de las notas: ${average.toFixed(2)}</p>
        <p>Detalles de las notas ingresadas:</p>
        <ul>
            ${notes.map((note, index) => `<li>Asignatura ${index + 1}: ${note}</li>`).join('')}
        </ul>
    `;
}

// Recuperar datos del localStorage al cargar la página
const storedData = JSON.parse(localStorage.getItem('gradeData'));

if (storedData) {
    document.getElementById('subjectCount').value = storedData.subjectCount;
    generateFieldsButton.click(); // Generar campos de notas

        storedData.notes.forEach((note, index) => {
        document.getElementById(`note${index + 1}`).value = note;
    });

    displayResult(storedData.average, storedData.notes);
}