import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { TimeLoggingModal } from './components/TimeLoggingModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GamificationPanel } from './components/GamificationPanel';
import { MicroMomentTracker } from './components/MicroMomentTracker';
import { InterestTracker } from './components/InterestTracker';
import { 
  BarChart3, 
  Trophy, 
  Clock, 
  Lightbulb, 
  Plus, 
  Home,
  Menu,
  X
} from 'lucide-react';

type ActiveTab = 'dashboard' | 'analytics' | 'gamification' | 'moments' | 'interests';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
    { id: 'moments', label: 'Micro-Moments', icon: Clock },
    { id: 'interests', label: 'Interests', icon: Lightbulb },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onOpenTimeModal={() => setShowTimeModal(true)} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'gamification':
        return <GamificationPanel />;
      case 'moments':
        return <MicroMomentTracker />;
      case 'interests':
        return <InterestTracker />;
      default:
        return <DashboardOverview onOpenTimeModal={() => setShowTimeModal(true)} />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Family Time Tracker</h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTimeModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus size={16} className="mr-2" />
                  Log Time
                </button>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>

        {/* Time Logging Modal */}
        <TimeLoggingModal 
          isOpen={showTimeModal} 
          onClose={() => setShowTimeModal(false)} 
        />
      </div>
    </DataProvider>
  );
}

// Dashboard Overview Component
const DashboardOverview: React.FC<{ onOpenTimeModal: () => void }> = ({ onOpenTimeModal }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Dad! 👨‍👩‍👧‍👦</h2>
        <p className="text-blue-100 mb-6">Track meaningful moments with Logan, Carter, Blake, and Emma</p>
        <button
          onClick={onOpenTimeModal}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Log Quality Time
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          title="This Week"
          value="12.5h"
          subtitle="Family time logged"
          color="bg-blue-500"
        />
        <QuickStatCard
          title="Quality Score"
          value="4.2★"
          subtitle="Average connection rating"
          color="bg-green-500"
        />
        <QuickStatCard
          title="Streak"
          value="7 days"
          subtitle="Daily connection streak"
          color="bg-purple-500"
        />
        <QuickStatCard
          title="Achievements"
          value="3/12"
          subtitle="Badges unlocked"
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          <ActivityPreviewItem
            child="Logan"
            activity="Video Games/Hang"
            time="1h"
            rating={5}
            date="Today"
          />
          <ActivityPreviewItem
            child="Emma"
            activity="Important Talk"
            time="30min"
            rating={4}
            date="Yesterday"
          />
          <ActivityPreviewItem
            child="Carter & Blake"
            activity="Outdoors"
            time="3h"
            rating={5}
            date="Yesterday"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Log Micro-Moment"
          description="Quick breakfast chat or bedtime story"
          icon="⚡"
          onClick={() => {/* Handle micro-moment */}}
        />
        <QuickActionCard
          title="Complete Routine"
          description="Mark morning or evening routine as done"
          icon="✅"
          onClick={() => {/* Handle routine */}}
        />
        <QuickActionCard
          title="View Progress"
          description="Check achievements and streaks"
          icon="📊"
          onClick={() => {/* Handle progress */}}
        />
      </div>
    </div>
  );
};

const QuickStatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ title, value, subtitle, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
        <div className="w-6 h-6 bg-white rounded-full opacity-30"></div>
      </div>
    </div>
  </div>
);

const ActivityPreviewItem: React.FC<{
  child: string;
  activity: string;
  time: string;
  rating: number;
  date: string;
}> = ({ child, activity, time, rating, date }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div>
        <p className="font-medium text-gray-900">{child} - {activity}</p>
        <p className="text-sm text-gray-600">{date} • {time}</p>
      </div>
    </div>
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow text-left"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);

export default App;
