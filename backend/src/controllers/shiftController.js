const Shift = require("../models/Shift");

// Create new shift
const createShift = async (req, res) => {
  try {
    const { shiftId, name, startTime, endTime } = req.body;

    const existingShift = await Shift.findOne({ shiftId });
    if (existingShift) {
      return res.status(400).json({
        success: false,
        message: "Shift with this ID already exists",
      });
    }

    const shift = new Shift({ shiftId, name, startTime, endTime });
    await shift.save();

    res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data: shift,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating shift",
      error: error.message,
    });
  }
};

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shifts",
      error: error.message,
    });
  }
};

// Get single shift
const getShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    res.status(200).json({
      success: true,
      data: shift,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shift",
      error: error.message,
    });
  }
};

// Update shift
const updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shift updated successfully",
      data: shift,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating shift",
      error: error.message,
    });
  }
};

// Delete shift
const deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting shift",
      error: error.message,
    });
  }
};

module.exports = {
  createShift,
  getAllShifts,
  getShift,
  updateShift,
  deleteShift,
};
