import React, { useMemo } from 'react';
import { Trophy, Flame, Target, Star, Calendar, Clock, Users, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { format, differenceInDays } from 'date-fns';

export const GamificationPanel: React.FC = () => {
  const { data } = useData();

  const streakData = useMemo(() => {
    return data.streaks.map(streak => ({
      ...streak,
      icon: streak.type === 'daily-connection' ? Calendar : 
            streak.type === 'quality-time' ? Star : Users,
      color: streak.type === 'daily-connection' ? 'text-blue-500' : 
             streak.type === 'quality-time' ? 'text-yellow-500' : 'text-green-500',
      bgColor: streak.type === 'daily-connection' ? 'bg-blue-50' : 
               streak.type === 'quality-time' ? 'bg-yellow-50' : 'bg-green-50',
      title: streak.type === 'daily-connection' ? 'Daily Connection' : 
             streak.type === 'quality-time' ? 'Quality Time' : 'All Children'
    }));
  }, [data.streaks]);

  const achievementStats = useMemo(() => {
    const total = data.achievements.length;
    const unlocked = data.achievements.filter(a => a.unlockedAt).length;
    const totalProgress = data.achievements.reduce((sum, a) => sum + a.progress, 0);
    const avgProgress = total > 0 ? totalProgress / total : 0;

    return { total, unlocked, avgProgress };
  }, [data.achievements]);

  const currentChallenges = useMemo(() => {
    return data.challenges.filter(challenge => !challenge.completed);
  }, [data.challenges]);

  const badgeCategories = useMemo(() => {
    const categories = {
      consistency: data.achievements.filter(a => a.category === 'consistency'),
      quality: data.achievements.filter(a => a.category === 'quality'),
      creativity: data.achievements.filter(a => a.category === 'creativity'),
      milestone: data.achievements.filter(a => a.category === 'milestone')
    };

    return Object.entries(categories).map(([category, achievements]) => ({
      name: category,
      total: achievements.length,
      unlocked: achievements.filter(a => a.unlockedAt).length,
      icon: category === 'consistency' ? Calendar :
            category === 'quality' ? Star :
            category === 'creativity' ? Zap :
            Trophy,
      color: category === 'consistency' ? 'text-blue-500' :
             category === 'quality' ? 'text-yellow-500' :
             category === 'creativity' ? 'text-purple-500' :
             'text-orange-500'
    }));
  }, [data.achievements]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Trophy className="mr-3 text-orange-500" size={28} />
          Dad Level Dashboard
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-lg font-bold text-gray-900">
            {achievementStats.unlocked}/{achievementStats.total} Badges
          </p>
        </div>
      </div>

      {/* Achievement Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{achievementStats.unlocked}</div>
            <div className="text-sm opacity-90">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(achievementStats.avgProgress)}%</div>
            <div className="text-sm opacity-90">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{currentChallenges.length}</div>
            <div className="text-sm opacity-90">Active Challenges</div>
          </div>
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streakData.map(streak => {
          const IconComponent = streak.icon;
          return (
            <div key={streak.type} className={`bg-white rounded-xl p-6 border shadow-sm ${streak.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <IconComponent className={streak.color} size={24} />
                <Flame className="text-orange-500" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{streak.title}</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current</span>
                  <span className="font-bold">{streak.current} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best</span>
                  <span className="font-bold">{streak.longest} days</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Last updated {format(streak.lastUpdate, 'MMM dd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {badgeCategories.map(category => {
          const IconComponent = category.icon;
          const percentage = category.total > 0 ? (category.unlocked / category.total) * 100 : 0;
          
          return (
            <div key={category.name} className="bg-white rounded-xl p-6 border shadow-sm text-center">
              <IconComponent className={`mx-auto mb-3 ${category.color}`} size={32} />
              <h4 className="font-semibold text-gray-900 capitalize mb-2">{category.name}</h4>
              <div className="text-2xl font-bold mb-1">{category.unlocked}/{category.total}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{Math.round(percentage)}% complete</div>
            </div>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="mr-2 text-orange-500" size={20} />
          Achievement Collection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border transition-all ${
                achievement.unlockedAt 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{achievement.icon}</span>
                    <div>
                      <h4 className={`font-semibold ${
                        achievement.unlockedAt ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          achievement.unlockedAt ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>

                  {achievement.unlockedAt && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      🎉 Unlocked {format(achievement.unlockedAt, 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="mr-2 text-blue-500" size={20} />
          Active Challenges
        </h3>
        <div className="space-y-4">
          {currentChallenges.map(challenge => {
            const progress = (challenge.progress / challenge.target) * 100;
            const daysLeft = differenceInDays(challenge.endDate, new Date());
            
            return (
              <div key={challenge.id} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-blue-600 font-medium">{daysLeft} days left</div>
                    <div className="text-gray-500">Reward: {challenge.reward}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {challenge.progress}/{challenge.target} hours
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(progress)}% complete
                  </div>
                </div>
              </div>
            );
          })}
          
          {currentChallenges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="mx-auto mb-3 text-gray-400" size={48} />
              <p>No active challenges. Check back for new monthly challenges!</p>
            </div>
          )}
        </div>
      </div>

      {/* Dad Score Summary */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="mr-2" size={20} />
          Your Dad Score
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{achievementStats.unlocked * 100}</div>
            <div className="text-sm opacity-90">Achievement Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {data.streaks.reduce((sum, s) => sum + s.current, 0)}
            </div>
            <div className="text-sm opacity-90">Streak Days</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {data.activities.reduce((sum, a) => sum + a.qualityRating, 0)}
            </div>
            <div className="text-sm opacity-90">Quality Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round(data.challenges.reduce((sum, c) => sum + (c.progress / c.target * 100), 0))}
            </div>
            <div className="text-sm opacity-90">Challenge Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};