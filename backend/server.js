const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

const { pool } = require("./dbConfig");

// Endpoint for handling user creation
app.post("/api/users", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, role]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint for fetching users
app.get("/api/users", async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT id, name, email, role FROM users ORDER BY id ASC");
        res.status(200).json(allUsers.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(8080,()=>{
    console.log("server is running")
})

