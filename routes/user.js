import routerx from 'express-promise-router';
import middlewares from '../middlewares/index';
import UserController from '../controllers/UserController';

const router = routerx();

router.post('/add', middlewares.validateData, UserController.add);
router.get('/list', middlewares.validateAdmin, UserController.list);
router.post('/login' ,middlewares.loginUser, UserController.generationToken);
router.get('/query/:id', middlewares.validateIdUser , UserController.query);

router.put('/activate/:id', middlewares.validateIdUser,middlewares.validateAdmin,
     UserController.activate
);

router.put('/deactivate/:id', 
     middlewares.validateIdUser,
     middlewares.validateAdmin,
     UserController.deactivate
);

router.put(
     '/:id',
     middlewares.validateUserExits,
     middlewares.validateIdUser,
     middlewares.validateAdmin,
     UserController.update
);

router.delete(
     '/:id',
     middlewares.validateIdUser,
     middlewares.validateAdmin,
     UserController.remove
);

export default router; 