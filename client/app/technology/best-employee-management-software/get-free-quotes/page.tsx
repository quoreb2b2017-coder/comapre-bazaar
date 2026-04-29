// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle, ChevronDown, Users, Shield, Zap, TrendingUp, DollarSign, BarChart3, Clock, Briefcase } from 'lucide-react';

const EmployeeManagementGetQuotesForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    employeeCount: '',
    managementNeeds: '',
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
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // Update document title
  useEffect(() => {
    document.title = "Get Employee Management Software Quotes | Compare-Bazaar";
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
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
    if (!formData.managementNeeds) {
      newErrors.managementNeeds = 'Please complete this required field.';
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
      // Scroll to first error
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
        subject: 'Employee Management Software Quote Request - Compare-Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phoneNumber,
        zip_code: formData.zipCode,
        employee_count: formData.employeeCount,
        management_needs: formData.managementNeeds,
        email_updates: formData.emailUpdates ? 'Yes' : 'No',
        form_source: 'Employee Management Software - Get Quotes (Compare-Bazaar)',
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
          managementNeeds: '',
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

  return (
    <>
      <Head>
        <title>Get Employee Management Software Quotes | Compare-Bazaar</title>
        <meta name="description" content="Get free, no-obligation quotes from top employee management software providers. Compare solutions and find the best fit for your business." />
        <link rel="canonical" href="https://www.compare-bazaar.com/Technology/best-employee-management-software/get-free-quotes" />
      </Head>
      
      {/* Main Content Section - Two Column Layout */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8 md:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8633]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-stretch">
            
            {/* Left Side - Form */}
            <div className="order-1 lg:order-1 flex">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl w-full flex flex-col h-full">
                {/* Header Section */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="inline-block mb-4">
                    <span className="bg-gradient-to-r from-[#ff8633] to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                      Get Free Quotes
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Streamline Your Workforce Management
                  </h1>
                  <p className="text-base md:text-base text-gray-600 leading-relaxed">
                    Fill out the form to experience how our modern, easy-to-use platform unifies your HR processes and simplifies employee management.
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

                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
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

                  {/* Number of Employees */}
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
                        <option value="51 - 100">51 - 100</option>
                        <option value="101 - 250">101 - 250</option>
                        <option value="251 - 500">251 - 500</option>
                        <option value="500+">500+</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'employeeCount' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                      {focusedField === 'employeeCount' && !errors.employeeCount && (
                        <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                      )}
                    </div>
                    {errors.employeeCount && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.employeeCount}
                      </p>
                    )}
                  </div>

                  {/* What features do you need? */}
                  <div className="group">
                    <label htmlFor="managementNeeds" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      What features do you need? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="managementNeeds"
                        name="managementNeeds"
                        value={formData.managementNeeds}
                        onChange={(e) => handleSelectChange('managementNeeds', e.target.value)}
                        onFocus={() => setFocusedField('managementNeeds')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                          transition-all duration-300 ease-in-out cursor-pointer
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          appearance-none
                          ${errors.managementNeeds 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'managementNeeds' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select management needs</option>
                        <option value="Time & Attendance Tracking">Time & Attendance Tracking</option>
                        <option value="Performance Management">Performance Management</option>
                        <option value="Payroll Integration">Payroll Integration</option>
                        <option value="HR Automation">HR Automation</option>
                        <option value="Employee Onboarding">Employee Onboarding</option>
                        <option value="All-in-One Solution">All-in-One Solution</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'managementNeeds' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                      {focusedField === 'managementNeeds' && !errors.managementNeeds && (
                        <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                      )}
                    </div>
                    {errors.managementNeeds && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.managementNeeds}
                      </p>
                    )}
                  </div>

                  {/* Email Updates Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={formData.emailUpdates}
                      onChange={handleInputChange}
                      className="mt-1 h-5 w-5 text-[#ff8633] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#ff8633] focus:ring-offset-2 cursor-pointer transition-all hover:scale-110"
                    />
                    <label htmlFor="emailUpdates" className="ml-3 text-sm text-gray-700 leading-relaxed cursor-pointer hover:text-gray-900 transition-colors">
                      Yes, I&apos;d like to receive email updates from Compare-Bazaar.
                    </label>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="pt-2">
                    <div className="flex justify-start transform transition-all duration-300 hover:scale-105 overflow-hidden">
                      <div className="scale-90 sm:scale-100 origin-left">
                        <ReCAPTCHA
                          ref={captchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                          onChange={(value) => {
                            setCaptchaValue(value);
                            if (errors.captcha) {
                              setErrors({
                                ...errors,
                                captcha: ''
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    {errors.captcha && (
                      <p className="mt-2 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.captcha}
                      </p>
                    )}
                  </div>

                  {/* Consent Text */}
                  <div className="pt-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By clicking &quot;Compare Prices&quot; below, I consent to receive from compare-bazaar.com at any time SMS text messages and I also consent to receive from compare-bazaar.com and up to five service providers at any time emails, telemarketing calls using auto-dialer, artificial voices or pre-recordings, which could result in wireless charges, at the number provided above. I understand that consent is not a condition of purchase. I also agree to the{' '}
                      <Link href="/terms-of-use" className="text-[#ff8633] hover:text-orange-600 underline font-semibold transition-colors">
                        Terms &amp; Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy-policy" className="text-[#ff8633] hover:text-orange-600 underline font-semibold transition-colors">
                        Privacy Policy
                      </Link>
                      , which are also linked at the bottom of the page.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg mt-auto
                      transition-all duration-300 ease-in-out transform relative overflow-hidden
                      ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#ff8633] to-orange-600 hover:from-orange-600 hover:to-[#ff8633] shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Compare Prices'
                      )}
                    </span>
                    {!isSubmitting && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Product Demo/Content */}
            <div className="order-2 lg:order-2 flex">
              <div className="lg:sticky lg:top-4 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col border border-gray-700 relative overflow-hidden w-full lg:h-full custom-scrollbar">
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 md:opacity-15 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'local'
                  }}
                ></div>
                {/* Additional overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/97 via-gray-900/97 to-gray-800/97"></div>
                {/* Subtle pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                  }}
                ></div>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="mb-4">
                    <div className="inline-block mb-2">
                      <span className="bg-gradient-to-r from-[#ff8633] to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                        Get Free Quotes
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                      Experience Employee Management
                    </h2>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      See how our platform simplifies workforce management
                    </p>
                  </div>

                  {/* Professional Dashboard Design */}
                  <div className="mb-4 bg-gray-900 rounded-xl p-2 sm:p-3 shadow-2xl border border-gray-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl lg:flex-1">
                    {/* Browser Window Frame */}
                    <div className="bg-gray-800 rounded-t-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center space-x-1 sm:space-x-2 border-b border-gray-700">
                      <div className="flex space-x-1 sm:space-x-1.5 flex-shrink-0">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-sm"></div>
                      </div>
                      <div className="flex-1 bg-gray-700 h-5 sm:h-6 rounded-lg border border-gray-600 ml-1 sm:ml-2 flex items-center px-2 sm:px-3 min-w-0">
                        <span className="text-[8px] sm:text-[10px] text-gray-400 font-mono truncate">hr.compare-bazaar.com/dashboard</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-b-lg overflow-hidden shadow-inner lg:h-[calc(100%-45px)] min-h-[400px] sm:min-h-[500px] lg:min-h-0 flex flex-col">
                      {/* Professional Header */}
                      <div className="bg-gradient-to-r from-gray-50 to-white px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 mb-0.5 truncate">Employee Management System</h3>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">Workforce analytics & insights</p>
                          </div>
                          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 ml-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] sm:text-[10px] font-medium text-gray-600">Live</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Main Content Area */}
                      <div className="p-2 sm:p-3 md:p-4 bg-white flex-1 flex flex-col">
                        {/* Professional KPI Cards */}
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4">
                          {/* Active Employees Card */}
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-400">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100" />
                              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-semibold text-blue-100 bg-blue-700/30 px-1 sm:px-1.5 py-0.5 rounded">+5.2%</span>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-white mb-0.5 leading-tight">248</p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-blue-100 leading-tight">Active Employees</p>
                          </div>
                          
                          {/* Productivity Card */}
                          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-emerald-400">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-100" />
                              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-semibold text-emerald-100 bg-emerald-700/30 px-1 sm:px-1.5 py-0.5 rounded">+8.3%</span>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-white mb-0.5 leading-tight">94.7%</p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-emerald-100 leading-tight">Productivity</p>
                          </div>
                          
                          {/* Time Saved Card */}
                          <div className="bg-gradient-to-br from-[#ff8633] to-orange-600 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-orange-400">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-100" />
                              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-semibold text-orange-100 bg-orange-700/30 px-1 sm:px-1.5 py-0.5 rounded">+22%</span>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-white mb-0.5 leading-tight">18.5h</p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-orange-100 leading-tight">Time Saved</p>
                          </div>
                        </div>

                        {/* Professional Activity Feed */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 border border-gray-200 shadow-inner flex-1 relative min-h-[100px] sm:min-h-[120px] md:min-h-[150px] overflow-hidden">
                          {/* Activity Header */}
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-10">
                            <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 border border-gray-200 shadow-sm">
                              <div className="min-w-0 flex-1">
                                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-800 truncate">Team Activity</p>
                                <p className="text-[8px] sm:text-[9px] text-gray-500 truncate">248 employees • 12 departments</p>
                              </div>
                              <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 ml-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#ff8633] rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer">
                                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Activity Visualization */}
                          <div className="absolute inset-0 flex items-center justify-center pt-10 sm:pt-12">
                            <div className="relative w-full h-full flex items-center justify-center">
                              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                  </div>
                                  <p className="text-[8px] sm:text-[9px] text-gray-600">Onboarding</p>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-1">
                                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                  </div>
                                  <p className="text-[8px] sm:text-[9px] text-gray-600">Performance</p>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ff8633] rounded-full flex items-center justify-center mb-1">
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                  </div>
                                  <p className="text-[8px] sm:text-[9px] text-gray-600">Time Tracking</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom Stats */}
                          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 z-10">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-0">
                                <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
                                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-gray-700 whitespace-nowrap">12 Depts</span>
                                  </div>
                                  <div className="w-px h-3 sm:h-4 bg-gray-300"></div>
                                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-gray-700 whitespace-nowrap">All Active</span>
                                  </div>
                                </div>
                                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-[#ff8633] whitespace-nowrap">99.9% Uptime</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Professional Activity Feed */}
                        <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-[#ff8633] rounded-full"></div>
                              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-800">Recent Activity</p>
                            </div>
                            <button className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-[#ff8633] hover:text-orange-600 transition-colors whitespace-nowrap">
                              View All →
                            </button>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-start space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-800">New Employee Onboarded</p>
                                <p className="text-[8px] sm:text-[9px] text-gray-600 line-clamp-2">Sarah Johnson joined the Marketing team</p>
                                <p className="text-[7px] sm:text-[8px] text-gray-400 mt-0.5">2 minutes ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-800">Performance Review</p>
                                <p className="text-[8px] sm:text-[9px] text-gray-600 line-clamp-2">Q4 reviews completed for Sales team</p>
                                <p className="text-[7px] sm:text-[8px] text-gray-400 mt-0.5">5 minutes ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ff8633] rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-800">Time Tracking Update</p>
                                <p className="text-[8px] sm:text-[9px] text-gray-600 line-clamp-2">Weekly timesheets submitted by 95% of team</p>
                                <p className="text-[7px] sm:text-[8px] text-gray-400 mt-0.5">10 minutes ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features - Compact */}
                  <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 flex items-center">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#ff8633] mr-1.5 sm:mr-2" />
                      Key Features
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      {[
                        { icon: Users, text: 'Time & attendance tracking' },
                        { icon: Briefcase, text: 'Performance management' },
                        { icon: DollarSign, text: 'Payroll integration' },
                        { icon: Shield, text: 'HR compliance tools' },
                        { icon: BarChart3, text: 'Workforce analytics' }
                      ].map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center text-gray-300 group cursor-pointer active:scale-95 hover:text-white transition-all duration-300 hover:translate-x-1 sm:hover:translate-x-2 active:translate-x-1 bg-gray-800/50 rounded-lg p-2 sm:p-2.5 hover:bg-gray-800 hover:shadow-lg hover:shadow-[#ff8633]/20 active:bg-gray-700 touch-manipulation"
                        >
                          <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff8633] mr-1.5 sm:mr-2 flex-shrink-0 group-hover:scale-125 group-hover:rotate-3 transition-all duration-300" />
                          <span className="text-[10px] sm:text-xs font-medium group-hover:font-semibold transition-all duration-300">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-border {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        select {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        select:focus {
          transform: scale(1.01);
        }
        select option {
          padding: 12px;
          background: white;
          color: #1f2937;
          transition: background-color 0.2s;
        }
        select option:hover {
          background-color: #f3f4f6;
        }
        select option:checked {
          background-color: #ff8633;
          color: white;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff8633;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff6b00;
        }
      `}</style>
    </>
  );
};

export default EmployeeManagementGetQuotesForm;

