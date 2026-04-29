// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ChevronDown, Route, Shield, Zap, TrendingUp, DollarSign, BarChart3, Navigation, Activity, CheckCircle2, Clock, Star, Users, Phone, MessageSquare, Video } from 'lucide-react';
import gpsImage from '../../GPS.png';

const GPSFleetGetQuotesForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    employeeCount: '',
    vehicleTypes: '',
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

  // Update document title
  useEffect(() => {
    document.title = "Get GPS Fleet Management Quotes | Compare-Bazaar";
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
    if (!formData.vehicleTypes) {
      newErrors.vehicleTypes = 'Please complete this required field.';
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
        subject: 'GPS Fleet Management Quote Request - Compare-Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phoneNumber,
        zip_code: formData.zipCode,
        employee_count: formData.employeeCount,
        vehicle_types: formData.vehicleTypes,
        email_updates: formData.emailUpdates ? 'Yes' : 'No',
        form_source: 'GPS Fleet Management - Get Quotes (Compare-Bazaar)',
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
          vehicleTypes: '',
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
        <title>Get GPS Fleet Management Quotes | Compare-Bazaar</title>
        <meta name="description" content="Get free, no-obligation quotes from top GPS fleet management providers. Compare solutions and find the best fit for your business." />
        <link rel="canonical" href="https://www.compare-bazaar.com/technology/get-free-quotes" />
      </Head>
      
      {/* Main Content Section - Two Column Layout */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8 md:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8633]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-6 items-start lg:items-stretch">
            
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
                    Real Results, Driven by Real Innovation
                  </h1>
                  <p className="text-base md:text-base text-gray-600 leading-relaxed">
                    Fill out the form to experience how our modern, easy-to-use platform unifies your business and simplifies the way you work.
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

                  {/* Fleet Size */}
                  <div className="group">
                    <label htmlFor="employeeCount" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Fleet Size <span className="text-red-500">*</span>
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
                        <option value="">Select fleet size</option>
                        <option value="1 - 4">1 - 4</option>
                        <option value="5 - 9">5 - 9</option>
                        <option value="10 - 19">10 - 19</option>
                        <option value="20 - 49">20 - 49</option>
                        <option value="50 - 99">50 - 99</option>
                        <option value="100 or more">100 or more</option>
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

                  {/* What do you need to track? */}
                  <div className="group">
                    <label htmlFor="vehicleTypes" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      What do you need to track? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="vehicleTypes"
                        name="vehicleTypes"
                        value={formData.vehicleTypes}
                        onChange={(e) => handleSelectChange('vehicleTypes', e.target.value)}
                        onFocus={() => setFocusedField('vehicleTypes')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                          transition-all duration-300 ease-in-out cursor-pointer
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          appearance-none
                          ${errors.vehicleTypes 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'vehicleTypes' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select vehicle type</option>
                        <option value="Vans or trucks">Vans or trucks</option>
                        <option value="Heavy duty or semi trucks">Heavy duty or semi trucks</option>
                        <option value="Cars">Cars</option>
                        <option value="Trailers">Trailers</option>
                        <option value="Construction Equipment">Construction Equipment</option>
                        <option value="Buses">Buses</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'vehicleTypes' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                      {focusedField === 'vehicleTypes' && !errors.vehicleTypes && (
                        <div className="absolute inset-0 rounded-xl border-2 border-[#ff8633] pointer-events-none animate-pulse-border"></div>
                      )}
                    </div>
                    {errors.vehicleTypes && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.vehicleTypes}
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
              <div className="lg:sticky lg:top-4 bg-white rounded-l-none lg:rounded-r-3xl rounded-3xl shadow-2xl p-0 flex flex-col border-0 lg:border-l border-gray-200 relative overflow-hidden w-full h-full">
                <div className="flex flex-col flex-1">
                  <div className="mb-4 text-center px-4 sm:px-6 pt-4 sm:pt-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      Experience GPS Fleet Management
                    </h2>
                    <p className="text-gray-600 text-sm">
                      See how our platform simplifies fleet tracking
                    </p>
                  </div>

                  {/* GPS Image */}
                  <div className="w-full mb-4 flex-1">
                    <div className="relative w-full min-h-[500px] sm:min-h-[550px] md:min-h-[600px] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                      <Image
                        src={gpsImage}
                        alt="GPS Fleet Management"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Stats Banner - Card Style */}
                  <div className="mb-4 px-4 sm:px-6">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-center shadow-md">
                        <div className="text-white text-lg sm:text-xl font-bold mb-0.5">10K+</div>
                        <div className="text-blue-100 text-[9px] sm:text-[10px] font-medium">Fleets</div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-3 text-center shadow-md">
                        <div className="text-white text-lg sm:text-xl font-bold mb-0.5 flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
                          4.8
                        </div>
                        <div className="text-orange-100 text-[9px] sm:text-[10px] font-medium">Rating</div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg p-3 text-center shadow-md">
                        <div className="text-white text-lg sm:text-xl font-bold mb-0.5">24/7</div>
                        <div className="text-green-100 text-[9px] sm:text-[10px] font-medium">Support</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits Section - Horizontal Cards */}
                  <div className="mb-4 px-4 sm:px-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3 text-center">
                      Why Choose Our Platform?
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-xs">Compare Top Providers</h4>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed pl-10">Get quotes from leading GPS fleet management providers all in one place</p>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-xs">Save Time & Money</h4>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed pl-10">Compare pricing and features in minutes, not hours</p>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-[#ff8633] hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#ff8633] rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-xs">Expert Guidance</h4>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed pl-10">Our team helps you find the perfect solution for your fleet needs</p>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid - Vertical List Style */}
                  <div className="mb-4 px-4 sm:px-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3 text-center">
                      Key Features
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all group">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 bg-[#ff8633] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Navigation className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-800">Real-time Tracking</span>
                        </div>
                        <div className="w-2 h-2 bg-[#ff8633] rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all group">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Route className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-800">Route Optimization</span>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all group">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-800">Fuel Savings</span>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all group">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-800">Analytics</span>
                        </div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </div>
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

export default GPSFleetGetQuotesForm;

