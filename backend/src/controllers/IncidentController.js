const Incident = require("../models/Incident");

// Create new incident
const createIncident = async (req, res) => {
  try {
    const {
      incidentId,
      title,
      description,
      type,
      severity,
      location,
      date,
      reportedBy,
      equipment,
    } = req.body;

    const existingIncident = await Incident.findOne({ incidentId });
    if (existingIncident) {
      return res.status(400).json({
        success: false,
        message: "Incident with this ID already exists",
      });
    }

    const incident = new Incident({
      incidentId,
      title,
      description,
      type,
      severity,
      location,
      date,
      reportedBy,
      equipment,
    });

    await incident.save();
    await incident.populate("reportedBy equipment");

    res.status(201).json({
      success: true,
      message: "Incident recorded successfully",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating incident",
      error: error.message,
    });
  }
};

// Get all incidents
const getAllIncidents = async (req, res) => {
  try {
    const { type, severity, status, startDate, endDate } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const incidents = await Incident.find(filter)
      .populate("reportedBy", "userName role")
      .populate("equipment", "name equipmentId")
      .populate("resolvedBy", "userName role")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching incidents",
      error: error.message,
    });
  }
};

// Get single incident
const getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("reportedBy", "userName role email")
      .populate("equipment", "name equipmentId type")
      .populate("resolvedBy", "userName role email");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching incident",
      error: error.message,
    });
  }
};

// Update incident
const updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("reportedBy", "userName role")
      .populate("equipment", "name equipmentId")
      .populate("resolvedBy", "userName role");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incident updated successfully",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating incident",
      error: error.message,
    });
  }
};

// Delete incident
const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incident deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting incident",
      error: error.message,
    });
  }
};

// Update incident status
const updateIncidentStatus = async (req, res) => {
  try {
    const { status, actionTaken, resolvedBy } = req.body;

    const updateData = { status, actionTaken };

    if (status === "Resolved" || status === "Closed") {
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedDate = new Date();
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("reportedBy", "userName role")
      .populate("equipment", "name equipmentId")
      .populate("resolvedBy", "userName role");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incident status updated successfully",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating incident status",
      error: error.message,
    });
  }
};

// Get incident statistics
const getIncidentStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchFilter = {};
    if (startDate && endDate) {
      matchFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const byType = await Incident.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const bySeverity = await Incident.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 },
        },
      },
    ]);

    const byStatus = await Incident.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Incident.countDocuments(matchFilter);

    res.status(200).json({
      success: true,
      data: {
        total,
        byType,
        bySeverity,
        byStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching incident statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
  updateIncidentStatus,
  getIncidentStatistics,
};
