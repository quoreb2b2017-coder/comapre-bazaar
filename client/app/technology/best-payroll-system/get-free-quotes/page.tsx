// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  ChevronDown,
  DollarSign,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Clock,
  CreditCard,
  FileText,
  ArrowRight,
  Award,
  Star
} from 'lucide-react';

const PayrollGetQuotesForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
    employeeCount: '',
    payrollFrequency: '',
    brandName: '',
    currentSystem: '',
    emailUpdates: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);
  const videoRef = useRef(null);
  const [focusedField, setFocusedField] = useState(null);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);

  const brands = [
    {
      name: "ADP",
      logo: "/images/adp.jpg",
      color: "#D32F2F", // Red
      description: "ADP is a leading provider of human capital management solutions, offering comprehensive payroll services for businesses of all sizes. With decades of experience, ADP delivers reliable, automated payroll processing, tax compliance, and HR solutions that help enterprises streamline their workforce management."
    },
    {
      name: "Zoho",
      logo: "/images/zoho.png",
      color: "#1A73E8", // Blue
      description: "Zoho Payroll is an affordable, user-friendly payroll solution designed for small businesses. It offers automated payroll processing, tax compliance, and seamless integration with the Zoho ecosystem. Perfect for growing businesses that need efficient payroll management without the complexity."
    },
    {
      name: "BambooHR",
      logo: "/images/bomb.png",
      color: "#00A86B", // Green
      description: "BambooHR combines powerful HR management with integrated payroll functionality. This all-in-one platform helps businesses manage employee data, process payroll, track time, and handle benefits administration from a single, intuitive interface. Ideal for companies seeking comprehensive HR and payroll solutions."
    },
    {
      name: "OnPay",
      logo: "/images/on.jpg",
      color: "#0066CC", // Blue
      description: "OnPay offers straightforward, transparent payroll services with unlimited payroll runs and no hidden fees. Designed for small to medium businesses, OnPay provides full-service payroll, tax filing, and contractor payment management. It's perfect for businesses with mixed workforces including contractors and employees."
    },
    {
      name: "QuickBooks",
      logo: "/images/quick.png",
      color: "#0077C5", // Blue/Green
      description: "QuickBooks Payroll seamlessly integrates with QuickBooks accounting software, making it the perfect choice for businesses already using QuickBooks. It offers automated payroll processing, tax calculations, direct deposit, and real-time sync with your accounting data for streamlined financial management."
    }
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    const brandTimer = setInterval(() => {
      setCurrentBrandIndex((prevIndex) => (prevIndex + 1) % 5);
    }, 6000);

    return () => clearInterval(brandTimer);
  }, []);

  useEffect(() => {
    // Ensure video plays automatically
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
        // Try to play on user interaction
        const playVideo = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => { });
          }
        };
        document.addEventListener('click', playVideo, { once: true });
        document.addEventListener('touchstart', playVideo, { once: true });
      });
    }
  }, []);

  useEffect(() => {
    document.title = "Get Payroll System Quotes | Compare-Bazaar";
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
    if (!formData.payrollFrequency) {
      newErrors.payrollFrequency = 'Please complete this required field.';
    }
    if (!formData.brandName) {
      newErrors.brandName = 'Please complete this required field.';
    }
    if (!formData.currentSystem) {
      newErrors.currentSystem = 'Please complete this required field.';
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
        subject: 'Payroll System Quote Request - Compare-Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phoneNumber,
        zip_code: formData.zipCode,
        employee_count: formData.employeeCount,
        payroll_frequency: formData.payrollFrequency,
        brand_name: formData.brandName,
        current_system: formData.currentSystem,
        email_updates: formData.emailUpdates ? 'Yes' : 'No',
        form_source: 'Payroll System - Get Quotes (Compare-Bazaar)',
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
          payrollFrequency: '',
          brandName: '',
          currentSystem: '',
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
      {/* Main Content Section - Two Column Layout */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 py-8 md:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8633]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff8633]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff8633]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
                    Simplify Your Payroll Process
                  </h1>
                  <p className="text-base md:text-base text-gray-600 leading-relaxed">
                    Get matched with top-rated payroll providers. Compare features, pricing, and find the perfect solution for your business in minutes.
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

                  {/* Payroll Frequency */}
                  <div className="group">
                    <label htmlFor="payrollFrequency" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Payroll Frequency <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="payrollFrequency"
                        name="payrollFrequency"
                        value={formData.payrollFrequency}
                        onChange={(e) => handleSelectChange('payrollFrequency', e.target.value)}
                        onFocus={() => setFocusedField('payrollFrequency')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                          transition-all duration-300 ease-in-out cursor-pointer
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          appearance-none
                          ${errors.payrollFrequency
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-300'
                          }
                          ${focusedField === 'payrollFrequency' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Select payroll frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="semi-monthly">Semi-monthly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'payrollFrequency' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                    </div>
                    {errors.payrollFrequency && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.payrollFrequency}
                      </p>
                    )}
                  </div>

                  {/* Current Payroll System */}
                  <div className="group">
                    <label htmlFor="currentSystem" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Current Payroll System <span className="text-red-500">*</span>
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
                        <option value="">Select current system</option>
                        <option value="manual">Manual/Spreadsheet</option>
                        <option value="existing-software">Existing Payroll Software</option>
                        <option value="accountant">Outsourced to Accountant</option>
                        <option value="none">No current system</option>
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

                  {/* Select Your Brand Name */}
                  <div className="group">
                    <label htmlFor="brandName" className="block text-sm font-bold text-gray-800 mb-2 transition-colors group-focus-within:text-[#ff8633]">
                      Preferred service provider <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="brandName"
                        name="brandName"
                        value={formData.brandName}
                        onChange={(e) => handleSelectChange('brandName', e.target.value)}
                        onFocus={() => setFocusedField('brandName')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-gray-900 bg-white 
                          transition-all duration-300 ease-in-out cursor-pointer
                          focus:outline-none focus:ring-4 focus:ring-[#ff8633]/20 focus:border-[#ff8633] 
                          hover:border-gray-400 hover:shadow-md
                          appearance-none
                          ${errors.brandName
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-300'
                          }
                          ${focusedField === 'brandName' ? 'shadow-lg scale-[1.01]' : ''}
                        `}
                      >
                        <option value="">Preferred service provider</option>
                        <option value="ADP">ADP</option>
                        <option value="Zoho">Zoho</option>
                        <option value="BambooHR">BambooHR</option>
                        <option value="OnPay">OnPay</option>
                        <option value="QuickBooks">QuickBooks</option>
                        <option value="Any other">Any other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${focusedField === 'brandName' ? 'text-[#ff8633] rotate-180' : ''}`} />
                      </div>
                    </div>
                    {errors.brandName && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium animate-slideDown flex items-center">
                        <span className="mr-1">⚠</span> {errors.brandName}
                      </p>
                    )}
                  </div>

                  {/* Email Updates Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={formData.emailUpdates}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-[#ff8633] border-gray-300 rounded focus:ring-[#ff8633] cursor-pointer"
                    />
                    <label htmlFor="emailUpdates" className="text-sm text-gray-700 cursor-pointer">
                      I'd like to receive email updates about payroll solutions and best practices.
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

            {/* Right Side - Dashboard/Info Panel */}
            <div className="order-2 lg:order-2 flex">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-200 w-full flex flex-col h-full text-gray-800 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff8633]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff8633]/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-8">
                    {/* Brand Logos Row */}
                    <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                      {brands.map((brand, index) => (
                        <div
                          key={index}
                          className={`relative w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl p-2 border transition-all duration-300 cursor-pointer ${index === currentBrandIndex
                              ? 'bg-white border-[#ff8633] border-2 scale-105 shadow-md'
                              : 'border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                          onClick={() => setCurrentBrandIndex(index)}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={64}
                              height={64}
                              className="object-contain"
                              style={{
                                height: '56px',
                                width: 'auto',
                                maxWidth: '64px',
                                maxHeight: '56px',
                                objectFit: 'contain'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight text-center text-gray-800">
                      Why Choose Our Payroll Solutions?
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed text-center">
                      Get matched with top-rated payroll providers that fit your business needs.
                    </p>
                  </div>

                  {/* Rotating Brand Showcase */}
                  <div className="mb-8 overflow-hidden relative min-h-[340px] flex flex-col rounded-2xl">
                    {/* Video Background */}
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-orange-50/50">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Logo Section */}
                      <div className="flex items-center justify-center mb-6 overflow-hidden">
                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <h3
                            className="text-4xl font-bold opacity-70 transition-all duration-1000 ease-in-out animate-fadeInSlide"
                            style={{ color: brands[currentBrandIndex].color }}
                            key={currentBrandIndex}
                          >
                            {brands[currentBrandIndex].name}
                          </h3>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="text-center mb-6 flex-1 flex flex-col justify-center px-4 overflow-hidden">
                        <p className="text-sm text-gray-800 leading-relaxed max-w-full mx-auto font-medium text-justify transition-all duration-1000 ease-in-out animate-fadeInSlide" key={`desc-${currentBrandIndex}`}>
                          {brands[currentBrandIndex].description}
                        </p>
                      </div>

                      {/* Brand Indicators */}
                      <div className="flex justify-center items-center gap-2.5 mt-6 pt-4">
                        {brands.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentBrandIndex(index)}
                            className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633]/50 ${index === currentBrandIndex
                                ? 'w-8 h-2.5 bg-[#ff8633] shadow-lg shadow-[#ff8633]/30'
                                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                              }`}
                            aria-label={`View ${brands[index].name}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats/Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="text-3xl font-bold text-[#ff8633] mb-1">500+</div>
                      <div className="text-sm text-black font-medium">Companies Served</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="text-3xl font-bold text-[#ff8633] mb-1">24/7</div>
                      <div className="text-sm text-black font-medium">Support Available</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="text-3xl font-bold text-[#ff8633] mb-1">99.9%</div>
                      <div className="text-sm text-black font-medium">Uptime Guarantee</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="text-3xl font-bold text-[#ff8633] mb-1">$50K+</div>
                      <div className="text-sm text-black font-medium">Average Savings</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-6 flex-1">
                    {[
                      { icon: <Shield className="w-6 h-6" />, text: 'Tax Compliance & Filing Automated' },
                      { icon: <Zap className="w-6 h-6" />, text: 'Automated Payroll Processing' },
                      { icon: <BarChart3 className="w-6 h-6" />, text: 'Real-time Reporting & Analytics' },
                      { icon: <Clock className="w-6 h-6" />, text: 'Time & Attendance Integration' },
                      { icon: <CreditCard className="w-6 h-6" />, text: 'Direct Deposit & Payment Options' }
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-[#ff8633] to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                          {feature.icon}
                        </div>
                        <p className="text-sm text-black leading-relaxed pt-1 font-medium">{feature.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-auto pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff8633] to-orange-600 border-2 border-white flex items-center justify-center text-sm font-bold text-white">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">4.9/5 from 500+ reviews</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-semibold text-gray-900">Secure & Confidential:</span> Your information is encrypted and never shared with third parties.
                      </p>
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
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeOutSlide {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fadeOutSlide {
          animation: fadeOutSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default PayrollGetQuotesForm;
