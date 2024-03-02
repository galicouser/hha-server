const mongoose = require('mongoose');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 
require("dotenv").config();

const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': process.env.PMODE, //sandbox or live
  'client_id': process.env.PCLIENT_KEY,
  'client_secret': process.env.PCLIENT_SECRET
});

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Afm9_Qhv7AqCtIcsAWwSJ0usTkq_6MlKZC9UmPs_J1IhXyXR2WQ1gzVGCn7JbzS6H9tgSMWgZqhiQDA4',
  'client_secret': 'EJS7J137b6lZhjkDMaSzrYVTmA0Qn5Nv5jlSXBcHniubMe7Gv-88KTnw6jcQOYHJhufDxLa43Xqmc8_2'
});
const Checkout  = require("../models/checkout");
const { User } = require("../models/user");
const Subscription  = require("../models/subscription");
const RedeemCode = require('../models/redeem');

// Comment out the validation imports if you want to remove validation temporarily
const {
    validateFields
  } = require("../middleware/checkout");

  const { sendEmails } = require("../utils/emailService");


exports.process = async (req, res) => {
  const { error } = validateFields(req.body);
  console.log(req.body);
  
  // var product_id = '';
  // var type = 'paypal';
  if (error) return res.status(400).send({ message: "Enter data correctly" });

  const user = await User.findOne({ email: req.body.email });
  // const user = 'fahadbashir757@gmail.com'
  
  if (user)
  
  switch (req.body.type) {
    case 'stripe':
      try {
        const get_customer = await stripe.customers.search({
          query: 'email:\''+req.body.email+'\' ',
        });
    
        if (get_customer.data && get_customer.data.length > 0) {
          customerId = get_customer.data[0].id;
        }
        else{
          const customer = await stripe.customers.create({
            name: req.body.customer_name,
            phone: req.body.customer_phone,
            email: req.body.customer_email,
            customer_email: req.body.customer_email,
            customer_details: {
              email: req.body.customer_email
            },
          });
          customerId = customer.id;
          
        }
    
        const line_items = req.body.cartItems.map((item) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Plan ID: ${item.id}\nPlan Name: ${item.name}\nValidity: ${item.validity} months`,
                description: item.description,
                metadata: {
                  'product_id': item.id,
                  'itemvalidity': item.validity,
                },
              },
              unit_amount: item.price * 100,
            },
            
            quantity: 1,
          };
        });
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          phone_number_collection: {
            enabled: false,
          },
          line_items,
          mode: "payment",
          customer: customerId,
          success_url: `${process.env.CLIENT_URL}checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/UserProfile`,
        });
        
        res.send(session.url);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred");
      }
      break;
    case 'paypal':
      const totals = req.body.cartItems.map((item) => ({
              total: 1 * item.price,
        
      }));
      let total = totals[0].total
      console.log(totals)
      const items = req.body.cartItems.map((item) => ({
              name: `Plan ID: ${item.id}\nPlan Name: ${item.name}\nValidity: ${item.validity} months`,
              sku: item.description,
              currency: "USD",
              price: item.price,
              quantity: 1
      }));
      
      // Now, line_items is an array of objects with the correct structure
      


      const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4242/checkout/success_paypal",
            "cancel_url": "http://localhost:4242/checkout/cancel_paypal"
        },
        "transactions": [{
            "item_list": {
              items
            },
            "amount": {
                "currency": "USD",
                total
            },
            "description": "Cut The Cable TV subscription"
        }]
    };
  

      // console.log(total);
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.error("Error:", error);
        res.status(500).send(error);
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              
              res.send(payment.links[i].href);
            }
          }
      }
    });

      break;
  }
  else
   return res.status(404).send({ message: "User doesn't exists" });
  };
exports.success = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const session_items = await stripe.checkout.sessions.listLineItems(req.query.session_id);
  // console.log(session_items.data[0].description);
  // Split the output into lines
  const lines = session_items.data[0].description.split('\n');

  // Extract the "Validity" number and "Plan ID" from the lines
  let validity = null;
  let planId = null;

  lines.forEach(line => {
    if (line.startsWith('Validity:')) {
      // Extract the "Validity" number (assuming it's always a number followed by " months")
      validity = parseInt(line.match(/\d+/)[0]);
    } else if (line.startsWith('Plan ID:')) {
      // Extract the "Plan ID" (assuming it's the value after "Plan ID:")
      planId = line.split('Plan ID: ')[1];
    }
  });


  // console.log(session);
  const email = session.customer_details.email;
  const admin_email = process.env.ADMIN_EMAIL;

  const redeemcode = await RedeemCode.findOne({
    status: 'Pending',
    itemID: planId,
    validity: validity,
  });

  const checkouthistory = new Checkout({
    userID: email,
    checkoutID: req.query.session_id,
    itemPrice: session.amount_total,
    itemID: planId,
    validity: validity,
    status: 'success'
  });
  await checkouthistory.save();
  if (redeemcode) {
    const newSubscription = new Subscription({
      user: email,
      subscription_code: redeemcode.code
    });
    try {
      redeemcode.status = 'Availed';
      redeemcode.purchase_date = new Date();
      const savedSubscription = await newSubscription.save();
      const updateredeem = await redeemcode.save();
      const subject = 'NCN subscription'
      const message = 'Thank you for purchasing! To redeem your subscription, please log into portal, goto subscription section and click on redeem subscription button';
      await sendEmails(email,admin_email,message,subject);

      console.log("Thank you for purchasing! To redeem your subscription, please log into portal, goto subscription section and click on redeem subscription button");
      // return res.status(200).send({ message: "Subscription purchased" });
      res.redirect(`${process.env.FRONTEND_URL}/SuccessfulPayment`);

      
    } catch (err) {
      const subject = 'NCN subscription'
      const message = 'Something went wrong during subscription purchase we are looking into it';
      await sendEmails(email,admin_email,message,subject);

      console.log("something went wrong",err);
      res.redirect(`${process.env.FRONTEND_URL}/FailedPayment`);
      // return res.status(400).send({ message: "something went wrong" });
    }
  } else {
    const subject = 'NCN subscription'
    const message = 'Subscription purchased but no redeemable code availale please contact admin';
    await sendEmails(email,admin_email,message,subject);
    res.redirect(`${process.env.FRONTEND_URL}/FailedPayment`);
    // return res.status(404).send({ message: "Subscription purchased but no redeemable code availale please contact admin" });
  }

  // try {
  //   const savedRedeemCode = await newRedeemCode.save();
  //   console.log("Code saved");
  //   return res.status(200).send({ message: "Code saved!" });
  // } catch (err) {
  //   console.log("Code not saved", err);
  //   return res.status(400).send({ message: "Code not saved" });
  // }
  // res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
};

exports.success_paypal = async (req, res) => {

  let paymentId = req.query.paymentId;
  let payerId = {'payer_id': req.query.PayerID};
  paypal.payment.execute(paymentId, payerId, async function (error, payment) {
    if (error) {
        console.error(error.response);
    } else {
        if (payment.state == 'approved') {
          const lines = payment.transactions[0].item_list.items[0].name.split('\n')
          let validity = null;
          let planId = null;
          lines.forEach(line => {
            if (line.startsWith('Validity:')) {
              // Extract the "Validity" number (assuming it's always a number followed by " months")
              validity = parseInt(line.match(/\d+/)[0]);
            } else if (line.startsWith('Plan ID:')) {
              // Extract the "Plan ID" (assuming it's the value after "Plan ID:")
              planId = line.split('Plan ID: ')[1];
            }
          });

          // console.log(payment.transactions[0].amount.total);
          // return;
          const email = payment.payer.payer_info.email;
          const admin_email = process.env.ADMIN_EMAIL;
          const redeemcode = await RedeemCode.findOne({
            status: 'Pending',
            itemID: planId,
            validity: validity,
          });
          
          console.log(redeemcode);
          
            const checkouthistory = new Checkout({
              userID: email,
              checkoutID: req.query.paymentId,
              itemPrice: payment.transactions[0].amount.total,
              itemID: planId,
              validity: validity,
              status: 'success'
            });
            await checkouthistory.save();
            if (redeemcode) {
              const newSubscription = new Subscription({
                user: email,
                subscription_code: redeemcode.code
              });
              try {
                redeemcode.status = 'Availed';
                redeemcode.purchase_date = new Date();
                const savedSubscription = await newSubscription.save();
                const updateredeem = await redeemcode.save();
                const subject = 'NCN subscription'
                const message = 'Thank you for purchasing! To redeem your subscription, please log into portal, goto subscription section and click on redeem subscription button';
                await sendEmails(email,admin_email,message,subject);
          
                console.log("Thank you for purchasing! To redeem your subscription, please log into portal, goto subscription section and click on redeem subscription button");
                // return res.status(200).send({ message: "Subscription purchased" });
                res.redirect(`${process.env.FRONTEND_URL}/SuccessfulPayment`);
          
                
              } catch (err) {
                const subject = 'NCN subscription'
                const message = 'Something went wrong during subscription purchase we are looking into it';
                await sendEmails(email,admin_email,message,subject);
          
                console.log("something went wrong",err);
                res.redirect(`${process.env.FRONTEND_URL}/FailedPayment`);
                // return res.status(400).send({ message: "something went wrong" });
              }
            } 
        } else {
          const subject = 'NCN subscription'
          const message = 'Subscription purchased but no redeemable code availale please contact admin';
          await sendEmails(email,admin_email,message,subject);
          res.redirect(`${process.env.FRONTEND_URL}/FailedPayment`);
          // return res.status(404).send({ message: "Subscription purchased but no redeemable code availale please contact admin" });
        }
    }
});
};

exports.failure = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);

  res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
};