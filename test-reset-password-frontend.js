// Test script untuk endpoint reset password
import xior from "xior";

const API_URL = "https://sidifa-api.bits.my.id/api/v1";
const TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhpc3lhbWthbWlsOTlAZ21haWwuY29tIiwiaWF0IjoxNzUyMTI0NjQzLCJleHAiOjE3NTIyMTEwNDN9.LNs4d8ucfXuk1pqDOx5BH8haTB5K_-LlMYvNxt5fMxI";

async function testResetPassword() {
  console.log("🧪 Testing Reset Password Endpoint");
  console.log("=".repeat(50));

  const testData = {
    token: TEST_TOKEN,
    password: "Admins1234",
  };

  console.log("📤 Request Data:", JSON.stringify(testData, null, 2));
  console.log("🌐 URL:", `${API_URL}/auth/reset-password`);

  try {
    const response = await xior.post(
      `${API_URL}/auth/reset-password`,
      testData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      },
    );

    console.log("✅ Success Response:");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    console.log("❌ Error Response:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
      if (
        typeof Headers !== "undefined" &&
        error.response.headers instanceof Headers
      ) {
        console.log(
          "Headers:",
          Object.fromEntries(error.response.headers.entries()),
        );
      } else {
        console.log("Headers:", error.response.headers);
      }
    } else if (error.request) {
      console.log("No response received:", error.request);
    } else {
      console.log("Error:", error.message);
    }
  }
}

// Jalankan test
testResetPassword();
