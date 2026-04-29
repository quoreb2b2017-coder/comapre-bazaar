// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Phone, Shield, Zap, TrendingUp, Users, BarChart3, PhoneCall, MessageSquare, Video, DollarSign, Clock, CheckCircle2, Star, ArrowRight } from 'lucide-react';

const BusinessPhoneSystemGetQuotesForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    phoneSystemNeeds: '',
    phonesNeeded: '',
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
    document.title = "Get Business Phone System Quotes | Compare-Bazaar";
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
    if (!formData.phoneSystemNeeds) {
      newErrors.phoneSystemNeeds = 'Please complete this required field.';
    }
    if (!formData.phonesNeeded) {
      newErrors.phonesNeeded = 'Please complete this required field.';
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
        subject: 'Business Phone System Quote Request - Compare-Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phoneNumber,
        zip_code: formData.zipCode,
        phone_system_needs: formData.phoneSystemNeeds,
        phones_needed: formData.phonesNeeded,
        email_updates: formData.emailUpdates ? 'Yes' : 'No',
        form_source: 'Business Phone System - Get Quotes (Compare-Bazaar)',
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
          phoneSystemNeeds: '',
          phonesNeeded: '',
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
        <title>Get Business Phone System Quotes | Compare-Bazaar</title>
        <meta name="description" content="Get free, no-obligation quotes from top business phone system providers. Compare VoIP solutions and find the best fit for your business." />
        <link rel="canonical" href="https://www.compare-bazaar.com/Technology/business-phone-systems/get-free-quotes" />
      </Head>
      
      {/* Main Content Section - Two Column Layout */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8 md:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8633]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl delay-1000"></div>
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
                    Connect Your Business with Modern Communication
                  </h1>
                  <p className="text-base md:text-base text-gray-600 leading-relaxed">
                    Fill out the form to get customized quotes from top business phone system providers and find the perfect solution for your needs.
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
                        placeholder="Acme Corporation"
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

                  {/* Email */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Email Address <span className="text-red-500">*</span>
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
                  </div>

                  {/* Phone Number */}
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
                        placeholder="+1 (555) 123-4567"
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

                  {/* Zip Code */}
                  <div className="group">
                    <label htmlFor="zipCode" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Zip Code <span className="text-red-500">*</span>
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
                        maxLength={5}
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

                  {/* Phone System Needs */}
                  <div className="group">
                    <label htmlFor="phoneSystemNeeds" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Phone System Needs <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="phoneSystemNeeds"
                        name="phoneSystemNeeds"
                        value={formData.phoneSystemNeeds}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('phoneSystemNeeds')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 
                          bg-white transition-all duration-300 ease-in-out
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          ${errors.phoneSystemNeeds 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'phoneSystemNeeds' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select an option</option>
                        <option value="Installing new phone system">Installing new phone system</option>
                        <option value="Replacing existing phone system">Replacing existing phone system</option>
                        <option value="Expanding existing phone system">Expanding existing phone system</option>
                      </select>
                    </div>
                    {errors.phoneSystemNeeds && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.phoneSystemNeeds}
                      </p>
                    )}
                  </div>

                  {/* Phones Needed */}
                  <div className="group">
                    <label htmlFor="phonesNeeded" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Number of Phones Needed <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="phonesNeeded"
                        name="phonesNeeded"
                        value={formData.phonesNeeded}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('phonesNeeded')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl text-gray-900 
                          bg-white transition-all duration-300 ease-in-out
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          ${errors.phonesNeeded 
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-300'
                          }
                          ${focusedField === 'phonesNeeded' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select an option</option>
                        <option value="1-10">1-10 phones</option>
                        <option value="11-25">11-25 phones</option>
                        <option value="26-50">26-50 phones</option>
                        <option value="50+">50+ phones</option>
                      </select>
                    </div>
                    {errors.phonesNeeded && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.phonesNeeded}
                      </p>
                    )}
                  </div>

                  {/* Email Updates Checkbox */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailUpdates"
                        name="emailUpdates"
                        type="checkbox"
                        checked={formData.emailUpdates}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#ff8633] border-gray-300 rounded focus:ring-[#ff8633] focus:ring-2"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailUpdates" className="font-medium text-gray-700">
                        I would like to receive email updates about phone system solutions
                      </label>
                    </div>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="flex flex-col items-start">
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
                  {errors.captcha && (
                    <p className="mt-2 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                      <span className="mr-1">⚠</span> {errors.captcha}
                    </p>
                  )}

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
                      Experience Business Phone Systems
                    </h2>
                    <p className="text-gray-600 text-sm">
                      See how our platform simplifies business communication
                    </p>
                  </div>

                  {/* BPS Image */}
                  <div className="w-full mb-4 flex-1">
                    <div className="relative w-full min-h-[500px] sm:min-h-[550px] md:min-h-[600px] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                      <Image
                        src="/images/BPS.png"
                        alt="Business Phone Systems"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Stats Banner */}
                  <div className="mb-4 bg-gradient-to-r from-[#ff8633] via-orange-500 to-[#ff8633] rounded-xl p-3 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    <div className="relative grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-white text-xl sm:text-2xl font-bold mb-0.5">10K+</div>
                        <div className="text-orange-100 text-[10px] sm:text-xs font-medium">Businesses</div>
                      </div>
                      <div className="border-l border-orange-300/50"></div>
                      <div>
                        <div className="text-white text-xl sm:text-2xl font-bold mb-0.5 flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                          4.8
                        </div>
                        <div className="text-orange-100 text-[10px] sm:text-xs font-medium">Rating</div>
                      </div>
                      <div className="border-l border-orange-300/50"></div>
                      <div>
                        <div className="text-white text-xl sm:text-2xl font-bold mb-0.5">24/7</div>
                        <div className="text-orange-100 text-[10px] sm:text-xs font-medium">Support</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits Section */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 text-[#ff8633] mr-2" />
                      Why Choose Our Platform?
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2 p-2.5 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Compare Top Providers</h4>
                          <p className="text-[11px] text-gray-700 leading-tight">Get quotes from leading business phone system providers all in one place</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 p-2.5 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Save Time & Money</h4>
                          <p className="text-[11px] text-gray-700 leading-tight">Compare pricing and features in minutes, not hours</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 p-2.5 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-7 h-7 bg-[#ff8633] rounded-full flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Expert Guidance</h4>
                          <p className="text-[11px] text-gray-700 leading-tight">Our team helps you find the perfect solution for your business needs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 text-[#ff8633] mr-2" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-orange-50 transition-all group">
                        <Phone className="w-3.5 h-3.5 text-[#ff8633] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-medium text-gray-700 group-hover:text-gray-900">VoIP & Cloud PBX</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-orange-50 transition-all group">
                        <Video className="w-3.5 h-3.5 text-[#ff8633] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-medium text-gray-700 group-hover:text-gray-900">Video Conferencing</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-orange-50 transition-all group">
                        <MessageSquare className="w-3.5 h-3.5 text-[#ff8633] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-medium text-gray-700 group-hover:text-gray-900">Unified Messaging</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#ff8633] hover:bg-orange-50 transition-all group">
                        <BarChart3 className="w-3.5 h-3.5 text-[#ff8633] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-medium text-gray-700 group-hover:text-gray-900">Call Analytics</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Content Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs mb-1">100% Free Service</h4>
                          <p className="text-[10px] text-gray-700 leading-tight">No hidden fees. Compare quotes from verified providers at no cost to you.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2.5 border border-green-200 text-center hover:shadow-md transition-all group">
                        <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-gray-900">Save Up to 40%</div>
                        <div className="text-[10px] text-gray-600">On Phone Systems</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2.5 border border-purple-200 text-center hover:shadow-md transition-all group">
                        <Users className="w-5 h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-gray-900">Expert Help</div>
                        <div className="text-[10px] text-gray-600">Dedicated Support</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-600 text-center font-medium">
                      Trusted by thousands of businesses nationwide
                    </p>
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

export default BusinessPhoneSystemGetQuotesForm;

