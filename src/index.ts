import { getDestinations } from "./api-functions.js";

async function loadDestinations() {
  const container = document.getElementById("destinations");

  if (!container) return;
  const destinations = await getDestinations();
  container.innerHTML = "";

  for (const destination of destinations) {
    container.innerHTML += `
        <article>
        <h2>${destination.destination_title}</h2>
        <p>From: ${destination.destination_date_from}</p>
        <p>To: ${destination.destination_date_to}</p>
        <p>${destination.destination_description ?? ""}</p>
        <p>${destination.destination_location}, ${destination.destination_country}</p>
      </article>
      <hr>
    `;
  }
}
loadDestinations();
