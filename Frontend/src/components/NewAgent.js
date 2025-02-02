import React from 'react';
import { useForm } from 'react-hook-form';
import { NewAddAgent } from '../logic/new-agent';
import { useMutation } from '@tanstack/react-query';

const NewAgent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync: newAgent } = useMutation({
    mutationFn: (data) => NewAddAgent(data),
    onSuccess: (data) => {
      if (data?.success) {
        alert("New agent added successfully")
        return
      }
      alert("Error adding new agent")
    },
  });

  const onSubmit = async(data) => {
    await newAgent(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Agent Registration Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
              className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Agent Name */}
          <div className="mb-4">
            <label htmlFor="agentname" className="block text-sm font-medium text-gray-700">Agent Username</label>
            <input
              type="text"
              id="agentname"
              {...register('agentname', { required: 'Agent Name is required' })}
              className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.agentname ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.agentname && <p className="text-red-500 text-sm mt-1">{errors.agentname.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
              className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Number */}
          <div className="mb-4">
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">Number</label>
            <input
              type="text"
              id="number"
              {...register('number', { required: 'Number is required' })}
              className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>}
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              {...register('gender', { required: 'Gender is required' })}
              className={`mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          {/* Aadhar Card */}
          <div className="mb-4">
            <label htmlFor="aadharcard" className="block text-sm font-medium text-gray-700">Aadhar Card</label>
            <input
              type="text"
              id="aadharcard"
              {...register('aadharcard')}
              className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
          </div>

          {/* Pan Card */}
          <div className="mb-4">
            <label htmlFor="pancard" className="block text-sm font-medium text-gray-700">Pan Card</label>
            <input
              type="text"
              id="pancard"
              {...register('pancard')}
              className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAgent;
