import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Image, Calendar, Zap, Sparkles, Loader2, Check, X, AlertCircle, Maximize2 } from 'lucide-react';
import axios from 'axios';

const CONTENT_GENERATION_ENDPOINT = 'https://n8n-blue.up.railway.app/webhook/7edfffa8-1ff8-4fa1-a3ef-a1509c4443f2';

const ContentGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [contentType, setContentType] = useState('post');
  const [contentTopic, setContentTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: <Image className="h-5 w-5" /> },
    { id: 'facebook', name: 'Facebook', icon: <Image className="h-5 w-5" /> },
    { id: 'twitter', name: 'Twitter', icon: <Image className="h-5 w-5" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <Image className="h-5 w-5" /> }
  ];

  const contentTypes = [
    { id: 'post', name: 'Post' },
    { id: 'story', name: 'Story' },
    { id: 'carousel', name: 'Carousel' },
    { id: 'video', name: 'Video Script' }
  ];

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  const handleGenerate = async () => {
    // Reset any previous errors
    setError(null);
    setIsGenerating(true);
    setGeneratedContent([]); // Clear previous content
    
    try {
      // Prepare the data to send to the API
      const requestData = {
        platforms: selectedPlatforms,
        contentType: contentType,
        topic: contentTopic
      };
      
      console.log('Sending content generation request:', requestData);
      
      // Make the API call with NO timeout
      const response = await axios.post(CONTENT_GENERATION_ENDPOINT, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
        // No timeout specified - will wait indefinitely
      });
      
      console.log('Content generation response:', response.data);
      
      // Handle the response
      if (response.data) {
        // Check if the response contains an image URL
        if (typeof response.data === 'string' && response.data.startsWith('http')) {
          // If the response is just a URL string
          const newContent = {
            id: Date.now(),
            platform: selectedPlatforms[0],
            type: contentType,
            content: `Generated content about "${contentTopic}" for ${selectedPlatforms.join(', ')} as a ${contentType}.`,
            image: response.data
          };
          setGeneratedContent([newContent]);
        } else if (response.data.imageUrl && typeof response.data.imageUrl === 'string') {
          // If the response has an imageUrl property
          const newContent = {
            id: Date.now(),
            platform: selectedPlatforms[0],
            type: contentType,
            content: response.data.content || `Generated content about "${contentTopic}"`,
            image: response.data.imageUrl
          };
          setGeneratedContent([newContent]);
        } else if (response.data.image && typeof response.data.image === 'string') {
          // If the response has an image property
          const newContent = {
            id: Date.now(),
            platform: selectedPlatforms[0],
            type: contentType,
            content: response.data.content || `Generated content about "${contentTopic}"`,
            image: response.data.image
          };
          setGeneratedContent([newContent]);
        } else if (Array.isArray(response.data.content)) {
          // If the response has a content array
          setGeneratedContent(response.data.content);
        } else if (response.data.content) {
          // If the response has a content object but not in array format
          const contentItem = response.data.content;
          if (typeof contentItem === 'object') {
            setGeneratedContent([contentItem]);
          } else {
            // If content is just a string, create a content object
            const newContent = {
              id: Date.now(),
              platform: selectedPlatforms[0],
              type: contentType,
              content: contentItem,
              image: response.data.imageUrl || response.data.image
            };
            setGeneratedContent([newContent]);
          }
        } else {
          // If we can't determine the structure, use the whole response as content
          const newContent = {
            id: Date.now(),
            platform: selectedPlatforms[0],
            type: contentType,
            content: JSON.stringify(response.data),
            image: null
          };
          setGeneratedContent([newContent]);
        }
      } else {
        // Fallback to mock data if the API doesn't return anything
        const mockGeneratedContent = [
          {
            id: Date.now(),
            platform: selectedPlatforms[0],
            type: contentType,
            content: `Generated content about "${contentTopic}" for ${selectedPlatforms.join(', ')} as a ${contentType}.`,
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyJTIwZmFzaGlvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
          }
        ];
        
        setGeneratedContent(mockGeneratedContent);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = (contentId: number) => {
    // Implement save functionality
    console.log('Saving content:', contentId);
  };

  const handleScheduleContent = (contentId: number) => {
    // Implement schedule functionality
    console.log('Scheduling content:', contentId);
  };

  const handleExpandImage = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Content Generator</h1>
          <p className="mt-1 text-gray-500">
            Create engaging content for your social media platforms.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Content Generation Form */}
          <div className="lg:col-span-1 bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Content</h2>
            
            <div className="space-y-5">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2">{platform.icon}</span>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setContentType(type.id)}
                      className={`inline-flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                        contentType === type.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Topic or Theme
                </label>
                <textarea
                  id="topic"
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="What would you like to post about? (e.g., Summer collection, Product launch, etc.)"
                  value={contentTopic}
                  onChange={(e) => setContentTopic(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || selectedPlatforms.length === 0 || !contentTopic}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Content */}
          <div className="lg:col-span-2 bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h2>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
                <p className="text-gray-500">Generating creative content and images for you...</p>
                <p className="text-gray-400 text-sm mt-2">This may take up to 5 minutes as we create high-quality images.</p>
              </div>
            ) : generatedContent.length > 0 ? (
              <div className="space-y-6">
                {generatedContent.map((content, index) => (
                  <div key={content.id || index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {content.platform || selectedPlatforms[0]}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {content.type || contentType}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveContent(content.id || index)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => handleScheduleContent(content.id || index)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row">
                        {content.image && (
                          <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
                            <div className="relative group">
                              <img
                                src={content.image}
                                alt="Content preview"
                                className="w-full h-auto object-cover rounded-md cursor-pointer transition-all duration-200 hover:opacity-95"
                                style={{ minHeight: "200px", maxHeight: "300px" }}
                                onClick={() => handleExpandImage(content.image)}
                                onError={(e) => {
                                  console.error('Image failed to load:', content.image);
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                }}
                              />
                              <button 
                                className="absolute top-2 right-2 p-1 bg-white bg-opacity-75 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => handleExpandImage(content.image)}
                              >
                                <Maximize2 className="h-4 w-4 text-gray-700" />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className={content.image ? "md:w-1/2" : "w-full"}>
                          <p className="text-gray-700 text-sm">{content.content}</p>
                          <div className="mt-4 flex space-x-2">
                            <button className="text-xs text-indigo-600 hover:text-indigo-500">
                              Edit
                            </button>
                            <button className="text-xs text-gray-500 hover:text-gray-700">
                              Regenerate
                            </button>
                            <button className="text-xs text-red-600 hover:text-red-500">
                              Discard
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No content generated yet</h3>
                <p className="text-gray-500 max-w-md">
                  Select your platforms, content type, and topic, then click "Generate Content" to create engaging social media content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={handleCloseExpandedImage}>
          <div className="relative max-w-4xl max-h-screen w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
              onClick={handleCloseExpandedImage}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={expandedImage} 
              alt="Expanded content" 
              className="max-h-[90vh] max-w-full object-contain mx-auto rounded-lg"
              onError={(e) => {
                console.error('Expanded image failed to load:', expandedImage);
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
              }}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ContentGenerator;
