# Project 8

## Product Vision

**FOR** college students **WHO** need real-time communication for collaboration and class updates, **COURSE CHAT** is a web and mobile service **THAT** allows students to register with their institution, add their classes each semester, automatically join classroom group chats, and easily connect with classmates without sharing personal contact information. **UNLIKE** generic chat apps, **OUR** product protects student privacy and builds a focused academic community where collaboration comes naturally.

# Prototype

# Web Frontend

This is the frontend of the project, built with **React**, **TypeScript**, **Vite** and **TailwindCSS**

---

```bash
git clone https://github.com/CSCI-40500-Fall-2025/project-8.git
cd web-frontend
npm install
npm run dev
```

Could not host on Netlify/cloud due to access issues (Repository could not be found).

## Layered Software Architecture

|                User Interface                |
| :------------------------------------------: |
| Web Browser (React, Typescript, TailwindCSS) |

---

|                                User Interface Management                                 |
| :--------------------------------------------------------------------------------------: |
| Login/Signup, JWT Authentication, Chat search and join, Real-time chat (using socket.io) |

---

|                                         Configuration Services                                          |
| :-----------------------------------------------------------------------------------------------------: |
| Course based group chats, API Endpoint Setup, Route Management (Expressjs), middleware (CORS, JWT), ENV |

---

|                                         Application Services                                          |
| :---------------------------------------------------------------------------------------------------: |
| Real-time Chat (socket.io server), Users and course management, course group chats, archived messages |

---

|                          Integrated Services                          |
| :-------------------------------------------------------------------: |
| Authentication and authorization (JWT), Token Verification Middleware |

---

|                                   Shared Infrastructure Services                                   |
| :------------------------------------------------------------------------------------------------: |
| MongoDB (users, courses, chat data), AWS + Vercel (Hosting), User Storage (MongoDB, localStorage), |

---

## Technologies used:

**FRONTEND:**
React, Typescript, TailwindCSS

**BACKEND:**
Node.js, Express.js, Socket.io (Chat system)

**Database:**
MongoDB (Database)

**HOSTING:**
AWS and Vercel (Cloud Hosting)

**TESTS:**
Jest (testing)

We are using MongoDB because of familiarity and ease of access as well as the free tier atlas db. Product will be delivered on the web (Vercel hosting). Servers will be hosted on the public cloud (AWS).

## Table 4.4 The importance of architectural design issues
**Nonfunctional Product Characteristics**
Includes attributes like security, performance, reliability, and usability that affect all users. Getting these wrong can cause commercial failure.  These qualities often conflict (e.g., performance vs. security), requiring the architect to prioritize trade-offs based on system goals.

**Product Lifetime**
A long product lifetime requires ongoing updates and adaptability to new technologies. The architecture must be evolvable and modular, enabling continuous revisions without major redesigns

**Software Reuse**

Leveraging components from other products or open-source software saves development time and cost.  This constrains the architecture since it must integrate reused modules, sometimes limiting design flexibility.

**Number of Users**

Internet-based consumer software can experience rapid fluctuations in user numbers.  The system should be scalable, supporting dynamic load balancing and elastic resource allocation to maintain performance.

**Software Compatibility**

Users often require compatibility with other systems and data formats.  Architectural choices (e.g., databases, APIs) must support interoperability and data exchange with external software.

