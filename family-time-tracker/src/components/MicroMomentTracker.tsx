import React, { useState } from 'react';
import { Plus, Coffee, Car, Moon, BookOpen, MessageCircle, Heart, Sun, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { MicroMomentType, RoutineType } from '../types';
import { format } from 'date-fns';

const MICRO_MOMENT_TYPES: { type: MicroMomentType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'breakfast', label: 'Breakfast Chat', icon: <Coffee size={16} />, color: 'bg-orange-100 text-orange-700' },
  { type: 'car-ride', label: 'Car Ride', icon: <Car size={16} />, color: 'bg-blue-100 text-blue-700' },
  { type: 'bedtime', label: 'Bedtime', icon: <Moon size={16} />, color: 'bg-purple-100 text-purple-700' },
  { type: 'homework-help', label: 'Homework Help', icon: <BookOpen size={16} />, color: 'bg-green-100 text-green-700' },
  { type: 'quick-chat', label: 'Quick Chat', icon: <MessageCircle size={16} />, color: 'bg-pink-100 text-pink-700' },
  { type: 'hug', label: 'Hug/Affection', icon: <Heart size={16} />, color: 'bg-red-100 text-red-700' },
  { type: 'goodnight', label: 'Goodnight', icon: <Moon size={16} />, color: 'bg-indigo-100 text-indigo-700' },
  { type: 'goodmorning', label: 'Good Morning', icon: <Sun size={16} />, color: 'bg-yellow-100 text-yellow-700' }
];

const ROUTINE_TYPES: { type: RoutineType; label: string; icon: React.ReactNode; timeSlots: string[] }[] = [
  { 
    type: 'morning', 
    label: 'Morning Routine', 
    icon: <Sun size={16} />, 
    timeSlots: ['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM'] 
  },
  { 
    type: 'evening', 
    label: 'Evening Routine', 
    icon: <Moon size={16} />, 
    timeSlots: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'] 
  },
  { 
    type: 'mealtime', 
    label: 'Mealtime', 
    icon: <Coffee size={16} />, 
    timeSlots: ['Breakfast', 'Lunch', 'Dinner', 'Snack Time'] 
  },
  { 
    type: 'bedtime', 
    label: 'Bedtime Routine', 
    icon: <Moon size={16} />, 
    timeSlots: ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'] 
  }
];

