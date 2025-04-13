'use client'
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Brain, BarChart3, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

// Custom hook for animations on scroll
function useScrollAnimation() {
  return {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
}

// Custom component for animated elements
const AnimateOnScroll = ({ children, delay = 0, className = "" }) => {
  const controls = useRef(null);
  const animation = useScrollAnimation();
  
  return (
    <motion.div
      ref={controls}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px 0px" }}
      variants={{
        ...animation,
        visible: {
          ...animation.visible,
          transition: { 
            ...animation.visible.transition,
            delay: delay 
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto py-6 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-[#D1376A]" />
          <span className="font-bold text-2xl text-black">LifeLedger</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-black hover:text-[#D1376A] transition">Features</a>
          <a href="#how-it-works" className="text-black hover:text-[#D1376A] transition">How it works</a>
          <a href="#analytics" className="text-black hover:text-[#D1376A] transition">Analytics</a>
        </div>
        <button className="bg-[#D1376A] text-white px-4 py-2 rounded-lg hover:bg-[#BB2C5E] transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Make <span className="text-[#D1376A]">smarter decisions</span>, learn from your choices
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1}>
            <p className="text-xl text-gray-800 mb-10">
              LifeLedger is your AI-powered decision tracker that helps you think through choices, track outcomes, and grow from your experiences.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-[#D1376A] text-white px-6 py-3 rounded-lg hover:bg-[#BB2C5E] transition flex items-center justify-center gap-2">
                Start for free <ChevronRight className="h-4 w-4" />
              </button>
              <button className="bg-white text-[#D1376A] border border-[#D1376A] px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                Watch demo
              </button>
            </div>
          </AnimateOnScroll>
          
          {/* Hero Image */}
          <AnimateOnScroll delay={0.3}>
            <div className="rounded-xl shadow-xl bg-white p-2 max-w-3xl mx-auto">
              <div className="bg-gray-900 rounded-t-lg px-4 py-2 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-4 rounded-b-lg bg-gray-50">
                <div className="bg-white rounded-lg shadow-sm p-6 text-left">
                  <h3 className="font-bold text-lg text-black mb-2">Should I accept this internship or wait for another?</h3>
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-800 italic">&quot;I&apos;m considering this software engineering internship at a startup, but I might get an offer from a larger company next month...&quot;</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-black font-medium">AI Thought Partner:</p>
                    <p className="text-gray-800">Let&apos;s think through this. What matters most to you in this internship: experience, mentorship, or compensation?</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center text-black mb-12">Key Features</h2>
          </AnimateOnScroll>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <AnimateOnScroll delay={0.1}>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-pink-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-[#D1376A]" />
                </div>
                <h3 className="font-bold text-xl text-black mb-2">AI Thought Partner</h3>
                <p className="text-gray-800">
                  The system helps you weigh pros/cons, identify biases, and highlight long-term impacts of your decisions.
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Feature 2 */}
            <AnimateOnScroll delay={0.2}>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-pink-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-[#D1376A]" />
                </div>
                <h3 className="font-bold text-xl text-black mb-2">Decision Log</h3>
                <p className="text-gray-800">
                  Track your choices and document why you made them with AI-assisted reflection tools.
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Feature 3 */}
            <AnimateOnScroll delay={0.3}>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-pink-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-[#D1376A]" />
                </div>
                <h3 className="font-bold text-xl text-black mb-2">Scheduled Reflections</h3>
                <p className="text-gray-800">
                  Get reminders to reflect on past decisions and learn if they led to positive outcomes.
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Feature 4 */}
            <AnimateOnScroll delay={0.4}>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-pink-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-[#D1376A]" />
                </div>
                <h3 className="font-bold text-xl text-black mb-2">Personal Analytics</h3>
                <p className="text-gray-800">
                  Discover patterns in your decision-making and identify biases with smart analytics.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center text-black mb-16">How LifeLedger Works</h2>
          </AnimateOnScroll>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <AnimateOnScroll delay={0.1}>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#D1376A]">
                  <span className="text-[#D1376A] font-bold text-2xl">1</span>
                </div>
                <h3 className="font-bold text-xl text-black mb-3">Decision Entry</h3>
                <p className="text-gray-800">
                  Log a decision you&apos;re trying to make, big or small. Add details that matter to you.
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Step 2 */}
            <AnimateOnScroll delay={0.2}>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#D1376A]">
                  <span className="text-[#D1376A] font-bold text-2xl">2</span>
                </div>
                <h3 className="font-bold text-xl text-black mb-3">AI Guidance</h3>
                <p className="text-gray-800">
                  Get thoughtful questions and insights to help clarify your thinking and spot blind spots.
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Step 3 */}
            <AnimateOnScroll delay={0.3}>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#D1376A]">
                  <span className="text-[#D1376A] font-bold text-2xl">3</span>
                </div>
                <h3 className="font-bold text-xl text-black mb-3">Learn & Grow</h3>
                <p className="text-gray-800">
                  Review outcomes, reflect on results, and learn from your past decisions over time.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      <section id="analytics" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <AnimateOnScroll className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold text-black mb-6">Understand Your Decision Patterns</h2>
              <p className="text-gray-800 text-lg mb-8">
                Our powerful analytics dashboard helps you visualize your decision history and identify patterns in your choices.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-pink-50 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-[#D1376A]" />
                  </div>
                  <span className="text-gray-800">Track decision outcomes over time</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-pink-50 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-[#D1376A]" />
                  </div>
                  <span className="text-gray-800">Identify your common biases and blind spots</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-pink-50 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-[#D1376A]" />
                  </div>
                  <span className="text-gray-800">See what categories of decisions bring you the most satisfaction</span>
                </li>
              </ul>
            </AnimateOnScroll>
            
            <AnimateOnScroll delay={0.2} className="w-full lg:w-1/2">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-lg text-black mb-4">Your Decision Analytics</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-500">Analytics visualization placeholder</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <p className="font-bold text-2xl text-[#D1376A]">71%</p>
                      <p className="text-gray-800 text-sm">Positive outcomes</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <p className="font-bold text-2xl text-[#D1376A]">14</p>
                      <p className="text-gray-800 text-sm">Major decisions this year</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center text-black mb-12">What Our Users Say</h2>
          </AnimateOnScroll>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <AnimateOnScroll delay={0.1}>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#D1376A] font-bold">S</div>
                  <div className="ml-4">
                    <p className="font-bold text-black">Sarah K.</p>
                    <p className="text-sm text-gray-600">Student</p>
                  </div>
                </div>
                <p className="text-gray-800">
                  &quot;LifeLedger helped me weigh my college options and track which courses align with my goals. Now I understand my patterns and make better choices.&quot;
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Testimonial 2 */}
            <AnimateOnScroll delay={0.2}>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#D1376A] font-bold">M</div>
                  <div className="ml-4">
                    <p className="font-bold text-black">Michael T.</p>
                    <p className="text-sm text-gray-600">Freelancer</p>
                  </div>
                </div>
                <p className="text-gray-800">
                  &quot;As a freelancer, I make dozens of small decisions weekly. This app helps me see which clients and projects actually lead to growth.&quot;
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Testimonial 3 */}
            <AnimateOnScroll delay={0.3}>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#D1376A] font-bold">J</div>
                  <div className="ml-4">
                    <p className="font-bold text-black">Jennifer L.</p>
                    <p className="text-sm text-gray-600">Founder</p>
                  </div>
                </div>
                <p className="text-gray-800">
                  &quot;The reflection prompts and analytics have been eye-opening. I now understand my leadership biases and make more balanced decisions.&quot;
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#D1376A]">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-white mb-6">Ready to make smarter decisions?</h2>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={0.1}>
            <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
              Join thousands of people who use LifeLedger to think clearly, choose wisely, and learn from every decision.
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={0.2}>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-lg flex-1 border-0" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="bg-white text-[#D1376A] px-6 py-3 rounded-lg hover:bg-gray-100 transition font-medium flex items-center justify-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-pink-100 text-sm mt-4">No credit card required. Free plan available.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-[#D1376A]" />
                <span className="font-bold text-xl">LifeLedger</span>
              </div>
              <p className="text-gray-400">
                AI-powered decision tracking for personal growth.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Use Cases</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D1376A] transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LifeLedger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}