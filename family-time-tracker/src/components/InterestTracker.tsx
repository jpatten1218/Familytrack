import React, { useState } from 'react';
import { Lightbulb, TrendingUp, Plus, Target, Book, Trophy } from 'lucide-react';
import { useData } from '../context/DataContext';
import { format, differenceInDays } from 'date-fns';

export const InterestTracker: React.FC = () => {
  const { data } = useData();
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [newInterest, setNewInterest] = useState<string>('');
  const [newSkill, setNewSkill] = useState<{ skill: string; level: number }>({ skill: '', level: 1 });

  const handleAddInterest = () => {
    if (!selectedChild || !newInterest.trim()) return;
    
    // In a real app, this would update the child's interests
    // For now, we'll just reset the form
    setNewInterest('');
    setSelectedChild('');
    setShowAddInterest(false);
  };

  const handleAddSkill = () => {
    if (!selectedChild || !newSkill.skill.trim()) return;
    
    // In a real app, this would add to the child's skill progresses
    setNewSkill({ skill: '', level: 1 });
    setSelectedChild('');
    setShowAddSkill(false);
  };

  const getInterestTrend = (childId: string, interest: string) => {
    const relevantActivities = data.activities
      .filter(activity => 
        activity.childId === childId && 
        (activity.notes?.toLowerCase().includes(interest.toLowerCase()) || 
         activity.category.toLowerCase().includes(interest.toLowerCase()))
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (relevantActivities.length < 2) return 'stable';
    
    const recent = relevantActivities.slice(-3);
    const earlier = relevantActivities.slice(0, -3);
    
    const recentAvgQuality = recent.reduce((sum, a) => sum + a.qualityRating, 0) / recent.length;
    const earlierAvgQuality = earlier.length > 0 
      ? earlier.reduce((sum, a) => sum + a.qualityRating, 0) / earlier.length 
      : recentAvgQuality;

    if (recentAvgQuality > earlierAvgQuality + 0.5) return 'growing';
    if (recentAvgQuality < earlierAvgQuality - 0.5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'growing': return <TrendingUp className="text-green-500" size={16} />;
      case 'declining': return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'growing': return 'text-green-600 bg-green-50';
      case 'declining': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Lightbulb className="mr-3 text-yellow-500" size={28} />
          Interest & Skill Tracking
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddInterest(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Interest
          </button>
          <button
            onClick={() => setShowAddSkill(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={16} className="mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Add Interest Modal */}
      {showAddInterest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Interest</h3>
            
            <div className="space-y-4">
              <div>
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

              <div>
                <label className="block text-sm font-medium mb-2">Interest</label>
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="e.g., dinosaurs, cooking, soccer"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddInterest(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInterest}
                disabled={!selectedChild || !newInterest.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Interest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
            
            <div className="space-y-4">
              <div>
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

              <div>
                <label className="block text-sm font-medium mb-2">Skill</label>
                <input
                  type="text"
                  value={newSkill.skill}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, skill: e.target.value }))}
                  placeholder="e.g., piano, swimming, reading"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Starting Level (1-10)</label>
                <input
                  type="number"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: Number(e.target.value) }))}
                  min="1"
                  max="10"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddSkill(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                disabled={!selectedChild || !newSkill.skill.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Children Interest & Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.children.map(child => (
          <div key={child.id} className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{child.name}</h3>
              <div className="text-sm text-gray-500">Age {child.age}</div>
            </div>

            {/* Current Interests */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center">
                <Lightbulb className="mr-2 text-yellow-500" size={16} />
                Current Interests
              </h4>
              <div className="space-y-2">
                {child.interests.map(interest => {
                  const trend = getInterestTrend(child.id, interest);
                  return (
                    <div key={interest} className={`flex items-center justify-between p-2 rounded-lg ${getTrendColor(trend)}`}>
                      <span className="capitalize">{interest}</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(trend)}
                        <span className="text-xs capitalize">{trend}</span>
                      </div>
                    </div>
                  );
                })}
                {child.interests.length === 0 && (
                  <p className="text-gray-500 text-sm">No interests tracked yet</p>
                )}
              </div>
            </div>

            {/* Skill Progress */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Target className="mr-2 text-blue-500" size={16} />
                Skill Development
              </h4>
              <div className="space-y-3">
                {child.skillProgresses.map(skillProgress => {
                  const daysSincePractice = differenceInDays(new Date(), skillProgress.lastPracticed);
                  return (
                    <div key={skillProgress.skill} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{skillProgress.skill}</span>
                        <div className="flex items-center space-x-2">
                          <Trophy className="text-orange-500" size={14} />
                          <span className="text-sm font-bold">Level {skillProgress.level}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progress</span>
                          <span>{skillProgress.level}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(skillProgress.level / 10) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{skillProgress.totalHours}h total</span>
                          <span>
                            {daysSincePractice === 0 ? 'Practiced today' : 
                             daysSincePractice === 1 ? 'Last practiced yesterday' :
                             `Last practiced ${daysSincePractice} days ago`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {child.skillProgresses.length === 0 && (
                  <p className="text-gray-500 text-sm">No skills being tracked yet</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interest Evolution Insights */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-500" size={20} />
          Interest Evolution Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.children.map(child => {
            const growingInterests = child.interests.filter(interest => 
              getInterestTrend(child.id, interest) === 'growing'
            );
            const decliningInterests = child.interests.filter(interest => 
              getInterestTrend(child.id, interest) === 'declining'
            );

            return (
              <div key={child.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">{child.name}</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">{growingInterests.length}</span>
                    <span className="text-gray-600"> growing interests</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-600 font-medium">{decliningInterests.length}</span>
                    <span className="text-gray-600"> declining interests</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-600 font-medium">{child.skillProgresses.length}</span>
                    <span className="text-gray-600"> skills in development</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
          <Book className="mr-2" size={20} />
          Personalized Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.children.map(child => {
            const recommendations = [];
            
            // Generate sample recommendations based on interests and activities
            if (child.interests.includes('video games')) {
              recommendations.push('Try a coding game or programming activity together');
            }
            if (child.interests.includes('outdoor activities')) {
              recommendations.push('Plan a nature scavenger hunt or hiking adventure');
            }
            if (child.age >= 7 && child.skillProgresses.length < 2) {
              recommendations.push('Consider introducing a new skill like music or art');
            }
            
            recommendations.push('Schedule more one-on-one time based on recent activity patterns');

            return (
              <div key={child.id} className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">{child.name}</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};