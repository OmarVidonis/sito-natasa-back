import express from 'express'
import { Places } from '../models/placesModel.js';
import { v4 } from 'uuid';
import path from 'path';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage });


router.route('/').post(upload.single('imgUrl'), (request, res) => {
    console.log(request.file)
    const newPlaces = {
        name: request.body.name,
        imgUrl: request.file.filename,
        description: request.body.description,
        isVisited: request.body.isVisited,
        lat: request.body.lat,
        lng: request.body.lng,
        albumUrls: request.body.albumUrls,
    };

    const newPlace = new Places(newPlaces)

    newPlace.save()
        .then(result => res.json('Place Added'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/rec').get((req, res) => {
    Places.find()
        .then(place => res.json(place))
        .catch(err => res.status(400).json('Error: ' + err));
})


// add a book to db
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.imgUrl ||
            !request.body.description ||
            !request.body.lat ||
            !request.body.lng ||
            !request.body.albumUrls
        ) {
            return response.status(400).send({
                message: 'Send all required fields',
            });
        }
        const newPlaces = {
            name: request.body.name,
            imgUrl: request.body.imgUrl,
            description: request.body.description,
            isVisited: request.body.isVisited,
            lat: request.body.lat,
            lng: request.body.lng,
            albumUrls: request.body.albumUrls,
        };
        const place = await Places.create(newPlaces);

        return response.status(201).send(place);
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
});

// // get all books from db
router.get('/', async (request, response) => {
    try {
        const places = await Places.find({});
        return response.status(200).json({
            count: places.length,
            data: places
        });
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
})

// // get one book from id from db
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const place = await Places.findById(id);

        return response.status(200).json(place);
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
})

// // update a book in db
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.imgUrl ||
            !request.body.description ||
            !request.body.lat ||
            !request.body.lng ||
            !request.body.albumUrls
        ) {
            return response.status(400).send({
                message: 'Send all required fields',
            });
        }

        const { id } = request.params;
        const result = await Places.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Place not found' })
        }

        return response.status(200).send({ message: 'Place updated successfully' });
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
});

// // delete a book in the db
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Places.findByIdAndDelete(id);

        if (!result) {
            response.status(404).json({ message: 'Place not found' })
        }
        response.status(200).send({ message: 'Place deleted successfully' })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})

export default router;