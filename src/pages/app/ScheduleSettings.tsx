import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import { Calendar, Clock, Instagram, Facebook, Twitter, Linkedin, Save, Plus, Trash2, Info } from 'lucide-react';

interface ScheduleDay {
  day: string;
  enabled: boolean;
  times: string[];
  platforms: string[];
}

const defaultSchedule: ScheduleDay[] = [
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

const ScheduleSettings: React.FC = () => {
  const { currentUser, updateUser, saveUserToDatabase } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleDay[]>(defaultSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load user's schedule if available
    if (currentUser?.postSchedule) {
      try {
        // Convert from saved format to working format
        const userSchedule = defaultSchedule.map(defaultDay => {
          const savedDay = currentUser.postSchedule?.find(d => d.day === defaultDay.day);
          if (savedDay) {
            return {
              ...defaultDay,
              enabled: true,
              times: savedDay.times || [],
              platforms: savedDay.platforms || []
            };
          }
          return {
            ...defaultDay,
            enabled: false,
            times: [],
            platforms: []
          };
        });
        setSchedule(userSchedule);
      } catch (error) {
        console.error('Error loading schedule:', error);
        toast.error('Erro ao carregar seu cronograma de postagem');
      }
    }
  }, [currentUser]);

  const handleDayToggle = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    
    // If enabling a day with no times/platforms, add defaults
    if (newSchedule[index].enabled && newSchedule[index].times.length === 0) {
      newSchedule[index].times = ['12:00'];
      newSchedule[index].platforms = ['Instagram'];
    }
    
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleAddTime = (dayIndex: number) => {
    const newSchedule = [...schedule];
    // Find a time that's not already in the schedule
    const availableTime = availableTimes.find(time => !newSchedule[dayIndex].times.includes(time));
    if (availableTime) {
      newSchedule[dayIndex].times.push(availableTime);
      setSchedule(newSchedule);
      setHasChanges(true);
    } else {
      toast.info('Todos os horários já foram adicionados para este dia.');
    }
  };

  const handleRemoveTime = (dayIndex: number, timeIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].times.splice(timeIndex, 1);
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleTimeChange = (dayIndex: number, timeIndex: number, newTime: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].times[timeIndex] = newTime;
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handlePlatformToggle = (dayIndex: number, platform: string) => {
    const newSchedule = [...schedule];
    const platforms = newSchedule[dayIndex].platforms;
    
    if (platforms.includes(platform)) {
      newSchedule[dayIndex].platforms = platforms.filter(p => p !== platform);
    } else {
      newSchedule[dayIndex].platforms.push(platform);
    }
    
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
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
      
      // Save to database
      const result = await saveUserToDatabase();
      
      if (result.success) {
        toast.success('Cronograma de postagem atualizado com sucesso!');
        setHasChanges(false);
      } else {
        toast.error(result.message || 'Erro ao atualizar cronograma');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Ocorreu um erro ao salvar seu cronograma');
    } finally {
      setIsSaving(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const found = availablePlatforms.find(p => p.id === platform);
    return found ? found.icon : null;
  };

  const getPostsPerWeek = () => {
    let count = 0;
    schedule.forEach(day => {
      if (day.enabled) {
        count += day.times.length * day.platforms.length;
      }
    });
    return count;
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurações de Cronograma</h1>
          <p className="mt-1 text-sm text-gray-500">
            Defina quando e onde você deseja que seu conteúdo seja publicado automaticamente
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cronograma de Postagem</h3>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Sobre o cronograma</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Seu cronograma atual resultará em aproximadamente <strong>{getPostsPerWeek()} posts por semana</strong>. 
                      Recomendamos entre 3-5 posts por semana para manter seu público engajado sem sobrecarregá-lo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
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
                            onClick={() => handlePlatformToggle(dayIndex, platform.id)}
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

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSaving ? (
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
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScheduleSettings;
