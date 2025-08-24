import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Edit2, Trash2, Check, X } from 'lucide-react';
import { Exercise, ExerciseFormData } from '../types/Exercise';
import { audioManager } from '../utils/audioUtils';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (id: string, updates: Partial<Exercise>) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: ExerciseFormData) => void;
}

export default function ExerciseCard({ exercise, onUpdate, onDelete, onEdit }: ExerciseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: exercise.name,
    description: exercise.description,
    duration: exercise.duration
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousTimeRef = useRef<number>(exercise.timeRemaining);

  useEffect(() => {
    if (exercise.isActive && !exercise.isPaused && exercise.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        onUpdate(exercise.id, { 
          timeRemaining: Math.max(0, exercise.timeRemaining - 1) 
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Check if timer just reached zero and play bell sound
    if (previousTimeRef.current > 0 && exercise.timeRemaining === 0 && exercise.isActive) {
      audioManager.playBellSound();
    }
    previousTimeRef.current = exercise.timeRemaining;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [exercise.isActive, exercise.isPaused, exercise.timeRemaining, exercise.id, onUpdate]);

  const handleStart = () => {
    onUpdate(exercise.id, { isActive: true, isPaused: false });
  };

  const handlePause = () => {
    onUpdate(exercise.id, { isPaused: true });
  };

  const handleReset = () => {
    onUpdate(exercise.id, { 
      isActive: false, 
      isPaused: false, 
      timeRemaining: exercise.duration 
    });
  };

  const handleEdit = () => {
    onEdit(exercise.id, editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: exercise.name,
      description: exercise.description,
      duration: exercise.duration
    });
    setIsEditing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((exercise.duration - exercise.timeRemaining) / exercise.duration) * 100;
  const isCompleted = exercise.timeRemaining === 0 && exercise.isActive;

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      exercise.isActive && !exercise.isPaused ? 'border-blue-500 shadow-blue-100' : 
      isCompleted ? 'border-green-500 shadow-green-100' : 'border-gray-200'
    }`}>
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Exercise name"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Exercise description"
              rows={2}
            />
            <input
              type="number"
              value={editForm.duration}
              onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Duration (seconds)"
              min="1"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Check size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{exercise.description}</p>
              </div>
              <div className="flex space-x-1 ml-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className={`text-2xl font-bold ${
                  isCompleted ? 'text-green-600' : 
                  exercise.isActive && !exercise.isPaused ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {formatTime(exercise.timeRemaining)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    isCompleted ? 'bg-green-500' : 
                    exercise.isActive && !exercise.isPaused ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-3">
              {!exercise.isActive || exercise.isPaused ? (
                <button
                  onClick={handleStart}
                  className={`flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 ${
                    exercise.timeRemaining === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={exercise.timeRemaining === 0}
                >
                  <Play size={18} />
                  <span className="font-semibold">{exercise.isPaused ? 'Resume' : 'Start'}</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  <Pause size={18} />
                  <span className="font-semibold">Pause</span>
                </button>
              )}
              
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {isCompleted && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold text-center">Exercise Complete! 🎉</p>
              </div>
            )}
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Exercise</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{exercise.name}"? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onDelete(exercise.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}