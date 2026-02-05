// Native fetch used - VERSION REGISTER

async function testRegisterAndFetch() {
    try {
        const email = "debug_admin_" + Date.now() + "@admin.com";
        const password = "password123";
        console.log(`Attempting to register new admin: ${email}`);

        // 1. Register
        const regRes = await fetch("https://blackbuck-assessment.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Debug Admin", email, password })
        });
        const regData = await regRes.json();
        console.log("Register Status:", regRes.status);
        console.log("Register Body:", JSON.stringify(regData));

        if (regRes.status === 201) {
            // 2. Login
            console.log("Login with new admin...");
            const loginRes = await fetch("https://blackbuck-assessment.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const loginData = await loginRes.json();

            if (loginRes.status === 200) {
                const token = loginData.token;
                console.log("Token obtained. Role:", loginData.role);

                // 3. Fetch Users
                console.log("Fetching users...");
                const usersRes = await fetch("https://blackbuck-assessment.onrender.com/api/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                console.log("Users Fetch Status:", usersRes.status);
                const usersText = await usersRes.text();
                console.log("Users Data:", usersText);
            }
        }
    } catch (error) {
        console.error("Script Error:", error);
    }
}

testRegisterAndFetch();
