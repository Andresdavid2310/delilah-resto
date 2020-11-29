import routerx from 'express-promise-router';
import ProductController from '../controllers/ProductController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyAlmacenero, ProductController.add);
router.get('/query', auth.verifyAlmacenero, ProductController.query);
router.get('/list', auth.verifyAlmacenero, ProductController.list);
router.put('/update', auth.verifyAlmacenero, ProductController.update);
router.delete('/remove', auth.verifyAlmacenero, ProductController.remove);
router.put('/activate', auth.verifyAlmacenero, ProductController.activate);
router.put('/deactivate', auth.verifyAlmacenero, ProductController.deactivate);

export default router; 