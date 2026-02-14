import { useState } from "react";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill all required fields");
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email");
    }

    try {
      // Replace with your actual API endpoint
      // const response = await axios.post('/api/contact', formData);

      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    }
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <section className="h-cover">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-gelasio text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-dark-grey text-xl leading-7">
              Have a question or feedback? We'd love to hear from you. Fill out
              the form below and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-grey rounded-lg p-8 md:p-12 mb-12">
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block mb-2 text-dark-grey font-medium"
                >
                  Full Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full rounded-md p-4 bg-grey border border-grey focus:bg-transparent placeholder:text-dark-grey"
                />
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-dark-grey font-medium"
                >
                  Email Address <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full rounded-md p-4 bg-grey border border-grey focus:bg-transparent placeholder:text-dark-grey"
                />
              </div>

              {/* Subject Input */}
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block mb-2 text-dark-grey font-medium"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help?"
                  className="w-full rounded-md p-4 bg-grey border border-grey focus:bg-transparent placeholder:text-dark-grey"
                />
              </div>

              {/* Message Textarea */}
              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block mb-2 text-dark-grey font-medium"
                >
                  Message <span className="text-red">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                  className="w-full rounded-md p-4 bg-grey border border-grey focus:bg-transparent placeholder:text-dark-grey resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-dark center">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Email Card */}
            <div className="bg-grey/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fi fi-rr-envelope text-purple text-2xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-dark-grey text-base">contact@yourblog.com</p>
            </div>

            {/* Location Card */}
            <div className="bg-grey/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fi fi-rr-marker text-purple text-2xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-dark-grey text-base">123 Blog Street, City</p>
            </div>

            {/* Social Card */}
            <div className="bg-grey/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fi fi-rr-share text-purple text-2xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <div className="flex gap-4 justify-center mt-3">
                <a href="#" className="text-dark-grey hover:text-twitter">
                  <i className="fi fi-brands-twitter text-xl"></i>
                </a>
                <a href="#" className="text-dark-grey hover:text-purple">
                  <i className="fi fi-brands-instagram text-xl"></i>
                </a>
                <a href="#" className="text-dark-grey hover:text-black">
                  <i className="fi fi-brands-github text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default ContactPage;
