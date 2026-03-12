import { getDestinations } from "./api-functions.js";

async function loadDestinations() {
  const container = document.getElementById("destinations");

  if (!container) return;

  const destinations = await getDestinations();
  container.innerHTML = "";

  for (const destination of destinations) {
    const dateFrom = new Date(destination.destination_date_from).toISOString().split("T")[0];
    const dateTo = new Date(destination.destination_date_to).toISOString().split("T")[0];

    container.innerHTML += `
      <article class="destination-box">
        <h2>${destination.destination_title}</h2>
        <p><strong>Location:</strong> ${destination.destination_location}, ${destination.destination_country}</p>
        <p><strong>From:</strong> ${dateFrom}</p>
        <p><strong>To:</strong> ${dateTo}</p>
        <p>${destination.destination_description ?? ""}</p>
        <a href="/destination/${destination.destination_pk}" class="destination-button">View destination</a>
      </article>
    `;
  }
}

loadDestinations();
