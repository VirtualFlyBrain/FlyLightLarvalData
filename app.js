const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const imagesDirectory = '/images'; // Path inside the container

app.get('/explore', (req, res) => {
    const searchQuery = req.query.search?.toLowerCase() || '';
    let imageFiles = [];

    fs.readdirSync(imagesDirectory, { withFileTypes: true }).forEach(dir => {
        if (dir.isDirectory()) {
            let thumbnails = fs.readdirSync(path.join(imagesDirectory, dir.name))
                                .filter(file => file.endsWith('.jpg'))
                                .map(file => ({
                                    name: file,
                                    path: `/images/${dir.name}/${file}`,
                                    dir: dir.name
                                }));

            if (searchQuery) {
                thumbnails = thumbnails.filter(thumb => thumb.name.toLowerCase().includes(searchQuery));
            }

            imageFiles = imageFiles.concat(thumbnails);
        }
    });

    res.render('index', { thumbnails: imageFiles, searchQuery });
});

app.use('/images', express.static(imagesDirectory));

app.get('/', (req, res) => {
  res.render('about-images', { title: "About Image Creation and Attribution" });
});

app.get('/about-images', (req, res) => {
    res.render('about-images', { title: "About Image Creation and Attribution" });
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
