"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  LogOut,
  User,
  ArrowRight,
  Lock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  UserPlus,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"

// Interfaces
interface Question {
  id: number
  section: string
  text: string
  options?: string[]
  answer?: string
  description?: string
  constraints?: string[]
  examples?: { input: string; output: string }[]
  testCases?: { input: string; output: string }[]
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface ExamSubmission {
  id: number
  userId: number
  userName: string
  userEmail: string
  submissionDate: string
  score: number
  answers: {
    [questionId: number]: string
  }
  codingAnswers: {
    [questionId: number]: string
  }
}

const SECTIONS = ["mcqs", "aptitude", "ai", "coding"]

const SubmissionDetails: React.FC<{ submission: ExamSubmission | null; onClose: () => void }> = ({
  submission,
  onClose,
}) => {
  if (!submission) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#6366F1]">Submission Details</h1>
          <Button onClick={onClose} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Submissions
          </Button>
        </div>
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">User Information</h2>
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="text-xl mt-1">{submission.userName}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="text-xl mt-1">{submission.userEmail}</p>
              </div>
              <div>
                <Label className="text-gray-600">Submission Date</Label>
                <p className="text-xl mt-1">{new Date(submission.submissionDate).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-gray-600">Score</Label>
                <p className="text-xl mt-1">{submission.score}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold mb-6">Answers</h2>
            <div className="space-y-6">
              {Object.entries(submission.answers).map(([questionId, answer]) => (
                <div key={questionId}>
                  <Label className="text-gray-600">Question {questionId}</Label>
                  <p className="text-xl mt-1">{answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Coding Answers</h2>
            <div className="space-y-6">
              {Object.entries(submission.codingAnswers).map(([questionId, answer]) => (
                <div key={questionId} className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-lg font-medium">Question {questionId}</Label>
                  <pre className="text-lg mt-2 whitespace-pre-wrap bg-white p-4 rounded border">{answer}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main AdminPortal component
export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    section: "",
    text: "",
    options: ["", "", "", ""],
    answer: "",
    description: "",
    constraints: [""],
    examples: [{ input: "", output: "" }],
    testCases: [{ input: "", output: "" }],
  })
  const [users, setUsers] = useState<User[]>([])
  const [examSubmissions, setExamSubmissions] = useState<ExamSubmission[]>([])
  const [activeSection, setActiveSection] = useState<"questions" | "users" | "submissions" | "signup" | null>(null)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "User" })
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null)

  useEffect(() => {
    // Mock initial data
    setQuestions([
      {
        id: 1,
        section: "mcqs",
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
      },
      {
        id: 2,
        section: "aptitude",
        text: "If a train travels 420 kilometers in 7 hours, what is its speed in kilometers per hour?",
        options: ["50 km/h", "60 km/h", "65 km/h", "70 km/h"],
        answer: "60 km/h",
      },
      {
        id: 3,
        section: "coding",
        text: "Write a function to reverse a string.",
        description: "Implement a function that takes a string as input and returns the reverse of that string.",
        constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
        examples: [{ input: '"hello"', output: '"olleh"' }],
      },
      {
        id: 4,
        section: "ai",
        text: "Which of these is NOT a type of machine learning?",
        options: ["Supervised Learning", "Unsupervised Learning", "Peripheral Learning", "Reinforcement Learning"],
        answer: "Peripheral Learning",
      },
    ])
    setUsers([
      { id: 1, name: "Admin User", email: "admin@gmail.com", role: "Admin" },
      { id: 2, name: "Test User", email: "test@example.com", role: "User" },
    ])
    setExamSubmissions([
      {
        id: 1,
        userId: 2,
        userName: "Test User",
        userEmail: "test@example.com",
        submissionDate: "2023-05-15T10:30:00Z",
        score: 85,
        answers: {
          1: "Paris",
          2: "60 km/h",
          4: "Peripheral Learning",
        },
        codingAnswers: {
          3: "function reverseString(s) {\n  return s.split('').reverse().join('');\n}",
        },
      },
    ])
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "admin@gmail.com" && password === "admin123") {
      setIsLoggedIn(true)
    } else {
      alert("Invalid credentials")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail("")
    setPassword("")
    setActiveSection(null)
  }

  const handleAddQuestion = () => {
    const newId = newQuestion.id || (questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1)
    setQuestions([...questions, { ...newQuestion, id: newId }])
    setNewQuestion({
      id: 0,
      section: "",
      text: "",
      options: ["", "", "", ""],
      answer: "",
      description: "",
      constraints: [""],
      examples: [{ input: "", output: "" }],
      testCases: [{ input: "", output: "" }],
    })
  }

  const handleUpdateQuestion = () => {
    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q)))
      setEditingQuestion(null)
    }
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    const newUserId = users.length + 1
    setUsers([...users, { ...newUser, id: newUserId }])
    setNewUser({ name: "", email: "", password: "", role: "User" })
    alert("User signed up successfully!")
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LNRS TECH Admin
              </h2>
              <p className="text-gray-600 mt-2">Sign in to access the admin portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="admin@gmail.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <span>Sign In</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex space-x-4">
          <Button
            onClick={() => setActiveSection(activeSection === "questions" ? null : "questions")}
            variant={activeSection === "questions" ? "default" : "outline"}
          >
            Question Management
          </Button>
          <Button
            onClick={() => setActiveSection(activeSection === "users" ? null : "users")}
            variant={activeSection === "users" ? "default" : "outline"}
          >
            User Management
          </Button>
          <Button
            onClick={() => setActiveSection(activeSection === "submissions" ? null : "submissions")}
            variant={activeSection === "submissions" ? "default" : "outline"}
          >
            Exam Submissions
          </Button>
          <Button
            onClick={() => setActiveSection(activeSection === "signup" ? null : "signup")}
            variant={activeSection === "signup" ? "default" : "outline"}
          >
            User Sign Up
          </Button>
        </div>

        {activeSection === "questions" && (
          <div className="space-y-8">
            {/* Add New Question Form */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="questionId">Question ID</Label>
                  <Input
                    id="questionId"
                    value={newQuestion.id}
                    onChange={(e) => setNewQuestion({ ...newQuestion, id: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Enter question ID"
                    type="number"
                  />
                </div>
                <Select
                  value={newQuestion.section}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Question text"
                />
                {newQuestion.section !== "coding" && (
                  <>
                    {newQuestion.options?.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(newQuestion.options || [])]
                          newOptions[index] = e.target.value
                          setNewQuestion({ ...newQuestion, options: newOptions })
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                    <Input
                      value={newQuestion.answer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                      placeholder="Correct answer"
                    />
                  </>
                )}
                {newQuestion.section === "coding" && (
                  <>
                    <Textarea
                      value={newQuestion.description}
                      onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                      placeholder="Problem description"
                    />
                    {newQuestion.constraints?.map((constraint, index) => (
                      <Input
                        key={index}
                        value={constraint}
                        onChange={(e) => {
                          const newConstraints = [...(newQuestion.constraints || [])]
                          newConstraints[index] = e.target.value
                          setNewQuestion({ ...newQuestion, constraints: newConstraints })
                        }}
                        placeholder={`Constraint ${index + 1}`}
                      />
                    ))}
                    <Button
                      onClick={() =>
                        setNewQuestion({ ...newQuestion, constraints: [...(newQuestion.constraints || []), ""] })
                      }
                      variant="outline"
                    >
                      Add Constraint
                    </Button>
                    {newQuestion.testCases?.map((testCase, index) => (
                      <div key={index} className="space-y-2">
                        <Input
                          value={testCase.input}
                          onChange={(e) => {
                            const newTestCases = [...(newQuestion.testCases || [])]
                            newTestCases[index].input = e.target.value
                            setNewQuestion({ ...newQuestion, testCases: newTestCases })
                          }}
                          placeholder={`Test Case ${index + 1} Input`}
                        />
                        <Input
                          value={testCase.output}
                          onChange={(e) => {
                            const newTestCases = [...(newQuestion.testCases || [])]
                            newTestCases[index].output = e.target.value
                            setNewQuestion({ ...newQuestion, testCases: newTestCases })
                          }}
                          placeholder={`Test Case ${index + 1} Output`}
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        setNewQuestion({
                          ...newQuestion,
                          testCases: [...(newQuestion.testCases || []), { input: "", output: "" }],
                        })
                      }
                      variant="outline"
                    >
                      Add Test Case
                    </Button>
                  </>
                )}
              </div>
              <Button onClick={handleAddQuestion} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            {/* Existing Questions List */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-4 gap-4">
                {SECTIONS.map((section) => (
                  <div key={section} className="space-y-4">
                    <h2 className="text-xl font-semibold">{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
                    {questions
                      .filter((q) => q.section === section)
                      .map((question, index) => (
                        <div key={question.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{`Q${index + 1}: ${question.text}`}</h3>
                              <p className="text-sm text-gray-500">ID: {question.id}</p>
                            </div>
                            <div className="space-x-2">
                              <Button onClick={() => setEditingQuestion(question)} variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button onClick={() => handleDeleteQuestion(question.id)} variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {editingQuestion?.id === question.id && (
                            <div className="mt-4 space-y-4">
                              <Textarea
                                value={editingQuestion.text}
                                onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                              />
                              {editingQuestion.section !== "coding" && (
                                <>
                                  {editingQuestion.options?.map((option, index) => (
                                    <Input
                                      key={index}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(editingQuestion.options || [])]
                                        newOptions[index] = e.target.value
                                        setEditingQuestion({ ...editingQuestion, options: newOptions })
                                      }}
                                    />
                                  ))}
                                  <Input
                                    value={editingQuestion.answer}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                                    placeholder="Correct answer"
                                  />
                                </>
                              )}
                              {editingQuestion.section === "coding" && (
                                <>
                                  <Textarea
                                    value={editingQuestion.description}
                                    onChange={(e) =>
                                      setEditingQuestion({ ...editingQuestion, description: e.target.value })
                                    }
                                    placeholder="Problem description"
                                  />
                                  {editingQuestion.constraints?.map((constraint, index) => (
                                    <Input
                                      key={index}
                                      value={constraint}
                                      onChange={(e) => {
                                        const newConstraints = [...(editingQuestion.constraints || [])]
                                        newConstraints[index] = e.target.value
                                        setEditingQuestion({ ...editingQuestion, constraints: newConstraints })
                                      }}
                                    />
                                  ))}
                                  {editingQuestion.testCases?.map((testCase, index) => (
                                    <div key={index} className="space-y-2">
                                      <Input
                                        value={testCase.input}
                                        onChange={(e) => {
                                          const newTestCases = [...(editingQuestion.testCases || [])]
                                          newTestCases[index].input = e.target.value
                                          setEditingQuestion({ ...editingQuestion, testCases: newTestCases })
                                        }}
                                        placeholder={`Test Case ${index + 1} Input`}
                                      />
                                      <Input
                                        value={testCase.output}
                                        onChange={(e) => {
                                          const newTestCases = [...(editingQuestion.testCases || [])]
                                          newTestCases[index].output = e.target.value
                                          setEditingQuestion({ ...editingQuestion, testCases: newTestCases })
                                        }}
                                        placeholder={`Test Case ${index + 1} Output`}
                                      />
                                    </div>
                                  ))}
                                </>
                              )}
                              <div className="flex justify-end space-x-2">
                                <Button onClick={handleUpdateQuestion} variant="outline" size="sm">
                                  <Save className="w-4 h-4 mr-2" />
                                  Save
                                </Button>
                                <Button onClick={() => setEditingQuestion(null)} variant="outline" size="sm">
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "users" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="ml-2">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "submissions" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Exam Submissions</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.id}</TableCell>
                      <TableCell>{submission.userName}</TableCell>
                      <TableCell>{submission.userEmail}</TableCell>
                      <TableCell>{new Date(submission.submissionDate).toLocaleString()}</TableCell>
                      <TableCell>{submission.score}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeSection === "signup" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Sign Up</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setNewUser({ name: "", email: "", password: "", role: "User" })}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        )}

        {selectedSubmission && (
          <SubmissionDetails submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
        )}
      </div>
    </div>
  )
}

