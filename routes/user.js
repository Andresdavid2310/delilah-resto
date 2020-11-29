import routerx from 'express-promise-router';
import UserController from '../controllers/UsuarioController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyAdministrador, UserController.add);
router.get('/query', auth.verifyAdministrador, UserController.query);
router.get('/list', auth.verifyAdministrador, UserController.list);
router.put('/update', auth.verifyAdministrador, UserController.update);
router.delete('/remove', auth.verifyAdministrador,UserController.remove);
router.put('/activate', auth.verifyAdministrador,UserController.activate);
router.put('/deactivate', auth.verifyAdministrador,UserController.deactivate);
router.post('/login', UserController.login);

export default router; 