export const MicroMomentTracker: React.FC = () => {
  const { data, addMicroMoment, addRoutine, updateRoutine } = useData();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedMomentType, setSelectedMomentType] = useState<MicroMomentType | null>(null);
  const [duration, setDuration] = useState<number>(5);
  const [quality, setQuality] = useState<number>(5);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [routineData, setRoutineData] = useState({
    name: '',
    type: 'morning' as RoutineType,
    timeSlot: '',
    participants: [] as string[]
  });

  const handleQuickAdd = () => {
    if (!selectedChild || !selectedMomentType) return;

    // For micro-moments, we'll add them to the most recent activity or create a standalone entry
    const recentActivity = data.activities
      .filter(a => a.childId === selectedChild)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    if (recentActivity) {
      addMicroMoment(recentActivity.id, {
        type: selectedMomentType,
        duration,
        quality,
        timestamp: new Date()
      });
    }

    // Reset form
    setSelectedChild('');
    setSelectedMomentType(null);
    setDuration(5);
    setQuality(5);
    setShowQuickAdd(false);
  };

  const handleAddRoutine = () => {
    if (!routineData.name || !routineData.timeSlot) return;

    addRoutine({
      name: routineData.name,
      type: routineData.type,
      timeSlot: routineData.timeSlot,
      participants: routineData.participants,
      qualityRating: 5,
      lastCompleted: new Date(),
      streak: 0
    });

    // Reset form
    setRoutineData({
      name: '',
      type: 'morning',
      timeSlot: '',
      participants: []
    });
    setShowRoutineForm(false);
  };

  const toggleParticipant = (childId: string) => {
    setRoutineData(prev => ({
      ...prev,
      participants: prev.participants.includes(childId)
        ? prev.participants.filter(id => id !== childId)
        : [...prev.participants, childId]
    }));
  };

  const completeRoutine = (routineId: string) => {
    const routine = data.routines.find(r => r.id === routineId);
    if (!routine) return;

    const lastCompleted = routine.lastCompleted;
    const today = new Date();
    const isConsecutiveDay = 
      today.toDateString() !== lastCompleted.toDateString() &&
      (today.getTime() - lastCompleted.getTime()) <= 24 * 60 * 60 * 1000 * 2; // Within 2 days

    updateRoutine(routineId, {
      lastCompleted: today,
      streak: isConsecutiveDay ? routine.streak + 1 : 1,
      qualityRating: 5 // Could be made interactive
    });
  };

  const todaysMicroMoments = data.activities
    .filter(activity => 
      activity.date.toDateString() === new Date().toDateString() &&
      activity.microMoments && activity.microMoments.length > 0
    )
    .flatMap(activity => 
      activity.microMoments!.map(moment => ({
        ...moment,
        childName: data.children.find(c => c.id === activity.childId)?.name || 'Unknown'
      }))
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Micro-Moments & Routines</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Quick Add
          </button>
          <button
            onClick={() => setShowRoutineForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={16} className="mr-2" />
            Add Routine
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Log Micro-Moment</h3>
            
            {/* Child Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Child</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select a child</option>
                {data.children.map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>

            {/* Moment Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Moment Type</label>
              <div className="grid grid-cols-2 gap-2">
                {MICRO_MOMENT_TYPES.map(({ type, label, icon, color }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMomentType(type)}
                    className={`p-3 rounded-lg border text-left text-sm flex items-center ${
                      selectedMomentType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${color} mr-2`}>
                      {icon}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration and Quality */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  max="60"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quality (1-5)</label>
                <input
                  type="number"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowQuickAdd(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAdd}
                disabled={!selectedChild || !selectedMomentType}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Moment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Routine Modal */}
      {showRoutineForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Routine</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Routine Name</label>
                <input
                  type="text"
                  value={routineData.name}
                  onChange={(e) => setRoutineData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Breakfast Together"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Routine Type</label>
                <select
                  value={routineData.type}
                  onChange={(e) => setRoutineData(prev => ({ ...prev, type: e.target.value as RoutineType }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {ROUTINE_TYPES.map(({ type, label }) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Slot</label>
                <select
                  value={routineData.timeSlot}
                  onChange={(e) => setRoutineData(prev => ({ ...prev, timeSlot: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select time slot</option>
                  {ROUTINE_TYPES.find(r => r.type === routineData.type)?.timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Participants</label>
                <div className="space-y-2">
                  {data.children.map(child => (
                    <label key={child.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={routineData.participants.includes(child.id)}
                        onChange={() => toggleParticipant(child.id)}
                        className="mr-2"
                      />
                      {child.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRoutineForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoutine}
                disabled={!routineData.name || !routineData.timeSlot}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                Create Routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Micro-Moments */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Today's Micro-Moments</h3>
        <div className="space-y-3">
          {todaysMicroMoments.map(moment => {
            const momentType = MICRO_MOMENT_TYPES.find(t => t.type === moment.type);
            return (
              <div key={moment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${momentType?.color}`}>
                    {momentType?.icon}
                  </span>
                  <div>
                    <p className="font-medium">{moment.childName} - {momentType?.label}</p>
                    <p className="text-sm text-gray-600">
                      {format(moment.timestamp, 'HH:mm')} • {moment.duration} min • {moment.quality}★
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {todaysMicroMoments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No micro-moments logged today</p>
          )}
        </div>
      </div>

      {/* Routines */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Daily Routines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.routines.map(routine => {
            const routineType = ROUTINE_TYPES.find(t => t.type === routine.type);
            const isCompletedToday = routine.lastCompleted.toDateString() === new Date().toDateString();
            
            return (
              <div key={routine.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {routineType?.icon}
                    <div>
                      <h4 className="font-semibold">{routine.name}</h4>
                      <p className="text-sm text-gray-600">{routine.timeSlot}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => completeRoutine(routine.id)}
                    disabled={isCompletedToday}
                    className={`p-2 rounded-full ${
                      isCompletedToday 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Streak: {routine.streak} days</span>
                    <span>Quality: {routine.qualityRating}★</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Participants: {routine.participants.map(id => 
                      data.children.find(c => c.id === id)?.name
                    ).join(', ')}
                  </div>
                  {isCompletedToday && (
                    <div className="text-xs text-green-600 font-medium">✓ Completed today</div>
                  )}
                </div>
              </div>
            );
          })}
          {data.routines.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <BookOpen className="mx-auto mb-3 text-gray-400" size={48} />
              <p>No routines created yet. Add your first routine to start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};