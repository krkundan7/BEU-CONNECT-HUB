# Database Indexing & Query Optimization Manual

## Primary Indexes
- `User(registrationNumber)`: Unique B-Tree index
- `AcademicSyllabus(branchCode, semester)`: Composite index for rapid tree retrieval
- `Notice(publishedAt DESC, category)`: Compound index for timeline feed
- `Note(subjectCode, upvotes DESC)`: Index for top-rated study resources
