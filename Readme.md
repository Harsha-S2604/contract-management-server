# Contract Management Server

This repository contains the backend code to manage contracts, including features for contract creation, storage, and AWS integrations.

## Setup

### 1. Install Dependencies

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [AWS SDK](https://aws.amazon.com/sdk-for-node-js/)

### 2. AWS Configuration

Configure AWS with your credentials by running the following command and providing your access keys:

```bash
aws configure
```

### 3. Clone the Project

```bash
git clone git@github.com:Harsha-S2604/contract-management-server.git
```

### 4. Navigate to the Project Directory
```bash
cd contract-management-server
```

### 5. Install Project Packages
```bash
yarn
```

### 6. Set Up Environment Variables
Create a `.env.development` file at the root level of the project. This file will store environment-specific configurations.

### 7. Database Configuration
Add the following environment variables to the .env.development file with your specific database credentials:
```bash
DB_USERNAME=<your_db_username>
DB_PASSWORD=<your_db_password>
DB_HOST=<your_db_host>
DB_PORT=<your_db_port>
DB_DATABASE=<your_db_name>
SERVER_PORT=<your_server_port>
```

### 8. AWS Configuration
Add the following AWS-specific environment variables to the .env.development file:
```bash
AWS_ACCESS_KEY_ID=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
AWS_REGION=<your_aws_region>
```

### 9. Run the Server
```bash
yarn run-dev-server
```

## API Usage

### 1. Create Contract
``` Javascript
const contract = {
    clientName: "ABC Tech",
    status: "Draft",
    contractData: "file.txt",
    file: {
        fileName: "file.txt",
        fileType: "txt",
        fileBase64: "<Base64 value of a file data>"
    }
};

const response = await fetch("http://localhost:3000/contracts/create", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract })
});

const result = await response.json();
```

### 2. Get contracts
```Javascript
// for pagination
const page = 1
const pageSize = 5

const response = await fetch(`http://localhost:3000/contracts?page=${page}&paeSize=${pageSize}`, {
    method: "GET",
})

const result = await response.json()
```

### 3. Delete contract
```Javascript
// provide the contractId to delete
// page and pageSize for socket emit where UI reacts based on the page and pageSize
const response = await fetch(`http://localhost:3000/contracts/delete/${contractId}?page=${page}&pageSize=${pageSize}`, {
            method: "DELETE",
        })

const result = await response.json()
```

### 4. Update contract
```Javascript
const updateParams = { 
    id, // contract id to update
    key, // which column to update
    value // value to update
}
const response = await fetch(`http://localhost:3000/contracts/update?page=${page}&pageSize=${pageSize}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateParams)
        })

const result = await response.json()
```