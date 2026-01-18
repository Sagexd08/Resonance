'use client';

import { Github, Twitter, Linkedin, Send } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-[#030308] pt-24 pb-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="font-bold text-white text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Resonance</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                            Empowering teams with emotional intelligence. Built for the future of work where mental health is a priority, not an afterthought.
                        </p>

                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4">
                            {['Features', 'Integrations', 'Enterprise', 'Changelog', 'Docs'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors block hover:translate-x-1 duration-200">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors block hover:translate-x-1 duration-200">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">Get the latest insights on team wellness.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Resonance Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500 font-medium">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
