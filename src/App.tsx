import React, { useState, useEffect } from 'react';
import { Plus, Timer, Dumbbell, Zap, Volume2 } from 'lucide-react';
import ExerciseCard from './components/ExerciseCard';
import AddExerciseModal from './components/AddExerciseModal';
import { Exercise, ExerciseFormData } from './types/Exercise';
import { sampleExercises } from './data/sampleExercises';
import { audioManager } from './utils/audioUtils';

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    // Initialize with sample exercises
    const initialExercises: Exercise[] = sampleExercises.map((exercise, index) => ({
      ...exercise,
      id: `exercise-${index}`,
      isActive: false,
      timeRemaining: exercise.duration,
      isPaused: false
    }));
    setExercises(initialExercises);
  }, []);

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  };

  const addExercise = (exerciseData: ExerciseFormData) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: `exercise-${Date.now()}`,
      isActive: false,
      timeRemaining: exerciseData.duration,
      isPaused: false
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  };

  const editExercise = (id: string, data: ExerciseFormData) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === id 
        ? { 
            ...exercise, 
            ...data, 
            timeRemaining: data.duration,
            isActive: false,
            isPaused: false 
          } 
        : exercise
    ));
  };

  const activeExercises = exercises.filter(ex => ex.isActive && !ex.isPaused);
  const completedExercises = exercises.filter(ex => ex.timeRemaining === 0 && ex.isActive);

  const testBellSound = () => {
    audioManager.playBellSound();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Circuit Training</h1>
                  <p className="text-gray-600">Build strength, endurance, and power</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span>Add Exercise</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Timer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{exercises.length}</p>
                <p className="text-gray-600 font-medium">Total Exercises</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeExercises.length}</p>
                <p className="text-gray-600 font-medium">Active Timers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Dumbbell className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedExercises.length}</p>
                <p className="text-gray-600 font-medium">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        {exercises.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Dumbbell className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exercises yet</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={testBellSound}
                className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
                title="Test bell sound"
              >
                <Volume2 size={18} />
                <span className="hidden sm:inline">Test Bell</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span>Add Exercise</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onUpdate={updateExercise}
                onDelete={deleteExercise}
                onEdit={editExercise}
              />
            ))}
          </div>
        )}
      </div>

      <AddExerciseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addExercise}
      />
    </div>
  );
}

export default App;