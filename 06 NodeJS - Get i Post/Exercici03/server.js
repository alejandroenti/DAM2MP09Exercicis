const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Carpeta pública para imágenes (Accesibles en /images/...)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Funciones para leer los archivos JSON privados
const getCategories = () => {
    const data = fs.readFileSync(path.join(__dirname, 'data/categories.json'), 'utf8');
    return JSON.parse(data);
};

const getItems = () => {
    const data = fs.readFileSync(path.join(__dirname, 'data/items.json'), 'utf8');
    return JSON.parse(data).items; // Accedemos al array "items"
};

// 1. Demanar categories (POST)
app.post('/categories', (req, res) => {
    const categories = getCategories();
    // Retorna el objeto completo de categorías (Accio, Comedia, etc.)
    res.json(categories);
});

// 2. Demanar items d'una categoria (POST)
app.post('/categoria/items', (req, res) => {
    const { categoria } = req.body; // Ej: { "categoria": "Terror" }
    const allItems = getItems();
    const filtrats = allItems.filter(i => i.categoria === categoria);
    res.json({ items: filtrats });
});

// 3. Demanar informació d'un ítem (POST)
app.post('/item/detall', (req, res) => {
    const { id } = req.body; // Ej: { "id": 16 }
    const allItems = getItems();
    const item = allItems.find(i => i.id === parseInt(id));
    
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Pel·lícula no trobada" });
    }
});

// 4. Demanar items d'una cerca (POST)
app.post('/cerca', (req, res) => {
    const { query } = req.body; // Ej: { "query": "Nolan" }
    const allItems = getItems();
    
    const resultats = allItems.filter(i => 
        i.nom.toLowerCase().includes(query.toLowerCase()) || 
        i.director.toLowerCase().includes(query.toLowerCase())
    );
    res.json({ resultats });
});

// 5. Retornar la imatge d'un ítem (GET)
// Esta ruta permite obtener imágenes si no usas la ruta directa de static
app.get('/foto/:nom', (req, res) => {
    const nomArxiu = req.params.nom;
    res.sendFile(path.join(__dirname, 'public/images', nomArxiu));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de l'Exercici 04 corrent a http://localhost:${PORT}`);
});

// Aturar el servidor correctament 
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
function shutDown() {
    // Executar aquí el codi previ al tancament de servidor
    
    console.log('Received kill signal, shutting down gracefully');
    httpServer.close()
    process.exit(0);
}