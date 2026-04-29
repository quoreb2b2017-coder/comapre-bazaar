// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import { 
  CheckCircle, 
  ChevronDown, 
  Phone, 
  Shield, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  ArrowRight,
  Target,
  Users,
  Star,
  Award,
  Sparkles,
  Headphones,
  Activity,
  Video,
  MessageSquare,
  Rocket,
  Heart,
  Gift,
  Monitor,
  Calendar
} from 'lucide-react';

const CallCenterGetQuotesForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    employeeCount: '',
    agentCount: '',
    currentSystem: '',
    monthlyCallVolume: '',
    importantFeatures: [],
    industry: '',
    emailUpdates: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    document.title = "Get Call Center Management Software Quotes | Compare-Bazaar";
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCheckboxChange = (feature) => {
    setFormData({
      ...formData,
      importantFeatures: formData.importantFeatures.includes(feature)
        ? formData.importantFeatures.filter(f => f !== feature)
        : [...formData.importantFeatures, feature]
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please complete this required field.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Please complete this required field.';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Please complete this required field.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please complete this required field.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please complete this required field.';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Please complete this required field.';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit zip code.';
    }
    if (!formData.employeeCount) {
      newErrors.employeeCount = 'Please complete this required field.';
    }
    if (!formData.agentCount) {
      newErrors.agentCount = 'Please complete this required field.';
    }
    if (!formData.currentSystem) {
      newErrors.currentSystem = 'Please complete this required field.';
    }
    if (!formData.monthlyCallVolume) {
      newErrors.monthlyCallVolume = 'Please complete this required field.';
    }
    if (!formData.industry) {
      newErrors.industry = 'Please complete this required field.';
    }
    // reCAPTCHA is always required
    if (!captchaValue) {
      newErrors.captcha = 'Please verify that you\'re not a robot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Explicit check: reCAPTCHA must be completed
    if (!captchaValue) {
      setErrors({
        ...errors,
        captcha: 'Please verify that you\'re not a robot.'
      });
      return;
    }
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        alert('Form submission is not configured. Please contact support.');
        setIsSubmitting(false);
        return;
      }
      
      const submissionData = {
        access_key: accessKey,
        subject: 'Call Center Management Software Quote Request - Compare-Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phoneNumber,
        zip_code: formData.zipCode,
        employee_count: formData.employeeCount,
        agent_count: formData.agentCount,
        current_system: formData.currentSystem,
        monthly_call_volume: formData.monthlyCallVolume,
        important_features: formData.importantFeatures.join(', '),
        industry: formData.industry,
        email_updates: formData.emailUpdates ? 'Yes' : 'No',
        form_source: 'Call Center Management Software - Get Quotes (Compare-Bazaar)',
        captcha_token: captchaValue
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
          phoneNumber: '',
          zipCode: '',
          employeeCount: '',
          agentCount: '',
          currentSystem: '',
          monthlyCallVolume: '',
          importantFeatures: [],
          industry: '',
          emailUpdates: false
        });
        setCaptchaValue(null);
        if (captchaRef.current) {
          captchaRef.current.reset();
        }
        setErrors({});
      } else {
        alert('Sorry, there was a problem submitting your information. Please try again later.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Sorry, there was a problem submitting your information. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const importantFeatures = [
    { id: 'ivr', label: 'IVR & Call Routing', icon: <Phone className="w-5 h-5" /> },
    { id: 'recording', label: 'Call Recording & Monitoring', icon: <Monitor className="w-5 h-5" /> },
    { id: 'analytics', label: 'Real-time Analytics & Reporting', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'omnichannel', label: 'Omnichannel Support', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'workforce', label: 'Workforce Management', icon: <Users className="w-5 h-5" /> },
    { id: 'integrations', label: 'CRM & Third-party Integrations', icon: <Activity className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Main Content Section - Two Column Layout */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 py-8 md:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8633]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#000e54]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-stretch">
            
            {/* Left Side - Form */}
            <div className="order-1 lg:order-1 flex">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl w-full flex flex-col h-full">
                {/* Header Section */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <div className="inline-block mb-4">
                    <span className="bg-gradient-to-r from-[#ff8633] to-orange-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                      Get Free Quotes
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Find Your Perfect Call Center Solution
                  </h1>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Connect with top call center management providers. Compare features, pricing, and find the ideal call center software to enhance customer service and boost agent productivity.
                  </p>
                </div>

                {showSuccess && (
                  <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-4 shadow-lg animate-fadeIn">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-semibold text-green-800">Thank you!</h3>
                        <p className="mt-1 text-sm text-green-700">
                          Your submission has been received. We will get back to you soon with your free quotes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                  {/* First Name and Last Name in One Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="firstName" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                            bg-white transition-all duration-300 ease-in-out
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            ${errors.firstName 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'firstName' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                          placeholder="John"
                        />
                        {focusedField === 'firstName' && !errors.firstName && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                        )}
                      </div>
                      {errors.firstName && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="lastName" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                            bg-white transition-all duration-300 ease-in-out
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            ${errors.lastName 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'lastName' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                          placeholder="Doe"
                        />
                        {focusedField === 'lastName' && !errors.lastName && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                        )}
                      </div>
                      {errors.lastName && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="group">
                    <label htmlFor="companyName" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('companyName')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                          bg-white transition-all duration-300 ease-in-out
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          ${errors.companyName 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'companyName' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                        placeholder="Enter your company name"
                      />
                      {focusedField === 'companyName' && !errors.companyName && (
                        <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                      )}
                    </div>
                    {errors.companyName && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Business Email */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                          bg-white transition-all duration-300 ease-in-out
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          ${errors.email 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'email' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                        placeholder="john.doe@company.com"
                      />
                      {focusedField === 'email' && !errors.email && (
                        <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.email}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                      By entering your email above, you consent to receive marketing emails from compare-bazaar.com
                    </p>
                  </div>

                  {/* Phone Number and Zip Code in One Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('phoneNumber')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                            bg-white transition-all duration-300 ease-in-out
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            ${errors.phoneNumber 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'phoneNumber' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                          placeholder="(555) 123-4567"
                        />
                        {focusedField === 'phoneNumber' && !errors.phoneNumber && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                        )}
                      </div>
                      {errors.phoneNumber && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="zipCode" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Business Zip Code <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('zipCode')}
                          onBlur={() => setFocusedField(null)}
                          maxLength="5"
                          className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
                            bg-white transition-all duration-300 ease-in-out
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            ${errors.zipCode 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'zipCode' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                          placeholder="12345"
                        />
                        {focusedField === 'zipCode' && !errors.zipCode && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                        )}
                      </div>
                      {errors.zipCode && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Number of Employees and Agent Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="employeeCount" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Number of Employees <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="employeeCount"
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={(e) => handleSelectChange('employeeCount', e.target.value)}
                          onFocus={() => setFocusedField('employeeCount')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                            transition-all duration-300 ease-in-out cursor-pointer
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            appearance-none
                            ${errors.employeeCount 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'employeeCount' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                        >
                          <option value="">Select number of employees</option>
                          <option value="1 - 10">1 - 10</option>
                          <option value="11 - 50">11 - 50</option>
                          <option value="51 - 200">51 - 200</option>
                          <option value="201 - 500">201 - 500</option>
                          <option value="500+">500+</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'employeeCount' ? 'text-[#ff8633] rotate-180' : ''}`} />
                        </div>
                      </div>
                      {errors.employeeCount && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.employeeCount}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="agentCount" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Number of Call Center Agents <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="agentCount"
                          name="agentCount"
                          value={formData.agentCount}
                          onChange={(e) => handleSelectChange('agentCount', e.target.value)}
                          onFocus={() => setFocusedField('agentCount')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                            transition-all duration-300 ease-in-out cursor-pointer
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            appearance-none
                            ${errors.agentCount 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'agentCount' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                        >
                          <option value="">Select number of agents</option>
                          <option value="1 - 5">1 - 5 agents</option>
                          <option value="6 - 10">6 - 10 agents</option>
                          <option value="11 - 25">11 - 25 agents</option>
                          <option value="26 - 50">26 - 50 agents</option>
                          <option value="50+">50+ agents</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'agentCount' ? 'text-[#ff8633] rotate-180' : ''}`} />
                        </div>
                      </div>
                      {errors.agentCount && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.agentCount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Current System and Monthly Call Volume */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="currentSystem" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Current Call Center System <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="currentSystem"
                          name="currentSystem"
                          value={formData.currentSystem}
                          onChange={(e) => handleSelectChange('currentSystem', e.target.value)}
                          onFocus={() => setFocusedField('currentSystem')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                            transition-all duration-300 ease-in-out cursor-pointer
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            appearance-none
                            ${errors.currentSystem 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'currentSystem' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                        >
                          <option value="">Select option</option>
                          <option value="No system currently">No system currently</option>
                          <option value="Using basic phone system">Using basic phone system</option>
                          <option value="Have call center software but want to switch">Have call center software but want to switch</option>
                          <option value="Looking to upgrade current system">Looking to upgrade current system</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'currentSystem' ? 'text-[#ff8633] rotate-180' : ''}`} />
                        </div>
                      </div>
                      {errors.currentSystem && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.currentSystem}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="monthlyCallVolume" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                        Monthly Call Volume <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="monthlyCallVolume"
                          name="monthlyCallVolume"
                          value={formData.monthlyCallVolume}
                          onChange={(e) => handleSelectChange('monthlyCallVolume', e.target.value)}
                          onFocus={() => setFocusedField('monthlyCallVolume')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                            transition-all duration-300 ease-in-out cursor-pointer
                            focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                            hover:border-gray-400 hover:shadow-md
                            appearance-none
                            ${errors.monthlyCallVolume 
                              ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                              : 'border-gray-300'
                            }
                            ${focusedField === 'monthlyCallVolume' ? 'shadow-lg scale-[1.01]' : ''}
                          `}
                        >
                          <option value="">Select range</option>
                          <option value="0 - 500 calls">0 - 500 calls/month</option>
                          <option value="501 - 1,000 calls">501 - 1,000 calls/month</option>
                          <option value="1,001 - 5,000 calls">1,001 - 5,000 calls/month</option>
                          <option value="5,001 - 10,000 calls">5,001 - 10,000 calls/month</option>
                          <option value="10,000+ calls">10,000+ calls/month</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'monthlyCallVolume' ? 'text-[#ff8633] rotate-180' : ''}`} />
                        </div>
                      </div>
                      {errors.monthlyCallVolume && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.monthlyCallVolume}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="group">
                    <label htmlFor="industry" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={(e) => handleSelectChange('industry', e.target.value)}
                        onFocus={() => setFocusedField('industry')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                          transition-all duration-300 ease-in-out cursor-pointer
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          appearance-none
                          ${errors.industry 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'industry' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select your industry</option>
                        <option value="Customer Service">Customer Service</option>
                        <option value="Sales">Sales</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Technology">Technology</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'industry' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                    </div>
                    {errors.industry && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.industry}
                      </p>
                    )}
                  </div>

                  {/* Important Features */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-800 mb-3 transition-colors group-focus-within:text-[#ff8633]">
                      Important Features (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {importantFeatures.map((feature) => (
                        <label
                          key={feature.id}
                          className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            formData.importantFeatures.includes(feature.id)
                              ? 'border-[#ff8633] bg-orange-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.importantFeatures.includes(feature.id)}
                            onChange={() => handleCheckboxChange(feature.id)}
                            className="sr-only"
                          />
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3 mt-0.5 ${
                            formData.importantFeatures.includes(feature.id)
                              ? 'border-[#ff8633] bg-[#ff8633]'
                              : 'border-gray-300'
                          }`}>
                            {formData.importantFeatures.includes(feature.id) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`inline-flex p-2 rounded-lg mb-2 ${
                              formData.importantFeatures.includes(feature.id)
                                ? 'bg-gradient-to-r from-[#ff8633] to-orange-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {feature.icon}
                            </div>
                            <p className={`text-xs font-semibold ${
                              formData.importantFeatures.includes(feature.id)
                                ? 'text-gray-900'
                                : 'text-gray-700'
                            }`}>
                              {feature.label}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email Updates Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl border border-orange-200">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={formData.emailUpdates}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-[#ff8633] border-gray-300 rounded focus:ring-[#ff8633] cursor-pointer"
                    />
                    <label htmlFor="emailUpdates" className="text-sm text-gray-700 cursor-pointer">
                      I'd like to receive email updates about call center solutions and best practices.
                    </label>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="pt-2">
                    <div className="flex justify-start">
                      <ReCAPTCHA
                        ref={captchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                        onChange={(value) => setCaptchaValue(value)}
                      />
                    </div>
                    {errors.captcha && (
                      <p className="mt-2 text-sm text-red-600 font-medium text-left">{errors.captcha}</p>
                    )}
                  </div>

                  {/* Consent Text */}
                  <div className="pt-2">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By clicking "Get Free Quotes" below, I consent to receive from compare-bazaar.com at any time SMS text messages and I also consent to receive from compare-bazaar.com and up to five service providers at any time emails, telemarketing calls using auto-dialer, artificial voices or pre-recordings, which could result in wireless charges, at the number provided above. I understand that consent is not a condition of purchase. I also agree to the{' '}
                      <Link href="/terms-of-use" className="text-[#ff8633] hover:underline font-semibold">Terms & Conditions</Link>
                      {' '}and{' '}
                      <Link href="/privacy-policy" className="text-[#ff8633] hover:underline font-semibold">Privacy Policy</Link>
                      , which are also linked at the bottom of the page.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#ff8633] to-orange-600 text-white font-bold text-base rounded-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Free Quotes
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Enhanced Dashboard with Brand Colors */}
            <div className="order-2 lg:order-2 flex">
              <div className="bg-gradient-to-br from-[#000e54] via-blue-900 to-[#000e54] rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-blue-800/30 backdrop-blur-sm w-full flex flex-col h-full text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8633]/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#000e54]/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff8633] to-orange-600 rounded-2xl mb-4 shadow-xl">
                      <Headphones className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                      Transform Your Call Center Operations
                    </h2>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      Discover powerful call center management platforms that help you improve customer satisfaction, reduce handle times, and boost agent productivity with advanced features.
                    </p>
                  </div>

                  {/* Key Benefits Section */}
                  <div className="bg-gradient-to-r from-[#ff8633]/20 to-orange-600/20 rounded-xl p-4 mb-5 border border-[#ff8633]/30">
                    <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Why Choose Compare Bazaar?
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff8633]"></div>
                        <p className="text-sm text-blue-100">Compare 20+ top call center software providers</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff8633]"></div>
                        <p className="text-sm text-blue-100">Get personalized recommendations based on your call volume</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff8633]"></div>
                        <p className="text-sm text-blue-100">Free quotes with no obligation to purchase</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff8633]"></div>
                        <p className="text-sm text-blue-100">Expert guidance from call center specialists</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl font-bold text-[#ff8633] mb-1">1,800+</div>
                      <div className="text-xs text-blue-200">Call Centers Served</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl font-bold text-[#ff8633] mb-1">97%</div>
                      <div className="text-xs text-blue-200">Satisfaction Rate</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl font-bold text-[#ff8633] mb-1">20+</div>
                      <div className="text-xs text-blue-200">Software Options</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl font-bold text-[#ff8633] mb-1">24/7</div>
                      <div className="text-xs text-blue-200">Expert Support</div>
                    </div>
                  </div>

                  {/* Top Call Center Features */}
                  <div className="mb-5">
                    <h3 className="text-lg font-bold mb-3 text-white">Top Call Center Features</h3>
                    <div className="space-y-2">
                      {[
                        { icon: <Phone className="w-5 h-5" />, text: 'IVR & Smart Routing', benefit: 'Route calls efficiently', color: 'from-blue-400 to-cyan-500' },
                        { icon: <Monitor className="w-5 h-5" />, text: 'Call Recording', benefit: 'Monitor quality 100%', color: 'from-purple-400 to-pink-500' },
                        { icon: <BarChart3 className="w-5 h-5" />, text: 'Real-time Analytics', benefit: 'Track performance metrics', color: 'from-green-400 to-emerald-500' },
                        { icon: <MessageSquare className="w-5 h-5" />, text: 'Omnichannel Support', benefit: 'Email, chat, phone unified', color: 'from-yellow-400 to-orange-500' },
                        { icon: <Users className="w-5 h-5" />, text: 'Workforce Management', benefit: 'Optimize agent schedules', color: 'from-red-400 to-pink-500' },
                        { icon: <Activity className="w-5 h-5" />, text: 'CRM Integrations', benefit: 'Seamless data sync', color: 'from-indigo-400 to-blue-500' }
                      ].map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 group"
                        >
                          <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-semibold">{feature.text}</p>
                            <p className="text-xs text-blue-300">{feature.benefit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="mb-5">
                    <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-[#ff8633]" />
                      How It Works
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#ff8633]/20 to-orange-600/20 rounded-lg border border-[#ff8633]/30">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-[#ff8633] to-orange-600 flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <p className="text-sm text-white font-semibold mb-1">Submit Your Requirements</p>
                          <p className="text-xs text-blue-200">Tell us about your call center needs and current operations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg border border-blue-500/30">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <p className="text-sm text-white font-semibold mb-1">Get Matched Instantly</p>
                          <p className="text-xs text-blue-200">Our system matches you with 3-5 perfect call center software providers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <p className="text-sm text-white font-semibold mb-1">Compare & Choose</p>
                          <p className="text-xs text-blue-200">Review personalized quotes and select the best platform for your team</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Stories */}
                  <div className="mb-5">
                    <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#ff8633]" />
                      Success Stories
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-3 border border-white/15">
                        <p className="text-sm text-blue-100 italic mb-2">"Switched to a better call center platform and reduced our average handle time by 35%! Customer satisfaction scores improved dramatically."</p>
                        <p className="text-sm text-[#ff8633] font-semibold">- Robert K., Call Center Manager</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/15">
                        <p className="text-sm text-blue-100 italic mb-2">"The comparison tool helped us find a platform that fits our budget perfectly. Saved us $400/month and improved our analytics capabilities."</p>
                        <p className="text-sm text-[#ff8633] font-semibold">- Maria L., Operations Director</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge & Rating */}
                  <div className="mt-auto pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff8633] to-orange-600 border-2 border-[#000e54] flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                        </div>
                        <div className="ml-2">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-xs text-blue-300">4.9/5 from 1,800+ reviews</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-[#ff8633] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-white leading-relaxed font-semibold mb-1">100% Secure & Confidential</p>
                          <p className="text-xs text-blue-200 leading-relaxed">
                            Your information is encrypted and never shared with third parties.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 bg-gradient-to-r from-[#ff8633]/20 to-orange-600/20 rounded-lg p-3 border border-[#ff8633]/30">
                      <p className="text-sm text-white font-semibold mb-1 flex items-center gap-1">
                        <Gift className="w-4 h-4 text-[#ff8633]" />
                        Quick Match Guarantee
                      </p>
                      <p className="text-xs text-blue-100">Get matched with 3-5 perfect call center software providers within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes pulse-border {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </>
  );
};

export default CallCenterGetQuotesForm;

