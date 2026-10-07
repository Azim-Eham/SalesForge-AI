import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    let timer;
    let scrollHandler;

    const ctx = gsap.context(() => {
      // 1. Nav
      const nav = document.querySelector('.nav-island');
      if (nav) {
        scrollHandler = () => {
          if (window.scrollY > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
        };
        window.addEventListener('scroll', scrollHandler);
      }

      // 2. Hero
      gsap.from(".hero-text-stagger", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.from(".hero-image-wrapper", {
        scale: 1.05,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.4
      });

      gsap.to(".hero-image-wrapper", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.from(".stat-card", {
        x: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "elastic.out(1, 0.7)",
        delay: 0.8
      });

      const counters = document.querySelectorAll('.counter-val');
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isFloat = target % 1 !== 0;
        
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          delay: 1,
          snap: { innerHTML: isFloat ? 0.1 : 1 },
          onUpdate: function() {
            if (isFloat) {
              counter.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
            }
          }
        });
      });

      // 3. Features
      const featureRows = document.querySelectorAll('.feature-row');
      featureRows.forEach((row, i) => {
        const isLeft = i % 2 === 0;
        gsap.from(row, {
          x: isLeft ? -40 : 40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });

      gsap.to(".feature-icon", {
        y: -8,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        }
      });

      // 4. Sticky Stack
      const cards = document.querySelectorAll('.sticky-card');
      cards.forEach((card, i) => {
        card.style.setProperty('--sticky-top', `${120 + (i * 20)}px`);
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.95 - (0.02 * (cards.length - i - 1)),
            opacity: 0.7,
            scrollTrigger: {
              trigger: card,
              start: `top ${120 + (i * 20)}px`,
              endTrigger: ".sticky-stack-container",
              end: "bottom bottom",
              scrub: true
            }
          });
        }
      });

      // 5. Testimonials
      const quotes = document.querySelectorAll('.testimonial-slide');
      const dots = document.querySelectorAll('.testimonial-dot');
      let currentIdx = 0;

      if (quotes.length && dots.length) {
        function showSlide(index) {
          gsap.to(quotes[currentIdx], { opacity: 0, zIndex: 0, duration: 0.5 });
          dots[currentIdx].classList.remove('bg-teal-600');
          dots[currentIdx].classList.add('bg-warm-200');
          
          currentIdx = index;
          
          gsap.fromTo(quotes[currentIdx], 
            { opacity: 0, y: 10, zIndex: 10 }, 
            { opacity: 1, y: 0, duration: 0.5 }
          );
          dots[currentIdx].classList.remove('bg-warm-200');
          dots[currentIdx].classList.add('bg-teal-600');
        }

        function nextSlide() {
          showSlide((currentIdx + 1) % quotes.length);
        }

        gsap.set(quotes, { opacity: 0, zIndex: 0 });
        gsap.set(quotes[0], { opacity: 1, zIndex: 10 });
        dots[0].classList.add('bg-teal-600');
        dots[0].classList.remove('bg-warm-200');

        timer = setInterval(nextSlide, 5000);

        dots.forEach((dot, i) => {
          dot.addEventListener('click', () => {
            if (i === currentIdx) return;
            clearInterval(timer);
            showSlide(i);
            timer = setInterval(nextSlide, 5000);
          });
        });
      }
    });

    return () => {
      ctx.revert();
      if (timer) clearInterval(timer);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <>


    {/*  1. Floating Navigation  */}
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 pointer-events-none mt-6">
        <nav className="nav-island mx-auto max-w-5xl rounded-full px-6 py-3 border border-transparent flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
                <i className="ph-fill ph-trend-up text-teal-600 text-2xl"></i>
                <span className="font-display text-2xl tracking-tight leading-none pt-1">SalesForge <span className="text-teal-600">AI</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-warm-800">
                <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How it works</a>
                <a href="#platform" className="hover:text-teal-600 transition-colors">Platform</a>
                <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing</a>
            </div>
            
            <button className="btn-tactile bg-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-tint-md hover:bg-teal-800 transition-all flex items-center gap-2">
                Book a Call <i className="ph ph-arrow-right"></i>
            </button>
        </nav>
    </div>

    {/*  2. Split-Screen Hero  */}
    <section id="hero" className="relative min-h-[100dvh] pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 overflow-hidden">
        
        {/*  Left: Text content  */}
        <div className="w-full lg:w-[55%] flex flex-col items-start z-10">
            <div className="hero-text-stagger inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold tracking-wider uppercase mb-8">
                <i className="ph-fill ph-sparkle"></i> AI-powered sales automation
            </div>
            
            <h1 className="hero-text-stagger font-display text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight mb-6 text-balance">
                Close more deals.<br />
                <span className="text-teal-800">Spend less time.</span>
            </h1>
            
            <p className="hero-text-stagger text-lg md:text-xl text-warm-600 mb-10 max-w-xl text-pretty leading-relaxed">
                Get unlimited access to the SalesForge AI platform and learn proven strategies to automate your outreach, score leads, and forecast revenue with precision.
            </p>
            
            <div className="hero-text-stagger flex flex-wrap items-center gap-4 mb-12">
                <button className="btn-tactile bg-teal-600 text-white px-8 py-4 rounded-full text-base font-semibold shadow-tint-lg hover:bg-teal-800 transition-all flex items-center gap-2">
                    Explore Platform <i className="ph ph-arrow-right"></i>
                </button>
                <button className="btn-tactile px-8 py-4 rounded-full text-base font-medium text-warm-800 hover:bg-warm-100 transition-colors flex items-center gap-2">
                    <i className="ph-fill ph-play-circle text-teal-600 text-xl"></i> Watch demo
                </button>
            </div>
            
            <div className="hero-text-stagger flex items-center gap-4">
                <div className="flex -space-x-3">
                    <img src="https://placehold.co/100x100/14B8A6/FFFFFF?text=A" alt="User" className="w-10 h-10 rounded-full border-2 border-cream object-cover" />
                    <img src="https://placehold.co/100x100/0F766E/FFFFFF?text=E" alt="User" className="w-10 h-10 rounded-full border-2 border-cream object-cover" />
                    <img src="https://placehold.co/100x100/0A3D3D/FFFFFF?text=S" alt="User" className="w-10 h-10 rounded-full border-2 border-cream object-cover" />
                    <img src="https://placehold.co/100x100/C8A95E/FFFFFF?text=J" alt="User" className="w-10 h-10 rounded-full border-2 border-cream object-cover" />
                </div>
                <div>
                    <div className="flex items-center gap-1 text-gold mb-0.5 text-sm">
                        <i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i>
                    </div>
                    <p className="text-xs text-warm-600 font-medium">Join 2,847+ sellers growing their revenue</p>
                </div>
            </div>
        </div>

        {/*  Right: Image & Floating Cards  */}
        <div className="w-full lg:w-[45%] relative mt-12 lg:mt-0">
            {/*  Hero Image Wrapper  */}
            <div className="hero-image-wrapper relative rounded-[2rem] overflow-hidden shadow-tint-xl z-0 aspect-[4/5] lg:aspect-auto lg:h-[700px]">
                <img src="media/hero-image.png" alt="Sales Professional" className="w-full h-full object-cover object-center hue-shift-teal" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent mix-blend-multiply pointer-events-none"></div>
            </div>

            {/*  Floating Stat Card 1  */}
            <div className="stat-card glass-panel absolute top-12 -left-12 lg:-left-24 rounded-2xl p-4 flex items-center gap-4 z-10 w-48 shadow-tint-lg">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <i className="ph-fill ph-envelope-open text-xl"></i>
                </div>
                <div>
                    <div className="font-mono text-xl font-bold text-teal-950 flex"><span className="counter-val" data-target="93.7">0</span>%</div>
                    <div className="text-[10px] uppercase tracking-wider text-warm-600 font-semibold mt-0.5">Email Open Rate</div>
                </div>
            </div>

            {/*  Floating Stat Card 2  */}
            <div className="stat-card glass-panel absolute top-1/2 -right-8 lg:-right-16 -translate-y-1/2 rounded-2xl p-4 flex items-center gap-4 z-10 w-48 shadow-tint-lg">
                <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold shrink-0">
                    <i className="ph-fill ph-chart-line-up text-xl"></i>
                </div>
                <div>
                    <div className="font-mono text-xl font-bold text-teal-950 flex"><span className="counter-val" data-target="4.2">0</span>x</div>
                    <div className="text-[10px] uppercase tracking-wider text-warm-600 font-semibold mt-0.5">Pipeline Growth</div>
                </div>
            </div>

            {/*  Floating Stat Card 3  */}
            <div className="stat-card glass-panel absolute bottom-24 -left-8 lg:-left-20 rounded-2xl p-4 flex items-center gap-4 z-10 w-48 shadow-tint-lg">
                <div className="w-10 h-10 rounded-full bg-teal-950 flex items-center justify-center text-teal-400 shrink-0">
                    <i className="ph-fill ph-lightning text-xl"></i>
                </div>
                <div>
                    <div className="font-mono text-xl font-bold text-teal-950 flex"><span className="counter-val" data-target="12">0</span> min</div>
                    <div className="text-[10px] uppercase tracking-wider text-warm-600 font-semibold mt-0.5">Response Time</div>
                </div>
            </div>
            
            {/*  Abstract background shape  */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-100/50 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        </div>
    </section>

    {/*  3. Logo Bar  */}
    <section className="py-12 bg-warm-100/50 border-y border-warm-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <p className="text-sm font-semibold text-warm-600 uppercase tracking-[0.2em] mb-8">Trusted by scaling B2B brands</p>
            <div className="marquee-container relative w-full">
                <div className="marquee-content flex items-center gap-16 md:gap-24 opacity-60">
                    {/*  Text SVGs simulating logos to avoid generic look  */}
                    <div className="font-display text-3xl font-bold text-warm-800">FORTUNA</div>
                    <div className="font-sans text-2xl font-bold tracking-tighter text-warm-800 flex items-center gap-1"><i className="ph-fill ph-hexagon"></i> MERIDIAN</div>
                    <div className="font-mono text-2xl font-bold text-warm-800">APEX_</div>
                    <div className="font-sans text-3xl italic font-bold text-warm-800">Catalyst</div>
                    <div className="font-display text-3xl font-bold text-warm-800">VERTEX</div>
                    <div className="font-sans text-2xl font-semibold uppercase tracking-widest text-warm-800">Pinnacle</div>
                    {/*  Duplicate for infinite scroll  */}
                    <div className="font-display text-3xl font-bold text-warm-800">FORTUNA</div>
                    <div className="font-sans text-2xl font-bold tracking-tighter text-warm-800 flex items-center gap-1"><i className="ph-fill ph-hexagon"></i> MERIDIAN</div>
                    <div className="font-mono text-2xl font-bold text-warm-800">APEX_</div>
                    <div className="font-sans text-3xl italic font-bold text-warm-800">Catalyst</div>
                </div>
            </div>
        </div>
    </section>

    {/*  4. Features (Zig-Zag)  */}
    <section id="features" className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="font-display text-5xl md:text-6xl text-offblack mb-6">Everything you need to scale</h2>
            <p className="text-lg text-warm-600">Stop wasting time on manual data entry and generic outreach. Let AI handle the heavy lifting while you focus on closing.</p>
        </div>

        <div className="flex flex-col gap-32">
            {/*  Row 1  */}
            <div className="feature-row flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                    <div className="feature-icon w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-6 shadow-tint-sm">
                        <i className="ph-fill ph-target text-3xl"></i>
                    </div>
                    <h3 className="font-display text-4xl mb-4">AI Lead Scoring</h3>
                    <p className="text-warm-600 text-lg leading-relaxed mb-6">Our predictive models analyze hundreds of signals to identify which prospects in your pipeline are actually ready to buy, right now.</p>
                    <a href="#" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-800 transition-colors">See how scoring works <i className="ph-bold ph-arrow-right"></i></a>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-tint-lg bg-white p-2 border border-warm-200">
                        <img src="/media/lead_scoring.jpg" alt="Lead Scoring" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                </div>
            </div>

            {/*  Row 2  */}
            <div className="feature-row flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-tint-lg bg-white p-2 border border-warm-200">
                        <img src="/media/email_sequences.jpg" alt="Email Sequences" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="feature-icon w-16 h-16 rounded-2xl bg-gold-50 border border-gold/20 flex items-center justify-center text-gold mb-6 shadow-sm">
                        <i className="ph-fill ph-paper-plane-tilt text-3xl"></i>
                    </div>
                    <h3 className="font-display text-4xl mb-4">Smart Email Sequences</h3>
                    <p className="text-warm-600 text-lg leading-relaxed mb-6">Generate hyper-personalized outreach based on prospect LinkedIn data, company news, and past interactions. No more generic templates.</p>
                    <a href="#" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-800 transition-colors">Explore sequences <i className="ph-bold ph-arrow-right"></i></a>
                </div>
            </div>

            {/*  Row 3  */}
            <div className="feature-row flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                    <div className="feature-icon w-16 h-16 rounded-2xl bg-teal-950 flex items-center justify-center text-teal-400 mb-6 shadow-tint-md">
                        <i className="ph-fill ph-chart-pie-slice text-3xl"></i>
                    </div>
                    <h3 className="font-display text-4xl mb-4">Pipeline Analytics</h3>
                    <p className="text-warm-600 text-lg leading-relaxed mb-6">Gain total visibility into your sales machine. Forecast revenue with 95% accuracy and spot bottlenecks before they cost you deals.</p>
                    <a href="#" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-800 transition-colors">View analytics features <i className="ph-bold ph-arrow-right"></i></a>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-tint-lg bg-white p-2 border border-warm-200">
                        <img src="/media/analytics_charts.jpg" alt="Pipeline Analytics" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  5. How It Works (Sticky Scroll Stack)  */}
    <section id="how-it-works" className="py-32 bg-teal-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6">One platform.<br />Unlimited growth.</h2>
        </div>

        <div className="sticky-stack-container max-w-4xl mx-auto px-4 md:px-8 pb-32">
            {/*  Card 1  */}
            <div className="sticky-card bg-teal-900 border border-teal-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-24 min-h-[400px] flex flex-col md:flex-row items-center gap-8 z-10">
                <div className="flex-1">
                    <div className="font-mono text-teal-400 text-lg mb-4">01.</div>
                    <h3 className="font-display text-4xl mb-4">Connect your CRM</h3>
                    <p className="text-teal-100/80 text-lg">Integrate natively with Salesforce, HubSpot, or Pipedrive in under 2 minutes. We securely pull your historical data to train the models.</p>
                </div>
                <div className="flex-1 flex justify-center">
                    <i className="ph-light ph-plugs-connected text-9xl text-teal-400/20"></i>
                </div>
            </div>
            
            {/*  Card 2  */}
            <div className="sticky-card bg-teal-800 border border-teal-700 rounded-3xl p-8 md:p-12 shadow-2xl mb-24 min-h-[400px] flex flex-col md:flex-row items-center gap-8 z-20">
                <div className="flex-1">
                    <div className="font-mono text-teal-400 text-lg mb-4">02.</div>
                    <h3 className="font-display text-4xl mb-4">AI analyzes pipeline</h3>
                    <p className="text-teal-100/80 text-lg">The system instantly flags at-risk deals, highlights overlooked opportunities, and generates next-best-action plans for every prospect.</p>
                </div>
                <div className="flex-1 flex justify-center">
                    <i className="ph-light ph-brain text-9xl text-teal-400/20"></i>
                </div>
            </div>

            {/*  Card 3  */}
            <div className="sticky-card bg-teal-600 border border-teal-500 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[400px] flex flex-col md:flex-row items-center gap-8 z-30">
                <div className="flex-1">
                    <div className="font-mono text-teal-100 text-lg mb-4">03.</div>
                    <h3 className="font-display text-4xl mb-4 text-white">Close deals faster</h3>
                    <p className="text-teal-50 text-lg">Execute outreach directly from the platform. Watch your conversion rates climb and your sales cycle shrink dramatically.</p>
                </div>
                <div className="flex-1 flex justify-center">
                    <i className="ph-light ph-rocket-launch text-9xl text-teal-100/20"></i>
                </div>
            </div>
        </div>
    </section>

    {/*  6. Inside the Platform (Bento Grid)  */}
    <section id="platform" className="py-32 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-200 text-warm-800 text-xs font-semibold tracking-wider uppercase mb-6">
                Inside the platform
            </div>
            <h2 className="font-display text-5xl text-offblack mb-6">A workspace that<br />feels like magic.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/*  Left Column: Pills  */}
            <div className="md:col-span-4 flex flex-col gap-6 justify-center">
                <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-tint-sm flex items-start gap-4 hover:-translate-y-1 transition-transform">
                    <i className="ph-fill ph-magnifying-glass text-teal-600 text-2xl mt-1"></i>
                    <div>
                        <h4 className="font-bold text-lg mb-1">Global AI Search</h4>
                        <p className="text-sm text-warm-600">Find any contact, deal, or metric instantly via natural language.</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-tint-sm flex items-start gap-4 hover:-translate-y-1 transition-transform">
                    <i className="ph-fill ph-kanban text-teal-600 text-2xl mt-1"></i>
                    <div>
                        <h4 className="font-bold text-lg mb-1">Visual Pipelines</h4>
                        <p className="text-sm text-warm-600">Drag and drop functionality with automated stage triggers.</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-tint-sm flex items-start gap-4 hover:-translate-y-1 transition-transform">
                    <i className="ph-fill ph-bell-ringing text-teal-600 text-2xl mt-1"></i>
                    <div>
                        <h4 className="font-bold text-lg mb-1">Real-time Alerts</h4>
                        <p className="text-sm text-warm-600">Get notified the exact second a prospect opens your proposal.</p>
                    </div>
                </div>
            </div>

            {/*  Right Column: Screenshot Card  */}
            <div className="md:col-span-8 bg-warm-100 rounded-3xl p-6 md:p-10 border border-warm-200 shadow-inner relative group">
                {/*  Search bar mock  */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 md:w-96 bg-white rounded-full py-2.5 px-4 shadow-tint-md flex items-center gap-2 z-20 border border-warm-200">
                    <i className="ph-regular ph-magnifying-glass text-warm-600"></i>
                    <span className="text-sm text-warm-400">Search contacts, deals, metrics...</span>
                </div>
                
                <div className="relative w-full aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-tint-xl border border-white/50 mt-10 transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
                    {/*  Ensure the generated platform.jpg exists in assets/  */}
                    <img src="assets/platform.jpg" alt="SalesForge Dashboard" className="w-full h-full object-cover" />
                </div>
                
                {/*  Decorative sparkles  */}
                <i className="ph-fill ph-sparkle absolute top-10 right-10 text-gold text-2xl"></i>
                <i className="ph-fill ph-sparkle absolute bottom-20 left-6 text-teal-400 text-xl"></i>
            </div>
        </div>
    </section>

    {/*  7. Testimonials (Single Rotating)  */}
    <section className="py-32 bg-warm-100/50 border-y border-warm-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative h-[350px]">
            {/*  Quote Icon  */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-8xl text-teal-100 font-display leading-none z-0">"</div>
            
            {/*  Slide 1  */}
            <div className="testimonial-slide absolute inset-0 pt-16 flex flex-col items-center z-10">
                <p className="font-display text-3xl md:text-4xl text-offblack mb-10 leading-snug">
                    Since implementing SalesForge AI, our SDR team has doubled their meeting booked rate. The smart email sequences are frighteningly good.
                </p>
                <div className="flex items-center gap-4">
                    <img src="https://placehold.co/100x100/0D4F4F/FFFFFF?text=MC" alt="Marcus Chen" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div className="text-left">
                        <div className="font-bold text-offblack">Marcus Chen</div>
                        <div className="text-sm text-warm-600">VP Sales, TechFlow</div>
                    </div>
                </div>
            </div>

            {/*  Slide 2  */}
            <div className="testimonial-slide absolute inset-0 pt-16 flex flex-col items-center z-0 opacity-0 pointer-events-none">
                <p className="font-display text-3xl md:text-4xl text-offblack mb-10 leading-snug">
                    The AI lead scoring is the most accurate I've seen. We no longer waste time on prospects who aren't ready to buy. It's transformed our quarter.
                </p>
                <div className="flex items-center gap-4">
                    <img src="https://placehold.co/100x100/14B8A6/FFFFFF?text=SR" alt="Sarah Rivera" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div className="text-left">
                        <div className="font-bold text-offblack">Sarah Rivera</div>
                        <div className="text-sm text-warm-600">CRO, Nexus Digital</div>
                    </div>
                </div>
            </div>

            {/*  Slide 3  */}
            <div className="testimonial-slide absolute inset-0 pt-16 flex flex-col items-center z-0 opacity-0 pointer-events-none">
                <p className="font-display text-3xl md:text-4xl text-offblack mb-10 leading-snug">
                    I was skeptical of AI in sales, but SalesForge feels like having an elite analyst working 24/7 on my pipeline. Unbelievable ROI.
                </p>
                <div className="flex items-center gap-4">
                    <img src="https://placehold.co/100x100/C8A95E/FFFFFF?text=JD" alt="James Donovan" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div className="text-left">
                        <div className="font-bold text-offblack">James Donovan</div>
                        <div className="text-sm text-warm-600">Director of Sales, Elevate</div>
                    </div>
                </div>
            </div>

            {/*  Dots  */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                <button className="testimonial-dot w-8 h-2 rounded-full bg-teal-600 transition-colors"></button>
                <button className="testimonial-dot w-8 h-2 rounded-full bg-warm-200 transition-colors"></button>
                <button className="testimonial-dot w-8 h-2 rounded-full bg-warm-200 transition-colors"></button>
            </div>
        </div>
    </section>

    {/*  8. Pricing (Asymmetric)  */}
    <section id="pricing" className="py-32 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="font-display text-5xl text-offblack mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-warm-600">Start closing more deals today. No hidden fees.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch justify-center">
            {/*  Starter Tier  */}
            <div className="w-full md:w-[40%] bg-white rounded-3xl p-8 border border-warm-200 shadow-tint-md flex flex-col">
                <h3 className="font-bold text-xl text-warm-600 mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-display">$</span>
                    <span className="text-5xl font-bold text-offblack">99</span>
                    <span className="text-warm-600">/mo</span>
                </div>
                <p className="text-sm text-warm-600 mb-8 border-b border-warm-100 pb-8">Perfect for solo founders and small sales teams getting started with AI.</p>
                
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-sm text-warm-800"><i className="ph-bold ph-check text-teal-600"></i> Up to 1,000 active contacts</li>
                    <li className="flex items-center gap-3 text-sm text-warm-800"><i className="ph-bold ph-check text-teal-600"></i> Basic AI lead scoring</li>
                    <li className="flex items-center gap-3 text-sm text-warm-800"><i className="ph-bold ph-check text-teal-600"></i> Standard email sequences</li>
                    <li className="flex items-center gap-3 text-sm text-warm-800"><i className="ph-bold ph-check text-teal-600"></i> Analytics dashboard</li>
                </ul>
                
                <button className="w-full py-3 rounded-full border border-warm-200 text-warm-800 font-bold hover:bg-warm-100 transition-colors">Book a Call</button>
            </div>

            {/*  Pro Tier (Highlighted)  */}
            <div className="w-full md:w-[60%] bg-teal-950 rounded-3xl p-8 md:p-12 border border-teal-800 shadow-tint-xl flex flex-col relative overflow-hidden text-white">
                <div className="absolute top-8 right-8 bg-gold text-warm-950 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
                
                <h3 className="font-bold text-xl text-teal-400 mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-display">$</span>
                    <span className="text-6xl font-bold">249</span>
                    <span className="text-teal-400/80">/mo</span>
                </div>
                <p className="text-sm text-teal-100/80 mb-8 border-b border-teal-800 pb-8">For scaling sales teams that need advanced automation and custom workflows.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-sm text-teal-50"><i className="ph-bold ph-check text-teal-400"></i> Unlimited contacts</li>
                    <li className="flex items-center gap-3 text-sm text-teal-50"><i className="ph-bold ph-check text-teal-400"></i> Predictive AI lead scoring</li>
                    <li className="flex items-center gap-3 text-sm text-teal-50"><i className="ph-bold ph-check text-teal-400"></i> Custom email sequences</li>
                    <li className="flex items-center gap-3 text-sm text-teal-50"><i className="ph-bold ph-check text-teal-400"></i> Advanced pipeline analytics</li>
                    <li className="flex items-center gap-3 text-sm text-teal-50"><i className="ph-bold ph-check text-teal-400"></i> CRM integrations (Salesforce, etc)</li>
                    <li className="flex items-center gap-3 text-sm text-teal-50"><i className="ph-bold ph-check text-teal-400"></i> Priority 24/7 support</li>
                </div>
                
                <button className="w-full py-4 rounded-full bg-teal-500 text-white font-bold hover:bg-teal-400 transition-colors shadow-lg">Get Started with Pro</button>
            </div>
        </div>
    </section>

    {/*  9. Final CTA  */}
    <section className="py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto mb-12">
        <div className="bg-mesh-teal rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-tint-xl">
            {/*  Decorative abstract circles  */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-800/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 mix-blend-overlay"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
                <i className="ph-fill ph-rocket-launch text-5xl text-teal-100 mb-6 mx-auto"></i>
                <h2 className="font-display text-5xl md:text-6xl text-white mb-6">Ready to transform your sales?</h2>
                <p className="text-xl text-teal-50/90 mb-10 leading-relaxed">Join thousands of B2B sellers who use SalesForge AI to automate outreach and close deals faster.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="btn-tactile w-full sm:w-auto bg-white text-teal-950 px-8 py-4 rounded-full text-base font-bold shadow-lg hover:bg-teal-50 transition-colors">
                        Book a Call
                    </button>
                    <p className="text-sm text-teal-100/70 ml-2">No credit card required.</p>
                </div>
            </div>
        </div>
    </section>

    {/*  10. Footer  */}
    <footer className="bg-warm-950 text-warm-200 py-16 px-4 md:px-8 border-t border-warm-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <i className="ph-fill ph-trend-up text-teal-500 text-3xl"></i>
                    <span className="font-display text-3xl tracking-tight text-white leading-none pt-1">SalesForge <span className="text-teal-500">AI</span></span>
                </div>
                <p className="text-warm-400 max-w-sm">The intelligence layer for modern B2B sales teams. Close more deals, spend less time.</p>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-6">Product</h4>
                <ul className="flex flex-col gap-4 text-sm text-warm-400">
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Integrations</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Changelog</a></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-6">Company</h4>
                <ul className="flex flex-col gap-4 text-sm text-warm-400">
                    <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
                </ul>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-warm-800 gap-4">
            <p className="text-sm text-warm-600">© 2024 SalesForge AI Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xl text-warm-400">
                <a href="#" className="hover:text-teal-400 transition-colors"><i className="ph-fill ph-twitter-logo"></i></a>
                <a href="#" className="hover:text-teal-400 transition-colors"><i className="ph-fill ph-linkedin-logo"></i></a>
                <a href="#" className="hover:text-teal-400 transition-colors"><i className="ph-fill ph-envelope"></i></a>
            </div>
        </div>
    </footer>

    {/*  Scripts  */}
    
    
    

    </>
  );
}
