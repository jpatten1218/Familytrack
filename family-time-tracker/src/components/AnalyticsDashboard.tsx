import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Clock, Star, Users, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ViewMode, ActivityCategory, TimeInterval } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

const TIME_INTERVAL_HOURS: Record<TimeInterval, number> = {
  '15min': 0.25,
  '30min': 0.5,
  '1hour': 1,
  '3hours': 3,
  'all-day': 8
};

const ACTIVITY_COLORS: Record<ActivityCategory, string> = {
  'Video Games/Hang': '#8B5CF6',
  'Outdoors': '#10B981',
  'Meal': '#F59E0B',
  'Date': '#EC4899',
  'Adventure': '#3B82F6',
  'Important Talk': '#6366F1'
};

export const AnalyticsDashboard: React.FC = () => {
  const { data } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>(data.children.map(c => c.id));
  const [showFilters, setShowFilters] = useState(false);

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (viewMode) {
      case 'daily':
        return { start: now, end: now };
      case 'weekly':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'monthly':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'yearly':
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: startOfWeek(now), end: endOfWeek(now) };
    }
  }, [viewMode]);

  const filteredActivities = useMemo(() => {
    return data.activities.filter(activity => 
      selectedChildIds.includes(activity.childId) &&
      isWithinInterval(activity.date, dateRange)
    );
  }, [data.activities, selectedChildIds, dateRange]);

  const timeByChild = useMemo(() => {
    const childTimes = data.children.map(child => {
      const childActivities = filteredActivities.filter(a => a.childId === child.id);
      const totalHours = childActivities.reduce((sum, activity) => 
        sum + TIME_INTERVAL_HOURS[activity.timeSpent], 0
      );
      return {
        name: child.name,
        hours: totalHours,
        activities: childActivities.length
      };
    });
    return childTimes;
  }, [data.children, filteredActivities]);

  const activityBreakdown = useMemo(() => {
    const categoryTimes: Record<ActivityCategory, number> = {
      'Video Games/Hang': 0,
      'Outdoors': 0,
      'Meal': 0,
      'Date': 0,
      'Adventure': 0,
      'Important Talk': 0
    };

    filteredActivities.forEach(activity => {
      categoryTimes[activity.category] += TIME_INTERVAL_HOURS[activity.timeSpent];
    });

    return Object.entries(categoryTimes).map(([category, hours]) => ({
      name: category,
      value: hours,
      color: ACTIVITY_COLORS[category as ActivityCategory]
    })).filter(item => item.value > 0);
  }, [filteredActivities]);

  const qualityTrend = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayActivities = filteredActivities.filter(activity => 
        activity.date.toDateString() === date.toDateString()
      );
      const averageQuality = dayActivities.length > 0 
        ? dayActivities.reduce((sum, a) => sum + a.qualityRating, 0) / dayActivities.length
        : 0;
      
      last7Days.push({
        date: format(date, 'MMM dd'),
        quality: Math.round(averageQuality * 10) / 10,
        activities: dayActivities.length
      });
    }
    return last7Days;
  }, [filteredActivities]);

  const statistics = useMemo(() => {
    const totalHours = filteredActivities.reduce((sum, activity) => 
      sum + TIME_INTERVAL_HOURS[activity.timeSpent], 0
    );
    const averageQuality = filteredActivities.length > 0 
      ? filteredActivities.reduce((sum, activity) => sum + activity.qualityRating, 0) / filteredActivities.length
      : 0;
    const totalActivities = filteredActivities.length;
    const uniqueDays = new Set(filteredActivities.map(a => a.date.toDateString())).size;

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      averageQuality: Math.round(averageQuality * 10) / 10,
      totalActivities,
      uniqueDays
    };
  }, [filteredActivities]);

  const toggleChildFilter = (childId: string) => {
    setSelectedChildIds(prev => 
      prev.includes(childId) 
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Family Time Analytics</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            {(['daily', 'weekly', 'monthly', 'yearly'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Filter by Children</h3>
          <div className="flex flex-wrap gap-2">
            {data.children.map(child => (
              <button
                key={child.id}
                onClick={() => toggleChildFilter(child.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedChildIds.includes(child.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalHours}h</p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Quality</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.averageQuality}★</p>
            </div>
            <Star className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activities</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalActivities}</p>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Days</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.uniqueDays}</p>
            </div>
            <Calendar className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time by Child Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Time Spent per Child</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeByChild}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} hours`, 'Time']}
                labelFormatter={(label) => `Child: ${label}`}
              />
              <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Activity Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} hours`, 'Time']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-500" size={20} />
            Quality Trend (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value: number) => [`${value} stars`, 'Quality']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {filteredActivities
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5)
            .map(activity => {
              const child = data.children.find(c => c.id === activity.childId);
              return (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ACTIVITY_COLORS[activity.category] }}
                    />
                    <div>
                      <p className="font-medium">{child?.name} - {activity.category}</p>
                      <p className="text-sm text-gray-600">
                        {format(activity.date, 'MMM dd, yyyy')} • {TIME_INTERVAL_HOURS[activity.timeSpent]}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < activity.qualityRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};