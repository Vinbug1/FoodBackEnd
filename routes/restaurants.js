const {Restaurant} = require('../model/restaurant');
const express =  require('express');
const {FoodItem} = require('../model/foodItem')
const {Food} = require('../model/food')
const {Address} = require('../model/address')
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
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get('/', async(req, res) =>{

    let filter = {};
    if (req.query.foods) {
        filter = { food: req.query.foods.split(',') };
    }
    const restaurantList =  await Restaurant.find();

    if (!restaurantList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(restaurantList);
    //console.log(restaurantList);
})
 router.get('/:id', async(req, res) => {
     const restaurant = await Restaurant.findById(req.params.id).populate({path:'food',populate:'category'});
     if(!restaurant){
         res.status(500).json({message:'Restaurant not found '});
     };
     res.status(200).send(restaurant);
 });

 router.put('/:id', uploadOptions.single('image'),async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Restaurant Id');
    }
    
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(400).send('Invalid Restaurant!');


    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/restaurants/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = restaurant.image;
    }    
    const updateRestaurant = await Restaurant.findByIdAndUpdate(
         req.params.id,{
             name:req.body.name,
             image:imagepath,
             rating: req.body.rating,
             contact: req.body.contact,
             location: req.body.address,
         },{new:true}
     );
     //restaurant = await restaurant.save();
     if(!updateRestaurant) return res.status(500).send('restaurant update was not  succefull')
     res.send(updateRestaurant)
 })

 router.post('/', uploadOptions.single('image'),async(req, res) => {
    // console.log(req.body.food);
     let foodsIdArray = req.body.food.split(',');
    const reqFoods = Promise.all( foodsIdArray.map( async f => {
       // console.log(f);
        var newFood = new Food({
            food: f,
        })
        newFood = await newFood.save();
        return newFoodItem._id;
    }))
    const foodsResolved = await reqFoods;

     
    
    // const address = await Address.findById(req.body.address);
    // if (!address) return res.status(400).send('Invalid Address');

    // const food = await Food.findById(req.body.food);
    // if (!food) return res.status(400).send('Invalid Food');

      
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/restaurants/`;
    
     let restaurant = new Restaurant({
        name:req.body.name,
        image:`${basePath}${fileName}`,
        food:foodsResolved,
        //req.body.food,
        rating: req.body.rating,
        contact: req.body.contact,
        address: req.body.address
     });
     restaurant = await restaurant.save();
     if(!restaurant) 
     return res.status(500).send('restaurant was not created')
     res.send(restaurant);
 })

 router.delete('/:id',async(req, res) =>{
     Restaurant.findByIdAndRemove(req.params.id).then((restaurant) =>{
         if(restaurant){
             return res.status(200).json({success:true, message:'restaurant was deleted successfull'});

         }else{
             return res.status(404).json({success: false,message:'delete was not successfull'})
         }
     }).catch(err =>{
         return res.status(400).json({success: false, error:err});
     })
 })

 
router.get(`/get/count`, async (req, res) => {
    const RestaurantCount = await Restaurant.countDocuments((count) => count);

    if (!RestaurantCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        RestaurantCount: RestaurantCount,
    });
});

// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.params.count ? req.params.count : 0;
//     const products = await Product.find({ isFeatured: true }).limit(+count);

//     if (!products) {
//         res.status(500).json({ success: false });
//     }
//     res.send(products);
// });

router.put('/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Restaurant Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!restaurant)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(restaurant);
    }
);

 module.exports = router;