import { getSingleDestination, updateDestination } from "./api-functions.js";

async function loadSingleDestination() {
  const destinationPk = window.location.pathname.split("/").pop()!;

  const destination = await getSingleDestination(destinationPk);

  (document.getElementById("destination_pk") as HTMLInputElement).value = destination.destination_pk;
  (document.getElementById("destination_title") as HTMLInputElement).value = destination.destination_title;

  (document.getElementById("destination_date_from") as HTMLInputElement).value = new Date(destination.destination_date_from).toISOString().split("T")[0];

  (document.getElementById("destination_date_to") as HTMLInputElement).value = new Date(destination.destination_date_to).toISOString().split("T")[0];

  (document.getElementById("destination_description") as HTMLTextAreaElement).value = destination.destination_description ?? "";

  (document.getElementById("destination_location") as HTMLInputElement).value = destination.destination_location;

  (document.getElementById("destination_country") as HTMLInputElement).value = destination.destination_country;
}

async function handleUpdateDestination(event: Event) {
  event.preventDefault();

  const form = document.getElementById("edit_destination_form") as HTMLFormElement;
  const destinationPk = window.location.pathname.split("/").pop()!;
  const formData = new FormData(form);

  await updateDestination(destinationPk, formData);

  alert("Destination updated");
}

const form = document.getElementById("edit_destination_form") as HTMLAnchorElement;

if (form) {
  form.addEventListener("submit", handleUpdateDestination);
}

loadSingleDestination();
