import React, { useState } from 'react';
import { X, Star, Clock, Heart, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Child, ActivityCategory, TimeInterval } from '../types';

interface TimeLoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'child' | 'activity' | 'time' | 'quality' | 'notes';

const ACTIVITY_CATEGORIES: { category: ActivityCategory; icon: string; color: string }[] = [
  { category: 'Video Games/Hang', icon: '🎮', color: 'bg-purple-500' },
  { category: 'Outdoors', icon: '🌳', color: 'bg-green-500' },
  { category: 'Meal', icon: '🍽️', color: 'bg-orange-500' },
  { category: 'Date', icon: '💝', color: 'bg-pink-500' },
  { category: 'Adventure', icon: '🗺️', color: 'bg-blue-500' },
  { category: 'Important Talk', icon: '💭', color: 'bg-indigo-500' }
];

const TIME_INTERVALS: { interval: TimeInterval; label: string; hours: number }[] = [
  { interval: '15min', label: '15 minutes', hours: 0.25 },
  { interval: '30min', label: '30 minutes', hours: 0.5 },
  { interval: '1hour', label: '1 hour', hours: 1 },
  { interval: '3hours', label: '3 hours', hours: 3 },
  { interval: 'all-day', label: 'All day (8+ hours)', hours: 8 }
];

export const TimeLoggingModal: React.FC<TimeLoggingModalProps> = ({ isOpen, onClose }) => {
  const { data, addActivity, updateStreak, updateChallengeProgress } = useData();
  const [currentStep, setCurrentStep] = useState<Step>('child');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedSiblings, setSelectedSiblings] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeInterval | null>(null);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [isGroupActivity, setIsGroupActivity] = useState<boolean>(false);

  const resetForm = () => {
    setCurrentStep('child');
    setSelectedChild(null);
    setSelectedSiblings([]);
    setSelectedCategory(null);
    setSelectedTime(null);
    setQualityRating(5);
    setNotes('');
    setIsGroupActivity(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const nextStep = () => {
    const steps: Step[] = ['child', 'activity', 'time', 'quality', 'notes'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['child', 'activity', 'time', 'quality', 'notes'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    if (!selectedChild || !selectedCategory || !selectedTime) return;

    const timeHours = TIME_INTERVALS.find(t => t.interval === selectedTime)?.hours || 0;

    addActivity({
      childId: selectedChild.id,
      siblingIds: selectedSiblings.length > 0 ? selectedSiblings : undefined,
      category: selectedCategory,
      timeSpent: selectedTime,
      qualityRating,
      date: new Date(),
      notes: notes.trim() || undefined
    });

    // Update streaks and challenges
    updateStreak('daily-connection', true);
    if (qualityRating >= 4) {
      updateStreak('quality-time', true);
    }
    
    // Update monthly challenge progress
    const monthlyChallenge = data.challenges.find(c => c.id === 'monthly-1');
    if (monthlyChallenge && !monthlyChallenge.completed) {
      updateChallengeProgress('monthly-1', monthlyChallenge.progress + timeHours);
    }

    handleClose();
  };

  const toggleSibling = (siblingId: string) => {
    setSelectedSiblings(prev => 
      prev.includes(siblingId) 
        ? prev.filter(id => id !== siblingId)
        : [...prev, siblingId]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'child': return selectedChild !== null;
      case 'activity': return selectedCategory !== null;
      case 'time': return selectedTime !== null;
      case 'quality': return qualityRating > 0;
      case 'notes': return true;
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Log Family Time</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {['child', 'activity', 'time', 'quality', 'notes'].indexOf(currentStep) + 1} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((['child', 'activity', 'time', 'quality', 'notes'].indexOf(currentStep) + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Child Selection */}
          {currentStep === 'child' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="mr-2 text-red-500" size={20} />
                Who did you spend time with?
              </h3>
              
              <div className="space-y-3">
                {data.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedChild?.id === child.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{child.name}</h4>
                        <p className="text-sm text-gray-600">Age {child.age}</p>
                      </div>
                      <div className="text-2xl">
                        {child.age >= 10 ? '🧒' : child.age >= 7 ? '👧' : child.name === 'Emma' ? '👧' : '🧒'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedChild && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center text-sm font-medium">
                      <Users className="mr-2" size={16} />
                      Include siblings in this activity?
                    </label>
                    <button
                      onClick={() => setIsGroupActivity(!isGroupActivity)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isGroupActivity ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isGroupActivity ? 'Group Activity' : 'One-on-One'}
                    </button>
                  </div>

                  {isGroupActivity && (
                    <div className="space-y-2">
                      {data.children
                        .filter(child => child.id !== selectedChild.id)
                        .map(sibling => (
                          <button
                            key={sibling.id}
                            onClick={() => toggleSibling(sibling.id)}
                            className={`w-full p-2 rounded border text-left text-sm ${
                              selectedSiblings.includes(sibling.id)
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-gray-200'
                            }`}
                          >
                            {sibling.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Activity Selection */}
          {currentStep === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">What did you do together?</h3>
              <div className="grid grid-cols-2 gap-3">
                {ACTIVITY_CATEGORIES.map(({ category, icon, color }) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      selectedCategory === category
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-2xl">{icon}</span>
                    </div>
                    <p className="text-sm font-medium">{category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Selection */}
          {currentStep === 'time' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="mr-2 text-blue-500" size={20} />
                How long did you spend together?
              </h3>
              <div className="space-y-3">
                {TIME_INTERVALS.map(({ interval, label }) => (
                  <button
                    key={interval}
                    onClick={() => setSelectedTime(interval)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTime === interval
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality Rating */}
          {currentStep === 'quality' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">How was the connection quality?</h3>
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setQualityRating(rating)}
                    className="p-2"
                  >
                    <Star
                      size={32}
                      className={`${
                        rating <= qualityRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {qualityRating === 1 && "Difficult - lots of tension or conflict"}
                  {qualityRating === 2 && "Challenging - some disconnection"}
                  {qualityRating === 3 && "Okay - pleasant but not particularly connected"}
                  {qualityRating === 4 && "Great - good connection and enjoyment"}
                  {qualityRating === 5 && "Amazing - deeply connected and meaningful"}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {currentStep === 'notes' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Any notes about this time?</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What made this time special? Any interesting conversations or moments?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32"
              />
              <p className="text-xs text-gray-500 mt-2">Optional - but these details help track what works best!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={prevStep}
            disabled={currentStep === 'child'}
            className="px-4 py-2 text-gray-600 disabled:text-gray-400"
          >
            Back
          </button>
          
          {currentStep === 'notes' ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Log Time
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};