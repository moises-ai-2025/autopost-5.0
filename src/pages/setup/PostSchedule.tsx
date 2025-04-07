import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, Instagram, Facebook, Twitter, Linkedin, Save, Plus, Trash2 } from 'lucide-react';

interface ScheduleDay {
  day: string;
  enabled: boolean;
  times: string[];
  platforms: string[];
}

const initialSchedule: ScheduleDay[] = [
  { day: 'Segunda', enabled: true, times: ['10:00'], platforms: ['Instagram'] },
  { day: 'Terça', enabled: true, times: ['14:00'], platforms: ['Facebook'] },
  { day: 'Quarta', enabled: true, times: ['12:00'], platforms: ['Instagram'] },
  { day: 'Quinta', enabled: true, times: ['16:00'], platforms: ['Twitter'] },
  { day: 'Sexta', enabled: true, times: ['11:00'], platforms: ['Instagram', 'Facebook'] },
  { day: 'Sábado', enabled: false, times: [], platforms: [] },
  { day: 'Domingo', enabled: false, times: [], platforms: [] },
];

const availablePlatforms = [
  { id: 'Instagram', name: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
  { id: 'Facebook', name: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
  { id: 'Twitter', name: 'Twitter', icon: <Twitter className="h-5 w-5" /> },
  { id: 'LinkedIn', name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" /> },
];

const availableTimes = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const PostSchedule: React.FC = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ScheduleDay[]>(initialSchedule);
  const [isLoading, setIsLoading] = useState(false);

  const handleDayToggle = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    
    // If enabling a day with no times/platforms, add defaults
    if (newSchedule[index].enabled && newSchedule[index].times.length === 0) {
      newSchedule[index].times = ['12:00'];
      newSchedule[index].platforms = ['Instagram'];
    }
    
    setSchedule(newSchedule);
  };

  const handleAddTime = (dayIndex: number) => {
    const newSchedule = [...schedule];
    // Find a time that's not already in the schedule
    const availableTime = availableTimes.find(time => !newSchedule[dayIndex].times.includes(time));
    if (availableTime) {
      newSchedule[dayIndex].times.push(availableTime);
      setSchedule(newSchedule);
    } else {
      toast.info('Todos os horários já foram adicionados para este dia.');
    }
  };

  const handleRemoveTime = (dayIndex: number, timeIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].times.splice(timeIndex, 1);
    setSchedule(newSchedule);
  };

  const handleTimeChange = (dayIndex: number, timeIndex: number, newTime: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].times[timeIndex] = newTime;
    setSchedule(newSchedule);
  };

  const handlePlatformToggle = (dayIndex: number, timeIndex: number, platform: string) => {
    const newSchedule = [...schedule];
    const platforms = newSchedule[dayIndex].platforms;
    
    // If this is for a specific time slot (future enhancement)
    // For now, we're just toggling platforms for the whole day
    if (platforms.includes(platform)) {
      newSchedule[dayIndex].platforms = platforms.filter(p => p !== platform);
    } else {
      newSchedule[dayIndex].platforms.push(platform);
    }
    
    setSchedule(newSchedule);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Filter out disabled days and days with no times
      const activeSchedule = schedule
        .filter(day => day.enabled && day.times.length > 0)
        .map(day => ({
          day: day.day,
          times: day.times,
          platforms: day.platforms
        }));
      
      // Update user with schedule data
      updateUser({ 
        postSchedule: activeSchedule
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cronograma de postagem salvo com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao salvar cronograma. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const getPlatformIcon = (platform: string) => {
    const found = availablePlatforms.find(p => p.id === platform);
    return found ? found.icon : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configure seu cronograma de postagem
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Defina quando e onde você deseja que seu conteúdo seja publicado
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {schedule.map((day, dayIndex) => (
              <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`day-${dayIndex}`}
                      checked={day.enabled}
                      onChange={() => handleDayToggle(dayIndex)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`day-${dayIndex}`} className="ml-2 block text-sm font-medium text-gray-700">
                      {day.day}
                    </label>
                  </div>
                  
                  {day.enabled && (
                    <div className="flex space-x-2">
                      {day.platforms.map((platform) => (
                        <div key={platform} className="flex items-center">
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {day.enabled && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {availablePlatforms.map((platform) => (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => handlePlatformToggle(dayIndex, 0, platform.id)}
                          className={`inline-flex items-center px-3 py-1.5 border ${
                            day.platforms.includes(platform.id)
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          } rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          <span className="mr-1.5">{platform.icon}</span>
                          {platform.name}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Horários</label>
                      
                      {day.times.map((time, timeIndex) => (
                        <div key={timeIndex} className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <select
                            value={time}
                            onChange={(e) => handleTimeChange(dayIndex, timeIndex, e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            {availableTimes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveTime(dayIndex, timeIndex)}
                            className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => handleAddTime(dayIndex)}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar horário
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Pular por enquanto
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar e continuar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSchedule;
