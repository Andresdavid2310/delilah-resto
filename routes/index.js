import routerx from 'express-promise-router';
import productRouter from './product';
import orderRouter from './order';
import userRouter from './user';

const router = routerx();

router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/user', userRouter);

export default router;