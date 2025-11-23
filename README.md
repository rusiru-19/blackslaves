# BLACKSLAVES 

A web application for managing orders, designed with Next.js, Firebase, and Tailwind CSS. The project features both customer and admin views of orders, complete with order tracking, status updates, and order summaries.



---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Project Structure](#project-structure)  
- [Project Brief](#Project-Brief)  


## Features

- **Customer View**
  - Product Page with slaves 
  - Slave details with slave's image and pricing
  - Shipping information
  - Order summary (subtotal, tax, shipping, total)

- **Admin View**
  - Full order management interface
  - Customer and shipping information
  - Add / edit Slaves


- **Integration with Firebase**
  - Firestore database for storing orders and products
  - Real-time order fetching for admin dashboard

---

## Tech Stack

- [Next.js](https://nextjs.org/)  
- [Firebase](https://firebase.google.com/) (Firestore, Authentication)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [React Icons & Lucide](https://lucide.dev/)  
- TypeScript  

---

## Login Credentials

project url : [blackslaves.rusiru.dev](https://blackslaves.rusiru.dev)

```ts
| Role    | Email                  | Password       | Notes                          |
|---------|------------------------|----------------|--------------------------------|
| Admin   | sanuka@gmail.com       |  admin123      | Full access to admin dashboard |
| Customer| customer@gmail.com     | customer123    | normal user experience         |

```
## Project Brief

A E-COMMERCE website designed to sell and buy slaves online. This projects purpose is to bring old slave market into a next level by making the process completly digital. In this website customers can view the slaves with relavent categories and vandors can sell slaves by loging to the admin dashboard. 

The process of buying is, when a customer chose a slave he/she can add it to the cart then moving to the checkout page they can fill the relavant data and place the order. In the backend an when an slave is added to the cart, the relavant slave ID is added to a array in the customers profile. When the order is place the data in the array will be deleted, while making a new order doc with unique ID (ID is made by combining the customers id with the date and time). Also the slaves doc the status feild will be updated to 'not available'.

Login and signup process works with typical Firebase authentication and to keep the routes secure, we use nextjs build in middleware to protect the [admin/* , checkout/*] routes. Further more we use tokens to verify the users authentication and role.
 
### Firestore Structure
```

firestore
├── orders (collection)
│   └── {orderId} (document)
│       ├── id: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── email: string
│       ├── phone: string
│       ├── address: string
│       ├── city: string
│       ├── province: string
│       ├── zipCode: string
│       ├── price: number
│       ├── status: "in process" | "completed" | "cancelled"
│       ├── slaves: array of slaveId (string)
│       └── createdAt: timestamp
│
├── slaves (collection)
│   └── {slaveId} (document)
│       ├── name: string
│       ├── category: string
│       ├── description: string
│       ├── image: string (URL/path)
│       ├── price: string
│       ├── height: string
│       ├── weight: string
│       └── status: "available" | "unavailable"
│
└── users (collection)
    └── {userId} (document)
        ├── name: string
        ├── email: string
        ├── role: "customer" | "admin"
        ├── createdAt: timestamp
        ├── lastLogin: timestamp
        └── orders: array of orderId (string)

```
 
---



**Author:** rusiru-19

**GitHub:** [https://github.com/rusiru-19](https://github.com/rusiru-19)

