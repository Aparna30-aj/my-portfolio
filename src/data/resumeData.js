// Local mirror of backend/src/main/resources/resume-data.json
// Used as a fallback so the site renders even if the Spring Boot API
// isn't running (e.g. static hosting, quick preview). When the API at
// VITE_API_BASE is reachable, live data from the backend is used instead.

export const resumeData = {
  "profile": {
    "name": "Aparna Patel",
    "title": "Software Engineer",
    "tagline": "I turn critical enterprise workflows into fast, event-driven systems — and make the hard parts feel effortless.",
    "email": "aparnapatel3009@gmail.com",
    "phone": "9571468115",
    "location": "Bengaluru, India",
    "linkedin": "https://www.linkedin.com/in/aparna-patel-b49535198/",
    "github": "https://github.com/aparnapatel",
    "summary": "Software engineer who loves turning complex problems into elegant, dependable products. I build resilient Java systems with microservices, asynchronous messaging, performance engineering, and practical AI — always curious about the next technology worth exploring.",
    "about": [
      "I am a software engineer who genuinely enjoys the craft of coding — breaking down complex problems, designing clean solutions, and turning ideas into systems people can rely on.",
      "At CGI, I build and modernise enterprise platforms for oil & gas and gas transportation. My work spans Java, Spring Boot, microservices, event-driven workflows, performance tuning, and production support across systems used on two continents.",
      "I am at my best when there is a difficult problem to untangle: making an API faster, reducing operational noise, or simplifying a legacy workflow. I also love exploring new technology, especially where AI can make engineering teams faster and support experiences smarter."
    ]
  },
  "skills": {
    "Languages": [
      "Java",
      "JavaScript"
    ],
    "Backend": [
      "Spring Boot",
      "Spring MVC",
      "Spring Cloud (Eureka, API Gateway)",
      "REST APIs",
      "JUnit5",
      "Microservices",
      "Spring AI"
    ],
    "Messaging & Eventing": [
      "RabbitMQ",
      "Kafka",
      "Event-Driven Architecture"
    ],
    "Frontend": [
      "React.js",
      "PrimeFaces (JSF)",
      "HTML",
      "CSS"
    ],
    "Databases": [
      "SQL",
      "MongoDB",
      "VectorDB"
    ],
    "Concepts": [
      "OOP",
      "SOLID Principles",
      "Multi-Threading",
      "Data Structures & Algorithms",
      "RAG"
    ],
    "Tools & Platforms": [
      "Jenkins",
      "Git",
      "Postman",
      "ServiceNow",
      "Azure",
      "AWS",
      "Docker",
      "JasperReports",
      "OpenAI",
      "Gemini"
    ]
  },
  "experience": [
    {
      "company": "CGI India",
      "role": "Software Engineer",
      "duration": "06/2022 - Present",
      "location": "Bengaluru, India",
      "projects": [
        {
          "name": "Ovintiv, Canada",
          "duration": "05/2024 - Present",
          "domain": "Oil & Gas Operations Platform",
          "highlights": [
            "Moved the Travel Replacement and Plan Notification workflows off synchronous calls and onto Spring Boot services talking through Azure Service Bus, so slow downstream steps no longer stall the whole request.",
            "Built a RabbitMQ-backed alerting pipeline feeding a React subscription UI, which cut the time it takes the ops team to hear about an ITSM incident by roughly 70%.",
            "Traced a set of high-traffic endpoints back to sequential blocking calls and rewrote the hot path with CompletableFuture and Spring @Async, bringing response times down about 64%.",
            "Noticed 8+ microservices were each handling errors their own way, so I built one shared exception-handling framework for all of them \u2014 inconsistent error responses dropped by around 40%.",
            "Went back through the service and controller layers adding unit and integration tests where coverage was thin, which made releases noticeably less nerve-wracking for the team.",
            "Designed and built a React dashboard that turns raw KPI and incident data into something operations can actually read at a glance, replacing a manual reporting process.",
            "Ran root-cause investigations across 10+ services with the AMS and onshore teams \u2014 mostly log correlation and performance profiling \u2014 that brought recurring incidents down by about 35%.",
            "Wired Spring AI into Azure OpenAI to build an AI help desk that triages incoming issues and suggests fixes automatically, effectively giving the incident management process a first responder."
          ]
        },
        {
          "name": "GTMS \u2014 Gas Transportation Management System",
          "duration": "06/2022 - 04/2024",
          "domain": "Enterprise Gas Transportation Platform (Northern Ireland & ROI)",
          "highlights": [
            "Built out and maintained the Capacity, Allocation, Scheduling, and Billing modules in Java and Spring MVC \u2014 the core logic a national-scale gas transportation platform runs on.",
            "Rewrote the billing and capacity calculations to run on ExecutorService-based parallel processing instead of sequentially, which made both the backend and the UI feel noticeably faster on large transaction volumes.",
            "Went through the slowest queries across Billing, Allocation, and Capacity one by one and rewrote them for the actual access patterns, cutting execution time by up to 50%.",
            "Led the migration off RichFaces onto PrimeFaces within the existing Spring MVC app \u2014 page loads dropped 53% and the UI felt about 30% more responsive.",
            "Rebuilt the Jasper reports for Transportation, Allocation, and Billing, tightening the underlying queries and templates so generation time fell by 40%.",
            "Kept the Jenkins CI/CD pipelines and AWS EC2 deployments running smoothly \u2014 watching builds, coordinating releases, catching problems before they shipped.",
            "Helped prototype a Spring Boot + Angular version of the legacy Spring MVC app as a step toward microservices \u2014 the work was recognized at a company Kaizen event for process improvement."
          ]
        }
      ]
    }
  ],
  "education": [
    {
      "school": "National Institute of Technology, Jalandhar",
      "degree": "B.Tech, Mechanical Engineering",
      "duration": "07/2018 - 05/2022",
      "location": "Jalandhar, India",
      "gpa": "CGPA - 7.41"
    }
  ],
  "awards": [
    "Best Collaborative Performer \u2014 recognized for how consistently teamwork showed up across cross-team projects, not just individual output.",
    "Kaizen event recognition for the Spring Boot + Angular modernization proof-of-concept, as part of the broader push to move the platform toward microservices."
  ]
};
