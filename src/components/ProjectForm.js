import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Input from './UI/Input';
import Select from './UI/Select';
import Button from './UI/Button';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'on hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const teamMembers = [
  { value: 'Alice', label: 'Alice' },
  { value: 'Bob', label: 'Bob' },
  { value: 'Charlie', label: 'Charlie' },
  { value: 'Diana', label: 'Diana' },
  { value: 'Eve', label: 'Eve' },
  { value: 'Frank', label: 'Frank' }
];

// Set default team member (first one in the array)
const DEFAULT_TEAM_MEMBER = teamMembers[0].value;

export default function ProjectForm({ initialData = {}, onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    deadline: '',
    assignedTo: DEFAULT_TEAM_MEMBER, // Set default team member here
    budget: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData.deadline) {
      const deadlineDate = new Date(initialData.deadline);
      const formattedDate = deadlineDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, deadline: formattedDate }));
    }
  }, [initialData.deadline]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const dataToSubmit = {
        ...formData,
        deadline: new Date(formData.deadline),
        budget: Number(formData.budget)
      };
      await onSubmit(dataToSubmit);
      router.push('/projects');
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: error.details });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <Input
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        as="textarea"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
        />

        <Select
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          options={teamMembers}
          error={errors.assignedTo}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={errors.deadline}
          required
        />

        <Input
          label="Budget ($)"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          error={errors.budget}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={() => router.push('/projects')}
          className="bg-gray-500 hover:bg-gray-600 text-white m-8"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white m-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
}