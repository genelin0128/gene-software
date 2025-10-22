const About = () => {
    return (
        <section className="mt-5">
            <div className="grid xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
                <div className="col-span-1 xl:row-span-3">
                    <div
                        className="w-full h-full border border-[#1f2937] bg-[#374151] rounded-lg p-4 sm:p-7 flex flex-col gap-4">

                        {/* Image stack: background + centered circular avatar */}
                        <div className="relative w-full h-[260px] sm:h-[420px] rounded-xl overflow-hidden">
                            {/* Background image covers the container; slight blur and dim for contrast */}
                            <img
                                src="/images/background.jpeg"
                                alt="background"
                                className="absolute inset-0 w-full h-full object-cover scale-[1.06] filter blur-[1px] brightness-90"
                            />

                            {/* Circular avatar centered via transforms; mobile/desktop sizes differ */}
                            <div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-36 h-36 sm:w-56 sm:h-56 rounded-full overflow-hidden
                                bg-[#0b0b0c] ring-2 ring-white/70 shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                                aria-label="Profile avatar"
                            >
                                {/* object-cover ensures the image fills the circle (accepts minor cropping) */}
                                <img
                                    src="/images/avatar.jpeg"
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="px-3 flex flex-col gap-2">
                            {/* Headline */}
                            <p className="text-xl font-semibold text-white">Hi, I’m Gene</p>

                            {/* About: concise, professional, focused on web development */}
                            <p className="text-base text-[#afb0b6] leading-relaxed max-w-prose">
                                I’m an MCS candidate at Rice (Dec 2025) focused on modern web development.
                                I work across React/Next.js on the front end and Node/Express on the back end.
                                At Paycom, I delivered an internal “UI Playroom” that let engineers rapidly build pages
                                and components via drag-and-drop.
                                Previously at SXB, I built a MySQL-backed billing system and Python ETL that automated
                                invoice generation and reconciliation, streamlined payment tracking, and reduced manual
                                work. I enjoy turning ambiguous requirements into reliable, scalable web applications.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
