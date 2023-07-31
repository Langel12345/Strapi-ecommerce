'use strict';

//const stripe = require("stripe")("pk_test_51NYsbqEU1itYkmMAia4GfAJextBmeEL6ZaIj0pFCh9KbGyKarx9ZZN5MdsyHlPucTFMLmRRBqbjzeSmkpKUnuvTT00SIqcUTHb");
/**
 * order controller
 */
function calcDiscountPrice(price,discount){
    if(!discount) return price;
    const discountAmount = (price * discount) /100;
    const result = price -discountAmount;

    return  result.toFixed(2);
}

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order' ,({ strapi }) => ({
    async paymentOrder(ctx){
        console.log(ctx)
        const {token, products, idUser, addressShoping} =ctx.request.body;
        
        let totalPayment =0;
        products.forEach((product )=>{
            const priceTemp =calcDiscountPrice(product.price, product.discount);
            totalPayment *=Number(priceTemp) * product.quantity;
        });
       /*const cherge = await stripe.charges.create({
            amount: totalPayment * 100,
            currency: "mxn",
            source:token.id,
            description:`user id : ${idUser}`
        }); */
        const data ={
            products,
            user:idUser,
            totalPayment,
            idPayment:1,
            addressShoping
        };
        const model = strapi.contentType["api::order:order"];
        const validData= await strapi.entityValidator.validateEntityCreation(
            model,
            data
        );
        const entry= await strapi.db.query("api::oder:order").create({data:validData});
        return entry;
    },
    
}));

