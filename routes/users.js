const {User} = require('../model/user');
const express = require('express');
const router = express.Router();

router.get('/',async(req,res) => {
    const userList = await User.find()
    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
});

router.get('/:id', async(req,res) =>{
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(500).json({message:'User not found'})
    }
});


router.post('/resgister', async(req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        sex: req.body.sex,
        country: req.body.country,
    })
    user = await user.save();
    if(!user)
    return res.status(400).send('the user cannot be created!')
    res.send(user);
})

router.post('/login', async(req,res) => {
    const user = await User.findOne({email:req.body.email})
    if(user.comareSync(req.body.password,user.password)){
        res.status(200).send({user:user.email,user:user.password})
    } else{
        res.status(400).send('email or password is wrong');
    }
})
 router.put('/:id',async(req,res) =>{
     const userExist = await User.findById(req.params.id);
     let newPassword
     if(req.nody.password){
         newPassword = (req.body.password,6)
     }else{
         newPassword = userExist.password;
     }

     const user = await User.findByIdAndUpdate(
         req.params.id,{
             name: req.body.name,
             email: req.body.email,
             password: req.body.password,
             sex: req.body.sex,
             country: req.body.country,
         },{new:true}
     )
     if(!user)
     return res.status(400).send('the user cannot be created!')
 
     res.send(user);
 })

 module.exports = router;