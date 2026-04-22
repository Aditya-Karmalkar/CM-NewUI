import React from "react";

const Integration = () => {
  const integrations = [
    { name: "Electronic Health Records", delay: "0" },
    { name: "Pharmacy Systems", delay: "100" },
    { name: "Fitness Trackers", delay: "200" },
    { name: "Mobile Health Apps", delay: "300" },
    { name: "Telemedicine Platforms", delay: "400" },
    { name: "Medical Devices", delay: "500" },
  ];

  return (
    <section aria-labelledby="integration-heading" className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#f8fafc] rounded-[48px] p-12 md:p-20 border border-gray-100 shadow-xl shadow-blue-500/5">
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="text-xs font-bold text-[#0068ff] uppercase tracking-widest">Ecosystem</span>
              </div>
              <h2 id="integration-heading" className="text-4xl md:text-5xl font-bold text-[#111] mb-8 tracking-tight leading-tight">
                Seamless <span className="text-[#0068ff]">Integrations</span>
              </h2>
              <p className="text-lg text-[#595959] font-medium leading-relaxed mb-10 max-w-xl">
                Curamind works with your existing health technology ecosystem, from 
                Electronic Health Records to your favorite wearable devices.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex-none w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0068ff]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#111] font-bold text-sm tracking-tight">{integration.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button className="px-8 py-4 bg-[#0068ff] text-white hover:bg-blue-600 font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center gap-3">
                  Check Documentation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="hidden lg:block relative text-center">
              {/* This could be a visual representation of the ecosystem */}
              <div className="inline-block p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100 rotate-2">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                      <div className="w-10 h-10 bg-blue-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                      <div className="w-10 h-10 bg-green-200 rounded-full animate-pulse delay-75"></div>
                    </div>
                    <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center border border-yellow-100">
                      <div className="w-10 h-10 bg-yellow-200 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
                      <div className="w-10 h-10 bg-purple-200 rounded-full animate-pulse delay-300"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
