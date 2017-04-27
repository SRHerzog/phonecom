const moment = require('moment');
const Twocheckout = require('2checkout-node');

module.exports = function paymentApi() {
    const privateKey = process.env.PRIVATE_KEY;
    const sellerId = process.env.SELLER_ID;
    const tco = new Twocheckout({
        sellerId,
        privateKey,
        sandbox: true,
    });
    this.pay = (req, res, next) => {
        const params = {
            merchantOrderId: moment().unix(),
            token: req.body.token,
            currency: 'USD',
            lineItems: [{
                type: 'product',
                name: 'ott.tel service',
                price: req.body.price,
                recurrence: '1 Month',
            }],
            billingAddr: {
                name: req.body.company,
                addrLine1: req.body.address1,
                addrLine2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.postal,
                country: req.body.country,
                email: req.body.email,
                phoneNumber: req.body.phone,
            },
        };
        tco.checkout.authorize(params, (error, data) => {
            if (error) {
                console.log('2checkout error: ', error);
                res.status(500).json({ error });
            } else {
                console.log('2checkout success! ', data);
                res.status(200).json({ message: 'success' });
                // next();
            }
        });
    };
};
