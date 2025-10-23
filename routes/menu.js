import { Router } from 'express';
import { getMenu, addMenuItem } from '../services/menu.js';
import auth from '../middlewares/auth.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import validateProduct from '../middlewares/validators.js';
import Product from '../models/product.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const menu = await getMenu();
        if (menu) {
            res.json({ success: true, menu });
        } else {
            next({ status: 404, message: 'Menu not found' });
        }
    } catch (err) {
        next(err);
    }
});

// Protected route: only admins can add products
router.post('/add-item', auth, requireAdmin, validateProduct, async (req, res, next) => {
    try {
        const { title, desc, price } = req.body;
        const newItem = await addMenuItem({ title, desc, price });
        if (newItem) {
            res.status(201).json({ success: true, item: newItem });
        } else {
            next({ status: 400, message: 'Item not added' });
        }
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', auth, requireAdmin, validateProduct, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, desc, price } = req.body;
        // include modified_at so updated timestamp is set even with findOneAndUpdate
        const update = { title, desc, price, modified_at: new Date() };
        const item = await Product.findOneAndUpdate(
            { prodId: id },
            update,
            { new: true, runValidators: true }
        );
        if (item) {
            res.json({ success: true, item });
        } else {
            next({ status: 404, message: 'Item not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', auth, requireAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Product.findOneAndDelete({ prodId: id });
        if (item) {
            res.json({ success: true, message: 'Item deleted successfully' });
        } else {
            next({ status: 404, message: 'Item not found' });
        }
    } catch (err) {
        next(err);
    }
})

export default router;