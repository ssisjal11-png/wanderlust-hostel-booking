const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all packages
router.get('/', async (req, res) => {
    try {
        const packages = await prisma.package.findMany({
            where: { active: true }
        });

        // Parse features JSON string back to array
        const parsedPackages = packages.map(pkg => ({
            ...pkg,
            features: JSON.parse(pkg.features)
        }));

        res.json(parsedPackages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch packages' });
    }
});

// GET single package
router.get('/:id', async (req, res) => {
    try {
        const pkg = await prisma.package.findUnique({
            where: { id: req.params.id }
        });

        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.json({
            ...pkg,
            features: JSON.parse(pkg.features)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch package' });
    }
});

// CREATE package
router.post('/', async (req, res) => {
    try {
        const { features, ...data } = req.body;
        const pkg = await prisma.package.create({
            data: {
                ...data,
                features: JSON.stringify(features)
            }
        });
        res.json({
            ...pkg,
            features: JSON.parse(pkg.features)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create package' });
    }
});

// UPDATE package
router.put('/:id', async (req, res) => {
    try {
        const { features, ...data } = req.body;
        const updateData = { ...data };

        if (features) {
            updateData.features = JSON.stringify(features);
        }

        const pkg = await prisma.package.update({
            where: { id: req.params.id },
            data: updateData
        });

        res.json({
            ...pkg,
            features: JSON.parse(pkg.features)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update package' });
    }
});

// DELETE package (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        await prisma.package.update({
            where: { id: req.params.id },
            data: { active: false }
        });
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete package' });
    }
});

module.exports = router;
