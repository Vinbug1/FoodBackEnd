
const { Food } = require('../model/food');
const express = require('express');
const { Category } = require('../model/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now().toString()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const foodList = await Food.find(filter).populate('category');

    if (!foodList) {
        res.status(500).json({ success: false });
    }
    res.send(foodList);
});

router.get(`/:id`, async (req, res) => {
    const food = await Food.findById(req.params.id).populate('category');

    if (!food) {
        res.status(500).json({ success: false });
    }
    res.send(food);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
    let food = new Food({
        name: req.body.name,
        image: `${basePath}${fileName}`,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
       // isFeatured: req.body.isFeatured,
    }) 
    food = await food.save();

    if (!food) return res.status(500).send('The food cannot be created');

    res.send(food);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid food Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const food = await Food.findById(req.params.id);
    if (!food) return res.status(400).send('Invalid food!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = food.image;
    }

    const updatedfood = await Food.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: imagepath,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating,
        },
        { new: true }
    );
        food = await food.save();
    if (!updatedfood)
        return res.status(500).send('the food cannot be updated!');

    res.send(updatedfood);
});

router.delete('/:id', (req, res) => {
    Food.findByIdAndRemove(req.params.id)
        .then((food) => {
            if (food) {
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: 'food  deleted was successful!',
                    });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'food delete was not successfull' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get(`/get/count`, async (req, res) => {
    const foodCount = await Food.countDocuments((count) => count);

    if (!foodCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        foodCount: foodCount,
    });
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const foods = await Food.find({ isFeatured: true }).limit(+count);

    if (!foods) {
        res.status(500).json({ success: false });
    }
    res.send(foods);
});

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid food Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const food = await Food.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!food)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(food);
    }
);

module.exports = router;