import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Palette, Upload } from 'lucide-react';

interface BrandIdentityFormValues {
  brandVoice: string;
  primaryColor: string;
  targetAudience: string;
  logo?: File | null;
}

const BrandIdentitySchema = Yup.object().shape({
  brandVoice: Yup.string().required('Tom de voz é obrigatório'),
  primaryColor: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Formato de cor inválido')
    .required('Cor primária é obrigatória'),
  targetAudience: Yup.string().required('Público-alvo é obrigatório'),
});

const BrandIdentity: React.FC = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSubmit = async (values: BrandIdentityFormValues) => {
    try {
      setIsLoading(true);
      
      // In a real app, we would upload the logo to a storage service
      // and get back a URL to store in the user profile
      let logoUrl = null;
      if (values.logo) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // For demo, we'll just use the preview URL
        logoUrl = logoPreview;
      }
      
      updateUser({
        brandData: {
          brandColors: [values.primaryColor],
          brandVoice: values.brandVoice,
          targetAudience: values.targetAudience,
          logo: logoUrl
        }
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Identidade da marca salva!');
      navigate('/setup/post-schedule');
    } catch (error) {
      toast.error('Falha ao salvar identidade da marca. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue('logo', file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Palette className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Defina a identidade da sua marca
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Essas informações nos ajudam a criar conteúdo que reflete sua marca
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              brandVoice: '',
              primaryColor: '#4F46E5',
              targetAudience: '',
              logo: null
            }}
            validationSchema={BrandIdentitySchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-700">
                    Tom de voz da marca
                  </label>
                  <div className="mt-1">
                    <Field
                      as="select"
                      id="brandVoice"
                      name="brandVoice"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.brandVoice && touched.brandVoice ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                      <option value="">Selecione um tom de voz</option>
                      <option value="Professional">Profissional</option>
                      <option value="Friendly">Amigável</option>
                      <option value="Casual">Casual</option>
                      <option value="Authoritative">Autoritativo</option>
                      <option value="Humorous">Humorístico</option>
                    </Field>
                    <ErrorMessage name="brandVoice" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Cor primária
                  </label>
                  <div className="mt-1 flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: values.primaryColor }}
                    ></div>
                    <Field
                      id="primaryColor"
                      name="primaryColor"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.primaryColor && touched.primaryColor ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="#4F46E5"
                    />
                  </div>
                  <ErrorMessage name="primaryColor" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                    Público-alvo
                  </label>
                  <div className="mt-1">
                    <Field
                      id="targetAudience"
                      name="targetAudience"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.targetAudience && touched.targetAudience ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Ex: Mulheres de 25-45 anos interessadas em bem-estar"
                    />
                    <ErrorMessage name="targetAudience" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo (opcional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {logoPreview ? (
                        <div className="flex flex-col items-center">
                          <img src={logoPreview} alt="Logo preview" className="h-24 w-auto mb-4" />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview(null);
                              setFieldValue('logo', null);
                            }}
                            className="text-sm text-red-600 hover:text-red-500"
                          >
                            Remover
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="logo"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Carregar um arquivo</span>
                              <input
                                id="logo"
                                name="logo"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleLogoChange(e, setFieldValue)}
                              />
                            </label>
                            <p className="pl-1">ou arraste e solte</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF até 2MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/setup/post-schedule')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Pular por enquanto
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : 'Continuar'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BrandIdentity;
