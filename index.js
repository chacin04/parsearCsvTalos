import readline from 'readline'
import fs from 'fs';

async function parseCsvToJsonManually(filePath,separador) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const results = [];
    let headers = [];

    for await (const line of rl) {
        const values = line.split(separador);

        if (headers.length === 0) {
            headers = values;
        } else {
            const obj = {};
            values.forEach((value, index) => {
                const header = headers[index];
                let parsedValue = value.trim().replace(/^"|"$/g, ''); // Quitar comillas al inicio y fin
                
                if (!isNaN(parsedValue) && parsedValue !== "") {
                    // Convertir a número si no es NaN y no es una cadena vacía
                    parsedValue = parseFloat(parsedValue);
                } else if (parsedValue.toLowerCase() === 'true' || parsedValue.toLowerCase() === 'false') {
                    // Convertir a booleano si es 'true' o 'false'
                    parsedValue = parsedValue.toLowerCase() === 'true';
                } else if (parsedValue === 'null' || parsedValue === '') {
                    // Convertir a null si es 'null' o una cadena vacía
                    parsedValue = null;
                }

                obj[header] = parsedValue;
            });
            results.push(obj);
        }
    }

    return results;
}
