import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { mineralService, shiftService } from '../../services/mineralService.js&shiftService';
import productionService from '../../services/productionService';
import { useAuth } from '../../context/AuthContext';

const ProductionForm = ({ onClose, onSuccess, editData = null }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [minerals, setMinerals] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    recordId: editData?.recordId || `PROD-${Date.now()}`,
    date: editData?.date ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    quantity: editData?.quantity || '',
    mineral: editData?.mineral?._id || '',
    location: editData?.location || '',
    shift: editData?.shift?._id || '',
    supervisor: editData?.supervisor?._id || user._id,
    fieldOperator: editData?.fieldOperator?._id || user._id,
    workingHours: editData?.workingHours || '',
    remarks: editData?.remarks || '',
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [mineralsRes, shiftsRes] = await Promise.all([
        mineralService.getAll(),
        shiftService.getAll(),
      ]);
      setMinerals(mineralsRes.data || []);
      setShifts(shiftsRes.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await productionService.update(editData._id, formData);
      } else {
        await productionService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving production record:', error);
      alert(error.response?.data?.message || 'Failed to save production record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData ? 'Edit Production Record' : 'New Production Record'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Record ID */}
            <div>
              <label className="label">Record ID</label>
              <input
                type="text"
                name="recordId"
                value={formData.recordId}
                readOnly
                className="input-field bg-gray-100"
              />
            </div>

            {/* Date */}
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Mineral */}
            <div>
              <label className="label">Mineral Type *</label>
              <select
                name="mineral"
                value={formData.mineral}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Mineral</option>
                {minerals.map((mineral) => (
                  <option key={mineral._id} value={mineral._id}>
                    {mineral.name} - {mineral.grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="label">Quantity (tons) *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Mine Site A"
                required
              />
            </div>

            {/* Shift */}
            <div>
              <label className="label">Shift *</label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Shift</option>
                {shifts.map((shift) => (
                  <option key={shift._id} value={shift._id}>
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Working Hours */}
            <div>
              <label className="label">Working Hours *</label>
              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                className="input-field"
                min="1"
                max="24"
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="label">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : editData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionForm;