import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Image } from 'lucide-react';

interface BusinessInfoFormValues {
  businessName: string;
  industry: string;
  description: string;
  website: string;
  subIndustry?: string;
}

const BusinessInfoSchema = Yup.object().shape({
  businessName: Yup.string().required('Nome do negócio é obrigatório'),
  industry: Yup.string().required('Indústria é obrigatória'),
  description: Yup.string().required('Descrição é obrigatória'),
  website: Yup.string().url('Formato de URL inválido').notRequired(),
  subIndustry: Yup.string().notRequired()
});

const industries = [
  'Retail',
  'Food & Beverage',
  'Health & Wellness',
  'Professional Services',
  'Technology',
  'Education',
  'Real Estate',
  'Beauty & Personal Care',
  'Home Services',
  'Travel & Hospitality',
  'Entertainment',
  'Other'
];

const BusinessInfo: React.FC = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: BusinessInfoFormValues) => {
    try {
      setIsLoading(true);
      updateUser({ 
        businessName: values.businessName,
        businessInfo: {
          industry: values.industry,
          subIndustry: values.subIndustry,
          description: values.description,
          website: values.website
        }
      });
      
      // In a real app, we would save all the business info to the backend
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Informações do negócio salvas!');
      navigate('/setup/brand-identity');
    } catch (error) {
      toast.error('Falha ao salvar informações do negócio. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Conte-nos sobre seu negócio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Essas informações nos ajudam a personalizar sua experiência
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              businessName: '',
              industry: '',
              subIndustry: '',
              description: '',
              website: ''
            }}
            validationSchema={BusinessInfoSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Nome do negócio
                  </label>
                  <div className="mt-1">
                    <Field
                      id="businessName"
                      name="businessName"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.businessName && touched.businessName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    <ErrorMessage name="businessName" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Segmento
                  </label>
                  <div className="mt-1">
                    <Field
                      as="select"
                      id="industry"
                      name="industry"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.industry && touched.industry ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                      <option value="">Selecione um segmento</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="industry" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subIndustry" className="block text-sm font-medium text-gray-700">
                    Sub-segmento (opcional)
                  </label>
                  <div className="mt-1">
                    <Field
                      id="subIndustry"
                      name="subIndustry"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.subIndustry && touched.subIndustry ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Ex: Software B2B, Restaurante Italiano, etc."
                    />
                    <ErrorMessage name="subIndustry" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição do negócio
                  </label>
                  <div className="mt-1">
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={4}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.description && touched.description ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Descreva brevemente o que seu negócio faz..."
                    />
                    <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website (opcional)
                  </label>
                  <div className="mt-1">
                    <Field
                      id="website"
                      name="website"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.website && touched.website ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="https://example.com"
                    />
                    <ErrorMessage name="website" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
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

export default BusinessInfo;
