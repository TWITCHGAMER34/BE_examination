import Product from '../models/product.js';
import crypto from 'crypto';

async function generateUniqueProdId() {
    // try a few times to avoid collisions
    for (let i = 0; i < 5; i++) {
        const pid = 'prod-' + crypto.randomBytes(3).toString('hex'); // produces >= 6 hex chars
        // check existence
        const exists = await Product.findOne({ prodId: pid }).lean();
        if (!exists) return pid;
    }
    // fallback
    return 'prod-' + Date.now().toString(36);
}

export async function addMenuItem({ title, desc, price }) {
    const prodId = await generateUniqueProdId();
    const item = new Product({ prodId, title, desc, price });
    return item.save();
}

export async function getMenu() {
    try {
        const menu = await Product.find();
        return menu;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}

export async function getProduct(prodId) {
    try {
        const product = await Product.findOne({ prodId : prodId });
        return product;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}