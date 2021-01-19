import routerx from 'express-promise-router';
import middlewares from '../middlewares/index';
import ProductController from '../controllers/ProductController';

const router = routerx();

router.post(
     '/add',
     middlewares.validateData,
     middlewares.validateAdmin,
     ProductController.add
);

 router.put(
      '/:id', 
      middlewares.validateIdProduct, 
      middlewares.validateAdmin,   
      ProductController.update
);  


router.delete( 
     '/:id', 
     middlewares.validateIdProduct, 
     middlewares.validateAdmin,
     ProductController.remove
);

router.put(
     '/activate/:id',
     middlewares.validateIdProduct, 
     middlewares.validateAdmin,
     ProductController.activate
);

router.put(
     '/deactivate/:id',
     middlewares.validateIdProduct, 
     middlewares.validateAdmin,
     ProductController.deactivate
);

router.get('/list', ProductController.list);
router.get('/query/:id', middlewares.validateIdProduct , ProductController.query);

export default router;  