import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Instagram, Facebook, Twitter, Linkedin, Trash2, Edit, Plus } from 'lucide-react';

interface ScheduledPost {
  id: number;
  content: string;
  date: Date;
  time: string;
  platform: string;
  image?: string;
  status: 'scheduled' | 'published' | 'failed';
}

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock scheduled posts data
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 1,
      content: "Excited to announce our summer sale! 🌞 Get 30% off all products until the end of the month. #SummerSale #Discount",
      date: new Date(),
      time: "10:00 AM",
      platform: "Instagram",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      status: "scheduled"
    },
    {
      id: 2,
      content: "Check out our latest blog post on industry trends for 2023! Link in bio. #IndustryTrends #2023Forecast",
      date: addDays(new Date(), 1),
      time: "2:30 PM",
      platform: "Twitter",
      status: "scheduled"
    },
    {
      id: 3,
      content: "Meet our team! We're a group of passionate individuals dedicated to providing the best service for our customers.",
      date: addDays(new Date(), 2),
      time: "11:15 AM",
      platform: "Facebook",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      status: "scheduled"
    },
    {
      id: 4,
      content: "We're hiring! Join our growing team and be part of something special. Check out our careers page for more information.",
      date: addDays(new Date(), 3),
      time: "9:00 AM",
      platform: "LinkedIn",
      status: "scheduled"
    }
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'LinkedIn':
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      default:
        return <Instagram className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Scheduled
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Published
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const filteredPosts = scheduledPosts.filter(post => 
    isSameDay(post.date, selectedDate)
  );

  const handleDeletePost = (id: number) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Content Schedule</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Post
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Sidebar */}
            <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="mb-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  inline
                  className="w-full"
                />
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Upcoming Posts
                </h3>
                <div className="space-y-3">
                  {scheduledPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex items-center space-x-3 text-sm">
                      <div className="flex-shrink-0">
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">
                          {format(post.date, 'MMM d')} • {post.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts for Selected Date */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Posts for {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map(post => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(post.platform)}
                            <span className="text-sm font-medium text-gray-900">{post.platform}</span>
                          </div>
                          {getStatusBadge(post.status)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{format(post.date, 'MMMM d, yyyy')}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.time}</span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-gray-800">{post.content}</p>
                        </div>
                        
                        {post.image && (
                          <div className="mt-2 mb-3">
                            <img
                              src={post.image}
                              alt="Post"
                              className="h-40 w-full object-cover rounded-md"
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2 mt-4">
                          <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No posts scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new post for this date.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Schedule;
