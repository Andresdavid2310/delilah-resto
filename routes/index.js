import routerx from 'express-promise-router';
import productRouter from './product';
import orderRouter from './order';
import userRouter from './user';

const router = routerx();

router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);

export default router;