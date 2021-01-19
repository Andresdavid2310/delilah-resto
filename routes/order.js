import routerx from 'express-promise-router';
import OrderController from '../controllers/OrderController';
import middlewares from '../middlewares/';

const router = routerx();

router.post('/add', middlewares.validateDataOrder, OrderController.add);
router.get('/query/:id', OrderController.query);
router.get('/list', middlewares.validateAdmin, OrderController.list);
router.delete('/remove', middlewares.validateAdmin, OrderController.remove);
/* router.put('/activate',middlewares.validateAdmin, OrderController.activate); */
/* router.put('/deactivate', middlewares.validateAdmin , OrderController.deactivate); */

router.put(
     '/:id',
     middlewares.validateAdmin, 
     middlewares.validateOrderStatus,
     OrderController.update
);

export default router;  
