import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return (
            <main className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <h1 className="text-2xl font-semibold animate-pulse">
                    Loading your interview plan...
                </h1>
            </main>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 px-6 py-10">

            {/* Header */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">
                    Create Your Custom <span className="text-indigo-400">Interview Plan</span>
                </h1>
                <p className="text-gray-400 mt-3">
                    Let AI analyze the job requirements and your profile to build a winning strategy.
                </p>
            </header>

            {/* Main Card */}
            <div className="max-w-6xl mx-auto bg-gray-900 rounded-xl shadow-lg border border-gray-800">

                <div className="grid md:grid-cols-2 gap-6 p-6">

                    {/* Left Panel */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-lg font-semibold">Target Job Description</h2>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                Required
                            </span>
                        </div>

                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={`Paste the full job description here...
e.g. 'Senior Frontend Engineer at Google requires proficiency in React...'`}
                        />

                        <div className="text-xs text-gray-500 mt-2">
                            {jobDescription.length} / 5000 chars
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div>

                        <h2 className="text-lg font-semibold mb-4">Your Profile</h2>

                        {/* Resume Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Upload Resume
                                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                    Best Results
                                </span>
                            </label>

                            <label
                                htmlFor="resume"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition"
                            >
                                <p className="text-sm text-gray-300">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF or DOCX (Max 5MB)
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    id="resume"
                                    accept=".pdf,.docx"
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-gray-700"></div>
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-700"></div>
                        </div>

                        {/* Self Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Quick Self Description
                            </label>

                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe your experience, skills, and years of experience..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-400">
                            Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required.
                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-800 p-5">

                    <span className="text-sm text-gray-500">
                        AI Strategy Generation • Approx 30s
                    </span>

                    <button
                        onClick={handleGenerateReport}
                        className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2"
                    >
                        Generate My Interview Strategy
                    </button>

                </div>
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
                <section className="max-w-6xl mx-auto mt-10">

                    <h2 className="text-xl font-semibold mb-4">
                        My Recent Interview Plans
                    </h2>

                    <ul className="grid md:grid-cols-3 gap-4">
                        {reports.map(report => (
                            <li
                                key={report._id}
                                onClick={() => navigate(`/interview/${report._id}`)}
                                className="bg-gray-900 border border-gray-800 rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition"
                            >
                                <h3 className="font-medium mb-2">
                                    {report.title || 'Untitled Position'}
                                </h3>

                                <p className="text-xs text-gray-500 mb-2">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </p>

                                <p className={`text-sm font-semibold 
                                    ${report.matchScore >= 80 ? 'text-green-400' :
                                        report.matchScore >= 60 ? 'text-yellow-400' :
                                            'text-red-400'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm mt-12 space-x-6">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Help Center</a>
            </footer>

        </div>
    )
}

export default Home