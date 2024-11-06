<h1 style="text-align: center;">🚀 Namaste Node.js - 12 | Databases - SQL & NoSQL 🚀</h1>

## What is a Database?

In computing, a **database** is an organized collection of data or a type of data store based on the use of a **Database Management System** (**DBMS**). The DBMS is the software that interacts with end-users, applications, and the database itself to capture and analyze the data. The DBMS also provides core facilities for administering the database. The combination of the database, the DBMS, and the associated applications is referred to as a **database system**. Often, the term "database" is used loosely to refer to the DBMS or the database system itself.

## Types of Databases

### 1. Relational Databases (RDBMS)

- **Examples:** `MySQL`, `PostgreSQL`
- Relational databases use structured tables with predefined schemas, making them ideal for handling complex queries and transactions. They ensure data integrity through **ACID** properties (Atomicity, Consistency, Isolation, Durability). These databases are commonly used in applications requiring robust, relational data models.

### 2. NoSQL Databases

- **Example:** `MongoDB`
- NoSQL databases like MongoDB store data in flexible, JSON-like documents, allowing for dynamic schemas. They are highly scalable and suitable for large volumes of unstructured or semi-structured data, which makes them popular in modern web applications.

### 3. In-memory Databases

- **Example:** `Redis`
- Redis is an in-memory database known for its high-speed data processing capabilities. It supports various data structures like strings, hashes, and lists. Redis is commonly used for caching, real-time analytics, and message brokering.

### 4. Distributed SQL Databases

- **Example:** `CockroachDB`
- CockroachDB is a distributed SQL database designed to scale horizontally across multiple nodes while ensuring strong consistency and supporting ACID transactions. It is ideal for applications that require high availability and resilience across different geographic locations.

### 5. Time Series Databases

- **Example:** `InfluxDB`
- InfluxDB is optimized for handling time-stamped data, making it suitable for time series applications such as monitoring, real-time analytics, and IoT applications.

### 6. Object-Oriented Databases (OODB)

- **Example:** `db4o`
- db4o is an object-oriented database that stores data as objects, directly aligned with object-oriented programming languages. This eliminates the need for converting data between object models and relational tables.

### 7. Graph Databases

- **Example:** `Neo4j`
- Neo4j excels at handling complex relationships between entities using a graph structure. It is ideal for applications like social networks, recommendation engines, and fraud detection.

### 8. Hierarchical Databases

- **Example:** `IBM IMS`
- IBM IMS is a hierarchical database used primarily in legacy systems. It organizes data in a tree-like structure with parent-child relationships and is known for handling large-scale transaction processing with high performance.

### 9. Network Databases

- **Example:** `IDMS`
- IDMS is a network database system that models data with a graph of record types and relationships. It allows for more complex relationships than hierarchical databases and is often used in legacy systems that require high performance.

### 10. Cloud Databases

- **Example:** `Amazon RDS`
- Amazon RDS is a managed cloud database service that supports multiple relational database engines, including MySQL, PostgreSQL, and Oracle. It automates tasks like backups, patching, and scaling, simplifying the deployment and management of databases in the cloud.

## Most Commonly Used Databases:

1. **Relational DB**: `MySQL`, `PostgreSQL`
2. **NoSQL DB**: `MongoDB`

## Relational Database Management Systems (RDBMS)

Relational Database Management Systems like MySQL and PostgreSQL are popular for managing structured data. They use structured query language (**SQL**) for defining and manipulating data and are ideal for transactional systems where data integrity is critical.

### **Key Features of RDBMS:**

- Data stored in tables with rows and columns
- Supports complex queries using SQL
- Enforces ACID properties for transaction management
- Ideal for structured data with fixed schemas

## NoSQL Databases and MongoDB

NoSQL databases are classified into different types based on how they store and manage data:

### Types of NoSQL Databases:

1. **Document Databases**: Store data as documents (e.g., `MongoDB`)
2. **Key-Value Databases**: Store data as key-value pairs
3. **Graph Databases**: Represent data as nodes and relationships (e.g., `Neo4j`)
4. **Wide-Column Databases**: Store data in columns rather than rows
5. **Multi-Model Databases**: Support multiple data models (e.g., `ArangoDB`)

<!-- ## SQL vs NoSQL
![Difference between SQL and NoSQL](SQL%20vs%20NoSQL.jpeg) -->

If you found this useful, **please ⭐ star the repository** to show your support! 😊
