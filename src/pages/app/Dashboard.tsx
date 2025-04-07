import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Image, Calendar, Zap, TrendingUp, Users, ArrowRight, Clock, BarChart2, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Mock data for dashboard
  const stats = [
    { name: 'Total Posts', value: '24', icon: <Image className="h-6 w-6 text-indigo-600" />, change: '+12% from last month' },
    { name: 'Scheduled', value: '12', icon: <Calendar className="h-6 w-6 text-green-600" />, change: '5 posts this week' },
    { name: 'Engagement Rate', value: '3.2%', icon: <TrendingUp className="h-6 w-6 text-blue-600" />, change: '+0.8% from last month' },
    { name: 'Audience Growth', value: '+5%', icon: <Users className="h-6 w-6 text-purple-600" />, change: '152 new followers' },
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Summer Sale Announcement',
      platform: 'Instagram',
      date: '2 days ago',
      engagement: '245 likes',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'New Product Launch',
      platform: 'Facebook',
      date: '5 days ago',
      engagement: '32 shares',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'Customer Testimonial',
      platform: 'LinkedIn',
      date: '1 week ago',
      engagement: '18 comments',
      image: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVzdGltb25pYWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    },
  ];

  const contentIdeas = [
    'Share a behind-the-scenes look at your business',
    'Create a how-to guide related to your products',
    'Highlight a customer success story',
    'Share industry news or trends',
    'Run a poll or quiz to engage your audience'
  ];

  const upcomingPosts = [
    { title: 'Weekly Product Spotlight', platform: 'Instagram', date: 'Tomorrow, 10:00 AM' },
    { title: 'Customer Success Story', platform: 'LinkedIn', date: 'Wednesday, 2:00 PM' },
    { title: 'Weekend Special Offer', platform: 'Facebook', date: 'Friday, 9:00 AM' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {currentUser?.name || 'User'}!
              </h1>
              <p className="mt-1 text-gray-500">
                Here's what's happening with your social media content.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/content"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Create new content
                <Plus className="ml-2 -mr-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg bg-gray-50">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Posts */}
          <div className="lg:col-span-2 bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
              <Link
                to="/content"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-5">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 rounded-md object-cover shadow-sm"
                      src={post.image}
                      alt={post.title}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{post.platform}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.date}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <BarChart2 className="h-3 w-3 mr-1" />
                        {post.engagement}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Upcoming Posts */}
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h2>
              <div className="space-y-4">
                {upcomingPosts.map((post, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="text-xs font-medium text-indigo-600">{post.platform}</span>
                        <span className="mx-1">•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  to="/schedule"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  View schedule
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Content Ideas */}
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Ideas</h2>
              <ul className="space-y-3">
                {contentIdeas.map((idea, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{idea}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Link
                  to="/content"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Generate more ideas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
