const Mineral = require("../models/Mineral");

// Create new mineral
const createMineral = async (req, res) => {
  try {
    const { mineralId, name, grade, description } = req.body;

    const existingMineral = await Mineral.findOne({ mineralId });
    if (existingMineral) {
      return res.status(400).json({
        success: false,
        message: "Mineral with this ID already exists",
      });
    }

    const mineral = new Mineral({ mineralId, name, grade, description });
    await mineral.save();

    res.status(201).json({
      success: true,
      message: "Mineral created successfully",
      data: mineral,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating mineral",
      error: error.message,
    });
  }
};

// Get all minerals
const getAllMinerals = async (req, res) => {
  try {
    const minerals = await Mineral.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: minerals.length,
      data: minerals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching minerals",
      error: error.message,
    });
  }
};

// Get single mineral
const getMineral = async (req, res) => {
  try {
    const mineral = await Mineral.findById(req.params.id);

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mineral,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching mineral",
      error: error.message,
    });
  }
};

// Update mineral
const updateMineral = async (req, res) => {
  try {
    const mineral = await Mineral.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mineral updated successfully",
      data: mineral,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating mineral",
      error: error.message,
    });
  }
};

// Delete mineral
const deleteMineral = async (req, res) => {
  try {
    const mineral = await Mineral.findByIdAndDelete(req.params.id);

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mineral deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting mineral",
      error: error.message,
    });
  }
};

module.exports = {
  createMineral,
  getAllMinerals,
  getMineral,
  updateMineral,
  deleteMineral,
};
