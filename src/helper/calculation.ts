import { promises as fs } from 'fs';
import mime from 'mime-types';

/**
 * Helper function because number.toFixed often does not round correctly if last digit is 5
 * e.g. 25.675.toFixed(2) returns '25.67' instead of '25.68'. If we round with this function
 * first and then use toFixed, it works correctly.
 * @param value The number to round
 * @param decimals The number of decimal places to round to
 * @return The rounded number
 * @example round(25.675, 2) returns 25.68
 */

export function round(value: number, decimals: number): number {
    const shifter = Math.pow(10, decimals);
    const roundedValue = Math.sign(value) * Math.round(Math.abs(value * shifter));
    return roundedValue / shifter;
}

/**
 * Wandelt einen Data-URL (z.B. 'data:font/ttf;base64,AAEAAA...')
 * in ein Uint8Array um. Funktioniert im Browser und in Node.js.
 * @param dataUrl Der Data-URL-String.
 */
export async function dataUrlToUint8Array(dataUrl: string): Promise<Uint8Array> {
    // Lösung für den Browser (und andere moderne Umgebungen wie Deno)
    if (typeof fetch !== 'undefined') {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new Uint8Array(await blob.arrayBuffer());
    }

    // Fallback-Lösung für Node.js
    if (typeof Buffer !== 'undefined') {
        const base64String = dataUrl.split(',')[1];
        if (!base64String) {
            throw new Error('Invalid Data URL: a comma was not found.');
        }
        const buffer = Buffer.from(base64String, 'base64');
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }

    throw new Error('Unsupported environment: no fetch or Buffer API available.');
}

// Import der Bibliothek

/**
 * Generiert einen Base64 Data-URL aus einem gegebenen Dateipfad.
 * Ermittelt den MIME-Typ automatisch.
 *
 * @param filePath Der Pfad zur Datei, die konvertiert werden soll.
 * @returns Ein Promise, das mit dem vollständigen Data-URL aufgelöst wird.
 * @throws Wirft einen Fehler, wenn die Datei nicht gelesen oder der MIME-Typ nicht gefunden werden kann.
 */
export async function generateDataUrlFromFile(filePath: string): Promise<string> {
    // Schritt 1: Datei als Buffer einlesen
    const fileBuffer = await fs.readFile(filePath);

    // Schritt 2: MIME-Typ automatisch anhand der Dateiendung ermitteln
    const mimeType = mime.lookup(filePath);

    if (!mimeType) {
        throw new Error(`Konnte den MIME-Typ für die Datei nicht bestimmen: ${filePath}`);
    }

    // Schritt 3: Buffer in Base64 konvertieren und den Data-URL zusammenbauen
    const base64String = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return dataUrl;
}
