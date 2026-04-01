const Inventory = require("../models/inventory.model");

exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate("product");
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate("product");

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      product: req.params.productId,
    }).populate("product");

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "product và quantity phải hợp lệ" });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.stock += quantity;
    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "product và quantity phải hợp lệ" });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (inventory.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    inventory.stock -= quantity;
    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "product và quantity phải hợp lệ" });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (inventory.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;

    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "product và quantity phải hợp lệ" });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (inventory.reserved < quantity) {
      return res.status(400).json({ message: "Not enough reserved quantity" });
    }

    inventory.reserved -= quantity;
    inventory.soldCount += quantity;

    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};