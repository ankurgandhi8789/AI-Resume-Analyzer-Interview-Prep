
import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions' },
    { id: 'behavioral', label: 'Behavioral Questions' },
    { id: 'roadmap', label: 'Road Map' },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg mb-4">
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between cursor-pointer p-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-pink-400 font-semibold">
                        Q{index + 1}
                    </span>
                    <p className="text-gray-200">{item.question}</p>
                </div>

                <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </div>

            {open && (
                <div className="px-4 pb-4 space-y-4">
                    <div>
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            Intention
                        </span>
                        <p className="text-gray-300 mt-2">{item.intention}</p>
                    </div>

                    <div>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Model Answer
                        </span>
                        <p className="text-gray-300 mt-2">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
            <span className="bg-pink-600 text-xs px-2 py-1 rounded">
                Day {day.day}
            </span>
            <h3 className="font-semibold text-gray-200">{day.focus}</h3>
        </div>

        <ul className="space-y-2">
            {day.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mt-2"></span>
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {

    const [activeNav, setActiveNav] = useState("technical")
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="flex items-center justify-center h-screen bg-gray-950 text-white">
                Loading your interview plan...
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80
            ? "text-green-400"
            : report.matchScore >= 60
                ? "text-yellow-400"
                : "text-red-400"

    return (
        <div className="min-h-screen bg-[#1c1c1c] text-gray-200 p-6">

            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

                {/* LEFT NAV */}
                <nav className="col-span-2  border border-gray-800 rounded-lg p-4 h-fit">

                    <p className="text-xs text-gray-400 mb-4">Sections</p>

                    <div className="flex flex-col gap-2">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`text-left px-3 py-2 rounded-md text-sm
                                ${activeNav === item.id
                                        ? "bg-pink-600 text-white"
                                        : "hover:bg-gray-800 text-gray-300"}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-sm py-2 rounded-md"
                    >
                        Download Resume
                    </button>
                </nav>

                {/* CENTER CONTENT */}
                <main className="col-span-7">

                    {activeNav === "technical" && (
                        <>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Technical Questions
                                </h2>

                                <span className="text-sm text-gray-400">
                                    {report.technicalQuestions.length} questions
                                </span>
                            </div>

                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </>
                    )}

                    {activeNav === "behavioral" && (
                        <>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Behavioral Questions
                                </h2>

                                <span className="text-sm text-gray-400">
                                    {report.behavioralQuestions.length} questions
                                </span>
                            </div>

                            {report.behavioralQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </>
                    )}

                    {activeNav === "roadmap" && (
                        <>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Preparation Road Map
                                </h2>

                                <span className="text-sm text-gray-400">
                                    {report.preparationPlan.length}-day plan
                                </span>
                            </div>

                            {report.preparationPlan.map(day => (
                                <RoadMapDay key={day.day} day={day} />
                            ))}
                        </>
                    )}

                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="col-span-3 space-y-6">

                    {/* MATCH SCORE */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">

                        <p className="text-sm text-gray-400 mb-2">
                            Match Score
                        </p>

                        <div className={`text-5xl font-bold ${scoreColor}`}>
                            {report.matchScore}%
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Strong match for this role
                        </p>

                    </div>

                    {/* SKILL GAPS */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">

                        <p className="text-sm text-gray-400 mb-4">
                            Skill Gaps
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {report.skillGaps.map((gap, i) => (
                                <span
                                    key={i}
                                    className={`text-xs px-2 py-1 rounded
                                    ${gap.severity === "high"
                                            ? "bg-red-500/20 text-red-400"
                                            : gap.severity === "medium"
                                                ? "bg-yellow-500/20 text-yellow-400"
                                                : "bg-green-500/20 text-green-400"
                                        }`}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>

                    </div>

                </aside>

            </div>
        </div>
    )
}

export default Interview


// import React, { useState, useEffect } from 'react'
// import { useInterview } from '../hooks/useInterview.js'
// import { useNavigate, useParams } from 'react-router'



// const NAV_ITEMS = [
//     { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
//     { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
//     { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
// ]

// // ── Sub-components ────────────────────────────────────────────────────────────
// const QuestionCard = ({ item, index }) => {
//     const [ open, setOpen ] = useState(false)
//     return (
//         <div className='q-card'>
//             <div className='q-card__header' onClick={() => setOpen(o => !o)}>
//                 <span className='q-card__index'>Q{index + 1}</span>
//                 <p className='q-card__question'>{item.question}</p>
//                 <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
//                 </span>
//             </div>
//             {open && (
//                 <div className='q-card__body'>
//                     <div className='q-card__section'>
//                         <span className='q-card__tag q-card__tag--intention'>Intention</span>
//                         <p>{item.intention}</p>
//                     </div>
//                     <div className='q-card__section'>
//                         <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
//                         <p>{item.answer}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// const RoadMapDay = ({ day }) => (
//     <div className='roadmap-day'>
//         <div className='roadmap-day__header'>
//             <span className='roadmap-day__badge'>Day {day.day}</span>
//             <h3 className='roadmap-day__focus'>{day.focus}</h3>
//         </div>
//         <ul className='roadmap-day__tasks'>
//             {day.tasks.map((task, i) => (
//                 <li key={i}>
//                     <span className='roadmap-day__bullet' />
//                     {task}
//                 </li>
//             ))}
//         </ul>
//     </div>
// )

// // ── Main Component ────────────────────────────────────────────────────────────
// const Interview = () => {
//     const [ activeNav, setActiveNav ] = useState('technical')
//     const { report, getReportById, loading, getResumePdf } = useInterview()
//     const { interviewId } = useParams()

//     useEffect(() => {
//         if (interviewId) {
//             getReportById(interviewId)
//         }
//     }, [ interviewId ])



//     if (loading || !report) {
//         return (
//             <main className='loading-screen'>
//                 <h1>Loading your interview plan...</h1>
//             </main>
//         )
//     }

//     const scoreColor =
//         report.matchScore >= 80 ? 'score--high' :
//             report.matchScore >= 60 ? 'score--mid' : 'score--low'


//     return (
//         <div className='interview-page'>
//             <div className='interview-layout'>

//                 {/* ── Left Nav ── */}
//                 <nav className='interview-nav'>
//                     <div className="nav-content">
//                         <p className='interview-nav__label'>Sections</p>
//                         {NAV_ITEMS.map(item => (
//                             <button
//                                 key={item.id}
//                                 className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
//                                 onClick={() => setActiveNav(item.id)}
//                             >
//                                 <span className='interview-nav__icon'>{item.icon}</span>
//                                 {item.label}
//                             </button>
//                         ))}
//                     </div>
//                     <button
//                         onClick={() => { getResumePdf(interviewId) }}
//                         className='button primary-button' >
//                         <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
//                         Download Resume
//                     </button>
//                 </nav>

//                 <div className='interview-divider' />

//                 {/* ── Center Content ── */}
//                 <main className='interview-content'>
//                     {activeNav === 'technical' && (
//                         <section>
//                             <div className='content-header'>
//                                 <h2>Technical Questions</h2>
//                                 <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
//                             </div>
//                             <div className='q-list'>
//                                 {report.technicalQuestions.map((q, i) => (
//                                     <QuestionCard key={i} item={q} index={i} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {activeNav === 'behavioral' && (
//                         <section>
//                             <div className='content-header'>
//                                 <h2>Behavioral Questions</h2>
//                                 <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
//                             </div>
//                             <div className='q-list'>
//                                 {report.behavioralQuestions.map((q, i) => (
//                                     <QuestionCard key={i} item={q} index={i} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {activeNav === 'roadmap' && (
//                         <section>
//                             <div className='content-header'>
//                                 <h2>Preparation Road Map</h2>
//                                 <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
//                             </div>
//                             <div className='roadmap-list'>
//                                 {report.preparationPlan.map((day) => (
//                                     <RoadMapDay key={day.day} day={day} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}
//                 </main>

//                 <div className='interview-divider' />

//                 {/* ── Right Sidebar ── */}
//                 <aside className='interview-sidebar'>

//                     {/* Match Score */}
//                     <div className='match-score'>
//                         <p className='match-score__label'>Match Score</p>
//                         <div className={`match-score__ring ${scoreColor}`}>
//                             <span className='match-score__value'>{report.matchScore}</span>
//                             <span className='match-score__pct'>%</span>
//                         </div>
//                         <p className='match-score__sub'>Strong match for this role</p>
//                     </div>

//                     <div className='sidebar-divider' />

//                     {/* Skill Gaps */}
//                     <div className='skill-gaps'>
//                         <p className='skill-gaps__label'>Skill Gaps</p>
//                         <div className='skill-gaps__list'>
//                             {report.skillGaps.map((gap, i) => (
//                                 <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
//                                     {gap.skill}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>

//                 </aside>
//             </div>
//         </div>
//     )
// }

// export default Interview