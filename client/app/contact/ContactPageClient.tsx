'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

export function ContactPageClient() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
      if (!accessKey) {
        alert('Form submission is not configured. Please contact support.')
        return
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'Contact Form Submission - Compare-Bazaar',
          from_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          form_source: 'Contact Us Page',
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        console.error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <>
      <h1 className="sr-only">Contact Us</h1>
      <div className="font-sans overflow-x-hidden bg-gray-50">
        <div className="relative">
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex justify-center items-center relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.6039841582637!2d-96.81980702397371!3d32.7792809902966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e991dc0b81703%3A0x73ceb38c75d3a3ac!2s539%20W%20Commerce%20St%20%232577%2C%20Dallas%2C%20TX%2075208%2C%20USA!5e0!3m2!1sen!2sin!4v1714662415844!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale"
              title="Compare Bazaar office location map"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#000e54]/20 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 lg:px-16 mx-auto max-w-7xl relative -mt-32 md:-mt-40 mb-16 z-20">
          <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 flex-1 min-h-[280px] flex flex-col justify-center group hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
            <div className="flex flex-col items-center h-full">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff8633] to-[#ff9a57] rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center text-center">
                <h2 className="text-xl md:text-2xl text-[#000e54] font-bold mb-4">ADDRESS</h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-600">
                  539 W. Commerce St #2577
                  <br />
                  Dallas, TX 75208
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 flex-1 min-h-[280px] flex flex-col justify-center group hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
            <div className="flex flex-col items-center h-full">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff8633] to-[#ff9a57] rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center text-center">
                <h2 className="text-xl md:text-2xl text-[#000e54] font-bold mb-4">EMAIL</h2>
                <a href="mailto:contactus@compare-bazaar.com" className="text-base md:text-lg leading-relaxed text-[#ff8633] hover:text-[#ff9a57] transition-colors break-all">
                  contactus@compare-bazaar.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 flex-1 min-h-[280px] flex flex-col justify-center group hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
            <div className="flex flex-col items-center h-full">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff8633] to-[#ff9a57] rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center text-center">
                <h2 className="text-xl md:text-2xl text-[#000e54] font-bold mb-4">WORK HOURS</h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-600">
                  Monday - Friday: 09:00 - 23:00
                  <br />
                  Sunday: 09:00 - 16:00
                </p>
                <p className="mt-3 text-base md:text-lg leading-relaxed text-gray-600">
                  Phone:{' '}
                  <a href="tel:+13322310404" className="text-[#ff8633] hover:text-[#ff9a57] transition-colors">
                    +1 332-231-0404
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 px-4 md:px-8 lg:px-16 py-20 max-w-7xl mx-auto">
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Please get in <span className="text-[#ff8633]">touch</span> with{' '}
              <span className="text-[#ff8633]">us</span>
            </h2>
            <div className="flex gap-2 mb-6">
              <div className="w-2 h-1.5 bg-[#ff8633] rounded-full" />
              <div className="w-12 h-1.5 bg-[#ff8633] rounded-full" />
            </div>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              We&apos;re here to help! Whether you have questions about our services, need support, or want to explore partnership opportunities, our team is ready to assist you. Reach out to us through any of the channels below, and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
              {[
                { title: 'Reliable Service', body: 'We provide dependable and high-quality services tailored to your needs.' },
                { title: 'Expert Team', body: 'Our team of professionals is dedicated to delivering exceptional results.' },
                { title: 'Innovative Solutions', body: 'We use cutting-edge technology to solve your business challenges.' },
                { title: 'Customer-Centric', body: 'Your satisfaction is our priority. We listen and adapt to your needs.' },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#ff8633] to-[#ff9a57] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#000e54]">{item.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="getintouch" className="flex-1 flex flex-col">
            <div
              className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 h-full flex flex-col justify-between border border-gray-100"
              style={{
                boxShadow: '0 20px 40px rgba(255, 134, 51, 0.15), 0 10px 20px rgba(0, 14, 84, 0.1)',
              }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#000e54] relative inline-block">Send message</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#ff8633] to-[#ff9a57] rounded-full mb-8 mt-4" />
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-[#000e54] rounded-xl p-8 w-full mb-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-center text-[#000e54] mb-4">Thank you for your message!</h3>
                      <p className="text-center text-[#000e54] text-base">
                        We appreciate your inquiry and will get back to you as soon as possible.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="bg-gradient-to-r from-[#ff8633] to-[#ff9a57] text-white px-8 py-4 rounded-full text-sm font-bold hover:from-[#000e54] hover:to-[#001e74] transition-all duration-300 mt-2 w-[200px] shadow-lg"
                    >
                      GO BACK
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ''} />
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8633] focus:border-[#ff8633] outline-none bg-gray-50 hover:bg-white text-gray-800" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8633] focus:border-[#ff8633] outline-none bg-gray-50 hover:bg-white text-gray-800" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Contact Detail</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your contact detail" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8633] focus:border-[#ff8633] outline-none bg-gray-50 hover:bg-white text-gray-800" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8633] focus:border-[#ff8633] outline-none bg-gray-50 hover:bg-white text-gray-800 min-h-[120px] resize-y" rows={4} required />
                      </div>
                    </div>
                    <div className="flex justify-center mt-8">
                      <button type="submit" className="bg-gradient-to-r from-[#ff8633] to-[#ff9a57] text-white px-10 py-4 rounded-xl text-base font-bold hover:from-[#000e54] hover:to-[#001e74] transition-all duration-300 w-full md:w-auto shadow-xl">
                        SEND MESSAGE
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#000e54] to-[#001e74] text-white text-center py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to grow your business?</h2>
            <p className="max-w-2xl mx-auto mb-10 text-lg text-white/90 leading-relaxed">
              Partner with us to elevate your marketing strategy and drive measurable results for your business.
            </p>
            <a href="#getintouch">
              <button type="button" className="bg-gradient-to-r from-[#ff8633] to-[#ff9a57] hover:from-[#ff9a57] hover:to-[#ff8633] text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl">
                Get Started Today
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
