import { getDestinations, deleteDestination } from "./api-functions.js";

declare const loggedInUserPk: string;

async function loadDestinations() {
  const container = document.getElementById("destinations");

  if (!container) return;

  const destinations = await getDestinations();
  container.innerHTML = "";

  for (const destination of destinations) {
    const dateFrom = new Date(destination.destination_date_from).toISOString().split("T")[0];
    const dateTo = new Date(destination.destination_date_to).toISOString().split("T")[0];

    const isOwner = loggedInUserPk && destination.user_fk === loggedInUserPk;

    container.innerHTML += `
      <article class="destination-card" id="destination_${destination.destination_pk}">
        <h2>${destination.destination_title}</h2>
        <p><strong>Location:</strong> ${destination.destination_location}, ${destination.destination_country}</p>
        <p><strong>From:</strong> ${dateFrom}</p>
        <p><strong>To:</strong> ${dateTo}</p>
        <p>${destination.destination_description ?? ""}</p>

        <div class="destination-actions">
          <a href="/destination/${destination.destination_pk}" class="destination-action">
            View destination
          </a>

          ${
            isOwner
              ? `
                <a href="/destination/${destination.destination_pk}" class="destination-action">
                  Edit
                </a>
                <button class="destination-action delete-btn" data-id="${destination.destination_pk}" type="button">
                  Delete
                </button>
              `
              : ""
          }
        </div>
      </article>
    `;
  }

  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const destinationPk = (button as HTMLButtonElement).dataset.id;

      if (!destinationPk) return;

      const confirmed = confirm("Are you sure you want to delete this destination?");
      if (!confirmed) return;

      await deleteDestination(destinationPk);

      const destinationElement = document.getElementById(`destination_${destinationPk}`);
      destinationElement?.remove();
    });
  });
}

loadDestinations();
