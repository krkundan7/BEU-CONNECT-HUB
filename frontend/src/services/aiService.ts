export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: 'english' | 'hindi' | 'hinglish';
  category?: string;
  suggestedFollowups?: string[];
}

export const AIService = {
  getWelcomeMessage: (studentName: string, branch: string, semester: number): AIChatMessage => {
    return {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Hello ${studentName}! 👋 I am **BEU AI**, your dedicated academic assistant tailored for Bihar Engineering University (${branch} Semester ${semester}).\n\nI can help you with:\n• Explaining complex engineering topics step-by-step\n• High-frequency BEU PYQ pattern breakdowns\n• Generating personalized exam revision timetables\n• Practice questions with model solutions (English, हिन्दी or Hinglish)\n\nWhat would you like to learn today?`,
      timestamp: 'Just now',
      suggestedFollowups: [
        'Explain AVL Tree Rotations with numerical example',
        'What are the most frequent DBMS topics in BEU exams?',
        'Create a 5-day study plan for DSA Mid-Sem',
        'Explain BCNF Normalization in Hinglish'
      ]
    };
  },

  generateResponse: async (query: string, language: 'english' | 'hindi' | 'hinglish' = 'english', contextBranch = 'CSE', contextSemester = 3): Promise<AIChatMessage> => {
    // Simulate natural AI thinking latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const lower = query.toLowerCase();

    let responseText = '';
    let suggestedFollowups: string[] = [];

    // AVL Tree & Tree topics
    if (lower.includes('avl') || (lower.includes('tree') && (lower.includes('rotation') || lower.includes('bst')))) {
      if (language === 'hinglish') {
        responseText = `### 🌲 AVL Tree Rotations Simplified (BEU End-Sem Focus)

AVL Tree ek **Self-Balancing Binary Search Tree** hota hai jisme har node ka **Balance Factor (BF)** calculate hota hai:
$$\\text{BF} = \\text{Height of Left Subtree} - \\text{Height of Right Subtree}$$
Valid BF values: \`-1, 0, +1\`. Agar BF \`+2\` ya \`-2\` ho jata hai, to hum **4 types ke Rotations** use karte hain:

1. **LL (Left-Left) Rotation**: Single **Right** rotation lagta hai.
2. **RR (Right-Right) Rotation**: Single **Left** rotation lagta hai.
3. **LR (Left-Right) Rotation**: Double rotation: Pehle Left child pe Left rotation, fir Root pe Right rotation.
4. **RL (Right-Left) Rotation**: Double rotation: Pehle Right child pe Right rotation, fir Root pe Left rotation.

> 🔴 **BEU PYQ Pattern Note**: BEU End-Sem exam me AVL Tree se 14-marks ka numerical lagbhag har saal pucha jata hai. (e.g. Insert values: 10, 20, 30, 40, 50, 25 and balance it).`;
      } else if (language === 'hindi') {
        responseText = `### 🌲 एवीएल ट्री और रोटेशन (AVL Tree Rotations)

एवीएल ट्री एक **सेल्फ-बैलेंसिंग बाइनरी सर्च ट्री** है जिसमें प्रत्येक नोड का बैलेंस फैक्टर (Balance Factor) केवल **-1, 0 या +1** हो सकता है।

**चार मुख्य रोटेशन:**
1. **एलएल (LL) रोटेशन:** जब बाएं सबट्री के बाएं नोड पर इंसर्शन होता है (Right Rotate)।
2. **आरआर (RR) रोटेशन:** जब दाएं सबट्री के दाएं नोड पर इंसर्शन होता है (Left Rotate)।
3. **एलआर (LR) रोटेशन:** बाएं सबट्री के दाएं नोड पर (पहले Left फिर Right)।
4. **आरएल (RL) रोटेशन:** दाएं सबट्री के बाएं नोड पर (पहले Right फिर Left)।

> ⚠️ *नोट:* यह जानकारी पिछले बीईयू प्रश्न पत्रों के आधार पर तैयार की गई है। कृपया आधिकारिक पाठ्यक्रम का भी अध्ययन करें।`;
      } else {
        responseText = `### 🌲 AVL Tree & Rotations (BEU High-Yield Topic)

An **AVL Tree** is a height-balanced Binary Search Tree where for every node, the **Balance Factor (BF)** is defined as:
$$\\text{BF} = \\text{Height(Left Subtree)} - \\text{Height(Right Subtree)}$$
Permissible balance factors are strictly **\\{-1, 0, +1\\}**.

#### The 4 Critical Rotations:
1. **LL Rotation (Left of Left)**: Solved with a single **Right Rotation** around the pivot node.
2. **RR Rotation (Right of Right)**: Solved with a single **Left Rotation** around the pivot node.
3. **LR Rotation (Right of Left)**: Double rotation — Left Rotate the left child, followed by a Right Rotate on the root.
4. **RL Rotation (Left of Right)**: Double rotation — Right Rotate the right child, followed by a Left Rotate on the root.

#### Key BEU Exam Insight:
• **Time Complexity**: Insertion, Deletion, and Search are guaranteed $\\mathcal{O}(\\log n)$.
• **Frequent Question**: 14 marks step-by-step tree construction with given sequence of keys.`;
      }

      suggestedFollowups = [
        'Show numerical step-by-step for keys: 15, 20, 24, 10, 13, 7, 30',
        'Compare AVL Tree vs Red-Black Tree in complexity',
        'Generate practice questions on Binary Search Trees'
      ];
    }
    // Normalization & DBMS
    else if (lower.includes('norm') || lower.includes('bcnf') || lower.includes('3nf') || lower.includes('dbms')) {
      if (language === 'hinglish') {
        responseText = `### 🗄️ DBMS Normalization (1NF, 2NF, 3NF & BCNF)

Normalization ka main maksad table me **Redundancy (Duplication)** aur **Anomalies (Insertion, Deletion, Update)** ko khatam karna hota hai:

| Normal Form | Condition | Elimination |
| :--- | :--- | :--- |
| **1NF** | Har attribute me sirf **Atomic (Single)** values honi chahiye. | Multi-valued attributes |
| **2NF** | 1NF hona chahiye + **No Partial Dependency** (Non-prime attribute candidate key ke subset pe depend na kare). | Partial Dependency |
| **3NF** | 2NF hona chahiye + **No Transitive Dependency** (For $X \\to Y$, ya to $X$ Super Key ho ya $Y$ Prime Attribute ho). | Transitive Dependency |
| **BCNF** | Stricter version of 3NF: For every non-trivial $X \\to Y$, $X$ MUST strictly be a **Super Key**. | Redundant dependencies |

> 📌 **BEU Exam Tip**: 3NF dependency preserve karta hai, jabki BCNF hamesha functional dependency preserve nahi kar pata. Ye difference Section B me 7 marks ka question hota hai!`;
      } else {
        responseText = `### 🗄️ Database Normalization Master Breakdown

Normalization decomposes complex tables into well-structured relations to eliminate redundancy and update anomalies:

1. **1NF (First Normal Form)**:
   - All column values must be atomic (indivisible).
   - No repeating groups or arrays stored in single cells.

2. **2NF (Second Normal Form)**:
   - Must satisfy 1NF.
   - **No Partial Dependencies**: Non-prime attributes must depend on the whole candidate key, not a proper subset.

3. **3NF (Third Normal Form)**:
   - Must satisfy 2NF.
   - **No Transitive Dependencies**: For every functional dependency $X \\to Y$, either $X$ is a Super Key OR $Y$ is a Prime Attribute.

4. **BCNF (Boyce-Codd Normal Form)**:
   - For every non-trivial FD $X \\to Y$, $X$ must strictly be a Super Key.
   - Lossless join decomposition is always guaranteed, but dependency preservation may not hold.`;
      }

      suggestedFollowups = [
        'How to find candidate keys from functional dependencies?',
        'Explain Lossless Join Decomposition with an example',
        'Show 2024 BEU DBMS Normalization numerical'
      ];
    }
    // Study Plan prompt
    else if (lower.includes('plan') || lower.includes('schedule') || lower.includes('timetable') || lower.includes('strategy')) {
      responseText = `### 📅 Smart 7-Day BEU Exam Preparation Strategy (${contextBranch} Sem ${contextSemester})

Here is a high-efficiency revision plan structured around BEU past paper patterns:

| Day | Focus Subject & Units | Core Tasks | Daily Hours |
| :--- | :--- | :--- | :--- |
| **Day 1** | Data Structures (Unit 1 & 2) | Big-O proofs, Linked List reversing, Infix to Postfix stack conversion | 3.5 hrs |
| **Day 2** | Data Structures (Unit 3 & 4) | AVL 4 rotations, BST deletion numerical, Kruskal & Prim MST tables | 4.0 hrs |
| **Day 3** | DBMS (Unit 1 & 2) | ER Diagram to Relational mapping, Relational Algebra join queries | 3.5 hrs |
| **Day 4** | DBMS (Unit 3 & 4) | Candidate key finding algorithm, 3NF vs BCNF proofs, Precedence graph | 4.0 hrs |
| **Day 5** | Digital Electronics / OOP | Logic minimization (K-Map), Virtual functions & Polymorphism in C++ | 3.5 hrs |
| **Day 6** | Full PYQ Mock Drill | Solve BEU 2024 & 2023 papers under strict 3-hour exam timing | 4.5 hrs |
| **Day 7** | High-Yield Revision | Formulas, algorithm pseudocode, Section A short definition notes | 3.0 hrs |

💡 *You can also use our **Study Planner** tab to automatically generate interactive daily checkboxes for your specific exam date!*`;

      suggestedFollowups = [
        'Create a 3-day emergency crash plan',
        'Give me top 10 most repeated definitions for Section A',
        'How should I divide 3 hours in BEU theory paper?'
      ];
    }
    // PYQ Analysis prompt
    else if (lower.includes('pyq') || lower.includes('pattern') || lower.includes('question paper') || lower.includes('marks')) {
      responseText = `### 📊 BEU Previous Year Question (PYQ) Historical Pattern Analysis

Based on historical data from 2019 to 2024 BEU End-Semester Examinations:

#### 🔴 High Priority (Appeared in >80% Papers)
• **AVL Tree Insertion & 4 Rotations** (Unit 3 — 14 Marks)
• **Minimum Spanning Tree (Prim's & Kruskal's with DSU)** (Unit 4 — 7/14 Marks)
• **Database Normalization & BCNF Decomposition** (DBMS Unit 3 — 14 Marks)
• **Precedence Graph Conflict Serializability** (DBMS Unit 4 — 7 Marks)

#### 🟡 Medium Priority (Appeared in 50-79% Papers)
• **Quick Sort vs Merge Sort Recurrence & In-place comparison** (DSA Unit 5)
• **Hash Collision Resolution (Linear vs Quadratic Probing)** (DSA Unit 5)
• **Two Phase Locking (Strict 2PL vs Rigorous 2PL)** (DBMS Unit 4)

#### 🟢 Lower Priority (Appeared in <50% Papers)
• Sparse Matrix representation (Section A 2-mark question)
• Topological sorting via Kahn's algorithm

> ⚠️ *Disclaimer: This analysis is historical pattern recognition to help prioritize your study hours, not a guarantee of future exam questions. Always review the complete prescribed BEU syllabus.*`;

      suggestedFollowups = [
        'View complete PYQ library in Study Hub',
        'Show solved numericals for Minimum Spanning Tree',
        'Explain Section A answering strategy'
      ];
    }
    // Practice questions
    else if (lower.includes('practice') || lower.includes('question') || lower.includes('quiz') || lower.includes('test')) {
      responseText = `### 📝 Practice Questions for BEU End-Sem (${contextBranch})

**Section A (Short Conceptual — 2 Marks each):**
1. Define **Abstract Data Type (ADT)** with two examples.
2. What is the difference between a **Primary Key** and a **Candidate Key**?
3. Calculate the height of a complete binary tree containing 63 nodes.

**Section B (Analytical & Numerical — 7 Marks each):**
4. Construct an **AVL Tree** by inserting keys in the order: \`50, 20, 60, 10, 8, 15\`. Show balance factors and rotations at every step.
5. Given a relation $R(A, B, C, D, E)$ with FDs: $F = \\{A \\to BC, CD \\to E, B \\to D, E \\to A\\}$. Find all candidate keys of $R$.

**Section C (Comprehensive Theory — 14 Marks):**
6. Compare and contrast **Prim's** and **Kruskal's** algorithms for finding Minimum Spanning Tree. Trace Kruskal's algorithm on a graph with 6 vertices and explain cycle detection using Disjoint Set Union.

*Reply with your answers or ask "Explain solution for Q4" for a step-by-step walkthrough!*`;

      suggestedFollowups = [
        'Explain solution for Q4 (AVL tree construction)',
        'Explain solution for Q5 (Candidate keys finding)',
        'Give 5 more practice questions on DBMS'
      ];
    }
    // General engineering & default response
    else {
      responseText = `### 💡 Academic Answer from BEU AI

Regarding **"${query}"**:

In Bihar Engineering University (${contextBranch} curriculum):
1. **Core Concept**: It is essential to understand both the theoretical definition and practical implementation with diagrams or mathematical formulations.
2. **BEU Exam Answering Strategy**:
   - Begin with a crisp 2-line definition.
   - Include a neat labelled block diagram or architecture flowchart.
   - Write step-by-step algorithm or code syntax in C++/Java/Python.
   - Conclude with time/space complexity analysis and real-world engineering applications.

Would you like me to provide a detailed derivation, a solved BEU PYQ numerical, or generate practice questions on this topic?`;

      suggestedFollowups = [
        'Explain with diagram and C++ code',
        'Show previous year questions on this topic',
        'Translate this explanation to Hinglish'
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: responseText,
      timestamp: 'Just now',
      language,
      suggestedFollowups
    };
  }
};
