// Native fetch used - VERSION 3

async function testLoginAndFetchUsers() {
    try {
        console.log("Attempting login... V3");
        const loginRes = await fetch("https://blackbuck-assessment.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "admin@admin.com",
                password: "123456"
            })
        });

        const loginData = await loginRes.json();
        console.log("Login Status:", loginRes.status);

        if (loginRes.status === 200) {
            console.log("Token received.");
            const token = loginData.token;
            console.log("Fetching users...");

            const usersRes = await fetch("https://blackbuck-assessment.onrender.com/api/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Users Fetch Status:", usersRes.status);
            const usersData = await usersRes.json();
            console.log("Users Data:", JSON.stringify(usersData, null, 2));

        } else {
            console.log("Login Failed:", JSON.stringify(loginData));
        }
    } catch (error) {
        console.error("Script Error:", error);
    }
}

testLoginAndFetchUsers();
