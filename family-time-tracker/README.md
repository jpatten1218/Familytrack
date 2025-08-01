# Family Time Tracker

A comprehensive gamified React web application for tracking and enhancing quality time with four children (Logan-11, Carter-9, Blake-7, Emma-5), featuring advanced family time analytics and personalized interaction tracking with relationship health monitoring.

## 🚀 Features

### Core Time Tracking System
- **Predefined time intervals**: 15 minutes, 30 minutes, 1 hour, 3 hours, all day (8+ hours)
- **Six activity categories**: Video Games/Hang, Outdoors, Meal, Date, Adventure, Important Talk
- **Modal-based time logging** with step-by-step selection (child → activity → time → quality rating)
- **Connection quality rating system** (1-5 stars)
- **Sibling time tracking** (individual, group, or specific sibling)
- **Optional notes** for each activity

### Analytics Dashboard
- **Multiple view modes**: Daily, Weekly, Monthly, Yearly
- **Bar charts** showing time per child using Recharts
- **Pie charts** for activity breakdown
- **Statistics cards** showing totals and progress
- **Real-time updates** with data filtering

### Gamification Elements
- **Achievement system** with badges for consistency, creativity, quality, and milestones
- **Streak tracking** for daily connections and quality time
- **Monthly challenges** with progress tracking
- **Dad recognition system** with scoring metrics
- **Badge collection** with unlockable achievements

### Advanced Features
- **Micro-moment tracking** for brief interactions (breakfast, car rides, bedtime, etc.)
- **Routine optimization tracking** (morning, evening, mealtime routines)
- **Interest evolution tracking** for each child
- **Skill building integration** with progress monitoring
- **Personalized recommendations** based on activity patterns

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Context API with useReducer
- **Charts**: Recharts for data visualization
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Build Tool**: Create React App

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd family-time-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎯 Getting Started

1. **Log Your First Activity**: Click the "Log Time" button to open the step-by-step modal
2. **Explore Analytics**: View charts and statistics in the Analytics tab
3. **Check Achievements**: See your progress in the Achievements tab
4. **Track Micro-Moments**: Use the Micro-Moments tab for quick interactions
5. **Monitor Interests**: Use the Interests tab to track evolving child interests

## 📊 Dashboard Overview

The main dashboard provides:
- Welcome section with quick action button
- Statistics cards showing weekly totals, quality scores, streaks, and achievements
- Recent activity preview
- Quick action cards for common tasks

## 🏆 Gamification System

### Achievement Categories
- **Consistency**: Daily connection streaks and routine completion
- **Quality**: High-rating activities and meaningful interactions
- **Creativity**: Diverse activity types and new experiences
- **Milestone**: Total time goals and long-term achievements

### Streak Types
- **Daily Connection**: Spending time with children each day
- **Quality Time**: Maintaining high connection ratings
- **All Children**: Ensuring balanced time with each child

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🎨 Customization

### Adding New Activity Categories
1. Update the `ActivityCategory` type in `src/types/index.ts`
2. Add the new category to `ACTIVITY_CATEGORIES` in `TimeLoggingModal.tsx`
3. Update the color mapping in `ACTIVITY_COLORS` in `AnalyticsDashboard.tsx`

### Adding New Achievements
1. Add the achievement to `initialAchievements` in `DataContext.tsx`
2. Implement the logic to track progress and unlock the achievement

### Customizing Children Data
1. Update the `initialChildren` array in `DataContext.tsx`
2. Modify ages, names, and interests as needed

## 📈 Future Enhancements

- **Data Persistence**: Local storage or cloud database integration
- **Co-parent Coordination**: Shared tracking between parents
- **Export Features**: Data export to PDF or CSV
- **Notification System**: Reminders and achievement notifications
- **Advanced Analytics**: Machine learning insights and recommendations
- **Offline Support**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Recharts for beautiful chart components
- Tailwind CSS for the utility-first styling approach
- Lucide for the beautiful icons
