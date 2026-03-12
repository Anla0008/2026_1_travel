import { getSingleDestination, updateDestination, deleteDestination } from "./api-functions.js";
declare const loggedInUserPk: string;

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

  const deleteButton = document.getElementById("delete_destination_btn") as HTMLButtonElement;
  const updateButton = document.getElementById("update_destination_btn") as HTMLButtonElement;

  if (loggedInUserPk && destination.user_fk === loggedInUserPk) {
    deleteButton.hidden = false;
    updateButton.hidden = false;
  }
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

async function handleDeleteDestination() {
  const confirmed = confirm("Are you sure you want to delete this destination?");
  if (!confirmed) return;

  const destinationPk = window.location.pathname.split("/").pop()!;

  await deleteDestination(destinationPk);

  window.location.href = "/destinations";
}

const deleteButton = document.getElementById("delete_destination_btn") as HTMLButtonElement;
if (deleteButton) {
  deleteButton.addEventListener("click", handleDeleteDestination);
}

loadSingleDestination();
