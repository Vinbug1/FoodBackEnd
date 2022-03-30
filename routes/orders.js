const {Order} = require('../model/order');
const express = require('express');
const router = express.Router();
const{OrderItem} = require('../model/orderItem');

router.get('/:id', async(req,res) =>{
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered': -1});
    if(!orderList){
        res.status(500).json({ssuccess:false})
    }
    res.send(orderList);
})

router.get('/:id', async(req,res) => {
    const order = await Order.findById(req.params.id).populate('user','name').populate({path:'orderItems', populate:{path:'food',populate:'category'}});
    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order)
})

router.post('/', async(req,res) =>{
    const orderItemsIds = Promise.all(req.params.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            food:orderItem.food,
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrice = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) =>{
        const  orderItem = await OrderItem.findById(orderItemId).populate('food','price');
        const totalPrice = orderItem.food.price * orderItem.quantity;
        return totalPrice
    }))
    
     totalPrice = totalPrice.reduce((a,b) => a + b, 0);
    
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        address: req.body.address,
        phone: req.body.phone,
        status:req.body.status,
        user: req.body.user,
        date: req.body.date,
    })
    order = await order.save();

    if(!order)
    return res.status(404).send('order was not created')
    res.send(order)
})

router.put('/:id', async(req,res) =>{
    const order =  await Order.findBbyIdAndUpdate(
        req.params.id,{
            status:req.body.status
        },
        {new: true}
    )
    order = await order.save();
    if(!order)
    return res.status(404).send('Order Uupdate was successfull!')
    res.send(order);
})

router.delete(`/:id`,(req,res) =>{
    Order.findByIdAndRemove(req.params.id).then(order => {
        if(order){
            return res.status(200).json({success: true,message:'Order was deleted successfully'})
        }else{
            return res.status(404).json({success:false,message:'Order was  not successfull'})
        }
    }).catch(err =>{
        return res.status(400).json({success:false, error: err});
    })
})

  // getting total order from my store
  router.get('/get/count',async (req,res) => {
    const orderCount = await Order.countDocument((count) => count) 

    if(!orderCount){
        return res.status(500).json({success: false })
    }
    res.send({count: orderCount});
})


//get all user order
router.get('/get/userorders/:userid',async (req,res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path:'orderItems', populate: {
        path:'food',populate:'category' }
}).sort({'dateOrdered': -1}); 

    if(!userOrderList){
        return res.status(500).json({success: false })
    }
    res.send(userOrderList);
})

module.exports = router;