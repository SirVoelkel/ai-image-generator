const apiKey = "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";

const maxImage = 4; // Anzahl der Bilder, die für jede Eingabeaufforderung generiert werden sollen.
let selectImageNumber = null;

// Funktion zum Generieren einer Zufallszahl zwischen Min und Max (inclusive)
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (min - max + 1)) + min;
}

// Funktion zum Deaktivieren der Schaltfläche „Generieren“ während der Verarbeitung.
function disableGenerateButon(){
    document.getElementById("generate").disabled = true;
}

// Funktion zum Aktivieren der Schaltfläche „Generieren“ nach der Verarbeitung.
function enableGenerateButon(){
    document.getElementById("generate").disabled = false;
}

// Funktion zum Löschen des Rasters.
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Funktion zum Generieren von Bildern.
async function generateImage(input){
    disableGenerateButon();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImage; i++) {
        // Generieren Sie eine Zufallszahl zwischen 1 und 100 und hängen Sie sie an die Eingabeaufforderung an.
        const randomNumber = getRandomNumber(1, 100);
        const prompt = `${input} ${randomNumber}`;
        // Es wurde eine Zufallszahl hinzugefügt, um Sie aufzufordern, unterschiedliche Ergebnisse zu erzielen.
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );
        
        if(!response.ok){
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;  
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButon();

    selectImageNumber = null; // Ausgewähltes Bild zurücksetzen
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImage(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber}.jpg`;
    // Legen Sie den Dateinamen basierend auf dem ausgewählten Bild fest.
    link.click(); 
}










