# Case Studies Module

##  Overview 

The Case Studies module enables users to explore historical flood events, detailed reports, and analytical insights. This helps users better understand flood risks, patterns, and impacts across different regions. 

##  Frontend 

### Case Studies Listing Page 

Route `/case-studies\` → `localhost:3000/case-studies\` → `/case-studies\`   
Purpose: Provide a browsable list of flood-related case studies in a user-friendly format.

###  UI Features 

*  Case studies displayed in a **card-based layout**   
*  Responsive grid design for different screen sizes **Each Card Contains:**   
*  Title of the case study - Short summary/description   
*  Thumbnail image 

### User Interaction 

*  Each card includes a **“Read More…” button**  
*  On click: - Navigate to detailed page 

### Case Study Details Page 

Route: `/case-studies/\[id\]\`   
Purpose: Display complete information about a selected case study.   
UI Components: 

*  Full title   
*  Detailed description/content   
*  Images, maps, or visual data   
*  Flood analysis insights   
*  Related statistics *(optional)* 

## Backend 

### API Endpoints 

### Get Case Study by ID 

Endpoint:   
GET /api/case-studies/{id}   
Description:   
Fetch detailed data for a specific case study. 

Response: 

```json   
[  
 {   
 "id": 1,   
"title": "Flood in Colombo 2021",   
"content": "Full detailed report...",   
"images": \["url1", "url2"\],   
"analysis": { "rainfall": "300mm", "impact": "Severe urban flooding"  
 }  
\]

### Access Control

Users   
 - Can view all case studies   
 - Can access detailed pages  

## Additional Design Considerations

### 1\. Separate Endpoint for Listing Case Studies

A dedicated endpoint is required to fetch all available case studies for the listing page.

Endpoint:  
GET /api/case-studies

Purpose:

*  Retrieve a lightweight list of case studies  
*  Improve performance by avoiding large data transfers  
*  Support fast loading of the card-based UI

Response Includes:

*  id    
*  title    
*  summary    
*  image\_url (thumbnail)    
*  event\_date    
*  location  

\---

### 2\. Summary Character Limit

To maintain a clean and consistent card layout, the summary length should be controlled.

**Recommended Approach:**  
Store full summary in the database    
Limit display length on the frontend  

**UI Constraint:**  
 Ideal: 100–150 characters    
 Maximum: 200 characters  

**Frontend Handling Example:**  
 Truncate text and append "..." if it exceeds the limit  

\---

### 3. Image Storage Strategy (Supabase)

Images will be stored using **Supabase Storage**.

#### Approach

- Upload images to a Supabase storage bucket (e.g., `case-study-images`)  
- Retrieve a public URL for each uploaded image  
- Store only the image URL in the database  

---

#### Database Handling

Store image reference as:

```sql
image_url VARCHAR(500) 
