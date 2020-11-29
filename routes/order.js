import routerx from 'express-promise-router';
import OrderController from '../controllers/ProductController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyAlmacenero, OrderController.add);
router.get('/query', auth.verifyAlmacenero, OrderController.query);
router.get('/list', auth.verifyAlmacenero, OrderController.list);
router.put('/update', auth.verifyAlmacenero, OrderController.update);
router.delete('/remove', auth.verifyAlmacenero, OrderController.remove);
router.put('/activate', auth.verifyAlmacenero, OrderController.activate);
router.put('/deactivate', auth.verifyAlmacenero, OrderController.deactivate);
