import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { User, Building, Palette, MessageSquare, Target, Globe, Save, Edit, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AppLayout from '../../components/layout/AppLayout';

// Validation schema for profile settings
const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Nome completo é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  businessName: Yup.string().required('Nome da empresa é obrigatório'),
  industry: Yup.string().required('Segmento é obrigatório'),
  subIndustry: Yup.string(),
  description: Yup.string(),
  brandVoice: Yup.string(),
  primaryColor: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida'),
  targetAudience: Yup.string()
});

const Settings: React.FC = () => {
  const { currentUser, updateUser, saveUserToDatabase } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Prepare initial form values from user data
  const initialValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    businessName: currentUser?.businessName || '',
    industry: currentUser?.businessInfo?.industry || '',
    subIndustry: currentUser?.businessInfo?.subIndustry || '',
    description: currentUser?.businessInfo?.description || '',
    brandVoice: currentUser?.brandData?.brandVoice || '',
    primaryColor: currentUser?.brandData?.brandColors?.[0] || '#4F46E5',
    targetAudience: currentUser?.brandData?.targetAudience || ''
  };

  const handleSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      // Update user data in context
      const updatedUser = {
        ...currentUser,
        name: values.name,
        email: values.email,
        businessName: values.businessName,
        businessInfo: {
          industry: values.industry,
          subIndustry: values.subIndustry,
          description: values.description,
          website: currentUser?.businessInfo?.website || ''
        },
        brandData: {
          brandColors: [values.primaryColor],
          brandVoice: values.brandVoice,
          targetAudience: values.targetAudience,
          logo: currentUser?.brandData?.logo || null
        }
      };
      
      updateUser(updatedUser);
      
      // Save to database
      const result = await saveUserToDatabase();
      
      if (result.success) {
        toast.success('Perfil atualizado com sucesso!');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Ocorreu um erro ao salvar seu perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Segurança', icon: <User className="w-5 h-5" /> },
    { id: 'business', label: 'Empresa', icon: <Building className="w-5 h-5" /> },
    { id: 'branding', label: 'Identidade', icon: <Palette className="w-5 h-5" /> },
    { id: 'connections', label: 'Conexões', icon: <Globe className="w-5 h-5" /> }
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie suas informações pessoais, preferências e conexões com redes sociais.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 flex items-center text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Settings Form */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Configurações de Perfil</h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary inline-flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              )}
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={ProfileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, values, setFieldValue, resetForm }) => (
                <Form className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Nome completo
                      </label>
                      {isEditing ? (
                        <>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            className={`form-input ${
                              errors.name && touched.name ? 'border-red-300' : ''
                            }`}
                          />
                          <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                        </>
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      {isEditing ? (
                        <>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className={`form-input ${
                              errors.email && touched.email ? 'border-red-300' : ''
                            }`}
                          />
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                        </>
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="businessName" className="form-label">
                        Nome da empresa
                      </label>
                      {isEditing ? (
                        <>
                          <Field
                            id="businessName"
                            name="businessName"
                            type="text"
                            className={`form-input ${
                              errors.businessName && touched.businessName ? 'border-red-300' : ''
                            }`}
                          />
                          <ErrorMessage name="businessName" component="div" className="mt-1 text-sm text-red-600" />
                        </>
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.businessName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="industry" className="form-label">
                        Segmento
                      </label>
                      {isEditing ? (
                        <>
                          <Field
                            as="select"
                            id="industry"
                            name="industry"
                            className={`form-select ${
                              errors.industry && touched.industry ? 'border-red-300' : ''
                            }`}
                          >
                            <option value="">Selecione um segmento</option>
                            <option value="Technology">Tecnologia</option>
                            <option value="Food & Beverage">Alimentação & Bebidas</option>
                            <option value="Health & Wellness">Saúde & Bem-estar</option>
                            <option value="Education">Educação</option>
                            <option value="Retail">Varejo</option>
                            <option value="Finance">Finanças</option>
                            <option value="Real Estate">Imobiliária</option>
                            <option value="Professional Services">Serviços Profissionais</option>
                          </Field>
                          <ErrorMessage name="industry" component="div" className="mt-1 text-sm text-red-600" />
                        </>
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.industry}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subIndustry" className="form-label">
                        Sub-segmento
                      </label>
                      {isEditing ? (
                        <Field
                          id="subIndustry"
                          name="subIndustry"
                          type="text"
                          className="form-input"
                        />
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.subIndustry || "-"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="brandVoice" className="form-label">
                        Tom de voz
                      </label>
                      {isEditing ? (
                        <Field
                          as="select"
                          id="brandVoice"
                          name="brandVoice"
                          className="form-select"
                        >
                          <option value="">Selecione um tom de voz</option>
                          <option value="Professional">Profissional</option>
                          <option value="Friendly">Amigável</option>
                          <option value="Casual">Casual</option>
                          <option value="Authoritative">Autoritativo</option>
                          <option value="Humorous">Humorístico</option>
                        </Field>
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.brandVoice || "-"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="primaryColor" className="form-label">
                        Cor primária
                      </label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: values.primaryColor }}
                          ></div>
                          <Field
                            id="primaryColor"
                            name="primaryColor"
                            type="text"
                            className={`form-input ${
                              errors.primaryColor && touched.primaryColor ? 'border-red-300' : ''
                            }`}
                          />
                          <ErrorMessage name="primaryColor" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300 mr-2"
                            style={{ backgroundColor: values.primaryColor }}
                          ></div>
                          <span className="py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                            {values.primaryColor}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="targetAudience" className="form-label">
                        Público-alvo
                      </label>
                      {isEditing ? (
                        <Field
                          id="targetAudience"
                          name="targetAudience"
                          type="text"
                          className="form-input"
                        />
                      ) : (
                        <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700">
                          {values.targetAudience || "-"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="form-label">
                      Descrição da empresa
                    </label>
                    {isEditing ? (
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        className="form-textarea"
                      />
                    ) : (
                      <div className="mt-1 py-2 px-3 bg-gray-50 rounded-md text-gray-700 min-h-[100px]">
                        {values.description || "-"}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setIsEditing(false);
                        }}
                        className="btn btn-secondary inline-flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary inline-flex items-center"
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
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Alterações
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Segurança</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Alterar senha</h4>
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="currentPassword" className="form-label">Senha atual</label>
                      <input type="password" id="currentPassword" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="form-label">Nova senha</label>
                      <input type="password" id="newPassword" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="form-label">Confirmar nova senha</label>
                      <input type="password" id="confirmPassword" className="form-input" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">Autenticação de dois fatores</h4>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Proteja sua conta com autenticação de dois fatores</p>
                      </div>
                      <div className="ml-4">
                        <button type="button" className="btn btn-secondary">Configurar</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">Sessões ativas</h4>
                  <div className="mt-4">
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="ml-2 text-sm font-medium text-gray-700">Este dispositivo</span>
                          </div>
                          <span className="text-xs text-gray-500">Ativo agora</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="button" className="btn btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Informações da Empresa</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Detalhes da empresa</h4>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="companyWebsite" className="form-label">Website</label>
                      <input type="text" id="companyWebsite" className="form-input" placeholder="https://exemplo.com" />
                    </div>
                    <div>
                      <label htmlFor="companySize" className="form-label">Tamanho da empresa</label>
                      <select id="companySize" className="form-select">
                        <option value="">Selecione</option>
                        <option value="1-10">1-10 funcionários</option>
                        <option value="11-50">11-50 funcionários</option>
                        <option value="51-200">51-200 funcionários</option>
                        <option value="201-500">201-500 funcionários</option>
                        <option value="501+">501+ funcionários</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="foundedYear" className="form-label">Ano de fundação</label>
                      <input type="number" id="foundedYear" className="form-input" placeholder="2023" />
                    </div>
                    <div>
                      <label htmlFor="location" className="form-label">Localização</label>
                      <input type="text" id="location" className="form-input" placeholder="São Paulo, Brasil" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">Informações fiscais</h4>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="taxId" className="form-label">CNPJ</label>
                      <input type="text" id="taxId" className="form-input" placeholder="00.000.000/0000-00" />
                    </div>
                    <div>
                      <label htmlFor="companyType" className="form-label">Tipo de empresa</label>
                      <select id="companyType" className="form-select">
                        <option value="">Selecione</option>
                        <option value="MEI">MEI</option>
                        <option value="EI">EI</option>
                        <option value="EIRELI">EIRELI</option>
                        <option value="LTDA">LTDA</option>
                        <option value="SA">S/A</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="button" className="btn btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Identidade da Marca</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Logo</h4>
                  <div className="mt-4">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <button type="button" className="btn btn-secondary">Carregar logo</button>
                        <p className="mt-2 text-xs text-gray-500">PNG, JPG ou SVG. Máximo 2MB.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">Cores da marca</h4>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="secondaryColor" className="form-label">Cor secundária</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full border border-gray-300 bg-blue-400"></div>
                        <input type="text" id="secondaryColor" className="form-input" placeholder="#3B82F6" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="accentColor" className="form-label">Cor de destaque</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full border border-gray-300 bg-amber-500"></div>
                        <input type="text" id="accentColor" className="form-input" placeholder="#F59E0B" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">Tipografia</h4>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="primaryFont" className="form-label">Fonte principal</label>
                      <select id="primaryFont" className="form-select">
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="headingFont" className="form-label">Fonte para títulos</label>
                      <select id="headingFont" className="form-select">
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="button" className="btn btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Conexões com Redes Sociais</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">Facebook</h4>
                        <p className="text-sm text-gray-500">Conecte sua página do Facebook</p>
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary">Conectar</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">Instagram</h4>
                        <p className="text-sm text-gray-500">Conecte sua conta do Instagram</p>
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary">Conectar</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">Twitter</h4>
                        <p className="text-sm text-gray-500">Conecte sua conta do Twitter</p>
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary">Conectar</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">LinkedIn</h4>
                        <p className="text-sm text-gray-500">Conecte sua página do LinkedIn</p>
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary">Conectar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Settings;
