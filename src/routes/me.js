const express = require('express');
const isLoggedIn = require('../app/middlewares/isLogged_in');
const isAdmin = require('../app/middlewares/isAdmin');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.post('/order/confirmPurchase', isLoggedIn, meController.confirmPurchase);

router.get('/change_password_site', isLoggedIn, meController.changePasswordSite);

router.patch('/edit/:productCode', isLoggedIn, meController.editProducts);

router.patch('/change_password/:password', isLoggedIn, meController.change_password);

router.get('/order', isLoggedIn, meController.order);

router.get('/myInfo', isLoggedIn, meController.myInfo);

router.get('/sale', isLoggedIn, meController.sale);

router.get('/logout', meController.logout);

router.delete('/delete/user', isLoggedIn, isAdmin, meController.destroyUser);

router.delete('/delete/product/:productCode', isLoggedIn, meController.deletePublishedProducts)

router.delete('/delete_confirm_product/:productCode', isLoggedIn, meController.deleteConfirmProducts);

router.delete('/admin/deleteProduct/:productCode', isLoggedIn, isAdmin, meController.deleteProductsByAdmin)

router.get('/user_list', isLoggedIn, isAdmin, meController.user_list);

router.post('/post_for_sale', isLoggedIn, meController.post_for_sale)

router.get('/store', isLoggedIn, meController.store);

router.get('/added_to_cart', isLoggedIn, meController.get_added_to_cart);

router.get('/:productCode', isLoggedIn, meController.productInfo);



module.exports = router;
