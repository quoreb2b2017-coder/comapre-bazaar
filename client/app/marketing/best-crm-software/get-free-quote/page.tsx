// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronDown,
  Users,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Clock,
  ArrowRight,
  Target,
  MessageSquare,
  Globe,
  Database,
  Star,
  Award,
  Activity,
  PieChart,
  UserCheck,
  Briefcase
} from 'lucide-react';

const CRMGetQuotesForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    employeeCount: '',
    usingCRM: '',
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
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    document.title = "Get CRM Software Quotes | Compare-Bazaar";
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
    if (!formData.usingCRM) {
      newErrors.usingCRM = 'Please complete this required field.';
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
        subject: 'CRM Software Quote Request - Compare-Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phoneNumber,
        zip_code: formData.zipCode,
        employee_count: formData.employeeCount,
        using_crm: formData.usingCRM,
        important_features: formData.importantFeatures.join(', '),
        industry: formData.industry,
        email_updates: formData.emailUpdates ? 'Yes' : 'No',
        form_source: 'CRM Software - Get Quotes (Compare-Bazaar)',
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
          usingCRM: '',
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
    { id: 'sales-automation', label: 'Sales Automation & Pipeline Management', icon: <Target className="w-5 h-5" /> },
    { id: 'contact-management', label: 'Contact & Lead Management', icon: <Users className="w-5 h-5" /> },
    { id: 'email-integration', label: 'Email Integration & Tracking', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'reporting', label: 'Advanced Analytics & Reporting', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'mobile-access', label: 'Mobile Access & CRM App', icon: <Globe className="w-5 h-5" /> },
    { id: 'integrations', label: 'Third-party Integrations', icon: <Database className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Main Content Section - Two Column Layout */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-stretch">

            {/* Left Side - Form */}
            <div className="order-1 lg:order-1 flex">
              <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 lg:p-7 border border-gray-100 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl w-full flex flex-col h-full">
                {/* Header Section */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="inline-block mb-4">
                    <span className="bg-gradient-to-r from-[#ff8633] to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                      Get Free Quotes
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Find Your Perfect CRM Solution
                  </h1>
                  <p className="text-base md:text-base text-gray-600 leading-relaxed">
                    Connect with top CRM providers. Compare features, pricing, and find the ideal customer relationship management system for your business needs.
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

                <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
                  {/* First Name and Last Name in One Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="group">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 
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
                        <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 
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
                        <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="group">
                    <label htmlFor="companyName" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                      <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Business Email */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                      <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.email}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                      By entering your email above, you consent to receive marketing emails from compare-bazaar.com
                    </p>
                  </div>

                  {/* Phone Number and Zip Code in One Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="group">
                      <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 
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
                        <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                          className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 
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
                        <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                          <span className="mr-1">⚠</span> {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Number of Employees */}
                  <div className="group">
                    <label htmlFor="employeeCount" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-900 bg-white 
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
                      <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.employeeCount}
                      </p>
                    )}
                  </div>

                  {/* Currently Using CRM */}
                  <div className="group">
                    <label htmlFor="usingCRM" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
                      Currently Using CRM? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="usingCRM"
                        name="usingCRM"
                        value={formData.usingCRM}
                        onChange={(e) => handleSelectChange('usingCRM', e.target.value)}
                        onFocus={() => setFocusedField('usingCRM')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                          transition-all duration-300 ease-in-out cursor-pointer
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          appearance-none
                          ${errors.usingCRM
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-300'
                          }
                          ${focusedField === 'usingCRM' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select option</option>
                        <option value="Yes - Looking to switch">Yes - Looking to switch</option>
                        <option value="Yes - Looking to add features">Yes - Looking to add features</option>
                        <option value="No - First time user">No - First time user</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'usingCRM' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                    </div>
                    {errors.usingCRM && (
                      <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.usingCRM}
                      </p>
                    )}
                  </div>

                  {/* Industry */}
                  <div className="group">
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-800 mb-1.5 transition-colors group-focus-within:text-[#ff8633]">
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
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-900 bg-white 
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
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'industry' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                    </div>
                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.industry}
                      </p>
                    )}
                  </div>

                  {/* Important Features */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Important Features (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {importantFeatures.map((feature) => (
                        <label
                          key={feature.id}
                          className={`relative flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.importantFeatures.includes(feature.id)
                              ? 'border-[#ff8633] bg-orange-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.importantFeatures.includes(feature.id)}
                            onChange={() => handleCheckboxChange(feature.id)}
                            className="sr-only"
                          />
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3 mt-0.5 ${formData.importantFeatures.includes(feature.id)
                              ? 'border-[#ff8633] bg-[#ff8633]'
                              : 'border-gray-300'
                            }`}>
                            {formData.importantFeatures.includes(feature.id) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`inline-flex p-1.5 rounded-lg mb-1.5 ${formData.importantFeatures.includes(feature.id)
                                ? 'bg-[#ff8633] text-white'
                                : 'bg-gray-100 text-gray-600'
                              }`}>
                              {feature.icon}
                            </div>
                            <p className={`text-xs font-medium ${formData.importantFeatures.includes(feature.id)
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
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={formData.emailUpdates}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-[#ff8633] border-gray-300 rounded focus:ring-[#ff8633] cursor-pointer"
                    />
                    <label htmlFor="emailUpdates" className="text-sm text-gray-700 cursor-pointer">
                      I'd like to receive email updates about CRM solutions and best practices.
                    </label>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="pt-1 flex flex-col items-start w-full">
                    <div className="flex justify-start w-full">
                      <ReCAPTCHA
                        ref={captchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                        onChange={(value) => setCaptchaValue(value)}
                      />
                    </div>
                    {errors.captcha && (
                      <p className="mt-2 text-sm text-red-600 font-medium text-left w-full">{errors.captcha}</p>
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
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#ff8633] to-orange-600 text-white font-bold text-base rounded-xl hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2"
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
              <div className="bg-gradient-to-br from-[#000e54] via-blue-900 to-[#000e54] rounded-3xl shadow-2xl p-4 md:p-6 lg:p-7 border border-blue-700/30 backdrop-blur-sm w-full flex flex-col h-full text-white relative overflow-hidden">
                {/* Decorative Elements with Brand Colors */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff8633]/20 rounded-full blur-3xl -mr-40 -mt-40 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff8633]/15 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header Section */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#ff8633] to-orange-600 rounded-2xl mb-3 shadow-lg">
                      <Users className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                      Transform Your Customer Relationships
                    </h2>
                    <p className="text-blue-200 text-xs leading-relaxed">
                      Discover powerful CRM solutions that streamline your sales process and boost customer satisfaction.
                    </p>
                  </div>

                  {/* Key Benefits Section */}
                  <div className="bg-gradient-to-r from-[#ff8633]/20 to-orange-600/20 rounded-xl p-3 mb-4 border border-[#ff8633]/30">
                    <h3 className="text-base font-bold mb-2 text-white">Why Choose Compare Bazaar?</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff8633]"></div>
                        <p className="text-xs text-blue-100">Compare 50+ top CRM providers side-by-side</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff8633]"></div>
                        <p className="text-xs text-blue-100">Get personalized recommendations based on your needs</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff8633]"></div>
                        <p className="text-xs text-blue-100">Free quotes with no obligation to purchase</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff8633]"></div>
                        <p className="text-xs text-blue-100">Expert guidance from our CRM specialists</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-xl font-bold text-[#ff8633] mb-0.5">1,000+</div>
                      <div className="text-xs text-blue-200">Businesses Trust Us</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-xl font-bold text-[#ff8633] mb-0.5">95%</div>
                      <div className="text-xs text-blue-200">Satisfaction Rate</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-xl font-bold text-[#ff8633] mb-0.5">50+</div>
                      <div className="text-xs text-blue-200">CRM Providers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-xl font-bold text-[#ff8633] mb-0.5">24/7</div>
                      <div className="text-xs text-blue-200">Expert Support</div>
                    </div>
                  </div>

                  {/* Top CRM Features */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-white">Top CRM Features</h3>
                    <div className="space-y-1.5">
                      {[
                        { icon: <Target className="w-4 h-4" />, text: 'Sales Pipeline Management', benefit: 'Track deals 40% faster' },
                        { icon: <Users className="w-4 h-4" />, text: 'Contact Management', benefit: 'Organize all customer data' },
                        { icon: <MessageSquare className="w-4 h-4" />, text: 'Email Integration', benefit: 'Sync with email platforms' },
                        { icon: <BarChart3 className="w-4 h-4" />, text: 'Analytics & Reporting', benefit: 'Real-time insights' },
                        { icon: <Activity className="w-4 h-4" />, text: 'Automation Tools', benefit: 'Save 10+ hours weekly' },
                        { icon: <Briefcase className="w-4 h-4" />, text: 'Team Collaboration', benefit: 'Boost productivity 2x' }
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-r from-[#ff8633] to-orange-600">
                            {feature.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-100 font-medium truncate">{feature.text}</p>
                            <p className="text-xs text-blue-300">{feature.benefit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-white flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-[#ff8633]" />
                      How It Works
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-gradient-to-r from-[#ff8633]/10 to-orange-600/10 rounded-lg border border-[#ff8633]/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#ff8633] to-orange-600 flex items-center justify-center text-[10px] font-bold">1</div>
                        <p className="text-xs text-blue-100"><span className="font-semibold text-white">Submit Form:</span> Tell us about your business needs and CRM requirements</p>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-[10px] font-bold">2</div>
                        <p className="text-xs text-blue-100"><span className="font-semibold text-white">Get Matched:</span> We'll connect you with 3-5 perfect CRM providers within 24 hours</p>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-[10px] font-bold">3</div>
                        <p className="text-xs text-blue-100"><span className="font-semibold text-white">Compare & Select:</span> Review free quotes and choose the best CRM for your team</p>
                      </div>
                    </div>
                  </div>

                  {/* Success Stories */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-white">Success Stories</h3>
                    <div className="space-y-2">
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-xs text-blue-200 italic mb-1">"Found the perfect CRM in just 2 days! Saved us $500/month compared to our old system."</p>
                        <p className="text-xs text-[#ff8633] font-semibold">- Sarah M., Marketing Director</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-xs text-blue-200 italic mb-1">"The comparison tool helped us identify the best features for our team size. Highly recommend!"</p>
                        <p className="text-xs text-[#ff8633] font-semibold">- Mike T., Sales Manager</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="mb-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg p-3 border border-purple-500/30">
                    <h3 className="text-sm font-bold mb-2 text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#ff8633]" />
                      Quick Tips for Choosing a CRM
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#ff8633] mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-blue-100">Consider your team size and growth plans for scalability</p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#ff8633] mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-blue-100">Look for mobile access if your team works remotely</p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#ff8633] mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-blue-100">Check integration capabilities with your existing tools</p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#ff8633] mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-blue-100">Evaluate customer support quality and response times</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge & Rating */}
                  <div className="mt-auto pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff8633] to-orange-600 border-2 border-[#000e54] flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                        </div>
                        <div className="ml-2">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-xs text-blue-300">4.9/5 from 1,000+ reviews</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl p-2.5 border border-white/20">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-[#ff8633] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-100 leading-relaxed font-semibold mb-0.5">100% Secure & Confidential</p>
                          <p className="text-xs text-blue-300 leading-relaxed">
                            Your information is encrypted and never shared with third parties.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 bg-gradient-to-r from-[#ff8633]/20 to-orange-600/20 rounded-lg p-2.5 border border-[#ff8633]/30">
                      <p className="text-xs text-white font-semibold mb-0.5">🎯 Quick Match Guarantee</p>
                      <p className="text-xs text-blue-100">Get matched with 3-5 perfect CRM providers within 24 hours</p>
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

export default CRMGetQuotesForm;
