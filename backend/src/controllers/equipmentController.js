const Equipment = require("../models/Equipment");

// Create new equipment
const createEquipment = async (req, res) => {
  try {
    const {
      equipmentId,
      name,
      type,
      status,
      location,
      lastMaintenanceDate,
      nextMaintenanceDate,
      assignedTo,
    } = req.body;

    // Check if equipmentId already exists
    const existingEquipment = await Equipment.findOne({ equipmentId });
    if (existingEquipment) {
      return res.status(400).json({
        success: false,
        message: "Equipment with this ID already exists",
      });
    }

    const equipment = new Equipment({
      equipmentId,
      name,
      type,
      status,
      location,
      lastMaintenanceDate,
      nextMaintenanceDate,
      assignedTo,
    });

    await equipment.save();
    await equipment.populate("assignedTo", "userName role");

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating equipment",
      error: error.message,
    });
  }
};

// Get all equipment
const getAllEquipment = async (req, res) => {
  try {
    const { type, status, location } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (location) filter.location = location;

    const equipment = await Equipment.find(filter)
      .populate("assignedTo", "userName role")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment",
      error: error.message,
    });
  }
};

// Get single equipment
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      "assignedTo",
      "userName role email"
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment",
      error: error.message,
    });
  }
};

// Update equipment
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("assignedTo", "userName role");

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating equipment",
      error: error.message,
    });
  }
};

// Delete equipment
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting equipment",
      error: error.message,
    });
  }
};

// Update equipment status
const updateEquipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("assignedTo", "userName role");

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment status updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating equipment status",
      error: error.message,
    });
  }
};

// Log equipment usage
const logEquipmentUsage = async (req, res) => {
  try {
    const { lastMaintenanceDate, nextMaintenanceDate } = req.body;

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { lastMaintenanceDate, nextMaintenanceDate },
      { new: true, runValidators: true }
    ).populate("assignedTo", "userName role");

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment usage logged successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging equipment usage",
      error: error.message,
    });
  }
};

// Get equipment statistics
const getEquipmentStatistics = async (req, res) => {
  try {
    const byStatus = await Equipment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const byType = await Equipment.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Equipment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus,
        byType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  updateEquipmentStatus,
  logEquipmentUsage,
  getEquipmentStatistics,
};
