document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        // Add additional activities
        const additionalActivities = [
          { name: "Tennis", description: "Racket sport played individually or in pairs", schedule: "Sundays at 9 AM", type: "sport" },
          { name: "Swimming", description: "Improve your swimming skills", schedule: "Fridays at 7 AM", type: "sport" },
          { name: "Sculpting", description: "Create art with clay and tools", schedule: "Thursdays at 2 PM", type: "art" },
          { name: "Photography", description: "Learn to capture stunning photos", schedule: "Saturdays at 3 PM", type: "art" },
          { name: "Philosophy Club", description: "Discuss philosophical ideas and concepts", schedule: "Mondays at 6 PM", type: "intellectual" },
          { name: "Coding Workshop", description: "Learn programming basics", schedule: "Wednesdays at 5 PM", type: "intellectual" },
        ];

        additionalActivities.forEach((activity) => {
          const extraActivityCard = document.createElement("div");
          extraActivityCard.className = "activity-card";

          extraActivityCard.innerHTML = `
            <h4>${activity.name}</h4>
            <p>${activity.description}</p>
            <p><strong>Schedule:</strong> ${activity.schedule}</p>
          `;

          activitiesList.appendChild(extraActivityCard);

          // Add option to select dropdown
          const option = document.createElement("option");
          option.value = activity.name;
          option.textContent = activity.name;
          activitySelect.appendChild(option);
        });

        // No additional activities are redefined here to avoid duplication

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
